<template>
  <div class="app-container">
    <!--查询表单-->
    课程列表
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.level" clearable placeholder="课程状态">
          <el-option :value="'Normal'" label="已发布" />

          <el-option :value="'Draft'" label="未发布" />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getCourseList()"
        >查询</el-button
      >

      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->

    <el-table :data="courseList" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="课程id" width="180" />
      <el-table-column prop="title" label="课程名称" />

      <el-table-column label="课程状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="100" />
      <el-table-column prop="buyCount" label="销售数量" width="80" />
      <el-table-column prop="teacherId" label="课程讲师ID" width="180" />
      <el-table-column prop="viewCount" label="浏览人数" width="160" />

      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程大纲</el-button
            >
          </router-link>

          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->

    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getCourseList"
    />
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";

export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      courseQuery: {},
      courseList: null,
    };
  },

  created() {
    this.getCourseList();
  },

  methods: {
    getCourseList(page = 1) {
      this.page = page;
      courseApi
        .getCourseListPage(this.page, this.limit, this.courseQuery)
        .then((res) => {
          this.courseList = res.data.list;
          this.total = res.data.total;
        });
    },

    resetData() {
      this.courseQuery = {};
      this.getCourseList();
    },

    removeDataById(id) {
      this.$confirm("此操作将永久删除本课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        courseApi.removeCourseById(id).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getCourseList();
        });
      });
    },
  },
};
</script>
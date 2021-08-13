<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师" />

          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";

export default {
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },
      saveBtnDisabled: false,
    };
  },

  // 解决先修改在添加中页面传输数据的问题
  watch: {
    $route(to, from) {
      this.init();
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.searchTeacherInfoById(id);
      } else {
        this.teacher = {};
      }
    },
    saveOrUpdate() {
      // 判断是修改还是添加操作
      if (!this.teacher.id) {
        // 添加操作
        this.saveTeacher();
      } else {
        // 修改操作
        this.updateTeacherById();
      }
    },

    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((res) => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        this.$router.push({ path: "/teacher/table" });
      });
    },

    searchTeacherInfoById(id) {
      teacherApi.getTeacherInfo(id).then((res) => {
        this.teacher = res.data.teacher;
      });
    },

    updateTeacherById() {
      teacherApi.updateTeacher(this.teacher).then((res) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.$router.push({ path: "/teacher/table" });
      });
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />

      <el-step title="创建课程大纲" />

      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 所属一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择一级分类"
          @change="getSubjectTwoInfo"
        >
          <el-option
            v-for="oneSubject in subjectOneList"
            :key="oneSubject.id"
            :label="oneSubject.title"
            :value="oneSubject.id"
          ></el-option>
        </el-select>

        <!-- 所属二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择二级分类">
          <el-option
            v-for="twoSubject in subjectTwoList"
            :key="twoSubject.id"
            :label="twoSubject.title"
            :value="twoSubject.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <!-- :auto_upload="false" 自动上传 -->
      <el-form-item label="课程封面" class="cover">
        <el-upload
          :show-file-list="false"
          :auto_upload="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";
import teacherApi from "@/api/edu/teacher";
import subjectApi from "@/api/edu/subject";

import Tinymce from "@/components/Tinymce";

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: "",
        subjectId: "",
        subjectParentId: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "/static/cover.jpg",
        price: 0,
      },
      BASE_API: process.env.BASE_API,
      teacherList: [],
      subjectOneList: [], //一级分类
      subjectTwoList: [], //二级分类
      courseId: "",
    };
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      // 修改操作
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    } else {
      // 添加操作
      this.getTeacherInfo();
      this.getSubjectOneInfo();
    }
  },

  methods: {
    // 根据课程id查询课程信息用于回显（包含一级分类id和二级分类id）
    getCourseInfo() {
      courseApi.getCourseInfo(this.courseId).then((res) => {
        this.courseInfo = res.data.courseInfoVo;
        // 查询所有的分类 包括一级和二级
        subjectApi.getAllSubject().then((res) => {
          //得到所有一级分类
          this.subjectOneList = res.data.data;
          //比较courseInfo里面的一级分类id和subjectOneList中的一级分类id
          for (let i = 0; i < this.subjectOneList.length; i++) {
            //如果两者相同，则获取其下面的二级分类
            if (this.subjectOneList[i].id === this.courseInfo.subjectParentId) {
              this.subjectTwoList = this.subjectOneList[i].children;
            }
          }
        });
        this.getTeacherInfo();
      });
    },
    getTeacherInfo() {
      teacherApi.findAllTeacherInfo().then((res) => {
        this.teacherList = res.data.teacher;
      });
    },

    getSubjectTwoInfo(value) {
      this.courseInfo.subjectId = "";
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (value === this.subjectOneList[i].id) {
          this.subjectTwoList = this.subjectOneList[i].children;
        }
      }
    },

    getSubjectOneInfo() {
      subjectApi.getAllSubject().then((res) => {
        this.subjectOneList = res.data.data;
      });
    },

    // 添加课程
    addCourse() {
      courseApi.addCourseInf(this.courseInfo).then((res) => {
        this.$message({
          type: "success",
          message: "添加课程信息成功!",
        });
        this.$router.push({ path: "/course/chapter/" + res.data.courseId });
      });
    },

    updateCourse() {
      courseApi.updateCourseInfo(this.courseInfo).then((res) => {
        this.$message({
          type: "success",
          message: "修改课程信息成功!",
        });
        this.$router.push({ path: "/course/chapter/" + this.courseId });
      });
    },

    saveOrUpdate() {
      if (!this.courseInfo.id) {
        // 添加操作
        this.addCourse();
      } else {
        this.updateCourse();
      }
    },

    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是jpg格式！");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过2MB！");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style scoped>
.cover img {
  width: 300px;
  height: 100%;
}
.tinymce-container {
  line-height: 29px;
}
</style>
<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />

      <el-step title="创建课程大纲" />

      <el-step title="最终发布" />
    </el-steps>

    <div class="ccInfo">
      <img :src="publishCourseOnfo.cover" />

      <div class="main">
        <h2>课程名称：{{ publishCourseOnfo.title }}</h2>

        <h3>课程简介：</h3>
        <span v-html="publishCourseOnfo.description" class="description"></span>

        <p class="gray">
          <span>课程课时：{{ publishCourseOnfo.lessonNum }}课时</span>
        </p>

        <p>
          <span
            >所属分类：{{ publishCourseOnfo.subjectLevelOne }} —
            {{ publishCourseOnfo.subjectLevelTwo }}</span
          >
        </p>

        <p>课程讲师：{{ publishCourseOnfo.teacherName }}</p>

        <h3 class="red">课程售价：￥{{ publishCourseOnfo.price }}</h3>
      </div>
    </div>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">返回修改</el-button>

        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish"
          >发布课程</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";
export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: "",
      publishCourseOnfo: {
        cover: "",
        description: "",
        lessonNum: 0,
        price: "",
        subjectLevelOne: "",
        subjectLevelTwo: "",
        teacherName: "",
        title: "",
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getPublishCourdeInfo();
    }
  },

  methods: {
    getPublishCourdeInfo() {
      courseApi.getPublishCourseInfo(this.courseId).then((res) => {
        this.publishCourseOnfo = res.data.publishCourseInfo;
      });
    },
    previous() {
      this.$router.push({ path: "/course/chapter/" + this.courseId });
    },
    publish() {
      courseApi.publishCourse(this.courseId).then((res) => {
        this.$message({
          type: "success",
          message: "修改课时信息成功!",
        });
        this.$router.push({ path: "/course/list" });
      });
    },
  },
};
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;

  padding: 20px;

  overflow: hidden;

  border: 1px dashed #ddd;

  margin-bottom: 40px;

  position: relative;
}

.ccInfo img {
  background: #d6d6d6;

  width: 500px;

  display: block;

  float: left;

  border: none;
}

.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;

  margin-bottom: 30px;

  line-height: 1;

  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 10px;

  word-wrap: break-word;

  line-height: 24px;

  max-height: 48px;

  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;

  word-wrap: break-word;

  line-height: 24px;

  max-height: 48px;

  overflow: hidden;
}

.ccInfo .main .red {
  margin-top: 20px;
  left: 540px;

  bottom: 5px;

  line-height: 1;

  font-size: 28px;

  color: #d32f24;

  font-weight: normal;

  position: absolute;
}

.ccInfo .main .description {
  display: inline-block;
}
</style>
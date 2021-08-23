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
      <!-- 讲师头像 -->

      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->

        <pan-thumb :image="String(teacher.avatar)" />

        <!-- 文件上传按钮 -->

        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--

v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->

        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

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
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: {
    ImageCropper,
    PanThumb,
  },

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
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API, // 获取dev.env.js里面的地址
      imagecropperShow: false,
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

    // 关闭上传弹窗
    close() {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    cropSuccess(data) {
      this.teacher.avatar = data.url;
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    saveOrUpdate() {
      // 判断是修改还是添加操作

      if (JSON.stringify(this.teacher) == "{}") {
        alert("讲师信息为空");
      } else {
        if (!this.teacher.id) {
          // 添加操作
          this.saveTeacher();
        } else {
          // 修改操作
          this.updateTeacherById();
        }
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
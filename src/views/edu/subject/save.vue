<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>

        <el-tag>
          <i class="el-icon-download" />

          <a :href="'/static/class.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <!-- 是否手动上传        :auto-upload="false"   :limit="1" 每次只能传一个文件 -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >

          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 获取dev.env.js里面的地址
      importBtnDisabled: false,
      loading: false,
    };
  },

  created() {},

  methods: {
    submitUpload() {
      this.importBtnDisabled = true;
      (this.loading = true), this.$refs.upload.submit();
    },

    //上传成功
    fileUploadSuccess() {
      this.loading = false;
      this.$message({
        type: "success",
        message: "添加课程成功",
      });
      this.$router.push({ path: "/subject/list" });
    },

    //上传失败
    fileUploadError() {
      this.loading = false;
      this.$message({
        type: "error",
        message: "添加课程失败",
      });
    },
  },
};
</script>

<style>
</style>
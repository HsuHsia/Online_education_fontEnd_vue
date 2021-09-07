<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />

      <el-step title="创建课程大纲" />

      <el-step title="最终发布" />
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 添加和修改章节表单 -->

    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>

        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>

        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>

        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>

            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvod/video/uploadAliyunVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>

            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>

              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>

        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    /> -->

    <!-- 显示章节信息 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openEditVideoDialog(chapter.id)"
              >添加小节</el-button
            >
            <el-button type="text" @click="openEditChapterInfo(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}

              <span class="acts">
                <el-button type="text" @click="openEditVideoInfo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="removeVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>

        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapterApi from "@/api/edu/chapter";
import videoApi from "@/api/edu/video";
export default {
  data() {
    return {
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false, //小节弹框
      saveVideoBtnDisabled: false,
      video: {
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        videoOriginalName: "",
      },
      chapter: {
        title: "",
        sort: 0,
      },
      saveBtnDisabled: false,
      courseId: "",
      chapterVideoList: [],
      fileList: [],
      BASE_API: process.env.BASE_API,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getAllChapterVideo();
    }
  },
  methods: {
    // ====================================================视频操作====================================================
    handleVodUploadSuccess(res, file, fileList) {
      // 上传视频id赋值
      this.video.videoSourceId = res.data.videoId;
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name;
    },
    handleVodRemove() {
      videoApi.deleteAlyVideo(this.video.videoSourceId).then((res) => {
        this.$message({
          type: "success",
          message: "删除视频成功!",
        });
        this.fileList = [];
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
      });
    },
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定删除视频 ${file.name}？`);
    },
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    // ====================================================小节操作====================================================

    openEditVideoDialog(chapterId) {
      this.dialogVideoFormVisible = true;

      // 设置章节,课程Id
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;

      // 清空对话框
      this.video.title = "";
      this.video.sort = 0;
      this.video.isFree = 0;
      this.video.videoSourceId = "";
      this.video.videoOriginalName = "";

      this.fileList = [];
    },

    // 添加小节信息
    addVideo() {
      videoApi.addVideo(this.video).then((res) => {
        // 关闭小节弹窗
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加课时信息成功!",
        });

        // 刷新页面
        this.getAllChapterVideo();
      });
    },

    saveOrUpdateVideo() {
      if (!this.video.id) {
        // 添加操作
        this.addVideo();
      } else {
        // 修改操作
        this.updateVideo();
      }
    },

    //点击编辑按钮时
    openEditVideoInfo(videoId) {
      this.dialogVideoFormVisible = true;
      // 根据小节Id查询小节信息进行回显
      videoApi.getVideoInfo(videoId).then((res) => {
        this.video = res.data.video;
        this.fileList = [{ name: this.video.videoOriginalName }];
      });
    },

    // 修改小节信息
    updateVideo() {
      videoApi.updateVideo(this.video).then((res) => {
        // 关闭小节弹窗
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "修改课时信息成功!",
        });

        // 刷新页面
        this.getAllChapterVideo();

        this.video.id = "";
      });
    },

    // 删除小节信息
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除本课时信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        videoApi.deleteVideo(videoId).then((res) => {
          this.$message({
            type: "success",
            message: "删除课时成功!",
          });
          // 刷新页面
          this.getAllChapterVideo();
        });
      });
    },

    // ====================================================章节操作====================================================
    // 点击编辑按钮时 回显数据
    openEditChapterInfo(chapterId) {
      // 首先根据章节id查询章节信息
      this.dialogChapterFormVisible = true;
      chapterApi.getChapterInfo(chapterId).then((res) => {
        this.chapter = res.data.chapter;
      });
    },

    openChapterDialog() {
      // 弹出添加章节信息对话框
      this.dialogChapterFormVisible = true;

      // 清空对话框内信息
      this.chapter.title = "";
      this.chapter.sort = 0;
    },

    // 添加章节信息
    addChapter() {
      this.chapter.courseId = this.courseId;
      chapterApi.addChapter(this.chapter).then((res) => {
        // 关闭弹窗
        this.dialogChapterFormVisible = false;

        this.$message({
          type: "success",
          message: "添加章节信息成功!",
        });

        // 刷新页面
        this.getAllChapterVideo();
      });
    },

    // 修改章节信息
    updateChapter() {
      chapterApi.updateChapter(this.chapter).then((res) => {
        // 关闭弹窗
        this.dialogChapterFormVisible = false;

        this.$message({
          type: "success",
          message: "修改章节信息成功!",
        });

        // 刷新页面
        this.getAllChapterVideo();
        // 否则更新操作会变添加操作
        this.chapter.id = "";
      });
    },

    // 删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除本章节信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapterApi.deleteChapter(chapterId).then((res) => {
          this.$message({
            type: "success",
            message: "删除章节成功!",
          });
          // 刷新页面
          this.getAllChapterVideo();
        });
      });
    },

    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },

    getAllChapterVideo() {
      chapterApi.getChapterVideoByCourseId(this.courseId).then((res) => {
        this.chapterVideoList = res.data.list;
      });
    },

    saveOrUpdate() {
      if (!this.chapter.id) {
        // 添加操作
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },
  },
};
</script>

<style scoped>
.chapterList {
  position: relative;

  list-style: none;

  margin: 0;

  padding: 0;
}

.chapterList li {
  position: relative;
}

.chapterList p {
  /* float: left; */

  font-size: 20px;

  margin: 10px 0;

  padding: 10px;

  height: 70px;

  line-height: 50px;

  width: 100%;

  border: 1px solid #ddd;
}

.chapterList .acts {
  float: right;

  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  /* float: left; */

  font-size: 14px;

  margin: 10px 0;

  padding: 10px;

  height: 50px;

  line-height: 30px;

  width: 100%;

  border: 1px dotted #ddd;
}
</style>
<template>
  <div class="app-container">
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import chapterApi from "@/api/edu/chapter";

export default {
  data() {
    return {
      filterText: "",
      data2: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },

  created() {
    this.getAllChapterVideo();
  },

  methods: {
    getAllChapterVideo() {
      let courseId = 18;
      chapterApi.getChapterVideoByCourseId(courseId).then((res) => {
        this.data2 = res.data.list;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value) !== -1;
    },
  },
};
</script>

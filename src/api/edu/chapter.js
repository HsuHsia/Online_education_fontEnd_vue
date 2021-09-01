import request from '@/utils/request'

export default {
  getChapterVideoByCourseId(courseId) {
    return request({
      url: `/eduservice/chapter/getVideo/${courseId}`,
      method: 'get',
    })
  },

  addChapter(chapter) {
    return request({
      url: `/eduservice/chapter/addChapter`,
      method: "post",
      data: chapter,
    })
  },

  getChapterInfo(chapterId) {
    return request({
      url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
      method: "get",
    })
  },

  updateChapter(chapter) {
    return request({
      url: `/eduservice/chapter/updateChapter`,
      method: "post",
      data: chapter,
    })
  },

  deleteChapter(chapterId) {
    return request({
      url: `/eduservice/chapter/deleteChapter/${chapterId}`,
      method: "delete",
    })
  }

}
import request from '@/utils/request'

export default {
  addCourseInf(courseInfo) {
    return request({
      url: `/eduservice/course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },

  getCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getCourseInfo/${courseId}`,
      method: "get"
    })
  },

  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getPublishCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: "get"
    })
  },
  publishCourse(courseId) {
    return request({
      url: `/eduservice/course/publishCourse/${courseId}`,
      method: "post"
    })
  },
  getCourseListPage(courseCurrentPage, coursepageLimit, courseQuery) {
    return request({
      url: `/eduservice/course/getCourseCondition/${courseCurrentPage}/${coursepageLimit}`,
      method: 'post',
      data: courseQuery
    })
  },
  removeCourseById(courseId) {
    return request({
      url: `/eduservice/course/deleteCourseById/${courseId}`,
      method: "delete",
    })
  }
}
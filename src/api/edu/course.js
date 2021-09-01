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
  }
}
import request from '@/utils/request'

export default {
  getTeacherListPage(currentPage, pageLimit, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${currentPage}/${pageLimit}`,
      method: 'post',
      data: teacherQuery
    })
  },

  removeTeacherById(id) {
    return request({
      url: `/eduservice/teacher/deleteTeacher/${id}`,
      method: 'delete',
    })
  },

  addTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },

  getTeacherInfo(id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get',
    })
  },

  updateTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }
}

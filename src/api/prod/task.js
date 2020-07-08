import request from '@/utils/request'
//查询实施任务
export function getTasklist(datas) {
  return request({
    url: '/prod/task/list',
    method: 'get',
    params:datas
  })
}
///prod/task/dept/{deptId}
// 通过部门ID获取部门信息
export function getdept(deptId) {
  return request({
    url: '/prod/task/dept/'+deptId,
    method: 'get'
  })
}
//获取单个实施任务
export function getTasklistdan(id) {
  return request({
    url: '/prod/task/get/'+id,
    method: 'get'
  })
}
//加载对应角色的部门树
export function getroleDeptTreeselect(roleId) {
  return request({
    url: '/prod/task/roleDeptTreeselect/'+roleId,
    method: 'get'
  })
}
//新增实施任务
export function addTask(datas) {
  return request({
    url: '/prod/task/add',
    method: 'put',
    params:datas
  })
}
//修改实施任务
export function updateTask(datas) {
  return request({
    url: '/prod/task/update',
    method: 'post',
    params:datas
  })
}
//删除实施任务
export function delTask(id) {
  return request({
    url: '/prod/task/delete/'+id,
    method: 'delete'
  })
}

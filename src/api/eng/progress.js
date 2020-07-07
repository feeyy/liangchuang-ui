import request from '@/utils/request'

// 查询工程进展列表
export function queryProgress(queryParams) {
  return request({
    url: '/eng/progress/list',
    method: 'get',
    params: queryParams
  })
}

// 查询单个工程进展
export function get(id) {
  return request({
    url: '/eng/progress/get/' + id,
    method: 'get'
  })
}

// 添加工程进展
export function add(data) {
  return request({
    url: '/eng/progress/add',
    method: 'put',
    params: data
  })
}

// 修改工程进展
export function update(data) {
  return request({
    url: '/eng/progress/update',
    method: 'post',
    params: data
  })
}

// 修改工程进展进度
export function updateCurrent(id, currentCompleteLayer) {
  return request({
    url: '/eng/progress/update/pro/' + id + '/' + currentCompleteLayer,
    method: 'post',
  })
}

// 删除工程进展
export function remove(ids) {
  return request({
    url: '/eng/progress/delete/' + ids,
    method: 'delete'
  })
}

// 通过时间ID查询项目
export function getProjects(timeId) {
  return request({
    url: '/eng/progress/get/project/' + timeId,
    method: 'get'
  })
}

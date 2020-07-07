import request from '@/utils/request'

// 查询生产设计工作列表
export function queryDesign(queryParams) {
  return request({
    url: '/eng/design/list',
    method: 'get',
    params: queryParams
  })
}

// 查询单个生产设计工作
export function get(id) {
  return request({
    url: '/eng/design/get/' + id,
    method: 'get'
  })
}

// 添加生产设计工作
export function add(data) {
  return request({
    url: '/eng/design/add',
    method: 'put',
    params: data
  })
}

// 修改生产设计工作
export function update(data) {
  return request({
    url: '/eng/design/update',
    method: 'post',
    params: data
  })
}

// 删除生产设计工作
export function remove(ids) {
  return request({
    url: '/eng/design/delete/' + ids,
    method: 'delete'
  })
}

// 通过时间ID查询项目
export function getProjects(timeId) {
  return request({
    url: '/eng/design/get/project/' + timeId,
    method: 'get'
  })
}

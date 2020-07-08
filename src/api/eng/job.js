import request from '@/utils/request'

// 查询生产工作列表
export function queryJob(queryParams) {
  return request({
    url: '/eng/job/list',
    method: 'get',
    params: queryParams
  })
}

// 查询单个生产工作
export function get(id) {
  return request({
    url: '/eng/job/get/' + id,
    method: 'get'
  })
}

// 添加生产工作
export function add(data) {
  return request({
    url: '/eng/job/add',
    method: 'put',
    params: data
  })
}

// 修改生产工作
export function update(data) {
  return request({
    url: '/eng/job/update',
    method: 'post',
    params: data
  })
}

// 删除生产工作
export function remove(ids) {
  return request({
    url: '/eng/job/delete/' + ids,
    method: 'delete'
  })
}

// 通过时间ID查询项目
export function getProjects(timeId) {
  return request({
    url: '/eng/job/get/project/' + timeId,
    method: 'get'
  })
}

import request from '@/utils/request'

// 查询半成品进销存列表
export function list(query) {
  return request({
    url: '/repertory/ban/list',
    method: 'get',
    params: query
  })
}

// 获取单个半成品进销存信息
export function get(id) {
  return request({
    url: '/repertory/ban/get/' + id,
    method: 'get',
  })
}

// 添加半成品进销存信息
export function add(data) {
  return request({
    url: '/repertory/ban/add',
    method: 'put',
    params: data
  })
}

// 修改半成品进销存信息
export function update(data) {
  return request({
    url: '/repertory/ban/update',
    method: 'post',
    params: data
  })
}

// 删除半成品进销存信息
export function remove(ids) {
  return request({
    url: '/repertory/ban/remove/' + ids,
    method: 'delete',
  })
}



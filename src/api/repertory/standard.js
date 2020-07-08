import request from '@/utils/request'

// 查询标准型进销存列表
export function list(query) {
  return request({
    url: '/repertory/standard/list',
    method: 'get',
    params: query
  })
}

// 获取单个标准型进销存信息
export function get(id) {
  return request({
    url: '/repertory/standard/get/' + id,
    method: 'get',
  })
}

// 添加标准型进销存信息
export function add(data) {
  return request({
    url: '/repertory/standard/add',
    method: 'put',
    params: data
  })
}

// 修改标准型进销存信息
export function update(data) {
  return request({
    url: '/repertory/standard/update',
    method: 'post',
    params: data
  })
}

// 删除标准型进销存信息
export function remove(ids) {
  return request({
    url: '/repertory/standard/remove/' + ids,
    method: 'delete',
  })
}



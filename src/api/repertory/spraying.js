import request from '@/utils/request'

// 查询喷涂板进销存列表
export function list(query) {
  return request({
    url: '/repertory/spraying/list',
    method: 'get',
    params: query
  })
}

// 获取单个喷涂板进销存信息
export function get(id) {
  return request({
    url: '/repertory/spraying/get/' + id,
    method: 'get',
  })
}

// 添加喷涂板进销存信息
export function add(data) {
  return request({
    url: '/repertory/spraying/add',
    method: 'put',
    params: data
  })
}

// 修改喷涂板进销存信息
export function update(data) {
  return request({
    url: '/repertory/spraying/update',
    method: 'post',
    params: data
  })
}

// 删除喷涂板进销存信息
export function remove(ids) {
  return request({
    url: '/repertory/spraying/remove/' + ids,
    method: 'delete',
  })
}



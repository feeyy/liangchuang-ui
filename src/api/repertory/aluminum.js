import request from '@/utils/request'

// 查询铝型材料进销存列表
export function list(query) {
  return request({
    url: '/repertory/aluminum/list',
    method: 'get',
    params: query
  })
}

// 获取单个铝型材料进销存信息
export function get(id) {
  return request({
    url: '/repertory/aluminum/get/' + id,
    method: 'get',
  })
}

// 添加铝型材料进销存信息
export function add(data) {
  return request({
    url: '/repertory/aluminum/add',
    method: 'put',
    params: data
  })
}

// 修改铝型材料进销存信息
export function update(data) {
  return request({
    url: '/repertory/aluminum/update',
    method: 'post',
    params: data
  })
}

// 删除铝型材料进销存信息
export function remove(ids) {
  return request({
    url: '/repertory/aluminum/remove/' + ids,
    method: 'delete',
  })
}



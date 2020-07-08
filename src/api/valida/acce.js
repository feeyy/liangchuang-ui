import request from '@/utils/request'

// 查询验收列表
export function listAcce(query) {
  return request({
    url: '/valida/acceptance/list',
    method: 'get',
    params: query
  })
}
// 获取单个验收信息
export function get(id) {
  return request({
    url: '/valida/acceptance/get/' + id,
    method: 'get',
  })
}

// 添加验收
export function addAcce(data) {
  return request({
    url: '/valida/acceptance/add',
    method: 'put',
    params: data
  })
}

// 修改验收
export function updateAcce(data) {
  return request({
    url: '/valida/acceptance/update',
    method: 'post',
    params: data
  })
}

// 删除验收
export function deleteAcce(id) {
  return request({
    url: '/valida/acceptance/delete/' + id,
    method: 'delete',
  })
}

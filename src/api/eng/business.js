import request from '@/utils/request'

// 查询经营合约列表
export function queryBusiness(queryParams) {
  return request({
    url: '/eng/business/list',
    method: 'get',
    params: queryParams
  })
}

// 查询单个经营合约
export function get(id) {
  return request({
    url: '/eng/business/get/' + id,
    method: 'get'
  })
}

// 添加经营合约
export function add(data) {
  return request({
    url: '/eng/business/add',
    method: 'put',
    params: data
  })
}

// 修改经营合约
export function update(data) {
  return request({
    url: '/eng/business/update',
    method: 'post',
    params: data
  })
}

// 删除经营合约
export function remove(ids) {
  return request({
    url: '/eng/business/delete/' + ids,
    method: 'delete'
  })
}

// 通过时间ID查询项目
export function getProjects(timeId) {
  return request({
    url: '/eng/business/get/project/' + timeId,
    method: 'get'
  })
}

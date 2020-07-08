import request from '@/utils/request'

// 查询年度计划汇总列表
export function listProdMary(query) {
  return request({
    url: '/prod/mary/list',
    method: 'get',
    params: query
  })
}

// 获取单个年度计划汇总信息
export function get(id) {
  return request({
    url: '/prod/mary/get/' + id,
    method: 'get',
  })
}

// 年度计划汇总条件(年)
export function getYears() {
  return request({
    url: '/prod/mary/get/years',
    method: 'get',
  })
}

// 添加年度计划汇总信息
export function addProdMary(data) {
  return request({
    url: '/prod/mary/add',
    method: 'put',
    params: data
  })
}

// 修改年度计划汇总信息
export function updateProdMary(data) {
  return request({
    url: '/prod/mary/update',
    method: 'post',
    params: data
  })
}

// 删除年度计划汇总信息
export function deleteProdMary(ids) {
  return request({
    url: '/prod/mary/delete/' + ids,
    method: 'delete',
  })
}

// 查询年度计划汇总列表
export function updateMary() {
  return request({
    url: '/prod/mary/refresh',
    method: 'get',
  })
}



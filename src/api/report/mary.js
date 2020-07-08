import request from '@/utils/request'

// 查询年度生产汇总列表
export function listProdictMary(query) {
  return request({
    url: '/report/mary/list',
    method: 'get',
    params: query
  })
}

// 获取单个年度生产汇总信息
export function get(id) {
  return request({
    url: '/report/mary/get/' + id,
    method: 'get',
  })
}

// 年度生产汇总条件(年)
export function getYears() {
  return request({
    url: '/report/mary/get/years',
    method: 'get',
  })
}

// 添加年度生产汇总信息
export function addProdictMary(data) {
  return request({
    url: '/report/mary/add',
    method: 'put',
    params: data
  })
}

// 修改年度生产汇总信息
export function updateProdictMary(data) {
  return request({
    url: '/report/mary/update',
    method: 'post',
    params: data
  })
}

// 删除年度生产汇总信息
export function deleteProdictMary(ids) {
  return request({
    url: '/report/mary/delete/' + ids,
    method: 'delete',
  })
}

// 手动更新量产日报数据, 凌晨一点系统自动更新
export function refreshData() {
  return request({
    url: '/report/mary/refresh',
    method: 'get',
  })
}


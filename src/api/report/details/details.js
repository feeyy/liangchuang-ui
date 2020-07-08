import request from '@/utils/request'

// 查询日产量列表
export function listDetails(query) {
  return request({
    url: '/report/details/list',
    method: 'get',
    params: query
  })
}

// 获取单个日产量信息
export function get(id) {
  return request({
    url: '/report/details/get/' + id,
    method: 'get',
  })
}

// 修改日产量信息
export function updateDetails(data) {
  return request({
    url: '/report/details/update',
    method: 'post',
    params: data
  })
}



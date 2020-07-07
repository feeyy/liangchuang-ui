import request from '@/utils/request'

// 查询未打磨旧模板进销存列表
export function list(query) {
  return request({
    url: '/repertory/playsand/list',
    method: 'get',
    params: query
  })
}

// 获取单个未打磨旧模板进销存信息
export function get(id) {
  return request({
    url: '/repertory/playsand/get/' + id,
    method: 'get',
  })
}

// 添加未打磨旧模板进销存信息
export function add(data) {
  return request({
    url: '/repertory/playsand/add',
    method: 'put',
    params: data
  })
}

// 修改未打磨旧模板进销存信息
export function update(data) {
  return request({
    url: '/repertory/playsand/update',
    method: 'post',
    params: data
  })
}

// 删除未打磨旧模板进销存信息
export function remove(ids) {
  return request({
    url: '/repertory/playsand/remove/' + ids,
    method: 'delete',
  })
}

// 获取排
export function listRow() {
  return request({
    url: '/repertory/playsand/listRow/',
    method: 'get',
  })
}

// 获取编号
export function listNumber() {
  return request({
    url: '/repertory/playsand/listNumber/',
    method: 'get',
  })
}


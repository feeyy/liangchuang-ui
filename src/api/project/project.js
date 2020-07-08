import request from '@/utils/request'
//良创工程项目

//查询项目
export function getprolist(datas) {
  return request({
    url: '/management/project/list',
    method: 'get',
    params:datas
  })
}
//查询工程项目时间
export function gettime() {
  return request({
    url: '/module/time/list',
    method: 'get'
  })
}
//添加项目
export function addpro(datas) {
  return request({
    url: '/management/project/add',
    method: 'put',
    params:datas
  })
}
//删除项目
export function delpro(id) {
  return request({
    url: '/management/project/delete/'+id,
    method: 'DELETE'
  })
}
//修改项目
export function updatepro(datas) {
  return request({
    url:'/management/project/update',
    method: 'post',
    params:datas
  })
}
//查询项目单项信息
export function getprodan(id) {
  return request({
    url:'/management/project/get/'+id,
    method: 'get'
  })
}

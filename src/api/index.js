import request from '@/utils/request'

// 统计当前年的计划总数、完成、未完成、延后完成数量
export function getIndexTaskMary() {
  return request({
    url: '/index/getIndexTaskMary',
    method: 'get'
  })
}

// 查询日产量类型名称列表
export function listType() {
  return request({
    url: '/report/type/list',
    method: 'get',
  })
}

// 月统计产量(本年)
export function statisticalProductMaryMonth() {
  return request({
    url: '/index/statisticalProductMaryMonth',
    method: 'get'
  })
}

// 过去三年与本年的产量统计
export function statisticalProductMaryYears() {
  return request({
    url: '/index/statisticalProductMaryYears',
    method: 'get'
  })
}

// 通过组别类型统计当月日产量详情-用作主页echars图形数据
export function statisticalProductMary(prodTypeId) {
  return request({
    url: '/index/statisticalProductMary/' + prodTypeId,
    method: 'get'
  })
}

// 年度计划汇总
export function prodTaskMaryList(query) {
  return request({
    url: '/index/prodTaskMaryList',
    method: 'get',
    params: query
  })
}

// 年度生产汇总
export function listProdictMary(query) {
  return request({
    url: '/index/prodictMaryList',
    method: 'get',
    params: query
  })
}

// 年度工程项目汇总
export function queryProgressMary() {
  return request({
    url: '/index/engList',
    method: 'get',
  })
}

// 仓存进销存汇总
export function queryRepertoryList(query) {
  return request({
    url: '/index/repertoryList',
    method: 'get',
    params: query
  })
}

// 项目地图分布统计
export function porjectMap() {
  return request({
    url: '/index/porjectMap',
    method: 'get',
  })
}




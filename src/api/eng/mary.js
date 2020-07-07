import request from '@/utils/request'

// 查询工程进展列表
export function queryProgressMary(queryParams) {
  return request({
    url: '/eng/mary/list',
    method: 'get',
    params: queryParams
  })
}

// 通过时间ID查询项目
export function getProjects(timeId) {
  return request({
    url: '/eng/progress/get/project/' + timeId,
    method: 'get'
  })
}


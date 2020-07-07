import request from '@/utils/request'

// 仓库存储汇总
export function list(query) {
  return request({
    url: '/repertory/mary/list',
    method: 'get',
    params: query
  })
}



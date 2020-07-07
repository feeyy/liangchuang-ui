import request from '@/utils/request'

// 查询日产量类型名称列表
export function listType() {
  return request({
    url: '/report/type/list',
    method: 'get',
  })
}

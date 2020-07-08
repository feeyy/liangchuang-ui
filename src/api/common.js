import request from '@/utils/request'

// 判断是否是超级管理员: 是返回true , 否就返回false并返回部门ID
export function isAdmin() {
  return request({
    url: '/prod/task/isAdmin',
    method: 'get'
  })
}

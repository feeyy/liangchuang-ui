import request from '@/utils/request'

// 计划任务的时间(年月)
export function getTime() {
  return request({
    url: '/module/time/list',
    method: 'get'
  })
}

// 查询工程项目的时间(年)
export function getEngTime() {
  return request({
    url: '/eng/time/list',
    method: 'get'
  })
}


// 时间转换
export function formatDate(row, column) {
  // 获取单元格数据
  let data = row[column.property]
  if(data == null) {
    return null
  }
  let dt = new Date(data)
  return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
}
// 时间转换中年月日
export function formatDateZh(row, column) {
  // 获取单元格数据
  let data = row[column.property]
  if(data == null) {
    return null
  }
  let dt = new Date(data)
  return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日 ' + dt.getHours() + '时' + dt.getMinutes() + '分' + dt.getSeconds() + "秒"
}

import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/salesmanUser/list',
    method: 'get',
    params: query
  })
}
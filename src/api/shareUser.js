import request from '@/utils/request'

export function listShare(query) {
  return request({
    url: '/share/list',
    method: 'get',
    params: query
  })
}

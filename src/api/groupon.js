import request from '@/utils/request'

export function readGroupon(id) {
  return request({
    url: '/groupon/read',
    method: 'get',
    params: { id }
  })
}

export function listGrouponUser(query) {
  return request({
    url: '/groupon/join',
    method: 'get',
    params: query
  })
}

export function listGroupon(query) {
  return request({
    url: '/groupon/list',
    method: 'get',
    params: query
  })
}

export function deleteGroupon(id) {
  return request({
    url: '/groupon/delete',
    method: 'post',
    params: { id }
  })
}

export function publishGroupon(data) {
  return request({
    url: '/groupon/create',
    method: 'post',
    data
  })
}

export function editGroupon(data) {
  return request({
    url: '/groupon/update',
    method: 'post',
    data
  })
}

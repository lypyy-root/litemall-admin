import request from '@/utils/request'

export function listTenant(query) {
  return request({
    url: '/tenant/list',
    method: 'get',
    params: query
  })
}

export function createTenant(data) {
  return request({
    url: '/tenant/create',
    method: 'post',
    data
  })
}

export function updateTenant(data) {
  return request({
    url: '/tenant/update',
    method: 'post',
    data
  })
}

export function deleteTenant(id) {
  return request({
    url: '/tenant/delete',
    method: 'post',
    params: { id }
  })
}

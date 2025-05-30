import request from '@/utils/request'

export function listDynamic(query) {
  return request({
    url: '/dynamic/list',
    method: 'get',
    params: query
  })
}

export function createDynamic(data) {
  return request({
    url: '/dynamic/create',
    method: 'post',
    data
  })
}

export function readDynamic(data) {
  return request({
    url: '/dynamic/read',
    method: 'get',
    data
  })
}

export function updateDynamic(data) {
  return request({
    url: '/dynamic/update',
    method: 'post',
    data
  })
}

export function deleteDynamic(id) {
  return request({
    url: '/dynamic/delete',
    method: 'post',
    params: {id}
  })
}

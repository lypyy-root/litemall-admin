import request from '@/utils/request'

export function listQrcode(query) {
  return request({
    url: '/qrcode/list',
    method: 'get',
    params: query
  })
}

export function createQrcode(data) {
  return request({
    url: '/qrcode/create',
    method: 'post',
    data
  })
}

export function updateQrcode(data) {
  return request({
    url: '/qrcode/update',
    method: 'post',
    data
  })
}

export function deleteQrcode(id) {
  return request({
    url: '/qrcode/delete',
    method: 'post',
    params: { id }
  })
}

import request from '@/utils/request'

export function listLog(query) {
  return request({
    url: '/log/list',
    method: 'get',
    params: query
  })
}


export function listSysytmLog(query) {
  return request({
    url: '/log/system-list',
    method: 'get',
    params: query
  })
}

export function readSysytmLog(path) {
  return request({
    url: '/log/system-read',
    method: 'get',
    params: {path}
  })
}
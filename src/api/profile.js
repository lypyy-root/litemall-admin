import request from '@/utils/request'

export function changePassword(data) {
  return request({
    url: '/profile/password',
    method: 'post',
    data
  })
}

export function getProfileDetail() {
  return request({
    url: '/profile/detail',
    method: 'get'
  })
}

export function updateProfile(data) {
  return request({
    url: '/profile/update',
    method: 'post',
    data
  })
}

export function countNotice() {
  return request({
    url: '/profile/notice/count',
    method: 'get'
  })
}

export function listNotice(query) {
  return request({
    url: '/profile/notice/list',
    method: 'get',
    params: query
  })
}

export function catNotice(id) {
  return request({
    url: '/profile/notice/cat',
    method: 'post',
    params: { id }
  })
}

export function bcatNotice(data) {
  return request({
    url: '/profile/notice/batch-cat',
    method: 'post',
    data
  })
}

export function rmotice(id) {
  return request({
    url: '/profile/notice/delete',
    method: 'post',
    params: { id }
  })
}

export function brmNotice(data) {
  return request({
    url: '/profile/notice/batch-delete',
    method: 'post',
    data
  })
}

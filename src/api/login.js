import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function loginByQr(data) {
  return request({
    url: '/auth/login_by_qr',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function getCaptcha(data) {
  return request({
    url: '/auth/captcha',
    method: 'post',
    data
  })
}

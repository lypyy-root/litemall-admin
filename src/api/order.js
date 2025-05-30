import request from '@/utils/request'
import Qs from 'qs'

export function listOrder(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function orderIsissig(query) {
  return request({
    url: '/orderIsissigning/list',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}


export function orderMap(query) {
  return request({
    url: '/store/list',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function detailOrder(id) {
  return request({
    url: '/order/detail',
    method: 'get',
    params: { id }
  })
}

export function infoOrder() {
  return request({
    url: '/order/info',
    method: 'get'
  })
}

export function shipOrder(data) {
  return request({
    url: '/order/ship',
    method: 'post',
    data
  })
}

export function cancelOrder(data) {
  return request({
    url: '/order/cancel',
    method: 'post',
    data
  })
}

export function refundOrder(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

export function payOrder(data) {
  return request({
    url: '/order/pay',
    method: 'post',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: '/order/delete',
    method: 'post',
    params: { id }
  })
}

export function replyComment(data) {
  return request({
    url: '/order/reply',
    method: 'post',
    data
  })
}

export function listChannel(id) {
  return request({
    url: '/order/channel',
    method: 'get'
  })
}

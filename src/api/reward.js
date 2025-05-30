import request from '@/utils/request'

export function readReward(id) {
  return request({
    url: '/reward/read',
    method: 'get',
    params: { id }
  })
}

export function listRewardUser(query) {
  return request({
    url: '/reward/join',
    method: 'get',
    params: query
  })
}

export function listReward(query) {
  return request({
    url: '/reward/list',
    method: 'get',
    params: query
  })
}

export function deleteReward(id) {
  return request({
    url: '/reward/delete',
    method: 'post',
    params: { id }
  })
}

export function createReward(data) {
  return request({
    url: '/reward/create',
    method: 'post',
    data
  })
}

export function editReward(data) {
  return request({
    url: '/reward/update',
    method: 'post',
    data
  })
}

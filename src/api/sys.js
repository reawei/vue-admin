import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

export function addUser(params) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: params
  })
}

export function getPermList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

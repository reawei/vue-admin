import request from '@/utils/request'

export function getPayList(params) {
  return request({
    url: '/order/pay/list',
    method: 'get',
    params
  })
}

export function getWithdrawList(params) {
  return request({
    url: '/order/pay/list',
    method: 'get',
    params
  })
}

export function updatePayById(params) {
  return request({
    url: '/order/pay',
    method: 'post',
    data: params
  })
}

export function delPayById(params) {
  return request({
    url: '/order/pay/:id',
    method: 'delete',
    data: params
  })
}

import Mock from 'mockjs'
import { param2Obj } from '@/utils'

let payList = []
const WithdrawList = []
const count = 100

for (let i = 1; i < count; i++) {
  payList.push(Mock.mock({
    'id': i,
    'orderId': '@natural',
    'name': '@cname',
    'phone': /^1[385][1-9]\d{8}/,
    'idCard': '@id()',
    'status|1': [1, 2, 3, 4, 5],
    'ip': '@ip',
    'address': '@county(true)',
    'modifyTime': '@datetime',
    'createTime': '@datetime'
  }))
}

for (let i = 1; i < count; i++) {
  WithdrawList.push(Mock.mock({
    'id': i,
    'name': '@cname',
    'status|1': [1, 2, 3, 4, 5],
    'address': '@county(true)',
    'modifyTime': '@datetime',
    'createTime': '@datetime'
  }))
}

export default {
  getPayList: config => {
    const { status, name, current = 1, limit = 10 } = param2Obj(config.url)
    let mockList = payList.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      if (status && item.status !== status) return false
      return true
    })

    mockList = mockList.reverse()
    const pageList = mockList.filter((item, index) => index < limit * current && index >= limit * (current - 1))

    return {
      code: 20000,
      data: {
        total: mockList.length,
        items: pageList
      }
    }
  },

  updatePayById: config => {
    const { id, status } = JSON.parse(config.body)
    payList.forEach(item => {
      if (id && item.id === id) {
        item.status = status
        payList.unshift(item)
      }
    })

    return {
      code: 20000,
      data: 'success'
    }
  },

  deletePayById: config => {
    const { id } = JSON.parse(config.body)
    payList = payList.filter((item) => item.id !== id)
    return {
      code: 20000,
      data: 'success'
    }
  },

  getWithdrawList: config => {
    const { type, status, author, current = 1, limit = 10 } = param2Obj(config.url)

    let mockList = WithdrawList.filter(item => {
      if (author && item.author.indexOf(author) < 0) return false
      if (status && item.status !== status) return false
      if (type && item.type !== type) return false
      return true
    })

    mockList = mockList.reverse()
    const pageList = mockList.filter((item, index) => index < limit * current && index >= limit * (current - 1))

    return {
      code: 20000,
      data: {
        total: mockList.length,
        items: pageList
      }
    }
  }
}

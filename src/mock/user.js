import Mock from 'mockjs'
import {
  param2Obj
} from '@/utils'

let userList = []
const count = 3

for (let i = 1; i < count; i++) {
  userList.push(Mock.mock({
    'id': i,
    'name': '@cname',
    'phone': /^1[385][1-9]\d{8}/,
    'role|1': ['1', '2', '3', '4'],
    'status|1': ['1', '2'],
    modifyTime: '@datetime'
  }))
}

export default {
  getList: config => {
    const {
      role,
      status,
      name,
      current = 1,
      limit = 10
    } = param2Obj(config.url)
    let mockList = userList.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      if (status && item.status !== status) return false
      if (role && item.role !== role) return false
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
  addUser: config => {
    const {
      role,
      status,
      name,
      phone
    } = JSON.parse(config.body)

    userList.push(Mock.mock({
      id: userList.length + 1,
      role: role,
      status: status,
      name: name,
      phone: phone,
      modifyTime: '@datetime'
    }))

    return {
      code: 20000,
      data: 'success'
    }
  }
}

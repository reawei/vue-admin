import Mock from 'mockjs'
import loginAPI from './login'
import userAPI from './user'
import orderAPI from './order'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 用户管理
Mock.mock(/\/sys\/user/, 'get', userAPI.getList)
Mock.mock(/\/sys\/user/, 'post', userAPI.addUser)

// 订单管理
Mock.mock(/\/order\/pay\/list\.*/, 'get', orderAPI.getPayList)
Mock.mock(/\/order\/pay/, 'post', orderAPI.updatePayById)
Mock.mock(/\/order\/pay\/:id/, 'delete', orderAPI.deletePayById)
Mock.mock(/\/order\/withdraw\/list\.*/, 'get', orderAPI.getWithdrawList)

export default Mock

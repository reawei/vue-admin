import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/error/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '管理中心',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: '基础管理',
    meta: { title: '基础管理', icon: 'setting' },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/sys/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'perm',
        name: '权限管理',
        component: () => import('@/views/sys/perm/index'),
        meta: { title: '权限管理', icon: 'passwd' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/pay',
    name: '订单管理',
    meta: { title: '订单管理', icon: 'table' },
    children: [
      {
        path: 'pay',
        name: '支付订单',
        component: () => import('@/views/order/pay/index'),
        meta: { title: '支付订单', icon: 'table' }
      },
      {
        path: 'withdraw',
        name: '提现订单',
        component: () => import('@/views/order/withdraw/index'),
        meta: { title: '提现订单', icon: 'table' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '表单',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

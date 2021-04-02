import Vue from 'vue'
import VueRouter from 'vue-router'
import { getItem } from '../utils/storage'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=>import('../views/Welcome.vue')
      },
      {
        path:'/users',
        component:()=>import('../components/user/Users.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})


// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转而来
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = getItem("token");
  if (!tokenStr) return next('/login')
  next()


})

export default router

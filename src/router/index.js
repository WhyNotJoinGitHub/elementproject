import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childCpns/Welcome')
const Users = () => import('views/home/childCpns/userManage/Users')
const Rights = () => import('views/home/childCpns/powerManage/Rights')
const Roles = () => import('views/home/childCpns/powerManage/Roles')
const Categories = () => import('views/home/childCpns/goodsManage/categories')
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next()
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'

const error404 = () => import('views/error404')
const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childCpns/Welcome')
const Users = () => import('views/home/childCpns/userManage/Users')
const Rights = () => import('views/home/childCpns/powerManage/Rights')
const Roles = () => import('views/home/childCpns/powerManage/Roles')
const Categories = () => import('views/home/childCpns/goodsManage/Categories')
const Params = () => import('views/home/childCpns/goodsManage/Params')
const Goods = () => import('views/home/childCpns/goodsManage/Goods')
const Reports = () => import('views/home/childCpns/reports/Reports')
const Orders = () => import('views/home/childCpns/orders/Orders')
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
		path: '*',
		component: error404
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
			},
			{
				path: '/params',
				component: Params
			},
			{
				path: '/goods',
				component: Goods
			},
			{
				path: '/reports',
				component: Reports
			},
			{
				path: '/orders',
				component: Orders
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

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}


export default router

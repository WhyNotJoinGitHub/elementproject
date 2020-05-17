import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'assets/css/basic.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config => {
	config.headers.Authorization = sessionStorage.getItem('token')
	return config
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'assets/css/basic.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)

import axios from 'axios'

axios.defaults.baseURL = 'http://www.ahgpb.com:8888/api/private/v1'
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

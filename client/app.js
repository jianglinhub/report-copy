import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview'
import 'ne-istyle/index/main.less'
import App from './App.vue'
import routes from './config/routes'
import axios from './config/http'
import './common/css/svw_mib2_theme_index.less'

Vue.use(VueRouter)
Vue.use(iView)

const router = new VueRouter({
  routes,
})

Vue.prototype.$http = axios

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App),
})

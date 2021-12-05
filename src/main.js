/*
main.js 是最先执行的主 js 文件
*/
import App from './App.vue'
import router from './router'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'


Vue.prototype.$qs=qs

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios;   //全局注册，使用方法为:this.$axios


// axios.defaults.baseURL = 'https://api-test.shall-buy.top'  //全局使用的请求域名
axios.defaults.baseURL = 'http://127.0.0.1:8088'  //全局使用的请求域名

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')




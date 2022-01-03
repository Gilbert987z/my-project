/*
main.js 是最先执行的主 js 文件
*/
import App from './App.vue'
import router from './router'
import Vue from 'vue'
import axios from './axios'
// import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'


Vue.use(ElementUI)
// Vue.use(VueAxios, axios)

Vue.prototype.$qs=qs //全局注册,查询参数序列化和解析库
Vue.prototype.$axios = axios;   //全局注册，使用方法为:this.$axios


Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')




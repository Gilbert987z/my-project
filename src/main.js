
import App from './App.vue'
import router from './router'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios;   //全局注册，使用方法为:this.$axios

axios.defaults.baseURL = 'https://api-test.shall-buy.top'

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')




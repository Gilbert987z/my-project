
import App from './App.vue'
import router from './router'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';




Vue.use(ElementPlus)
Vue.use(VueAxios, axios)
// import axios from 'axios';
// Vue.prototype.$axios = axios;   //全局注册，使用方法为:this.$axios

axios.defaults.baseURL = 'https://api-test.shall-buy.top'

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')





// import App from './App.vue'
// import router from './router'
// import { createApp } from 'vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
// import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
//
//
//
// const app = createApp(App)
// app.use(ElementPlus)
// app.use(VueAxios, axios)
// // import axios from 'axios';
// // Vue.prototype.$axios = axios;   //全局注册，使用方法为:this.$axios
//
// axios.defaults.baseURL = 'https://api-test.shall-buy.top'
//
// app.config.productionTip = false
//
//
// new app({
//   router,
//   render: h => h(App),
// }).$mount('#app')

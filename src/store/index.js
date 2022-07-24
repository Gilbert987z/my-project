import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";

Vue.use(Vuex)

export default new Vuex.Store({
	state: {//存放需要共享的状态信息
		token: ''

	},
	mutations: {//更改state状态的方法

		SET_TOKEN: (state, token) => {
			console.log('SET_TOKEN方法')
			console.log(token)
			state.token = token
			localStorage.setItem("token", token)  //将token存入本地localStorage中
		},


	},
	actions: {},
	modules: {
		menus
	}
})

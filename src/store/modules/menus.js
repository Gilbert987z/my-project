import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
	state: {

		// menuList: [], //菜单栏数据
		permList: [], //权限数据

		hasRoutes: false,

		editableTabsValue: 'Index',
		editableTabs: [{
			title: '首页',
			name: 'Index',
		}]
	},
	mutations: {
		// setMenuList(state, menus) {
		// 	state.menuList = menus
		// },
		setPermList(state, perms) {
			console.log('设置vuex的权限缓存')
			state.permList = perms
		},
		changeRouteStatus(state, hasRoutes) {
			state.hasRoutes = hasRoutes
		},

		addTab(state, tab) {

			let index = state.editableTabs.findIndex(e => e.name === tab.name)

			if (index === -1) {
				state.editableTabs.push({
					title: tab.title,
					name: tab.name,
				});
			}

			state.editableTabsValue = tab.name;
		},

		resetState: (state) => {
			console.log('退出，登录清空vuex中的state变量缓存')
			// state.menuList = []
			state.permList = []

			state.hasRoutes = false
			state.editableTabsValue = 'Index'
			state.editableTabs = [{
				title: '首页',
				name: 'Index',
			}]
		}

	},
	actions: {
	},

}
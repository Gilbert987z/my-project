import Vue from "vue"

Vue.mixin({
	methods: {
		hasAuth(perm) { //查看是否有对应的权限
			var authority = this.$store.state.menus.permList  //获取menus文件中的权限列表
			console.log('authority')
			console.log(authority)
			console.log(perm)
			console.log(authority.indexOf(perm))

			return authority.indexOf(perm) > -1  //获取权限列表的位置
		}
	}
})

// import Vue from "vue"

// Vue.mixin({
// 	methods: {
// 		hasAuth(perm) {
// 			var authority = this.$store.state.menus.permList

// 			return authority.indexOf(perm) > -1
// 		}
// 	}
// })


// 公用方法库
// index请求接口方法
export default {
  istest() {
    let x = 'wqer';
    
    console.log("this is test");
    return x;
  },
  getBookTypeList(that) {
    //图书类型列表

    that.$axios
      .get("/index/book/type/list")
      .then((response) => {
        console.log(response);
     

      })
      .catch(function(error) {
        // 请求失败处理
        console.log(error);
        
      });
 
    
  },
  
};

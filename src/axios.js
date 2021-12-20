import axios from "axios";
// import router from "./router";
// import Element from "element-ui"

// axios.defaults.baseURL = 'https://api-test.shall-buy.top'  //全局使用的请求域名
axios.defaults.baseURL = 'http://127.0.0.1:8088'  //全局使用的请求域名

// 以后再做前端的token刷新吧，太难了
// 被挂起的请求数组
// let refreshSubscribers = [];
// 是否有请求正在刷新token
window.isRefreshing = false;


// const request = axios.create({
// 	timeout: 5000,
// 	headers: {
// 		'Content-Type': "application/json; charset=utf-8"
// 	}
// })

// request.interceptors.request.use(config => {
// 	config.headers['Authorization'] = localStorage.getItem("token")
// 	return config
// })

// request.interceptors.response.use(
// 	response => {

// 		console.log("response ->" + response)

// 		let res = response.data

// 		if (res.code === 200) {
// 			return response
// 		} else {
// 			Element.Message.error(!res.message ? '系统异常' : res.message)
// 			return Promise.reject(response.data.message)
// 		}
// 	},
// 	error => {

// 		console.log(error)

// 		if (error.response.data) {
// 			error.massage = error.response.data.message
// 		}

// 		if (error.response.status === 401) {
// 			router.push("/login")
// 		}

// 		Element.Message.error(error.massage, {duration: 3000})
// 		return Promise.reject(error)
// 	}
// )

// export default request












//  /*是否有请求正在刷新token*/
//  window.isRefreshing = false;
//  /*被挂起的请求数组*/
//  let refreshSubscribers = [];

//  /*获取刷新token请求的token*/
//  function getRefreshToken() {
//    return JSON.parse(localStorage.auth).refresh_token;
//  }

//  /*push所有请求到数组中*/
//  function subscribeTokenRefresh(cb) {
//    refreshSubscribers.push(cb);
//  }

//  /*刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
//  function onRrefreshed(token) {
//    refreshSubscribers.map(cb => cb(token));
//  }

//  /*请求拦截器*/
//  ajax.interceptors.request.use(
//    config => {
// 	 const authTmp = localStorage.auth;
// 	 /*判断是否已登录*/
// 	 if (authTmp) {
// 	   /*解析登录信息*/
// 	   let auth = JSON.parse(authTmp);
// 	   /*判断auth是否存在*/
// 	   if (auth) {
// 		 /*在请求头中添加token类型、token*/
// 		 config.headers.Authorization = auth.token_type + " " + auth.token;
// 		 /*判断刷新token请求的refresh_token是否过期*/
// 		 if (util.isRefreshTokenExpired()) {
// 		   alert("刷新token过期，请重新登录");
// 		   /*清除本地保存的auth*/
// 		   localStorage.removeItem("auth");
// 		   window.location.href = "#/login";
// 		   return;
// 		 }
// 		 /*判断token是否将要过期*/
// 		 if (
// 		   util.isTokenExpired() &&
// 		   config.url.indexOf("admin/auth/current") === -1
// 		 ) {
// 		   /*判断是否正在刷新*/
// 		   if (!window.isRefreshing) {
// 			 /*将刷新token的标志置为true*/
// 			 window.isRefreshing = true;
// 			 /*发起刷新token的请求*/
// 			 apiList
// 			   .refreshToken({ refresh_token: getRefreshToken() })
// 			   .then(res => {
// 				 /*将标志置为false*/
// 				 window.isRefreshing = false;
// 				 /*成功刷新token*/
// 				 config.headers.Authorization =
// 				   res.data.data.token_type + " " + res.data.data.token;
// 				 /*更新auth*/
// 				 localStorage.setItem(
// 				   "auth",
// 				   JSON.stringify(res.data.data)
// 				 );
// 				 /*执行数组里的函数,重新发起被挂起的请求*/
// 				 onRrefreshed(res.data.data.token);
// 				 /*执行onRefreshed函数后清空数组中保存的请求*/
// 				 refreshSubscribers = [];
// 			   })
// 			   .catch(err => {
// 				 alert(err.response.data.message);
// 				 /*清除本地保存的auth*/
// 				 // localStorage.removeItem('auth')
// 				 window.location.href = "#/login";
// 			   });
// 		   }
// 		   /*把请求(token)=>{....}都push到一个数组中*/
// 		   let retry = new Promise((resolve, reject) => {
// 			 /*(token) => {...}这个函数就是回调函数*/
// 			 subscribeTokenRefresh(token => {
// 			   config.headers.Authorization = "Bearer " + token;
// 			   /*将请求挂起*/
// 			   resolve(config);
// 			 });
// 		   });
// 		   return retry;
// 		 }
// 	   }
// 	   return config;
// 	 } else {
// 	   /*未登录直接返回配置信息*/
// 	   return config;
// 	 }
//    },
//    /*错误操作*/
//    err => {
// 	 return Promise.reject(err);
//    }
//  );

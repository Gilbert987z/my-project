//axios的文件封装

import axios from "axios";
import { Notification } from "element-ui";
import router from "./router";
// import Element from "element-ui"

// axios.defaults.baseURL = 'https://api-test.shall-buy.top'  //全局使用的请求域名
axios.defaults.baseURL = "http://127.0.0.1:8088"; //全局使用的请求域名

// 以后再做前端的token刷新吧，太难了
// 被挂起的请求数组
// let refreshSubscribers = [];
// 是否有请求正在刷新token
// window.isRefreshing = false;

//axios实例对象
const request = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

//axios请求拦截
request.interceptors.request.use((config) => {
  config.headers["Authorization"] = localStorage.getItem("token");
  return config;
});

window.
// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []


function refreshToken () {
  // 我项目中  更新token 需要吧原有的token 换成refreshToken去请求   这里根据需求可以改动
  window.localStorage.setItem('token', window.localStorage.refreshToken)
  return request({method:'get',url: '/api-token-refresh'})
}
// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
function setToken(token,refreshToken){
  console.log("重新缓存token")
  request.defaults.headers['Authorization'] = `Auth ${token}`
  // 这里用到的存储是localStorage
  window.localStorage.setItem('token', token)
    
  window.localStorage.setItem('refreshToken', refreshToken)
}


////axios响应拦截
request.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      console.log(response.data.code)

      // 这里可以根据code值进行判断处理，需要与后端协商统一
      if (response.data.code == 0) {
        console.log("test");
      } else if (response.data.code == 20001) {
        console.log("20001报错");
      
        Notification.error({
          title: "错误",
          message: response.data.message,
        });
        // Message({
        //   message: "网络请求不存在",
        //   duration: 1500,
        //   type: "error",
        // });
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  (error) => {


    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 418:
          //   router.replace({
          //     path: "/login",
          //     query: {
          //       redirect: router.currentRoute.fullPath,
          //     },
          //   });
          Notification.error({
            title: "401",
            message: error.response.data,
          });
          router.push("/login"); //跳转到登录页
          break;

        case 401:
          var config = error.config;

          if (!isRefreshing) {
            isRefreshing = true
            
            return refreshToken().then(res => {
        
              const { token ,refreshToken} = res.data.data
             
              
              setToken(token,refreshToken)
              config.headers['Authorization'] = `Auth ${token}`
              config.baseURL = ''
              console.log('token过期刷新接口');
               //  这里有个小问题  当在重试中 如果接口报错 就会直接跳转到登录页  需要后端配合
              // 已经刷新了token，将所有队列中的请求进行重试
              
              requests.forEach(cb => cb(token))
              requests = []
              return request(config)
            },err=>{
              console.log(err)
              
            }).catch(res => {
    
              console.error('refreshtoken error =>', res)
             
            }).finally(() => {
              console.log('这边');
              
              isRefreshing = false
            })
          }else {
            // 正在刷新token，将返回一个未执行resolve的promise
            // 保存函数 等待执行
            // 吧请求都保存起来 等刷新完成后再一个一个调用
             new Promise((resolve) => {
              // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
              requests.push((token) => {
                config.baseURL = ''
                config.headers['Authorization'] = `Auth ${token}`
                resolve(request(config))
              })
            })
          }
       
          break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          //   Message({
          //     message: "登录过期，请重新登录",
          //     duration: 1000,
          //     forbidClick: true,
          //   });
          //   // 清除token
          //   localStorage.removeItem("token");
          //   store.commit("loginSuccess", null);
          //   // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          //   setTimeout(() => {
          //     router.replace({
          //       path: "/login",
          //       query: {
          //         redirect: router.currentRoute.fullPath,
          //       },
          //     });
          //   }, 1000);
          break;

        // 404请求不存在
        case 404:
          Notification.error({
            title: "404",
            message: error.response.data,
          });
          //   Message({
          //     message: "网络请求不存在",
          //     duration: 1500,
          //     forbidClick: true,
          //   });
          break;
        // 其他错误，直接抛出错误提示
        default:
        //   Message({
        //     message: error.response.data.message,
        //     duration: 1500,
        //     forbidClick: true,
        //   });
      }
      return Promise.reject(error.response);
    }
  }
);
 


export default request;

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

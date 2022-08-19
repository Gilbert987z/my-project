import Vue from "vue";
import Router from "vue-router";
// 引入组件
import bookSave from "../components/book/bookSave";
import bookDetail from "../components/book/bookDetail";
import publisher from "../components/publisher.vue";
import bookType from "../components/bookType.vue";
import bookBorrow from "../components/bookBorrow.vue";
import userlist from "../components/userlist.vue";
import naviMenu from "../components/layout/naviMenu.vue";

import axios from "../axios";
import store from "../store"

Vue.use(Router);

//路由导航冗余报错（路由重复）
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new Router({
  mode: "history", //history模式不带#
  routes: [
    {
      path: "/404",
      name: "404",
      component: () => import("../components/error-page/404.vue"),
      hidden: true,
    },
    {
      path: "/401",
      name: "401",
      component: () => import("../components/error-page/401.vue"),
      hidden: true,
    },
    {
      path: "/login",
      name: "Login",
      meta: {
        title: "登录页",
      },
      // component: login
      component: () => import("../views/user/Login.vue"),
    },

    {
      path: "/test2",
      name: "test2",
      meta: {
        title: "测试页",
      },
      // component: login
      component: () => import("../views/test2.vue"),
    },
    {
      path: "/test3",
      name: "test3",
      meta: {
        title: "测试页",
      },
      // component: login
      component: () => import("../views/test3.vue"),
    },
    {
      path: "/test_pdf",
      name: "test_pdf",
      meta: {
        title: "测试页",
      },
      // component: login
      component: () => import("../views/test/test_pdf.vue"),
    },
    {
      path: "/testRefresh",
      name: "testRefresh",
      meta: {
        title: "测试页",
      },
      component: () => import("../views/test/testRefresh.vue"),
    },
    {
      path: "/testInput",
      name: "testInput",
      meta: {
        title: "测试页",
      },
      // component: login
      component: () => import("../views/testInput.vue"),
    },
    {
      path: "/testUpload",
      name: "testUpload",
      meta: {
        title: "测试页",
      },
      // component: login
      component: () => import("../views/testUpload.vue"),
    },
    {
      path: "/csdntest2",
      name: "csdntest2",
      meta: {
        title: "测试页",
      },
      // component: login
      component: () => import("../views/csdntest2.vue"),
    },

    
    {
      path: "/",
      // name: "Home",
      redirect: "/login", //跳转到登录
      // component: () => import("../views/Home.vue"), //header的页面
    },
    // {
    //     path: "/user/userCenter",
    //     name: "UserCenter",
    //     meta: {
    //       title: "个人中心",
    //     },
    //     component: () => import("../views/user/UserCenter.vue"), 
    //   },
    {
      path: "/member",  // path 设置为 “/” ，默认显示该页面
      name: "MemberHome",
      meta: {
        title: "图书",
      },
      redirect: "/member/index", //跳转到首页
      component: () => import("../views/member/Home.vue"), //header的页面
      children: [
        {
          path: "/member/index",
          name: "MemberIndex",
          meta: {
            title: "首页",
          },
          component: () => import("../views/member/Index.vue"), //main的页面
        },
        {
          path: "/user/userCenter",
          name: "UserCenter",
          meta: {
            title: "个人中心",
          },
          component: () => import("../views/user/UserCenter.vue"), 
        },
   
        {
            path: "/test", //列表页
            name: "test",
            meta: {
              title: "测试",
            },
            component: () => import("../views/test.vue"),
          },
      ],
    },
    {
      path: "/admin",  // path 设置为 “/” ，默认显示该页面
      name: "AdminHome",
      meta: {
        title: "图书管理系统",
      },
      redirect: "/admin/index", //跳转到首页
      component: () => import("../views/admin/Home.vue"), //header的页面
      children: [
        {
          path: "/admin/index",
          name: "AdminIndex",
          meta: {
            title: "首页",
          },
          component: () => import("../views/admin/Index.vue"), //main的页面
        },
        {
          path: "/user/userCenter",
          name: "UserCenter",
          meta: {
            title: "个人中心",
          },
          component: () => import("../views/user/UserCenter.vue"), 
        },
 
        {
            path: "/test", //列表页
            name: "test",
            meta: {
              title: "测试",
            },
            component: () => import("../views/test.vue"),
          },
      ],
    },
    {
      path: "/admin/sys",
      name: "Sys",
      meta: {
        title: "系统管理",
      },
      redirect: "/admin/sys/user", //跳转到首页
      component: () => import("../views/admin/Home.vue"), //header的页面
      children: [
        {
          path: "/admin/sys/user",
          name: "User",
          meta: {
            title: "用户管理",
          },
          component: () => import("../views/admin/sys/User.vue"),
        },
        {
          path: "/admin/sys/role",
          name: "Role",
          meta: {
            title: "角色管理",
          },
          component: () => import("../views/admin/sys/Role.vue"),
        },
        {
          path: "/admin/sys/permission",
          name: "Permission",
          meta: {
            title: "权限管理",
          },
          component: () => import("../views/admin/sys/Permission.vue"),
        },
      ],
    },
    {
      path: "/admin/book",
      name: "Book",
      meta: {
        title: "图书管理",
      },
      redirect: "/admin/book/list", //  /admin/book路径重定向到跳转到图书列表
      component: () => import("../views/admin/Home.vue"), //header的页面
      children: [
        {
          path: "/admin/book/list",
          name: "AdminBook",
          meta: {
            title: "图书列表",
          },
          component: () => import("../views/admin/book/Book.vue"),
          // component: () => import("../views/admin/book/BookSave.vue"),
          children:[
            
          ]
        },
        { //这里有问题，之后再解决吧  关于title的问题  
          path: "/admin/book/save",
          name: "BookSave",
          meta: {
            title: "图书新增",
          },
          component: () => import("../views/admin/book/BookSave.vue"),
        },
        { //这里有问题，之后再解决吧 
          path: "/admin/book/save",
          name: "BookSave",
          meta: {
            title: "图书编辑",
          },
          component: () => import("../views/admin/book/BookSave.vue"),
        },
        {
          path: "/admin/book/bookType",
          name: "BookType",
          meta: {
            title: "图书类型",
          },
          component: () => import("../views/admin/book/BookType.vue"),
        },
        {
          path: "/admin/book/bookPublisher",
          name: "BookPublisher",
          meta: {
            title: "图书出版商",
          },
          component: () => import("../views/admin/book/BookPublisher.vue"),
        },
        {
          path: "/admin/book/bookBorrowLog",
          name: "BookBorrowLog",
          meta: {
            title: "图书借阅日志",
          },
          component: () => import("../views/admin/book/BookBorrowLog.vue"),
        },
      ],
    },

    {
      path: "/member/book",
      name: "MemberBook",
      meta: {
        title: "图书借阅",
      },
      redirect: "/member/book/list", //跳转到图书列表
      component: () => import("../views/member/Home.vue"), //header的页面
      children: [
        {
          path: "/member/book/list",
          name: "MemberBook",
          meta: {
            title: "图书列表",
          },
          component: () => import("../views/member/book/Book.vue"),
        },
        {
          path: "/member/book/bookBorrowLog",
          name: "MemberBookBorrowLog",
          meta: {
            title: "图书借阅日志",
          },
          component: () => import("../views/member/book/BookBorrowLog.vue"),
        },
      ],
    },
    // {
    //   path: "/",
    //   name: "Home",
    //   redirect:'/index',//跳转到首页
    //   component: () => import("../views/Home.vue"), //header的页面
    //   children: [
    //     {
    //       path: "/index",
    //       name: "Index",
    //       meta: {
    //         title: "首页",
    //       },
    //       component: () => import("../views/Index.vue"), //main的页面
    //     },

    //     {
    //         path: "/sys",
    //         name: "Sys",
    //         meta: {
    //             title: "管理",
    //         },
    //         redirect:'/sys/user',//跳转到首页
    //         // component: () => import("../views/Home.vue"), //header的页面
    //         children: [
    //             {
    //                 path: "/sys/user",
    //                 name: "User",
    //                 meta: {
    //                   title: "用户",
    //                 },
    //                 component: () => import("../views/admin/sys/User.vue"),
    //               },
    //             {
    //             path: "/sys/role",
    //             name: "Role",
    //             meta: {
    //                 title: "角色",
    //             },
    //             component: () => import("../views/admin/sys/Role.vue"),
    //             },
    //             {
    //             path: "/sys/permission",
    //             name: "Permission",
    //             meta: {
    //                 title: "权限",
    //             },
    //             component: () => import("../views/admin/sys/Permission.vue"),
    //             },
    //         ]
    //     }
    //   ],
    // },

    {
      path: "/book", //列表页
      name: "Book",
      component: () => import("../views/admin/book/Book.vue"),
    },

  

    {
      path: "/book/detail", //图书详情页
      name: "bookDetail",
      component: bookDetail,
    },
    {
      path: "/book/add", //增加书籍
      name: "bookAdd",
      component: bookSave,
    },
    {
      path: "/book/edit", //修改书籍
      name: "bookEdit",
      component: bookSave,
    },
    {
      path: "/publisher",
      name: "publisher",
      component: publisher,
    },
    {
      path: "/bookBorrow",
      name: "bookBorrow",
      component: bookBorrow,
    },
    {
      path: "/bookType",
      name: "bookType",
      component: bookType,
    },
    {
      path: "/userlist",
      name: "userlist",
      component: userlist,
    },

    {
      path: "/naviMenu",
      name: "naviMenu",
      component: naviMenu,
    },
    // {
    //   path: "*", // 此处需特别注意置于最底部
    //   redirect: "/404", //跳转到404页面
    // },
  ],
});

export default router;

// 路由拦截，判断是否需要登录
router.beforeEach((to, from, next) => {
	let hasRoute = store.state.menus.hasRoutes

	let token = localStorage.getItem("token")


  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.path === "/login" || to.path === "/404" || to.path.includes("test")) {
    //login和404网页不用校验
    next();
    // console.log(11)
  } else {
    
    // console.log(22)
    if (!token) {
      //如果没有token，直接跳转到登录页
      // alert("请登录！")
      // console.log(33)
      next("/login");

    // } else if(token && !hasRoute) {
    //   axios.get("/user/permissions", {
    //     headers: {
    //       Authorization: localStorage.getItem("token")
    //     }
    //   }).then(res => {
  
    //     console.log(res.data.data)
  
    //     // 拿到menuList
    //     // store.commit("setMenuList", res.data.data.nav)
  
    //     // 拿到用户权限
    //     store.commit("setPermList", res.data.data.authoritys) 
  
    //     console.log('PermList123:')
    //     console.log(store.state.menus.menuList)
  
    //     // 动态绑定路由
    //     let newRoutes = router.options.routes
    //       console.log(newRoutes)

    //     // res.data.data.nav.forEach(menu => {
    //     //   if (menu.children) {
    //     //     menu.children.forEach(e => {
  
    //     //       // 转成路由
    //     //       let route = menuToRoute(e)
  
    //     //       // 吧路由添加到路由管理中
    //     //       if (route) {
    //     //         newRoutes[0].children.push(route)
    //     //       }
  
    //     //     })
    //     //   }
    //     // })
  
    //     console.log("newRoutes")
    //     console.log(newRoutes)
    //     router.addRoutes(newRoutes)
  
    //     hasRoute = true
    //     store.commit("changeRouteStatus", hasRoute)
    //   })
    
    } else {
      // console.log(44)
      next();
    }
  }
});



// // 导航转成路由
// const menuToRoute = (menu) => {

// 	if (!menu.component) {
// 		return null
// 	}

// 	let route = {
// 		name: menu.name,
// 		path: menu.path,
// 		meta: {
// 			icon: menu.icon,
// 			title: menu.title
// 		}
// 	}
// 	route.component = () => import('@/views/' + menu.component +'.vue')

// 	return route
// }
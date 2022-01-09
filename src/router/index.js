import Vue from 'vue'
import Router from 'vue-router'
// 引入组件
import bookSave from "../components/book/bookSave";
import bookDetail from "../components/book/bookDetail";
import publisher from "../components/publisher.vue";
import bookType from "../components/bookType.vue";
import bookBorrow from "../components/bookBorrow.vue";
import userlist from "../components/userlist.vue";
import naviMenu from "../components/layout/naviMenu.vue";
import notFound from "../components/error-page/404.vue";
import authorization from "../components/error-page/401.vue";

Vue.use(Router);

//路由导航冗余报错（路由重复）
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    mode: 'history', //history模式不带#
    routes: [
        {
            path: '/404',
            component: notFound,
            hidden: true
        },
        {
            path: '/401',
            component: authorization,
            hidden: true
        },
        {
            path: "/login",
            name: "Login",
            meta:{
                title:"登录页"
            },
            // component: login
            component: () => import('../views/Login.vue'),
        },
       
        {
            path:'/',
            name:'Home',
            component:()=>import('../views/Home.vue'), //header的页面
            children:[
                {
                    path: '/index',
                    name: 'Index',
                    meta: {
                        title: "首页"
                    },
                    component: ()=>import('../views/Index.vue') //main的页面
                },
                {
                    path:'/sys',
                    name:'Home',
                    component:()=>import('../views/admin/sys/Role.vue'),  
                    children:[
                        {
                            path: "/role",  
                            name: "Role",
                            meta: {
                                title: "角色"
                            },
                            component: () => import('../views/admin/sys/Role.vue')
                        },
                    ]
                },
                {
                    path: "/book", //列表页
                    name: "Book",
                    component: () => import('../views/admin/book/Book.vue')
                },

                {
                    path: "/test", //列表页
                    name: "test",
                    meta: {
                        title: "测试"
                    },
                    component: () => import('../views/test.vue')
                },
            ]
        },
        
         {
            path: "/book/detail", //图书详情页
            name: "bookDetail",
            component: bookDetail
        },
        {
            path: "/book/add", //增加书籍
            name: "bookAdd",
            component: bookSave
        },
        {
            path: "/book/edit", //修改书籍
            name: "bookEdit",
            component: bookSave
        },
           {
            path: "/publisher",
            name: "publisher",
            component: publisher
        },        {
            path: "/bookBorrow",
            name: "bookBorrow",
            component: bookBorrow
        },        {
            path: "/bookType",
            name: "bookType",
            component: bookType
        },        {
            path: "/userlist",
            name: "userlist",
            component: userlist
        },
       
 
        {
            path: "/naviMenu",
            name: "naviMenu",
            component: naviMenu
        },
        {
            path: "*", // 此处需特别注意置于最底部
            redirect: "/404" //跳转到404页面
        }
    ]
})

export default router

// 路由拦截，判断是否需要登录
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }

    
    if (to.path === '/login' || to.path==='/404') { //login和404网页不用校验
        next();
        // console.log(11)
    } else {
        let token = localStorage.getItem('token'); 
        // console.log(22)
        if (!token) {  //如果没有token，直接跳转到登录页
            // alert("请登录！")
            // console.log(33)
            next('/login');
        } else {
            // console.log(44)
            next();
        }
    }
});



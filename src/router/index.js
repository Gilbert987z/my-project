import Vue from 'vue'
import Router from 'vue-router'
// import todoItem from '@/components/todoItem'
// 引入组件
import Home from "../components/Home.vue";
import Info from "../components/Info.vue";
import About from "../components/About.vue";
import Login from "../components/Login.vue";
import movie from "../components/movie.vue";
import book from "../components/book.vue";
import bookSave from "../components/book/bookSave";
import test from "../components/test.vue";
import naviMenu from "../components/layout/naviMenu.vue";
import notFound from "../components/error-page/404.vue";
import authorization from "../components/error-page/401.vue";
// import navbar from "../components/layout/Navbar";

Vue.use(Router);

//路由导航冗余报错（路由重复）
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    mode: 'history',
    routes: [
        // {
        //   path: "/todoItem",
        //   name:"todoItem",
        //   component: todoItem
        // },
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
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/about",
            name: "about",
            component: About
        },
        {
            path: "/info",
            name: "info",
            component: Info
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/movie",
            name: "movie",
            component: movie
        },
        {
            path: "/book",
            name: "book",
            component: book
        }, {
            path: "/book/bookSave",
            name: "bookSave",
            component: bookSave
        },
        {
            path: "/test",
            name: "test",
            component: test
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
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('token');

        if (token === null || token === '') {
            alert("请登录！")
            next('/login');
        } else {
            next();
        }
    }
});



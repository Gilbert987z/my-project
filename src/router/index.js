import Vue from 'vue'
import Router from 'vue-router'
// import todoItem from '@/components/todoItem'
// 引入组件
import Home from "../components/Home.vue";
import Info from "../components/Info.vue";
import About from "../components/About.vue";
import Login from "../components/Login.vue";
import movie from "../components/movie.vue";

Vue.use(Router);

//路由导航冗余报错（路由重复）
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history',
    routes: [
        // {
        //   path: "/todoItem",
        //   name:"todoItem",
        //   component: todoItem
        // },
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
        }
    ]
})


// const router = createRouter()
// export default router
<!--<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>-->
<template>
  <div>
 <!-- router-link 定义点击后导航到哪个路径下 -->
 <router-link to="/">Home </router-link>

 <router-link to="/about">About </router-link>
 <router-link to="/info">Info </router-link>
 <router-link to="/login">Login </router-link>
 <router-link to="/movie">movie </router-link>
 <router-link to="/bookList">bookList </router-link>
 <router-link to="/naviMenu">naviMenu </router-link>
 <router-link to="/test">test </router-link>
 <router-link to="/userlist">userlist </router-link>
 <router-link to="/publisher">publisher </router-link>
 <router-link to="/bookType">bookType </router-link>
 <router-link to="/bookBorrow">bookBorrow </router-link>

  <!-- 对应的组件内容渲染到router-view中 -->
 <router-view></router-view>
</div>

</template>
<script>
// import About from './components/About.vue'
// import Home from './components/Home.vue'
// import Info from './components/Info.vue'

export default {
  name: 'App',
  // components: {
  //   Home,
  //  About,
  //  Info
  //
  // }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <!--    <div>
          Home
      </div>-->
  <div id="app">
    <h1>网站列表</h1>
    <!--    <div v-for="site in info" v-bind:key="site">-->
    <!--      {{ site }}-->
    <!--    </div>-->
    <!--        <div>{{info}}</div>-->
    <br>
    <div v-if="info">{{ info.message }}</div>
    <div>{{ info.list }}</div>
    <div v-for="list in info.data.list" :key="list.id">
      {{ list.name }}
    </div>

  </div>
</template>

<script>
/*    export default {
        name: "Home.vue"
    }*/
import axios from 'axios'

export default {
  name: "Home.vue",
  el: '#app',
  data() {
    return {
      info: null
    }
  },
  mounted() {
    axios
        .get('/ongoods/index/index-nav/list')
        .then(response => (this.info = response.data))
        //     .then(response){
        //    this.info = response,
        //    this.name = response.data.list.name
        // }

        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
  }
}
</script>

<style scoped>

</style>
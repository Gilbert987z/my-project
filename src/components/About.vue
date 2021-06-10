<template>
  <div>
    <div>
      About

    </div>
    <!--    <div v-for="site in info" v-bind:key="site">
          {{ site.moviename }}
        </div>-->
    <div id="app" v-if="day_good">
      <img :src="day_good.icon" alt="" style="height: 50px">
      <!--      <p>{{ day_good.front_end_small_title }}<span>{{ day_good.name }}</span></p>-->
      <p>{{ day_good.front_end_small_title }} <span>{{ day_good.name }}</span></p>
      <!--      <p>{{day_good}}</p>-->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "About.vue",
  el: '#app',
  created() {
    axios.all([axios.get('/activity/index/activity/get-day-good'),
      axios.get('/ongoods/index/index-nav/list')
    ])
        .then(axios.spread((res1, res2) => {
          console.log(res1);
          console.log(res2);
          this.day_good = res1.data.data;

        }))
  }
}

</script>

<style scoped>

</style>
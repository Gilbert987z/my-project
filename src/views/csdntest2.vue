<template>
  <el-row>
    <p id="p" style="word-wrap:break-word;word-break:break-all;">Android调用js方法的输出：</p>

    <el-button @click="showToast('测试JS调用Android的toast方法！')">调用Android方法</el-button>
    <div style = "height:1000px"></div>
  </el-row>
</template>
<script>
export default {
  data() {
    return{
      
    }
  },
  methods: {
    showToast(str) {
      let android_data =window.androidFunction.showToast(str);//调用Android的toast方法
      console.log(android_data) //打印Android方法的返回值
    },

    jsfunction(str) {
      document.getElementById("p").innerHTML += str;
    // },

    // jsfunction2(str) {
    //   document.getElementById("p").innerHTML += str;

      let json_data = {
        test:1,
        test2:"这是js的返回值,可供Android获取"
      }
 
      return  json_data //Android调用js方法，可获取返回值
    },
  },
  created() {
    window.jsfunction = this.jsfunction;
    // window.jsfunction2 = this.jsfunction2;
  },
};
</script>

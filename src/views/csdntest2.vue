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
      let x =window.androidFunction.showToast(str);
      console.log(x)
    },

    jsfunction(str) {
      document.getElementById("p").innerHTML += str;
    },

    jsfunction2(str) {
      document.getElementById("p").innerHTML += str;

      let str1 = {
        test:2,
        test2:"这是js的返回值,可供Android获取"
      }
 
      return  str1 //Android调用js方法，可获取返回值
    },
  },
  created() {
    window.jsfunction = this.jsfunction;
    window.jsfunction2 = this.jsfunction2;
  },
};
</script>

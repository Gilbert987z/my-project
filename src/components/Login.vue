<template>

  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

    <el-tab-pane label="登录" name="first">
      <el-form label-position="left" label-width="80px" :model="loginInfo">
        <el-form-item label="用户名">
          <el-input v-model="loginInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginSubmit">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="注册" name="second">
       <el-form label-position="left" label-width="80px" :model="loginInfo">
        <el-form-item label="用户名">
          <el-input v-model="loginInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerSubmit">注册</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeName: 'first',

      loginInfo: {
        name: '',
        password: ''
      }
    };
  },
  methods: {

    handleClick(tab, event) {
      console.log(tab, event);
    },
    loginSubmit() {
      axios
          .post(
              'http://127.0.0.1:8088/login',
              {
                username: this.loginInfo.name,
                password: this.loginInfo.password
              },
          )
          .then(response => {
            console.log(response)
            var message = response.data.message
            var success = response.data.success
            var token = response.data.data.accessToken
            console.log(message)


            var messageType =null
            console.log("success的值：",success)
            console.log(typeof success)
            if(success=== true){
              messageType = 'success'
            }else{
              messageType = 'error'
            }
            console.log(messageType)
            this.$message({ //登录提示信息
                message: message,
                type: messageType //提示类型 success(成功)/warning(警告)/info(消息)/error(错误)
            });


            if(token){ //token有值
              localStorage.setItem("token", token); //将token存入本地
              this.$router.push('/book');//跳转到book列表页面
            }

          }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
      console.log('submit!');
    },
    registerSubmit(){

    }
  }
}
</script>

<style>

</style>

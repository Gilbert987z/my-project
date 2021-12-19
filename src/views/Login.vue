<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="登录" name="first">
      <el-form label-position="left" label-width="80px" :model="loginForm">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="loginForm.code"></el-input>
          <el-image
            :src="captchaImg"
            class="captchaImg"
            @click="getCaptcha"
          ></el-image>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginSubmit">登录</el-button>
          <!--          <el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="注册" name="second">
      <el-form label-position="left" label-width="80px" :model="registerForm">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="registerForm.mobile"
            name="phone"
            pattern="[0-9]*"
            class="y_input"
            type="tel"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input
            v-model="registerForm.rePassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerSubmit">注册</el-button>
          <!--          <el-button>取消</el-button>-->
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
      activeName: "first",

      captchaImg: null,

      loginForm: {
        username: "",
        password: "",
        code: "",
        token: "",
      },
      registerForm: {
        username: "",
        mobile: "",
        password: "",
        rePassword: "",
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    loginSubmit() {
      axios
        .post(
          "/login",
          this.$qs.stringify(this.loginForm),
          // {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // }
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((response) => {
          console.log(response);
          var message = response.data.message;
          var success = response.data.success;
          var token = response.data.data.token;
          console.log(message);

          var messageType = null;
          console.log("success的值：", success);
          console.log(typeof success);
          if (success === true) {
            messageType = "success";
          } else {
            messageType = "error";
          }
          console.log(messageType);
          this.$message({
            //登录提示信息
            message: message,
            type: messageType, //提示类型 success(成功)/warning(警告)/info(消息)/error(错误)
          });

          if (token) {
            //token有值
            localStorage.setItem("token", token); //将token存入本地
            this.$router.push("/bookList"); //跳转到book列表页面
          }
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
      console.log("submit!");
    },
    registerSubmit() {
      axios
        .post("/register", {
          username: this.registerForm.username,
          mobile: parseInt(this.registerForm.mobile),
          password: this.registerForm.password,
        })
        .then((response) => {
          console.log(response);
          var message = response.data.message;
          var success = response.data.success;

          console.log(message);

          var messageType = null;
          console.log("success的值：", success);
          console.log(typeof success);
          if (success === true) {
            messageType = "success";
          } else {
            messageType = "error";
          }
          console.log(messageType);
          this.$message({
            //登录提示信息
            message: message,
            type: messageType, //提示类型 success(成功)/warning(警告)/info(消息)/error(错误)
          });
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
      console.log("submit!");
    },
    getCaptcha() {
      console.log("getCaptcha");

      this.$axios.get("/captcha").then((res) => {
        console.log(res);
        let data = res.data.data;
        console.log(data);
        this.loginForm.token = data.token;
        this.captchaImg = data.captchaImg;
        console.log("token", this.loginForm.token);
        console.log("captchaImg", this.captchaImg);
        // this.loginForm.code = ''
      });
    },
  },
  created() {
    this.getCaptcha();
  },
};
</script>

<style></style>

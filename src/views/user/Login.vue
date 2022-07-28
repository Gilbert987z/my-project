<template>
  <div>
    <h1 style="text-align: center;">LMS</h1>

    <!-- <div id="example"></div>
<script>
txt = "<p>浏览器代号: " + navigator.appCodeName + "</p>";
txt+= "<p>浏览器名称: " + navigator.appName + "</p>";
txt+= "<p>浏览器版本: " + navigator.appVersion + "</p>";
txt+= "<p>启用Cookies: " + navigator.cookieEnabled + "</p>";
txt+= "<p>硬件平台: " + navigator.platform + "</p>";
txt+= "<p>用户代理: " + navigator.userAgent + "</p>";
txt+= "<p>用户代理语言: " + navigator.language + "</p>";
document.getElementById("example").innerHTML=txt;
</script> -->

    <div class="login-container">
      <el-image class="login-pic" :src="require('../../assets/login.png')">
      </el-image>
      <!-- <el-form
      class="login-form"
      label-width="80px"
      :model="user"
      :rules="rules"
      hide-required-asterisk
      @keyup.enter.native="login"
    >
      <el-form-item>
        <h1 class="login-form-heading">登录</h1>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" autofocus></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="login"
          :disabled="!canSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form> -->

      <el-tabs
        class="login-form"
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="登录" name="first">
          <el-form
            label-position="left"
            label-width="80px"
            :model="loginForm"
            ref="loginForm"
            :rules="loginRules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="loginForm.username"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                prefix-icon="el-icon-lock"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input
                v-model="loginForm.code"
                prefix-icon="el-icon-key"
              ></el-input>
              <el-image
                :src="captchaImg"
                class="captchaImg"
                @click="getCaptcha"
              ></el-image>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginSubmit('loginForm')"
                >登录</el-button
              >
              <!--          <el-button>取消</el-button>-->
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="second">
          <el-form
            label-position="left"
            label-width="80px"
            :model="registerForm"
            ref="registerForm"
            :rules="registerRules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="registerForm.username"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model="registerForm.mobile"
                prefix-icon="el-icon-mobile-phone"
                name="phone"
                pattern="[0-9]*"
                class="y_input"
                type="tel"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                prefix-icon="el-icon-lock"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="重复密码" prop="rePassword">
              <el-input
                v-model="registerForm.rePassword"
                type="password"
                prefix-icon="el-icon-lock"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="registerSubmit('registerForm')"
                >注册</el-button
              >
              <!--          <el-button>取消</el-button>-->
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeName: "first",

      captchaImg: null,

      loginForm: {
        username: "lisi",
        password: "1234",
        code: "11111",
        token: "",
      },
      registerForm: {
        username: null,
        mobile: null,
        password: null,
        rePassword: null,
      },
      loginRules: {
        username: [{ required: true, message: "用户名必填", trigger: "blur" }],
        password: [{ required: true, message: "密码必填", trigger: "blur" }],
        code: [
          { required: true, message: "验证码必填", trigger: "blur" },
          {
            pattern: /^[a-zA_Z0-9]{5}$/,
            message: "请输入5位数字或字母的验证码",
            trigger: "blur",
          },
        ],
      },
      registerRules: {
        username: [{ required: true, message: "用户名必填", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号必填", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请正确输入手机号",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "密码必填", trigger: "blur" }],
        rePassword: [{ required: true, message: "密码必填", trigger: "blur" }],
      },
    };
  },
  computed: {
    canSubmit() {
      const { username, password } = this.loginForm;
      return Boolean(username && password);
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    loginSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        //表单校验
        if (valid) {
          this.$axios
            .post("/login", this.$qs.stringify(this.loginForm), {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            })
            .then((response) => {
              console.log(response.data);
              var message = response.data.message;
              var success = response.data.success;

              console.log(message);

              // console.log("success的值：", success);
              // console.log(typeof success);
              if (success) {
                var token = response.data.data.token;
                var refreshToken = response.data.data.refreshToken;

                this.$message({
                  //登录提示信息
                  message: message,
                  type: "success", //提示类型 success(成功)/warning(警告)/info(消息)/error(错误)
                });
              } else {
                this.getCaptcha(); //重新请求验证码接口
              }

              if (token) {
                //token有值

                // console.log("测试vuex  token");
                this.$store.commit("SET_TOKEN", token); //调用vuex中的设置token的mutations方法
                // console.log(this.$store.state.token); //获取vuex state变量

                localStorage.setItem("token", token); //将token存入本地
                localStorage.setItem("refreshToken", refreshToken); //将token存入本地

                this.$axios.get("/user/info").then((res) => {
                  let isAdmin = res.data.data.isAdmin;
                  // console.log(this.userInfo);
                  if (isAdmin == 1 || isAdmin == 2) {
                    this.$router.push({ name: "AdminIndex" }); //跳转到管理员首页
                  } else if (isAdmin == 3) {
                    this.$router.push({ name: "MemberIndex" }); //跳转到用户首页
                  }
                });
              }
            })
            .catch(function(error) {
              // 请求失败处理
              console.log(error);
            });
          console.log("login submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    registerSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        //表单校验
        if (valid) {
          this.$axios
            .post("/register", this.registerForm)
            .then((response) => {
              console.log(response);
              var message = response.data.message;
              var success = response.data.success;

              if (success) {
                this.$message({
                  //登录提示信息
                  message: message,
                  type: "success", //提示类型 success(成功)/warning(警告)/info(消息)/error(错误)
                });
              }
            })
            .catch(function(error) {
              // 请求失败处理
              console.log(error);
            });
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCaptcha() {
      this.$axios.get("/captcha").then((res) => {
        let data = res.data.data;
        // console.log(data);
        this.loginForm.token = data.token;
        this.captchaImg = data.captchaImg;
        // console.log("token", this.loginForm.token);
        // console.log("captchaImg", this.captchaImg);
        // this.loginForm.code = ''
      });
    },
  },
  created() {
    this.getCaptcha();
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-pic {
  width: 30vw;
  min-width: 300px;
  margin-right: 100px;
}

.login-form {
  width: 30vw;
  min-width: 300px;
}

.el-form-item:last-child {
  margin-bottom: 0;
}

.login-form-heading {
  margin: 0;
}
</style>

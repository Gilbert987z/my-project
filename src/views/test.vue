<template>
  <el-form :model="ruleForm" ref="ruleForm">
    <el-form-item prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>

    <el-button @click="goOff()">返回</el-button>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    navigatorInfomation() {
      console.log("浏览器代号: " + navigator.appCodeName);
      console.log("浏览器名称: " + navigator.appName);
      console.log("浏览器版本: " + navigator.appVersion);
      console.log("启用Cookies: " + navigator.cookieEnabled);
      console.log("硬件平台: " + navigator.platform);
      console.log("用户代理: " + navigator.userAgent);
      console.log("用户代理语言: " + navigator.language);
      console.log("navigator: " + navigator);

      console.log("可用宽度: " + screen.availWidth);
      console.log("可用高度: " + screen.availHeight);

      //JS判断当前设备类型
      var os = (function() {
        var ua = navigator.userAgent,
          isWindowsPhone = /(?:Windows Phone)/.test(ua),
          isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
          isAndroid = /(?:Android)/.test(ua),
          isFireFox = /(?:Firefox)/.test(ua),
          isChrome = /(?:Chrome|CriOS)/.test(ua),
          isTablet =
            /(?:iPad|PlayBook)/.test(ua) ||
            (isAndroid && !/(?:Mobile)/.test(ua)) ||
            (isFireFox && /(?:Tablet)/.test(ua)),
          isPhone = /(?:iPhone)/.test(ua) && !isTablet,
          isPc = !isPhone && !isAndroid && !isSymbian;

        console.log(isChrome);
        return {
          isTablet: isTablet,
          isPhone: isPhone,
          isAndroid: isAndroid,
          isPc: isPc,
        };
      })();

      if (os.isAndroid || os.isPhone) {
        alert("phone");
      } else if (os.isTablet) {
        alert("pad");
      } else if (os.isPc) {
        alert("pc");
      }
    },
    goOff() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
  },
  created() {
    this.navigatorInfomation();
  },
};
</script>

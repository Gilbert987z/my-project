<template>
  <el-row>
    <!-- <p id="p">hello world</p>
    <a href="android://h5/open?type=1&id=7#fragmentTest">打开看看</a>

    <el-button @click="jsfunction()">hello world</el-button>

    <el-button @click="goOff()">返回</el-button> -->
    <!-- <input type="button" value="Toast提示" onclick="myObj.showToast('曹神前来日狗~');"/> -->

    <!-- <el-button @click="window.myObj.showToast('曹神前来日狗11~')"
      >测试调用1</el-button
    >
    <el-button @click="showToast('曹神前来日狗121212~')">测试调用2</el-button> -->

    <input
      multiple="multiple"
      type="file"
      placeholder="这是一个提示信息！"
      title="xxxxx"
      capture
      accept="image/jpeg, image/jpg, image/png,application/pdf"
    />
    <!-- <input
      multiple="multiple"
      type="file"
      placeholder="这是一个提示信息！"
      title="xxxxx"
      capture
      accept="
      image/*,
      image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/x-msdownload,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      "
    /> -->

  </el-row>
</template>
<script>
export default {
  data() {
    return {
      msg: "哈哈",
    };
  },
  methods: {




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

    callJsFunction(str) {
      this.msg = "我通过原生方法改变了文字" + str;
      return "js调用成功";
    },
    callAndroidFunction() {
      window.myObj.showToast("曹神前来日狗~");
    },
    showToast(str) {
      window.myObj.showToast(str);
    },

    jsfunction() {
      document.getElementById("p").innerHTML += "str";
    },
  },
  created() {
    this.navigatorInfomation();
    this.callAndroidFunction();
    window.jsfunction = this.jsfunction;
  },
};
</script>

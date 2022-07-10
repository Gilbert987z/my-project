<template>
  <div style="text-align: center;">
    <h2>你好！{{ userInfo.username }} 同学</h2>
    <!-- <router-link :to="{ name: 'UserPassword' }">修改密码</router-link> -->
	
    <el-button type="text" @click="editPasswordHandle()">修改密码</el-button>
    
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPasswordVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        :model="passForm"
        status-icon
        :rules="rules"
        ref="passForm"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="currentPass">
          <el-input
            type="password"
            v-model="passForm.currentPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            v-model="passForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="passForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('passForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogPasswordVisible: false,
      userInfo: {},
      passForm: {
        password: "",
        checkPass: "",
        currentPass: "",
      },
      rules: {
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        checkPass: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        currentPass: [
          { required: true, message: "请输入当前密码", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/user/info").then((res) => {
        this.userInfo = res.data.data;
      });
    },
    //修改密码按钮操作
    editPasswordHandle() {
      console.log("eeee");
      this.dialogPasswordVisible = true; //打开密码对话框
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          this.$axios
            .post("/user/update/password", this.passForm)
            .then((res) => {
              if (res.data.code === 20000) {
                _this.$alert(res.data.message, "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    console.log(action);
                    this.$refs[formName].resetFields();
                    this.dialogPasswordVisible = false;
                  },
                });
              }

              //   console.log(res);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}
</style>

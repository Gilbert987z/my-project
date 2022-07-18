<template>
  <div style="text-align: center;">
    <el-row>
      <el-col :span="4">
        <!-- <el-avatar :size="70" :src="userInfo.avatar"></el-avatar> -->
        <!-- <el-button
          class="el-icon-edit-outline"
          type="text"
          @click="editAvatarHandle()"
          >修改头像</el-button
        > -->

        <!-- <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        > -->
        <!-- <el-upload :show-file-list="false">
          <el-avatar :size="70" :src="userInfo.avatar"></el-avatar>
          <el-button class="el-icon-edit-outline" type="text"
            >修改头像</el-button
          >
        </el-upload> -->

        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/Login/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :data="{ userId: user.eid, status: userStatus }"
          :before-upload="beforeAvatarUpload"
          style="display: inline-block;width: 300px"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>

      <el-col :span="20">
        <div style="float:left,width:100%">
          <!-- <router-link :to="{ name: 'UserPassword' }">修改密码</router-link> -->

          <el-row>
            <el-col :span="8" style="height:100%"><h1>姓名</h1></el-col>
            <el-col :span="16">
              <h1 style="float:left" id="username">
                {{ userInfo.username }}
                <el-button
                  class="el-icon-edit-outline"
                  type="text"
                  @click="editUsernameHandle()"
                  >修改姓名</el-button
                >
              </h1>
            </el-col>
          </el-row>
          <el-divider style="margin:0px"></el-divider>
          <el-row>
            <el-col :span="8" style="height:100%"><h1>手机号</h1></el-col>
            <el-col :span="16">
              <h1 style="float:left" id="mobile">
                {{ userInfo.mobile }}
                <el-button
                  class="el-icon-edit-outline"
                  type="text"
                  @click="editMobileHandle()"
                  >修改手机号</el-button
                >
              </h1>
            </el-col>
          </el-row>
          <el-divider style="margin:0px"></el-divider>
          <el-row>
            <el-col :span="8" style="height:100%"><h1>密码</h1></el-col>
            <el-col :span="16">
              <h1 style="float:left">
                <el-button
                  class="el-icon-edit-outline"
                  type="text"
                  @click="editPasswordHandle()"
                  >修改密码</el-button
                >
              </h1>
            </el-col>
          </el-row>
          <el-divider style="margin:0px"></el-divider>
        </div>
      </el-col>
    </el-row>

    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPasswordVisible"
      width="600px"
    >
      <el-form
        :model="passForm"
        status-icon
        :rules="passwordRules"
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
          <el-button type="primary" @click="submitPasswordForm('passForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('passForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改用户名弹窗 -->
    <el-dialog
      title="修改用户名"
      :visible.sync="dialogUsernameVisible"
      width="600px"
    >
      <el-form
        :model="usernameForm"
        status-icon
        :rules="usernameRules"
        ref="usernameForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="usernameForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitUsernameForm('usernameForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('usernameForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改手机号弹窗 -->
    <el-dialog
      title="修改手机号"
      :visible.sync="dialogMobileVisible"
      width="600px"
    >
      <el-form
        :model="mobileForm"
        status-icon
        :rules="mobileRules"
        ref="mobileForm"
        label-width="100px"
      >
        <el-form-item label="手机号" prop="mobile">
          <el-input
            type="text"
            v-model="mobileForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitMobileForm('mobileForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('mobileForm')">重置</el-button>
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
      dialogUsernameVisible: false,
      dialogMobileVisible: false,
      userInfo: {},
      passForm: {
        password: "",
        checkPass: "",
        currentPass: "",
      },
      passwordRules: {
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 4,
            max: 12,
            message: "长度在 4 到 12 个字符",
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
      usernameForm: {
        username: "",
      },
      usernameRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      mobileForm: {
        mobile: "",
      },
      mobileRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 12,
          //   message: "长度在 2 到 12 个字符",
          //   trigger: "blur",
          // },
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
        this.mobileForm.mobile = res.data.data.mobile; // 设置默认值
        this.usernameForm.username = res.data.data.username;
      });
    },
    //修改密码按钮操作
    editPasswordHandle() {
      this.dialogPasswordVisible = true; //打开密码对话框
    },
    editUsernameHandle() {
      this.dialogUsernameVisible = true; //打开对话框
    },
    editMobileHandle() {
      this.dialogMobileVisible = true; //打开对话框
    },
    submitPasswordForm(formName) {
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
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitUsernameForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          this.$axios
            .post("/user/update/username", this.usernameForm)
            .then((res) => {
              if (res.data.code === 20000) {
                _this.$alert(res.data.message, "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    console.log(action);
                    this.$refs[formName].resetFields();
                    this.dialogUsernameVisible = false;
                  },
                });
                this.getUserInfo(); //重新请求用户详情接口
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitMobileForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          this.$axios
            .post("/user/update/mobile", this.mobileForm)
            .then((res) => {
              if (res.data.code === 20000) {
                _this.$alert(res.data.message, "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    console.log(action);
                    this.$refs[formName].resetFields();
                    this.dialogMobileVisible = false;
                  },
                });
                this.getUserInfo(); //重新请求用户详情接口
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      //重置
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(URL.createObjectURL(file.raw));
      console.log(this.imageUrl);
      console.log(res);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}

.userCenterTable tbody tr {
  border: 10px solid #000;
}

.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
</style>

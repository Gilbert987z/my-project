<template>
  <div>
    <el-card>
      <p>头像添加</p>
      <el-upload
        class="avatar-uploader"
        action="http://localhost:8088/file/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <span
          v-if="imageUrl"
          class="el-upload-action"
          @click.stop="handleRemove()"
        >
          <i class="el-icon-delete"></i>
        </span>
        <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
      </el-upload>
    </el-card>

    <el-dialog
      title="确认修改头像吗？"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="text-align:center">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
          style="vertical-align: middle;margin: 0 auto;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    // 移除图片
    handleRemove() {
      this.imageUrl = "";
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      console.log(file);

      this.dialogVisible = true;

      this.imageUrl = "http://localhost:8088" + res.data.url;
    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const type =
        file.type === "image/jpeg" ||
        "image/jpg" ||
        "image/webp" ||
        "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!type) {
        this.$message.error("图片格式不正确!(只能包含jpg，png，webp，JPEG)");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return type && isLt2M;
    },
  },
};
</script>

<style scoped lang="less">
//bug的解决 https://blog.csdn.net/m0_49159526/article/details/115957028
.avatar-uploader {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  //   background: url('../assets/logo.png') no-repeat;
  background-size: 100% 100%;
}
.avatar-uploader-icon {
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar-uploader-icon:hover {
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.3);
}
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
}
.el-upload-action {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 0;
  color: #fff;
  text-align: center;
  line-height: 120px;
}
.el-upload-action:hover {
  font-size: 20px;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>

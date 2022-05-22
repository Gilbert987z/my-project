<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :before-upload="onBeforeUpload"
      :auto-upload="false"
      multiple
      :limit="9"
      accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/x-msdownload,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    >
    <!--默认的加号-->
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <!--图片的显示-->
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <!-- <img class="el-upload-list__item-thumbnail" vue-if="file.url==null" :src="require('../assets/pic_test/PDF.png')" alt="" /> -->
        <span class="el-upload-list__item-actions">
          <!-- 预览 -->
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <!-- 下载 -->
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <!-- 移除 -->
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <!-- 预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />

      <!-- 预览弹窗中pdf的展示 -->
      <div>
        <pdf
          :src="src"
          :page="pdfPage"
          @num-pages="pageCount = $event"
          @page-loaded="pdfPage = $event"
          style="display: inline-block; width: 100%"
        >
        </pdf>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pdf from "vue-pdf";
export default {
  components: {
    pdf,
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  methods: {
    //上传前的操作
    onBeforeUpload(file) { //:auto-upload="true" 才会调用这个方法,但是改成false怎么不支持多图上传了
      console.log(file);
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
        console.log("isIMAGE:",isIMAGE);
        console.log("isLt1M:",isLt1M);
      if (!isIMAGE) {
          
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },
    //移除
    handleRemove(file) {
      console.log(file);
    },
    //预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //下载
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>

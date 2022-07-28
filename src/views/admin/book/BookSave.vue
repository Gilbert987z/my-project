<template>
  <div>
    <h1>{{ title }}</h1>
    <el-form ref="book" :model="book" label-width="80px">
      <el-form-item label="图片" required="true">
        <!-- <el-input v-model="book.image"></el-input> -->

        <!-- <el-upload
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
        </el-upload> -->
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8088/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="book.image" :src="book.image" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="书名" required="true">
        <el-input v-model="book.name"></el-input>
      </el-form-item>
      <el-form-item label="作者" required="true">
        <el-input v-model="book.author"></el-input>
      </el-form-item>
      <el-form-item label="价格" required="true">
        <el-input-number
          v-model="book.price"
          :precision="0"
          :step="1"
          :min="0"
          :max="9999999"
        />
      </el-form-item>

      <el-form-item label="图书类型" required="true">
        <el-select
          v-model="book.bookTypeId"
          clearable
          placeholder="请选择图书类型"
        >
          <el-option
            v-for="item in bookTypeList"
            :key="item.id"
            :label="item.bookType"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出版社" required="true">
        <el-select
          v-model="book.publisherId"
          clearable
          placeholder="请选择出版社"
        >
          <el-option
            v-for="item in publisherList"
            :key="item.id"
            :label="item.publisher"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="库存" required="true">
        <el-input-number v-model="book.inventory" :min="1" :max="99999999" />
      </el-form-item>
      <el-form-item label="总数" required="true">
        <el-input-number v-model="book.total" :min="1" :max="99999999" />
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="book.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ btnSubmit }}</el-button>
        <el-button @click="goOff()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from "axios";
// import indexRequest from 'utils/indexRequest' //vue.config.js 中配置了路径别名

export default {
  data() {
    return {
      book: {
        //book的实例，默认数据
        name: null,
        image: null,
        author: null,
        publisherId: null,
        bookTypeId: null,
        inventory: 1,
        total: 1,
        price: 1,
        desc: null,
        id: this.$route.params.id,
      },
      bookTypeList: [],
      publisherList: [],
      btnSubmit: null, //提交按钮的名称
      title: null, //标题
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      console.log(this.book.id);

      this.$axios
        .post(
          "/admin/book/" + (this.book.id ? "update" : "create"), //根据有没有id判断
          this.book
        )
        .then((response) => {
          let successFlag = response.data.success;

          if (successFlag) {
            this.$message.success(response.data.message);
            this.$router.push({ name: "AdminBook" }); //跳转到图书页面
          } else {
            console.log("输出报错信息");
            let fieldErrors = response.data.data.fieldErrors;
            let errors = "";
            console.log(fieldErrors);

            // let arr=[];
            // Object.keys(fieldErrors).forEach((key,index)=>{
            //   console.log(index)
            //        arr.push(fieldErrors[key]);
            // });
            // console.log(arr)
            // for(let i in  arr){
            //   errors = errors +" \n " + arr[i];
            // }

            for (let key in fieldErrors) {
              //遍历json对象的每个key/value对,key为key
              console.log(key);
              let error = fieldErrors[key];
              errors = errors + " \n " + error;
              console.log(error);
            }
            console.log(errors);
            this.$message.error(errors);
          }
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    createOrUpdate() {
      //判断是否是新增或者修改
      if (this.book.id != null) {
        //判断是否是修改
        this.title = "修改";
        this.btnSubmit = "修改";
        this.$axios
          .get(
            "/admin/book/detail", //请求详情数据
            {
              // headers: {
              //   token: this.token,
              // },
              params: this.$route.params,
            }
          )
          .then((response) => {
            this.book = response.data.data;
          })
          .catch(function(error) {
            // 请求失败处理
            console.log(error);
          });
      } else {
        this.title = "创建";
        this.btnSubmit = "创建";
      }
    },
    getBookTypeList() {
      //图书类型列表
      this.$axios
        .get("/index/bookType/list")
        .then((response) => {
          console.log(response);
          this.bookTypeList = response.data.data;
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    getPublisherList() {
      this.$axios
        .get("index/bookPublisher/list")
        .then((response) => {
          console.log(response);
          this.publisherList = response.data.data;
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    goOff() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" }); //如果没有上一页返回首页
        return false;
      } else {
        this.$router.go(-1); //返回上一页
      }
    },
    // 上传前格式和图片大小限制
    handleAvatarSuccess(res, file) {
      console.log(file);
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.book.image = "http://localhost:8088" + res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        "image/jpg" ||
        "image/webp" ||
        "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("图片格式不正确!(只能包含jpg，png，webp，JPEG)");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  created() {
    this.createOrUpdate(); //判断是否是新增或者修改
    this.getBookTypeList(); //下拉框列表
    this.getPublisherList(); //下拉框列表
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

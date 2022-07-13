<template>
  <div>
    <h1>{{ title }}</h1>
    <el-form ref="book" :model="book" label-width="80px">
      <el-form-item label="图片" required="true">
        <el-input v-model="book.image"></el-input>
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
        bookName: null,
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
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      if (this.book.id == null) {
        this.$axios({
          method: "post",
          url: "/admin/book/create", //创建数据的接口
          headers: {
            token: this.token,
          },
          data: {
            bookName: this.book.bookName,
            image: this.book.image,
            author: this.book.author,
            publisherId: this.book.publisherId,
            bookTypeId: this.book.bookTypeId,
            inventory: this.book.inventory,
            total: this.book.total,
            price: this.book.price,
            desc: this.book.desc,
          },
        })
          .then((response) => {
            console.log(response);

            let successFlag = response.data.success;

            console.log(typeof successFlag);
            console.log(successFlag);
            if (successFlag) {
              this.$message.success(response.data.message);
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
      } else {
        this.$axios({
          method: "post",
          url: "/admin/book/update", //修改数据的接口
          headers: {
            token: this.token,
          },
          data: {
            bookName: this.book.bookName,
            image: this.book.image,
            author: this.book.author,
            publisherId: this.book.publisherId,
            bookTypeId: this.book.bookTypeId,
            inventory: this.book.inventory,
            total: this.book.total,
            price: this.book.price,
            desc: this.book.desc,
            id: this.book.id,
          },
        })
          .then((response) => {
            console.log(response);
            this.$message.success(response.data.message);
          })
          .catch(function(error) {
            // 请求失败处理
            console.log(error);
          });
      }
    },
    createOrUpdate() {
      //判断是否是新增或者修改
      console.log("this.book.id")
      console.log(this.$route.params)
      console.log(this.$route.params.id)
      // console.log(this.book.id)
      console.log("this.book.id")

      if (this.book.id != null) {
        //判断是否是修改
        this.title = "修改";
        this.btnSubmit = "修改";
        // console.log(this.book.id)
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
 
            this.book = response.data.data
            // let book = response.data.data.detail;
            // (this.book.bookName = book.bookName), //会修改默认的参数，渲染出详情数据
            //   (this.book.image = book.image),
            //   (this.book.author = book.author),
            //   (this.book.publisherId = book.publisherId),
            //   (this.book.bookTypeId = book.bookTypeId),
            //   (this.book.inventory = book.inventory),
            //   (this.book.total = book.total),
            //   (this.book.price = book.price),
            //   (this.book.desc = book.desc);
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
          this.bookTypeList = response.data.data.records;
          // this.page = response.data.data
          console.log("bookTypeList", this.bookTypeList);
          console.log("bookTypeList", response.data);
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
          this.publisherList = response.data.data.records;
          // this.page = response.data.data
          console.log(this.publisherList);
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
  },
  created() {
    this.createOrUpdate(); //判断是否是新增或者修改
    this.getBookTypeList(); //下拉框列表
    this.getPublisherList(); //下拉框列表
  
    

  },
};
</script>

<template>
  <el-form ref="book" :model="book" label-width="80px">
    <el-form-item label="图片">
      <el-input v-model="book.images"></el-input>
    </el-form-item>
    <el-form-item label="书名">
      <el-input v-model="book.bookName"></el-input>
    </el-form-item>
    <el-form-item label="作者">
      <el-input v-model="book.author"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input-number v-model="book.price" :precision="2" :step="0.1" :max="9999" />
    </el-form-item>
    <el-form-item label="图书类型">
      <el-select v-model="book.bookTypeId"  clearable placeholder="请选择图书类型">
        <el-option v-for="item in bookTypeList" :key="item.id" :label="item.bookType" :value="item.id">
        </el-option>

      </el-select>

    </el-form-item>
    <el-form-item label="出版社">
      <el-select v-model="book.publisherId" clearable placeholder="请选择出版社">
        <el-option v-for="item in publisherList" :key="item.id" :label="item.publisher" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="库存">
      <el-input-number v-model="book.inventory" :min="1" :max="99999999" @change="handleChange" />
    </el-form-item>
    <el-form-item label="总数">
      <el-input-number v-model="book.total" :min="1" :max="99999999" @change="handleChange" />
    </el-form-item>


    <el-form-item label="备注">
      <el-input type="textarea" v-model="book.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        book: {
          bookName:null,
          images:null,
          author:null,
          publisherId:null,
          bookTypeId:null,
          inventory:1,
          total:1,
          price:1,
          desc:null,
          id:this.$route.query.id
        },
        bookTypeList: [],
        publisherList: [],
        token: localStorage.getItem("token"),
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
        if(this.book.id==null){
          axios({
            method:"post",
            url:"http://127.0.0.1:8088/admin/book/create", //创建数据的接口
            headers:{
              "token": this.token
            },
            data:{
                    "bookName":this.book.bookName,
                    "images":this.book.images,
                    "author":this.book.author,
                    "publisherId":this.book.publisherId,
                    "bookTypeId":this.book.bookTypeId,
                    "inventory":this.book.inventory,
                    "total":this.book.total,
                    "price":this.book.price,
                    "desc":this.book.desc
                  }
          }).then(response => {
            console.log(response)
            this.$message.success(response.data.message)
      
            }).catch(function (error) { // 请求失败处理
              console.log(error);
        });
      }else{
        axios({
            method:"post",
            url:"http://127.0.0.1:8088/admin/book/update", //创建数据的接口
            headers:{
              "token": this.token
            },
            data:{
                    "bookName":this.book.bookName,
                    "images":this.book.images,
                    "author":this.book.author,
                    "publisherId":this.book.publisherId,
                    "bookTypeId":this.book.bookTypeId,
                    "inventory":this.book.inventory,
                    "total":this.book.total,
                    "price":this.book.price,
                    "desc":this.book.desc,
                    "id":this.book.id
                  }
          }).then(response => {
            console.log(response)
            this.$message.success(response.data.message)
      
            }).catch(function (error) { // 请求失败处理
              console.log(error);
        });
      }
    },
    getDetail(){
      console.log(1)
      console.log(this.$route.params)
      console.log(2)
      if(this.book.id!=null){
        axios.get('http://127.0.0.1:8088/admin/book/detail',
        {
          headers:{
            'token':this.token
          },
          params:this.$route.query
        }).then(response => {
              console.log(response)
              console.log(response);
              book = response.data
              this.book.bookName=book.bookName,
              this.book.images=book.images,
              this.book.author=book.author,
              this.book.publisherId=book.publisherId,
              this.book.bookTypeId=book.bookTypeId,
              this.book.inventory=book.inventory,
              this.book.total=book.total,
              this.book.price=book.price,
              this.book.desc=book.desc,
            }).catch(function (error) { // 请求失败处理
          console.log(error);
        });
      }
    },
    getBookTypeList() { //图书类型列表
      axios
          .get('http://127.0.0.1:8088/admin/booktype',
              {
                // params: params,
                headers: {
                  "token": this.token
                }
              }
          )
          .then(response => {
            console.log(response)
            this.bookTypeList = response.data.data.list
            // this.page = response.data.data
            console.log(this.bookTypeList);
          }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    getPublisherList() {
      axios
          .get('http://127.0.0.1:8088/admin/publisher',
              {
                // params: params,
                headers: {
                  "token": this.token
                }
              }
          )
          .then(response => {
            console.log(response)
            this.publisherList = response.data.data.list
            // this.page = response.data.data
            console.log(this.publisherList);
          }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    }
    },
    created(){
      this.getBookTypeList(); //下拉框列表
      this.getPublisherList(); //下拉框列表
      this.getDetail();
    }
  }
</script>
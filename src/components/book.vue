<template>

  <div>
    <div class="demo-input-suffix">
      属性方式：
      <el-input
          placeholder="请输入图书名称"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="inputBookName">
      </el-input>
    </div>

    <el-select v-model="bookTypeValue" @change="bookTypeChange" clearable placeholder="请选择图书类型">
      <el-option
          v-for="item in bookTypeList"
          :key="item.id"
          :label="item.bookType"
          :value="item.id">
      </el-option>

    </el-select>
    <el-select v-model="publisherValue" @change="publisherChange" clearable placeholder="请选择出版社">
      <el-option
          v-for="item in publisherList"
          :key="item.id"
          :label="item.publisher"
          :value="item.id">
      </el-option>
    </el-select>

    <el-row>
      <el-button type="primary" icon="el-icon-circle-plus" @click="bookSave">新增</el-button>
    </el-row>

    <el-table
        :data="info"
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="id"
          width="180">
      </el-table-column>
      <el-table-column

          label="书名"
          width="180">
        <template slot-scope="scope">
          <img alt :src="scope.row.images" width="40" height="40" class="head_pic"/>
          {{ scope.row.bookName }}/￥{{ scope.row.price }}

        </template>

      </el-table-column>
      <el-table-column
          prop="author"
          label="作者">
      </el-table-column>
      <el-table-column
          prop="bookType"
          label="图书类型">
      </el-table-column>
      <el-table-column
          prop="publisher"
          label="出版社">
      </el-table-column>
      <el-table-column
          prop="publisher"
          label="库存/总数">
        <template slot-scope="scope">
          {{ scope.row.inventory }} / {{ scope.row.total }}
        </template>
      </el-table-column>
      <el-table-column
          prop="desc"
          label="备注">

      </el-table-column>

      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="deleteBook(scope.row.id)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>

    <!--<span class="demonstration">完整功能</span>-->
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalPages">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      info: [],
      page: {pageSize: 10, currentPage: 1,},
      bookTypeList: [],
      publisherList: [],
      bookTypeValue: '',
      publisherValue: '',
      inputBookName: '',
      bookTypeId: null,
      publisherId: null,
      token:localStorage.getItem("token")
    }
  }, methods: {
    //获取列表
    getListTable() {  //图书列表
      var params = {
        page: this.page.currentPage,
        size: this.page.pageSize,
        bookTypeId: this.bookTypeId,
        publisherId: this.publisherId,
        bookName: this.inputBookName
      };
      console.log(params);
      // return false;
      console.log(this.token);
      axios
          .get('http://127.0.0.1:8088/book/list',
              {
                params: params,
                headers: {
                  "token": this.token
                }
              }
          )
          .then(response => {
            console.log(response);
            this.info = response.data.data.list;
            this.page = response.data.data;
            console.log(this.info);


            // this.$router.push({path: '/movie?page=' + this.page.current_page});
            //+'&size='+this.page.pageSize
          }).catch(function (error) { // 请求失败处理
        console.log(error);

      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      // val变化后的每页的条数
      this.page.pageSize = val;//更新每页的条数
      this.getListTable();//重新获取列表数据
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      //val 变化后的页码
      this.page.currentPage = val;
      this.getListTable();//重新获取列表数据
    },
    getBookTypeList() { //图书类型列表
      axios
          .get('http://127.0.0.1:8088/booktype',
              {
                // params: params,
                headers: {
                  // "token": "zz"
                  "token": this.token
                }
              }
          )
          .then(response => {
            console.log(response);
            this.bookTypeList = response.data.data.list;
            // this.page = response.data.data
            console.log(this.bookTypeList);
          }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    getPublisherList() { //获取下拉框列表
      axios
          .get('http://127.0.0.1:8088/publisher',
              {
                // params: params,
                headers: {
                  "token": this.token
                }
              }
          )
          .then(response => {
            console.log(response);
            this.publisherList = response.data.data.list;
            // this.page = response.data.data
            console.log(this.publisherList);
          }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    bookTypeChange(val) {
      this.bookTypeId = val;
      console.log('bookTypeChange' + val);
      this.getListTable();
    },
    publisherChange(val) {
      this.publisherId = val;
      console.log('publisherChange' + val);
      this.getListTable();
    },
    bookHandleSearchEvent(val) {
      this.inputBookName = val;
      console.log('inputBookName' + val);
      this.getListTable();
    },
    bookSave(){
      //通过push进行跳转
      this.$router.push('/book/bookSave')
    },
    deleteBook(id){
           // let app = this;
     // var deleteData = {
     //     id: id
     // }
     this.$confirm('确定删除该公告吗', '删除公告', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'error'
     }).then(() => {
       axios({
         method:"post",
         url:'http://127.0.0.1:8088/book/delete',
         headers:{
           "token": this.token
         },
         params:{
          "id":id
         }

       }).then(()=>{

       })
         // app.$Api.deleteNotice(deleteData, function (result) {
         //     if (result.result == "true") {
         //         app.$notify({
         //             title: '温馨提示：',
         //             message: '公告' + result.message,
         //             type: 'success'
         //         });
         //         app.queryNoticeList();
         //     } else {
         //         app.$notify.error({
         //             title: '温馨提示：',
         //             message: '公告' + result.message
         //         });
         //     }
         // });
     }).catch(() => {
         //取消操作
         this.$message({
             type: 'info',
             message: '已取消删除'
         });
     });

    }
  },
  created() {
    this.getListTable();
    this.getBookTypeList(); //下拉框列表
    this.getPublisherList(); //下拉框列表
  },
  mounted() {

  },


}
</script>
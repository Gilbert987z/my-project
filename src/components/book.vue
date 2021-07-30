<template>

  <div>
    <div class="demo-input-suffix">
      属性方式：
      <el-input
          placeholder="请输入内容"
          clearable
          prefix-icon="el-icon-search"
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
          {{scope.row.bookName}}/￥{{scope.row.price}}/{{scope.row.inventory}}
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
    </el-table>

    <!--<span class="demonstration">完整功能</span>-->
    <el-pagination
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
    }
  }, methods: {
    //获取列表
    getListTable() {
      var params = {
        page: this.page.currentPage,
        size: this.page.pageSize,
        bookTypeId: this.bookTypeId,
        publisherId: this.publisherId,

      }
      console.log(params);
      // return false;
      axios
          .get('http://127.0.0.1:8088/book/list',
              {
                params: params,
                headers: {
                  "token": "zz"
                }
              }
          )
          .then(response => {
            console.log(response)
            this.info = response.data.data.list
            this.page = response.data.data
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
    getBookTypeList() {
      axios
          .get('http://127.0.0.1:8088/booktype',
              {
                // params: params,
                headers: {
                  "token": "zz"
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
          .get('http://127.0.0.1:8088/publisher',
              {
                // params: params,
                headers: {
                  "token": "zz"
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
    }

  },
  created() {
    this.getListTable();
    this.getBookTypeList();
    this.getPublisherList();
  },
  mounted() {

  },


}
</script>
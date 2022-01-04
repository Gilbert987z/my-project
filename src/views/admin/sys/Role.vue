<template>
  <div>
    <div class="demo-input-suffix">
      属性方式：
      <el-input
        placeholder="请输入角色名称"
        clearable
        prefix-icon="el-icon-search"
        @input="bookHandleSearchEvent"
        v-model="queryName"
      >
      </el-input>
    </div>



    <el-row>
      <el-button type="primary" icon="el-icon-circle-plus" @click="saveBook"
        >新增</el-button
      >
    </el-row>

    <el-table :data="info" border style="width: 100%">
      <el-table-column prop="id" label="id" width="180"> </el-table-column>

 
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="createdAt" label="创建时间"> </el-table-column>
    

      <el-table-column label="操作">
        <template slot-scope="scope">

          <el-button type="text" size="small" @click="editBook(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteBook(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--<span class="demonstration">完整功能</span>-->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      info: [],
      page: {
        size: 10,
        current: 1,
        // pages:null,
        total: null,
      },
      queryName: "",

    };
  },
  methods: {
    //获取列表
    getListTable() {
      var params = {
        page: this.page.current,
        size: this.page.size,
        name: this.queryName,
      };
      console.log(params);
      // return false;
      this.$axios
        .get("/role/list", {
          params: params
        })
        .then((response) => {
          console.log(response);
          this.info = response.data.data.records;
          this.page = response.data.data;
          console.log(this.info);

          // this.$router.push({path: '/movie?page=' + this.page.current_page});
          //+'&size='+this.page.pageSize
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      // val变化后的每页的条数
      this.page.size = val; //更新每页的条数

      this.getListTable(); //重新获取列表数据
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      //val 变化后的页码
      this.page.current = val;
    
      this.getListTable(); //重新获取列表数据
    },
  
    bookTypeChange(val) {
      this.bookTypeId = val;
      console.log("bookTypeChange" + val);
      this.getListTable();
    },
    publisherChange(val) {
      this.publisherId = val;
      console.log("publisherChange" + val);
      this.getListTable();
    },
    bookHandleSearchEvent(val) {
      this.inputBookName = val;
      console.log("inputBookName" + val);
      this.getListTable();
    },
    saveBook() {
      //新增按钮操作
      //通过push进行跳转
      this.$router.push("/book/add");
    },
    editBook(id) {
      //编辑
      //通过push进行跳转
      this.$router.push({ path: "/book/edit", query: { id: id } });
    },
    deleteBook(id) {
      //单个删除
      this.$confirm("确定删除该公告吗", "删除公告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        axios({
          method: "post",
          url: "http://127.0.0.1:8088/admin/book/delete",
          headers: {
            token: this.token,
          },
          data: {
            id: id,
          },
        })
          .then(() => {
            this.getListTable(); //请求刷新
            this.$message.success("已成功删除!");
          })
          .catch(() => {
            //取消操作
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
  
  },
  created() {
 
    this.getListTable();
 
  },
  mounted() {},
};
</script>

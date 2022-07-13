<template>
  <div>
    <el-form
      :inline="true"
      :model="formSearch"
      ref="formSearch"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          placeholder="请输入图书名称"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.bookName"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-input
          placeholder="请输入图书编号"
          clearable
          prefix-icon="el-icon-search"
          type="number"
          @input="bookHandleSearchEvent"
          v-model="formSearch.bookId"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-input
          placeholder="请输入借书人"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.username"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <!-- <el-input
          placeholder="借书状态"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.status"
        >
        </el-input> -->

        <el-select
          v-model="formSearch.status"
          @change="bookHandleSearchEvent"
          clearable
          placeholder="借书状态"
        >
          <el-option label="借阅中" value="1"> </el-option>
          <el-option label="已归还" value="2"> </el-option>
          <el-option label="遗失" value="3"> </el-option>
          <el-option label="超时未归还" value="4"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getTableList">搜索</el-button>
        <el-button @click="resetSearch('formSearch')">重置</el-button>
      </el-form-item>
    </el-form>

    <div>
      <span style="font-weight:bold;font-size:20px;line-height:40px"
        >图书借阅列表</span
      >
      <el-row style="float:right">
        <!-- <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)"> -->
        <el-button
          style="margin-right:10px"
          type="danger"
          icon="el-icon-remove"
          :disabled="delBtlStatus"
          @click="delHandle(null)"
          >批量删除</el-button
        >
      </el-row>
    </div>

    <el-table
      :data="info"
      border
      style="width: 100%;margin-top:20px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="id" label="借书编号" width="180">
      </el-table-column>

      <el-table-column label="图书">
        <template slot-scope="scope">
          <img
            alt
            :src="scope.row.book.image"
            width="40"
            height="40"
            class="head_pic"
          />
          <p>{{ scope.row.book.name }}/￥{{ scope.row.book.price }}</p>
          <p>用户ID：{{ scope.row.book.id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="用户">
        <template slot-scope="scope">
          <img
            alt
            :src="scope.row.user.avatar"
            width="40"
            height="40"
            class="head_pic"
          />
          <p>{{ scope.row.user.username }}</p>
          <p>图书编号：{{ scope.row.book.id }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="borrowDays" label="借阅天数"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <p>借阅时间：{{ scope.row.createdAt }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-if="scope.row.status === 1"
            type="primary"
            effect="dark"
            >借阅中</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.status === 2"
            type="success"
            effect="dark"
            >已归还</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.status === 3"
            type="danger"
            effect="dark"
            >遗失</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.status === 4"
            type="warning"
            effect="dark"
            >超时未归还</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="permHandle(scope.row.id)"
            >分配权限</el-button
          > -->
          <!-- <el-divider direction="vertical"></el-divider> -->
          <!-- <el-button type="text" @click="editHandle(scope.row.id)"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider> -->
          <el-button type="text" @click="delHandle(scope.row.id)"
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
export default {
  data() {
    return {
      multipleSelection: [], //多选的勾选列表
      delBtlStatus: true, //批量删除按钮的禁用

      //列表
      info: [], //列表数据
      page: {
        //分页
        size: 10,
        current: 1,
        // pages:null,
        total: null,
      },
      formSearch: {
        bookName: null,
        bookId: null,
        username: null,
        status: null,
      },
    };
  },
  methods: {
    //获取列表
    getTableList() {
      var params = {
        page: this.page.current,
        size: this.page.size,
        // name: this.formSearch.queryName,
        bookName: this.formSearch.bookName,
        bookId: this.formSearch.bookId,
        username: this.formSearch.username,
        status: this.formSearch.status,
      };
      console.log(params);
      // return false;
      this.$axios
        .get("/admin/book/borrowLog/list", {
          params: params,
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
    //重置表单数据
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.getTableList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      // val变化后的每页的条数
      this.page.size = val; //更新每页的条数

      this.getTableList(); //重新获取列表数据
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      //val 变化后的页码
      this.page.current = val;

      this.getTableList(); //重新获取列表数据
    },

    //按角色名称查询
    bookHandleSearchEvent(val) {
      this.inputName = val;
      console.log("inputName" + val);
      this.getTableList();
    },
    //重置表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false; //关闭对话框
      this.editForm = {};
    },

    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach((row) => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
    //勾选改变
    handleSelectionChange(val) {
      console.log("勾选");
      console.log(val);
      this.multipleSelection = val;

      this.delBtlStatus = val.length == 0; //没有勾选，就是true,禁用
    },

    //单个删除
    delHandle(id) {
      var ids = [];

      if (id) {
        ids.push(id);
      } else {
        this.multipleSelection.forEach((row) => {
          ids.push(row.id);
        });
      }

      this.$confirm("确定删除选中的图书借阅信息吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$axios
          .post("/admin/book/borrowLog/delete", ids)
          .then(() => {
            this.getTableList(); //请求刷新
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
    this.getTableList();
  },
  mounted() {},
};
</script>
<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>

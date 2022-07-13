<template>
  <div>
    <el-form
      :inline="true"
      :model="formSearch"
      ref="formSearch"
      class="demo-form-inline"
    >
      <el-form-item prop="bookName">
        <el-input
          placeholder="请输入图书名称"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.bookName"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="bookId">
        <el-input
          placeholder="请输入图书编号"
          clearable
          type="number"
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.bookId"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="status">
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
    </div>

    <el-table :data="info" border style="width: 100%;margin-top:20px">
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

      <el-table-column prop="borrowDays" label="借阅天数"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <p>借阅时间：{{ scope.row.createdAt }}</p>
          <p v-if="scope.row.status === 2">
            归还时间：{{ scope.row.operateTime }}
          </p>
          <p v-if="scope.row.status === 3">
            遗失时间：{{ scope.row.operateTime }}
          </p>
          <p v-if="scope.row.status === 4">
            超时时间：{{ scope.row.passTime }}
          </p>
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
          <div v-if="scope.row.status === 1 || scope.row.status === 4">
            <el-button type="text" @click="bookReturn(scope.row.id)"
              >归还</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              @click="bookLost(scope.row.id, scope.row.remark)"
              >遗失</el-button
            >
          </div>
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

    <!--对话框-->
    <el-dialog
      title="遗失"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="100px"
        class="demo-editForm"
      >
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input
            type="textarea"
            v-model="editForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')"
            >确定</el-button
          >
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //对话框
      dialogVisible: false, //新增对话框 默认关闭
      editForm: {},
      editFormRules: {
        remark: [
          { required: true, message: "请输入遗失理由", trigger: "blur" },
        ],
      },

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
        bookName: this.formSearch.bookName,
        bookId: this.formSearch.bookId,
        status: this.formSearch.status,
      };
      // return false;
      this.$axios
        .get("/member/book/borrowLog/list", {
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

    //查询
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
    //关闭对话框
    handleClose() {
      this.resetForm("editForm"); //重置表单数据
    },

    //遗失按钮操作
    bookLost(id, remark) {
      this.editForm.id = id;
      console.log(remark);
      // this.editForm.remark = remark;
      this.dialogVisible = true; //打开对话框
    },

    //遗失填写备注
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/member/book/lost", this.editForm).then((res) => {
            console.log(res);
            this.getTableList(); //刷新列表

            if (res.data.code == 20000) {
              this.$message({
                showClose: true,
                message: "操作成功",
                type: "success",
                onClose: () => {
                  //此处写提示关闭后需要执行的函数
                },
              });

              this.dialogVisible = false; //成功了，才会关闭对话框
              this.resetForm(formName);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //归还
    bookReturn(id) {
      this.$confirm("确定归还选中的图书吗?", "归还", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .post("/member/book/return", { id: id })
          .then((res) => {
            this.getTableList(); //请求刷新
            if (res.data.code === 20000) {
              this.$message.success("归还成功!");
            }
          })
          .catch(() => {
            //取消操作
            this.$message({
              type: "info",
              message: "已取消归还",
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

<template>
  <div>
    <el-form
      :inline="true"
      :model="formSearch"
      ref="formSearch"
      class="demo-form-inline"
    >
      <el-form-item prop="queryName">
        <el-input
          placeholder="请输入图书出版商名称"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.queryName"
        >
        </el-input>
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
          <el-button type="text" @click="permHandle(scope.row.id)"
            >分配权限</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope.row.id)"
            >编辑</el-button
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

    <!--角色的对话框-->
    <el-dialog
      :title="dialogData.dialogTitle"
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
        <el-form-item label="名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input
            type="textarea"
            v-model="editForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">{{
            dialogData.dialogSubmit
          }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
          <!-- <el-button @click="resetForm('editForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
      <el-form :model="permForm">
        <el-tree
          :data="permTreeData"
          show-checkbox
          ref="permTree"
          :default-expand-all="true"
          node-key="id"
          :check-strictly="true"
          :props="defaultProps"
        >
        </el-tree>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermFormHandle('permForm')"
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
      formInline: {
        user: "",
        region: "",
      },

      multipleSelection: [], //多选的勾选列表
      delBtlStatus: true, //批量删除按钮的禁用
      //角色对话框
      dialogData: {
        dialogTitle: null,
        dialogSubmit: null,
      },
      dialogVisible: false, //新增对话框 默认关闭
      editForm: {},
      editFormRules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      //分配权限对话框
      permDialogVisible: false,
      permForm: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      permTreeData: [],

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
        queryName: "", //查询名称
      },
    };
  },
  methods: {
    //获取列表
    getTableList() {
      var params = {
        page: this.page.current,
        size: this.page.size,
        name: this.formSearch.queryName,
      };
      console.log(params);
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
    //关闭对话框
    handleClose() {
      this.resetForm("editForm"); //重置表单数据
    },
    //分配权限按钮操作
    permHandle(id) {
      this.permDialogVisible = true; //打开对话框

      this.$axios.get("/sys/role/info", { params: { id: id } }).then((res) => {
        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds);
        this.permForm = res.data.data;
      });
    },
    //新增按钮操作
    addHandle() {
      (this.editForm.status = 1), //默认是正常
        (this.dialogData.dialogTitle = "新增");
      this.dialogData.dialogSubmit = "创建";
      this.dialogVisible = true; //打开对话框
    },
    //修改按钮操作
    editHandle(id) {
      this.dialogData.dialogTitle = "编辑";
      this.dialogData.dialogSubmit = "编辑";
      //请求详情
      this.$axios.get("/sys/role/info", { params: { id: id } }).then((res) => {
        this.editForm = res.data.data;

        this.dialogVisible = true; //打开对话框
      });
    },

    //新增修改角色
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/sys/role/" + (this.editForm.id ? "update" : "save"), //根据有没有id判断
              this.editForm
            )
            .then((res) => {
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

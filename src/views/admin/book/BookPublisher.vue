<template>
  <div>
    <el-form
      :inline="true"
      :model="formSearch"
      ref="formSearch"
      class="demo-form-inline"
    >
      <el-form-item prop="publisher">
        <el-input
          placeholder="请输入图书出版商名称"
          clearable
          prefix-icon="el-icon-search"
          @input="bookHandleSearchEvent"
          v-model="formSearch.publisher"
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
        >图书出版商列表</span
      >
      <el-row style="float:right">
        <!-- <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)"> -->
        <!-- <el-button
          style="margin-right:10px"
          type="danger"
          icon="el-icon-remove"
          :disabled="delBtlStatus"
          @click="delHandle(null)"
          >批量删除</el-button
        > -->
        <!-- </el-popconfirm>      slot="reference"-->

        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addHandle()"
           v-if="hasAuth('bookPublisher.save')"
          >新增</el-button
        >
      </el-row>
    </div>

    <el-table
      :data="info"
      border
      style="width: 100%;margin-top:20px"

    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->

      <el-table-column prop="id" label="id" width="180"> </el-table-column>

      <el-table-column prop="publisher" label="名称"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="createdAt" label="创建时间"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-if="scope.row.status === 1"
            type="success"
            effect="dark"
            >正常</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.status === 0"
            type="danger"
            effect="dark"
            >禁用</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="permHandle(scope.row.id)"
            >分配权限</el-button
          >
          <el-divider direction="vertical"></el-divider> -->
          <el-button type="text" @click="editHandle(scope.row.id)"
          v-if="hasAuth('bookPublisher.update') && hasAuth('bookPublisher.detail')"
            >编辑</el-button
          >
        <template v-if="hasAuth('bookPublisher.switch')">
          <el-divider direction="vertical"></el-divider>
             <el-button
            v-if="scope.row.status === 1"
            type="text"
            @click="switchHandle(scope.row.id, scope.row.status)"
            >{{ bookPublisherStatus.off }}</el-button
          >
          <el-button
            v-else-if="scope.row.status === 0"
            type="text"
            @click="switchHandle(scope.row.id, scope.row.status)"
            >{{ bookPublisherStatus.on }}</el-button
          >
          </template>
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
        <el-form-item label="名称" prop="publisher" label-width="100px">
          <el-input v-model="editForm.publisher" autocomplete="off"></el-input>
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

    <!-- <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
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
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // multipleSelection: [], //多选的勾选列表
      // delBtlStatus: true, //批量删除按钮的禁用
      //对话框
      dialogData: {
        dialogTitle: null,
        dialogSubmit: null,
      },
      dialogVisible: false, //新增对话框 默认关闭
      editForm: {},
      editFormRules: {
        name: [{ required: true, message: "请输入图书出版商", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      //上下架对话框
      bookPublisherStatus: {
        on: "解禁",
        off: "禁用",
      },
      switchForm: {
        id: null,
        status: null,
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
        publisher: "", //查询名称
      },
    };
  },
  methods: {
    //获取列表
    getTableList() {
      var params = {
        page: this.page.current,
        size: this.page.size,
        publisher: this.formSearch.publisher,
      };
      console.log(params);
      // return false;
      this.$axios
        .get("/admin/bookPublisher/list", {
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
      this.$axios.get("/admin/bookPublisher/detail", { params: { id: id } }).then((res) => {
        this.editForm = res.data.data;

        this.dialogVisible = true; //打开对话框
      });
    },

    //新增修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/admin/bookPublisher/" + (this.editForm.id ? "update" : "save"), //根据有没有id判断
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

    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach((row) => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
    // //勾选改变
    // handleSelectionChange(val) {
    //   console.log("勾选");
    //   console.log(val);
    //   this.multipleSelection = val;

    //   this.delBtlStatus = val.length == 0; //没有勾选，就是true,禁用
    // },
    //上下架按钮弹窗操作
    switchHandle(id, status) {
      this.switchForm.id = id;

      if (status == 0) {
        this.switchForm.status = 1;

        this.$confirm("确定解禁选中的图书出版社吗?", "解禁", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .post("/admin/bookPublisher/switch", this.switchForm)
            .then((res) => {
              this.getTableList(); //请求刷新
              if (res.data.code === 20000) {
                this.$message.success("解禁成功!");
              }
            })
            .catch(() => {
              //取消操作
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        });
      } else if (status == 1) {
        this.switchForm.status = 0;

        this.$confirm("确定禁用选中的图书出版社吗?此操作同时会下架关联的图书！", "禁用", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .post("/admin/bookPublisher/switch", this.switchForm)
            .then((res) => {
              this.getTableList(); //请求刷新
              if (res.data.code === 20000) {
                this.$message.success("封禁成功!");
              }
            })
            .catch(() => {
              //取消操作
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        });
      }
    },
    // //单个删除
    // delHandle(id) {
    //   var ids = [];

    //   if (id) {
    //     ids.push(id);
    //   } else {
    //     this.multipleSelection.forEach((row) => {
    //       ids.push(row.id);
    //     });
    //   }

    //   this.$confirm("确定删除选中的图书出版商吗?", "删除", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "error",
    //   }).then(() => {
    //     this.$axios
    //       .post("/admin/bookPublisher/delete", ids)
    //       .then(() => {
    //         this.getTableList(); //请求刷新
    //         this.$message.success("已成功删除!");
    //       })
    //       .catch(() => {
    //         //取消操作
    //         this.$message({
    //           type: "info",
    //           message: "已取消删除",
    //         });
    //       });
    //   });
    // },
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

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
          placeholder="请输入图书名称"
          clearable
          prefix-icon="el-icon-search"
          @input="handleSearchEvent"
          v-model="formSearch.queryName"
        >
        </el-input>
      </el-form-item>

      <!-- <el-select
        v-model="bookTypeValue"
        @change="bookTypeChange"
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
      <el-select
        v-model="publisherValue"
        @change="publisherChange"
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
      </el-select> -->

      <el-form-item>
        <el-button type="primary" @click="getTableList">搜索</el-button>
        <el-button @click="resetSearch('formSearch')">重置</el-button>
      </el-form-item>
    </el-form>

    <div>
      <span style="font-weight:bold;font-size:20px;line-height:40px"
        >图书列表</span
      >
      <el-row style="float:right">
        <!-- <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)"> -->

        <el-button
          style="margin-right:10px"
          type="success"
          icon="el-icon-export"
          @click="exportData()"
          >导出</el-button
        >

        <el-button
          style="margin-right:10px"
          type="danger"
          icon="el-icon-remove"
          :disabled="delBtlStatus"
          @click="delHandle(null)"
          >批量删除</el-button
        >
        <!-- </el-popconfirm>      slot="reference"-->

        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addHandle()"
          >新增</el-button
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

      <el-table-column prop="id" label="id" width="180"> </el-table-column>

      <el-table-column label="书名" width="180">
        <template slot-scope="scope">
          <img
            alt
            :src="scope.row.image"
            width="40"
            height="40"
            class="head_pic"
          />
          {{ scope.row.name }}/￥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者"> </el-table-column>
      <el-table-column prop="bookType" label="图书类型"> </el-table-column>
      <el-table-column prop="publisher" label="出版社"> </el-table-column>
      <el-table-column prop="publisher" label="库存/总数">
        <template slot-scope="scope">
          {{ scope.row.inventory }} / {{ scope.row.total }}
        </template>
      </el-table-column>
      <el-table-column prop="remark"  label="备注"></el-table-column>


      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-if="scope.row.status === 1"
            type="success"
            effect="dark"
            >上架</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.status === 0"
            type="danger"
            effect="dark"
            >下架</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="roleHandle(scope.row.id)"
            >分配角色</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope.row.id)"
            >修改密码</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope.row.id)"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>
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

    <!-- 分配权限对话框 -->
    <!-- <el-dialog
      title="分配角色"
      :visible.sync="roleDialogFormVisible"
      width="600px"
    >
      <el-form :model="roleForm">
        <el-tree
          :data="roleTreeData"
          show-checkbox
          ref="roleTree"
          :check-strictly="checkStrictly"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
        >
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleHandle('roleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog> -->
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
      //分配角色对话框
      roleDialogFormVisible: false,
      roleForm: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      roleTreeData: [],

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
        action: "list",
      };
      console.log(params);
      // return false;
      this.$axios
        .get("/book/list", {
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
    //导出excel
    exportData() {
      var params = {
        action: "export",
      };
      console.log(params);
      // return false;
      // this.$axios
      //   .get("/book/export", {
      //     params: params,
      //   })
      this.$axios({
        method: "get",
        url: "/book/export",
        params: params,
        // data: formData, // 参数
        responseType: "blob", // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          // 处理返回的文件流
          let blob = new Blob([res.data], { type: res.data.type });
          const fileName = decodeURI(res.headers['content-disposition'].split('=')[1], "UTF-8");//截取content-disposition的filename；按=分割，取最后一个
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放blob
          this.$message.success("[图书信息]已成功导出!");
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

    //按名称查询
    handleSearchEvent(val) {
      this.inputName = val;
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
    //分配角色按钮操作
    roleHandle(id) {
      this.roleDialogFormVisible = true;

      console.log(id);

      //获取角色列表
      this.$axios.get("/sys/role/list").then((res) => {
        this.roleTreeData = res.data.data.records;
      });

      //获取用户拥有的角色
      this.$axios
        .get("/sys/user/detail", { params: { id: id } })
        .then((res) => {
          this.roleForm = res.data.data;

          let roleIds = [];
          res.data.data.sysRoles.forEach((row) => {
            roleIds.push(row.id);
          });

          //拥有的角色默认选中
          this.$refs.roleTree.setCheckedKeys(roleIds);
        });
    },
    //分配角色按钮操作
    submitRoleHandle(formName) {
      console.log(formName);
      var roleIds = this.$refs.roleTree.getCheckedKeys(); //获取选中的roleId

      console.log(roleIds);

      this.$axios
        .post("/sys/user/role/update", {
          userId: this.roleForm.id,
          roleIds: roleIds,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 20000) {
            this.$message({
              showClose: true,
              message: "恭喜你，操作成功",
              type: "success",
              onClose: () => {
                this.getUserList();
              },
            });

            this.roleDialogFormVisible = false; //关闭弹窗
          }
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

      this.$confirm("确定删除选中的用户吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$axios
          .post("/sys/user/delete", ids)
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

    this.$axios.get("/sys/permission/list").then((res) => {
      this.permTreeData = res.data.data;
    });
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

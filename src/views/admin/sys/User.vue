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
          placeholder="请输入用户名称"
          clearable
          prefix-icon="el-icon-search"
          @input="handleSearchEvent"
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
        >用户列表</span
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
          v-if="hasAuth('sys.user.save')"
          >新增</el-button
        >
      </el-row>
    </div>

    <el-table :data="info" border style="width: 100%;margin-top:20px">
      <!-- @selection-change="handleSelectionChange" -->
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <!-- <el-table-column type="index" width="55"> </el-table-column> -->

      <el-table-column prop="id" label="编号" width="55"> </el-table-column>

      <el-table-column label="名称">
        <template slot-scope="scope">
          <img
            alt
            :src="scope.row.avatar"
            width="40"
            height="40"
            class="head_pic"
          />
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isAdmin" label="是否是管理员">
        <template slot-scope="scope">
          <p v-if="scope.row.isAdmin === 1">超级管理员</p>
          <p v-else-if="scope.row.isAdmin === 2">普通管理员</p>
          <p v-else-if="scope.row.isAdmin === 3">用户</p>
        </template>
      </el-table-column>

      <el-table-column label="拥有的角色权限">
        <template slot-scope="scope">
          <p v-if="scope.row.isAdmin === 1">拥有所有角色权限</p>
          <el-tag
            v-else-if="scope.row.isAdmin === 2"
            size="small"
            type="info"
            v-for="item in scope.row.sysRoles"
            :key="item.name"
            >{{ item.name }}</el-tag
          >
          <p v-else-if="scope.row.isAdmin === 3">-</p>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"> </el-table-column>

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
          <div v-if="scope.row.isAdmin != 1">
            <el-button
              v-if="scope.row.isAdmin === 2 && hasAuth('sys.user.role.update')"
              type="text"
              @click="roleHandle(scope.row.id)"
              >分配角色</el-button
            >
            <!-- <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="editHandle(scope.row.id)"
              >修改密码</el-button
            > -->
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              @click="editHandle(scope.row.id)"
              v-if="hasAuth('sys.user.update') && hasAuth('sys.user.detail')"
              >编辑</el-button
            >
            <template v-if="hasAuth('sys.user.switch')">
              <el-divider direction="vertical"></el-divider>
              <el-button
                v-if="scope.row.status === 1"
                type="text"
                @click="switchHandle(scope.row.id, scope.row.status)"
                >封禁</el-button
              >
              <el-button
                v-if="scope.row.status === 0"
                type="text"
                @click="switchHandle(scope.row.id, scope.row.status)"
                >解禁</el-button
              >
            </template>
            <!-- <el-divider direction="vertical"></el-divider> -->
            <!-- <el-button
              type="text"
              @click="delHandle(scope.row.id)"
              
              >注销</el-button
            > -->
            <!-- <el-button disabled type="text" @click="delHandle(scope.row.id)"
              >注销用户</el-button
            > -->
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

    <!--用户的对话框-->
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
        <el-form-item label="名称" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" label-width="100px">
          <el-input
            type="tel"
            v-model="editForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="dialogData.dialogTitle === '新增'"
          label="密码"
          prop="password"
          label-width="100px"
        >
          <el-input
            type="password"
            v-model="editForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户身份" prop="isAdmin" label-width="100px">
          <el-select
            v-model="editForm.isAdmin"
            clearable
            placeholder="请选择用户身份"
          >
            <el-option
              v-for="item in options_isadmin"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="100px">
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
          <el-button @click="handleClose">取消</el-button>
          <!-- <el-button @click="resetForm('editForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogFormVisible"
      width="600px"
    >
      <el-form :model="roleForm">
        <el-tree
          :data="roleTreeData"
          show-checkbox
          ref="roleTree"
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection: [], //多选的勾选列表
      delBtlStatus: true, //批量删除按钮的禁用
      //角色对话框
      dialogData: {
        dialogTitle: null,
        dialogSubmit: null,
      },
      dialogVisible: false, //新增对话框 默认关闭
      editForm: {
        status: 1,
      },
      options_isadmin: [
        {
          value: 2,
          label: "普通管理员",
        },
        {
          value: 3,
          label: "普通用户",
        },
      ],
      editFormRules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        isAdmin: [
          { required: true, message: "请输入用户身份", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      switchForm: {
        id: null,
        status: null,
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
        username: this.formSearch.queryName,
      };
      console.log(params);
      // return false;
      this.$axios
        .get("/admin/sys/user/list", {
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
      console.log(id);

      //获取角色列表
      this.$axios
        .get("/admin/sys/role/list", { params: { type: "tree" } })
        .then((res) => {
          var roleTreeData = res.data.data;

          // for (index in this.roleTreeData) {
          //   if (index.status == 0) {
          //     this.roleTreeData;
          //   }
          // }
          for (var i = 0; i < roleTreeData.length; i++) {
            if (roleTreeData[i].status == 0) {
              roleTreeData[i].disabled = true;
              // roleTreeData.splice(i, 1); ////删除起始下标为1，长度为1的一个值(len设置1，如果为0，则数组不变)
            }
          }
          this.roleTreeData = roleTreeData;
        });

      //获取用户拥有的角色
      this.$axios
        .get("/admin/sys/user/detail", { params: { id: id } })
        .then((res) => {
          this.roleForm = res.data.data;

          let roleIds = [];
          res.data.data.sysRoles.forEach((row) => {
            roleIds.push(row.id);
          });

          //拥有的角色默认选中
          this.$refs.roleTree.setCheckedKeys(roleIds);
        });

      console.log(this.roleTreeData);
      this.roleDialogFormVisible = true;
    },
    //分配角色按钮操作
    submitRoleHandle(formName) {
      console.log(formName);
      var roleIds = this.$refs.roleTree.getCheckedKeys(); //获取选中的roleId

      this.$axios
        .post("/admin/sys/user/role/update", {
          userId: this.roleForm.id,
          roleIds: roleIds,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 20000) {
            this.getTableList(); //刷新列表

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
      this.editForm.status = 1; //默认是正常
      this.dialogData.dialogTitle = "新增";
      this.dialogData.dialogSubmit = "创建";
      this.dialogVisible = true; //打开对话框
    },
    //修改按钮操作
    editHandle(id) {
      this.dialogData.dialogTitle = "编辑";
      this.dialogData.dialogSubmit = "编辑";
      //请求详情
      this.$axios
        .get("/admin/sys/user/detail", { params: { id: id } })
        .then((res) => {
          this.editForm = res.data.data;

          this.dialogVisible = true; //打开对话框
        });
    },

    //新增用户
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/admin/sys/user/" + (this.editForm.id ? "update" : "save"), //根据有没有id判断
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

    // //勾选改变
    // handleSelectionChange(val) {
    //   console.log("勾选");
    //   console.log(val);
    //   this.multipleSelection = val;

    //   this.delBtlStatus = val.length == 0; //没有勾选，就是true,禁用
    // },
    //封禁解禁按钮弹窗操作
    switchHandle(id, status) {
      this.switchForm.id = id;

      if (status == 0) {
        this.switchForm.status = 1;

        this.$confirm("确定解封选中的用户吗?", "解封", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .post("/admin/sys/user/switch", this.switchForm)
            .then((res) => {
              this.getTableList(); //请求刷新
              if (res.data.code === 20000) {
                this.$message.success("解封成功!");
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

        this.$confirm("确定封禁选中的用户吗?", "封禁", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .post("/admin/sys/user/switch", this.switchForm)
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
    //单个删除
    // delHandle(id) {
    //   var ids = [];

    //   if (id) {
    //     ids.push(id);
    //   } else {
    //     this.multipleSelection.forEach((row) => {
    //       ids.push(row.id);
    //     });
    //   }

    //   this.$confirm("确定删除选中的用户吗?", "删除", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "error",
    //   }).then(() => {
    //     this.$axios
    //       .post("/admin/sys/user/delete", ids)
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

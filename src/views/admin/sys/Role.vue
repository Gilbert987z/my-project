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
          placeholder="请输入角色名称"
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
        >角色列表</span
      >
      <el-row style="float:right">
        <!-- <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)"> -->
        <el-button
          style="margin-right:10px"
          type="danger"
          icon="el-icon-remove"
          :disabled="delBtlStatus"
          @click="delHandle(null)"
          v-if="hasAuth('sys.role.delete')"
          >批量删除</el-button
        >
        <!-- </el-popconfirm>      slot="reference"-->

        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addHandle()"
          v-if="hasAuth('sys.role.save')"
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

      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="code" label="唯一编码"> </el-table-column>
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
          <el-button
            type="text"
            @click="permHandle(scope.row.id)"
            v-if="hasAuth('sys.role.permission.edit')"
            >分配权限</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            @click="editHandle(scope.row.id)"
            v-if="hasAuth('sys.role.update') && hasAuth('sys.role.info')"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            @click="delHandle(scope.row.id)"
            v-if="hasAuth('sys.role.delete')"
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
        <el-form-item label="唯一编码" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
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

    <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
      <el-form :model="permForm">
        <el-tree
          :data="permTreeData"
          show-checkbox
          ref="permTree"
          :default-expand-all="true"
          node-key="id"
          :check-strictly="false"
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
      editForm: {
        status: 1, //默认是正常状态
      },
      editFormRules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入唯一编码", trigger: "blur" }],
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
        .get("/admin/sys/role/list", {
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
      this.$axios.get("/admin/sys/permission/list").then((res) => {
        var permTreeData = res.data.data;

        for (var x = 0; x < permTreeData.length; x++) {
          console.log("x", x);
          // console.log(permTreeData[x]["children"]);
          if (permTreeData[x].status == 0) {
            console.log(x, "disabled");
            permTreeData[x].disabled = true;
          }

          if ("children" in permTreeData[x]) { //判断对象是否包含某个key的方法
            for (var y = 0; y < permTreeData[x]["children"].length; y++) {
              console.log("y", y);
              if (permTreeData[x]["children"][y].status == 0) {
                console.log(x, y, "disabled");
                permTreeData[x]["children"][y].disabled = true;
              }

              if ("children" in permTreeData[x]["children"][y]) {
                for (
                  var z = 0;
                  z < permTreeData[x]["children"][y]["children"].length;
                  z++
                ) {
                  console.log("z", z);
                  if (
                    permTreeData[x]["children"][y]["children"][z].status == 0
                  ) {
                    console.log(x, y, z, "disabled");
                    permTreeData[x]["children"][y]["children"][
                      z
                    ].disabled = true;
                  }
                }
              }
            }
          }

          // if (permTreeData[i].status == 0) {
          //   permTreeData[i].disabled = true;
          //   // permTreeData.splice(i, 1); ////删除起始下标为1，长度为1的一个值(len设置1，如果为0，则数组不变)
          // }
        }
        this.permTreeData = permTreeData;
        console.log(permTreeData);
      });

      this.$axios
        .get("/admin/sys/role/info", { params: { id: id } })
        .then((res) => {
          console.log(res);
          this.$refs.permTree.setCheckedKeys(res.data.data.permissionIds);
          this.permForm = res.data.data;
          // console.log(this.permForm)
        });

      this.permDialogVisible = true; //打开对话框
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
        .get("/admin/sys/role/info", { params: { id: id } })
        .then((res) => {
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
              "/admin/sys/role/" + (this.editForm.id ? "update" : "save"), //根据有没有id判断
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
    submitPermFormHandle(formName) {
      var menuIds = this.$refs.permTree.getCheckedKeys();
      // console.log(this.$refs.permTree.getHalfCheckedKeys())
      // console.log(this.$refs.permTree.getCurrentKey())
      var half_menuIds = this.$refs.permTree.getHalfCheckedKeys(); //获取到半选的节点

      menuIds = menuIds.concat(half_menuIds); // 合并数组
      console.log(menuIds);
      console.log(this.permForm.id);

      this.$axios
        .post("/admin/sys/role/permission/edit", {
          id: this.permForm.id,
          permissionIds: menuIds,
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "恭喜你，操作成功",
              type: "success",
              onClose: () => {
                this.getTableList();
              },
            });
          }

          this.permDialogVisible = false;
          this.resetForm(formName);
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

      this.$confirm("确定删除选中的角色吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$axios
          .post("/admin/sys/role/delete", ids)
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

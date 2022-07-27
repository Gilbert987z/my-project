<template>
  <div>
    <div>
      <span style="font-weight:bold;font-size:20px;line-height:40px"
        >权限列表</span
      >
      <el-row style="float:right">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addHandle()"
          v-if="hasAuth('sys.permission.save')"
          >新增</el-button
        >
      </el-row>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 20px;"
      row-key="id"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" sortable width="180">
      </el-table-column>
      <el-table-column prop="perms" label="权限编码" sortable width="180">
      </el-table-column>

      <el-table-column prop="icon" label="图标"> </el-table-column>

      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0" effect="dark"
            >目录</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.type === 1"
            type="success"
            effect="dark"
            >菜单</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.type === 2"
            type="info"
            effect="dark"
            >按钮</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column prop="path" label="菜单URL"> </el-table-column>
      <el-table-column prop="component" label="菜单组件"> </el-table-column>
      <el-table-column prop="orderNum" label="排序号"> </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
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
      </el-table-column> -->
      <el-table-column prop="icon" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editHandle(scope.row.id)"
            v-if="
              hasAuth('sys.permission.update') && hasAuth('sys.permission.info')
            "
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="delHandle(scope.row.id)"
            >
              <el-button
                type="text"
                slot="reference"
                v-if="hasAuth('sys.permission.delete')"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--新增对话框-->
    <el-dialog
      title="提示"
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
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
            <template>
              <div v-for="item in tableData" :key="item">
                <el-option :label="item.name" :value="item.id"></el-option>
                <template>
                  <div v-for="child in item.children" :key="child">
                    <el-option :label="child.name" :value="child.id">
                      <span>{{ "- " + child.name }}</span>
                    </el-option>
                  </div>
                </template>
              </div>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="perms" label-width="100px">
          <el-input v-model="editForm.perms" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon" label-width="100px">
          <el-input v-model="editForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" prop="path" label-width="100px">
          <el-input v-model="editForm.path" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单组件" prop="component" label-width="100px">
          <el-input v-model="editForm.component" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type" label-width="100px">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="状态" prop="statu" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="排序号" prop="orderNum" label-width="100px">
          <el-input-number v-model="editForm.orderNum" :min="1" label="排序号"
            >1</el-input-number
          >
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">{{
            dialogData.dialogSubmit
          }}</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [], //列表数据

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
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        perms: [{ required: true, message: "请输入权限编码", trigger: "blur" }],
        type: [{ required: true, message: "请选择状态", trigger: "blur" }],
        orderNum: [
          { required: true, message: "请填入排序号", trigger: "blur" },
        ],
        // status: [{ required: true, message: "请选择状态", trigger: "blur" }],
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
        queryName: "", //查询名称
      },
    };
  },
  methods: {
    //获取列表
    getTableList() {
      this.$axios
        .get("/admin/sys/permission/list")
        .then((response) => {
          this.tableData = response.data.data;
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
    searchEvent(val) {
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
        .get("/admin/sys/permission/info", { params: { id: id } })
        .then((res) => {
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
              "/admin/sys/permission/" + (this.editForm.id ? "update" : "save"), //根据有没有id判断
              this.editForm
            )
            .then((res) => {
              console.log(res);
              this.getTableList(); //刷新列表

              if (res.data.success) {
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

      this.$confirm("确定删除选中的权限吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$axios
          .post("/admin/sys/permission/delete", ids)
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

    this.$axios.get("/admin/sys/permission/list").then((res) => {
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

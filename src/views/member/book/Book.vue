<template>
  <div>
    <el-form
      :inline="true"
      :model="formSearch"
      ref="formSearch"
      class="demo-form-inline"
      action="#"
    
    
    >
      <el-form-item prop="queryName">
        <el-input
          placeholder="请输入图书名称"
          clearable
          type="search"
          prefix-icon="el-icon-search"
          @keyup="show"
          @keypress="show"
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
        >图书列表</span
      >
      <el-row style="float:right">
 
      </el-row>
    </div>

    <el-table
      :data="info"
      border
      style="width: 100%;margin-top:20px"
    >

      <el-table-column prop="id" label="图书编号" width="180"> </el-table-column>

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
      <el-table-column prop="remark" label="备注"></el-table-column>

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
      <el-table-column prop="createdAt" label="时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="roleHandle(scope.row.id)"
            >详情</el-button
          >
          <span v-if="scope.row.status === 0">
            <el-divider direction="vertical"></el-divider>
            <el-button disabled type="text" @click="borrowHandle(scope.row.id)"
              >借阅</el-button
            >
          </span>

                <span v-else-if="scope.row.status === 1">
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="borrowHandle(scope.row.id)"
              >借阅</el-button
            >
          </span>
 
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
        :model="borrowForm"
        :rules="borrowFormRules"
        ref="borrowForm"
        label-width="100px"
        class="demo-borrowForm"
      >
        <el-form-item label="借阅天数" prop="borrowDays" label-width="100px">
          <el-input-number v-model="borrowForm.borrowDays" ></el-input-number>
        </el-form-item>

        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input
            type="textarea"
            v-model="borrowForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('borrowForm')">{{
            dialogData.dialogSubmit
          }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
          <!-- <el-button @click="resetForm('borrowForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
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
      borrowForm: {
        bookId:null,
        borrowDays:null,
        remark:null
      },
      borrowFormRules: {
        borrow_num: [{ required: true, message: "请输入借阅天数", trigger: "blur" },
         { type: 'number', message: '借阅天数必须为数字值'},
        //  { max: 10, message: '借阅天数最多10天'},
         ],

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
    //点击搜索时触发
    show(e){
      console.log("点击了软件盘的搜索按钮121111113");
      console.log(e);
        this.$refs.input.blur();    //点击搜索后收起软键盘
        this.$emit('func',this.searchText);	    //获取搜索文本，做一些请求操作
    },


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
        .get("/member/book/list", {
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
      this.borrowForm = {};
    },
    //关闭对话框
    handleClose() {
      this.resetForm("borrowForm"); //重置表单数据
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
      (this.borrowForm.status = 1), //默认是正常
        (this.dialogData.dialogTitle = "新增");
      this.dialogData.dialogSubmit = "创建";
      this.dialogVisible = true; //打开对话框
    },
    //借阅按钮操作
    borrowHandle(bookId) {
      this.dialogData.dialogTitle = "借阅图书";
      this.dialogData.dialogSubmit = "借阅图书";
      // //请求详情
      // this.$axios.get("/sys/role/info", { params: { id: id } }).then((res) => {
        // this.borrowForm = res.data.data;
      console.log(bookId)
      this.borrowForm.bookId = bookId;
      
        this.dialogVisible = true; //打开对话框
      // });
    },

    //提交借阅按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/member/book/borrow" , //根据有没有id判断
              this.borrowForm
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

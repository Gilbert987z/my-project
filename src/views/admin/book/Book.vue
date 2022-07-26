<template>
  <div>
    <el-form
      :inline="true"
      :model="formSearch"
      ref="formSearch"
      class="demo-form-inline"
      action="#"
    >
      <!--οnsubmit="return false;" @submit.prevent="formSubmit" -->
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
          <!--action="javascript:return true;"  @keyup.13="show"  @keydown="onSearchIcon2($event)"
          @keypress="onSearchIcon1(e)"
          -->
        </el-input>
      </el-form-item>
      <el-form-item prop="bookTypeId">
        <el-select
          v-model="formSearch.bookTypeId"
          @change="handleSearchEvent"
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
      </el-form-item>
      <el-form-item prop="publisherId">
        <el-select
          v-model="formSearch.publisherId"
          @change="handleSearchEvent"
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
        </el-select>
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
        <!-- <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)"> -->

        <el-button
          style="margin-right:10px"
          type="success"
          icon="el-icon-export"
          @click="exportData()"
          v-if="hasAuth('book.export')"
          >导出</el-button
        >

        <el-button
          style="margin-right:10px"
          type="danger"
          icon="el-icon-remove"
          :disabled="delBtlStatus"
          v-if="hasAuth('book.delete')"
          @click="delHandle(null)"
          >批量删除</el-button
        >
        <!-- </el-popconfirm>      slot="reference"-->

        <el-button
          v-if="hasAuth('book.save')"
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

      <el-table-column prop="id" label="图书编号" width="180">
      </el-table-column>

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

      <el-table-column prop="status" label="图书状态">
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-if="scope.row.status === 1"
            type="success"
            effect="dark"
            >{{ bookStatus.on }}</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.status === 0"
            type="danger"
            effect="dark"
            >{{ bookStatus.off }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="hasAuth('book.switch')">
            <el-button
              v-if="scope.row.status === 1"
              type="text"
              @click="switchBookHandle(scope.row.id, scope.row.status)"
              >{{ bookStatus.off }}</el-button
            >
            <el-button
              v-else-if="scope.row.status === 0"
              type="text"
              @click="switchBookHandle(scope.row.id, scope.row.status)"
              >{{ bookStatus.on }}</el-button
            >
          </template>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            @click="editHandle(scope.row.id)"
            v-if="hasAuth('book.update') && hasAuth('book.detail')"
            >编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            @click="delHandle(scope.row.id)"
            v-if="hasAuth('book.delete')"
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

    <!--对话框-->
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection: [], //多选的勾选列表
      delBtlStatus: true, //批量删除按钮的禁用
      //对话框
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
      //上下架对话框
      bookStatus: {
        on: "上架",
        off: "下架",
      },
      switchBookForm: {
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
        queryName: "", //查询名称
        bookTypeId: null,
        publisherId: null,
      },
    };
  },
  methods: {
    //点击搜索时触发
    show(e) {
      console.log("点击了软件盘的搜索按钮121111113");
      console.log(e);
      this.$refs.input.blur(); //点击搜索后收起软键盘
      this.$emit("func", this.searchText); //获取搜索文本，做一些请求操作
    },
    // formSubmit(){
    //   return false;
    // },
    // onSearchIcon(e){
    //   console.log("点击了软件盘的搜索按钮121111113");
    //   if(e.keyCode == 13){
    //     console.log("点击了软件盘的搜索按钮11111");
    //     this.getTableList();
    //   }
    // },
    // onSearchIcon2(e){
    //   console.log("点击了软件盘的搜索按钮123");
    //   if(e.keyCode == 13){
    //     console.log("点击了软件盘的搜索按钮");
    //     this.getTableList();
    //   }
    // },

    //获取列表
    getTableList() {
      var params = {
        page: this.page.current,
        size: this.page.size,
        name: this.formSearch.queryName,
        bookTypeId: this.formSearch.bookTypeId,
        publisherId: this.formSearch.publisherId,
        action: "list",
      };
      console.log(params);
      // return false;
      this.$axios
        .get("/admin/book/list", {
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
        url: "/admin/book/export",
        params: params,
        // data: formData, // 参数
        responseType: "blob", // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          // 处理返回的文件流
          let blob = new Blob([res.data], { type: res.data.type });
          const fileName = decodeURI(
            res.headers["content-disposition"].split("=")[1],
            "UTF-8"
          ); //截取content-disposition的filename；按=分割，取最后一个
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

    //输入框修改时触发
    handleSearchEvent() {
      // this.inputName = val;
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
    //上下架按钮弹窗操作
    switchBookHandle(id, status) {
      this.switchBookForm.id = id;

      if (status == 0) {
        this.switchBookForm.status = 1;

        this.$confirm("确定上架选中的图书吗?", "上架", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .post("/admin/book/switch", this.switchBookForm)
            .then((res) => {
              this.getTableList(); //请求刷新
              if (res.data.code === 20000) {
                this.$message.success("上架成功!");
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
        this.switchBookForm.status = 0;

        this.$confirm("确定下架选中的图书吗?", "下架", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .post("/admin/book/switch", this.switchBookForm)
            .then((res) => {
              this.getTableList(); //请求刷新
              if (res.data.code === 20000) {
                this.$message.success("下架成功!");
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

    //新增按钮操作
    addHandle() {
      this.$router.push({ name: "BookSave" }); //跳转到图书添加页面
      // this.$router.push({ path: "/admin/book/save",params:{func:"insert"} }); //跳转到图书添加页面
    },
    //修改按钮操作
    editHandle(id) {
      console.log(id);
      // this.$router.push({ path: "/admin/book/save" }); //跳转到图书添加页面
      this.$router.push({ name: "BookSave", params: { id: id } }); //跳转到图书编辑页面
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

      this.$confirm("确定删除选中的图书吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$axios
          .post("/admin/book/delete", ids)
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
    getBookTypeList() {
      //图书类型列表
      this.$axios
        .get("/index/bookType/list")
        .then((response) => {
          console.log(response);
          this.bookTypeList = response.data.data;
          // this.page = response.data.data
          console.log("bookTypeList", this.bookTypeList);
          console.log("bookTypeList", response.data);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    getPublisherList() {
      this.$axios
        .get("index/bookPublisher/list")
        .then((response) => {
          console.log(response);
          this.publisherList = response.data.data;
          // this.page = response.data.data
          console.log(this.publisherList);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
  },
  created() {
    this.getTableList();
    this.getBookTypeList();
    this.getPublisherList();
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

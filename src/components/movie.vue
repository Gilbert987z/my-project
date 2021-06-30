<template>
  <div>

    <el-table
        :data="info"
        border
        style="width: 100%">
      <el-table-column
          prop="moviename"
          label="日期"
          width="180">
      </el-table-column>
      <el-table-column
          prop="movieyear"
          label="姓名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="moviecountry"
          label="地址">
      </el-table-column>
    </el-table>

    <!--    <span class="demonstration">完整功能</span>-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current_page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="page.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      info: [],
      page: {per_page: 10, current_page: 1,}
    }
  }, methods: {
    //获取列表
    getListTable() {
      // this.page.current_page = Number(this.$route.query.page)

      var params = {
        page: this.page.current_page,
        size: this.page.per_page
      }
      console.log(params);
      // return false;
      axios
          .get('http://127.0.0.1:8000/restful/api/modelSerializer/',
              {
                params: params,
              })
          .then(response => {
            this.info = response.data.data.list
            this.page = response.data.data
            console.log(this.info);


            this.$router.push({path: '/movie?page=' + this.page.current_page});
            //+'&size='+this.page.per_page
          }).catch(function (error) { // 请求失败处理
        console.log(error);

      });

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      // val变化后的每页的条数
      this.page.per_page = val;//更新每页的条数
      this.getListTable();//重新获取列表数据
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      // this.$route.query.page = val  // 其中val是当前的页数。
      // this.$router.replace(route)  // 这样页面就跳转到相应的路由了。

      //val 变化后的页码
      this.page.current_page = val;
      this.getListTable();//重新获取列表数据
    }

  },
  created() {
    this.getListTable();
  },
  mounted() {

  },
  // watch: {
  //   $route(to) {
  //    // console.log(to.query.page,789);
  //     // console.log(from);
  //     // console.log(to.query.page)
  //     // console.log("打印page的变化："+this.$route.query.page)
  //     // this.page.current_page = to.query.page
  //     this.page.current_page = Number(to.query.page)  //
  //     // console.log(to.query,1234);return;
  //     // console.log(this.page.current_page,1234);return;
  //     this.getListTable()
  //   }
  //     $route: {
  //       handler() {
  //            this.page.current_page = Number(this.$route.query.page);
  //            alert(Number(this.$route.query.page))
  //           this.getListTable();
  //           //深度监听，同时也可监听到param参数变化
  //     },
  //     deep: true,
  // }
  // },

}
</script>
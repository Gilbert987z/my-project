<template>
  <el-container>
    <el-aside width="200px">
      <!-- 导入菜单组件 -->
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <strong>图书管理系统</strong>

        <div class="header-avatar">
          <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>

          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{ name: 'UserCenter' }">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link :to="{ name: 'MemberHome' }">用户界面</router-link>
              </el-dropdown-item>
              <!-- <el-popconfirm title="是否登出?" @confirm="logout"> -->
              <!-- <template #reference> -->
              <el-dropdown-item @click.native="logout()"
                >退出登录</el-dropdown-item
              >
              <!-- </template> -->
              <!-- </el-popconfirm> -->
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <el-link
            href="https://github.com/Gilbert987z/my-project"
            target="_blank"
            >切换到用户界面</el-link
          > -->
        </div>
      </el-header>
      <el-main>
        <div style="margin: 15px;">
          <!-- 面包屑 -->
          <Breadcrumb style="margin-bottom:25px"></Breadcrumb>

          <!-- 将菜单的内容展示在这里 -->
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./inc/SideMenu";
import Breadcrumb from "./inc/Breadcrumb";

export default {
  name: "Home",
  components: {
    //引用组件
    SideMenu,
    Breadcrumb,
  },
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        avatar: "",
        isAdmin: null, //是否是管理员
      },
    };
  },
  created() {
    this.getUserInfo(); //进入首页，就获取用户信息
    this.getUserPermissions();
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/user/info").then((res) => {
        this.userInfo = res.data.data;
        console.log(this.userInfo);
      });
    },
    getUserPermissions() {
      this.$axios.get("/user/permissions").then((res) => {
        // this.userPermissions = res.data.data;
         // 拿到用户权限
        this.$store.commit("setPermList", res.data.data.authoritys) 
        // console.log(this.userPermissions);
      });
    },
    logout() {
      const h = this.$createElement;
      this.$msgbox({
        title: "登出",
        message: h("p", null, [
          h("span", null, "确认是否登出？ "),
          // h("i", { style: "color: teal" }, "VNode"),
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";

            this.$axios.post("/logout").then(() => {
              localStorage.clear();
              sessionStorage.clear();

              this.$store.commit("resetState"); //调用vuex中的清空数据的mutations方法

              this.$router.push({ name: "Login" }); //跳转到登录页
            });

            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          } else {
            done();
          }
        },
      }).then(() => {
        //登出后，弹出成功信息
        this.$message({
          type: "success",
          message: "登出成功",
        });
      });

      // console.log("test");
      // this.$confirm("确定删除选中的角色吗?", "删除", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "error",
      // }).then(() => {
      //   this.$axios.post("/logout").then(() => {
      //     localStorage.clear();
      //     sessionStorage.clear();

      //     // this.$store.commit("resetState");

      //     this.$router.push("/login");
      //   });
      // });
    },
  },
};
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: #16c3ee;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}

a {
  text-decoration: none;
}
</style>

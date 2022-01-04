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

              <el-popconfirm title="是否登出?" @confirm="logout">
                <template #reference>
                   <el-dropdown-item>退出</el-dropdown-item>
                </template>
              </el-popconfirm>

             
            </el-dropdown-menu>
          </el-dropdown>

          <el-link
            href="https://github.com/Gilbert987z/my-project"
            target="_blank"
            >github</el-link
          >
          <el-link href="https://space.bilibili.com/13491144" target="_blank"
            >B站</el-link
          >
        </div>
      </el-header>
      <el-main>
        <!-- 标签栏 -->
        <Tabs></Tabs>
        <div style="margin: 0 15px;">
          <!-- 将菜单的内容展示在这里 -->
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./inc/SideMenu";
import Tabs from "./inc/Tabs";

export default {
  name: "Home",
  components: {
    SideMenu,
    Tabs,
  },
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        avatar: "",
      },
    };
  },
  created() {
    this.getUserInfo(); //进入首页，就获取用户信息
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/user/info").then((res) => {
        this.userInfo = res.data.data;
        console.log(this.userInfo);
      });
    },
    logout() {
      this.$axios.post("/logout").then(() => {
        localStorage.clear();
        sessionStorage.clear();

        // this.$store.commit("resetState");

        this.$router.push("/login");
      });
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

<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- 真的要取name吗？ -->
    <router-link :to="{ name: 'AdminIndex' }">
      <el-menu-item index="Index">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>

    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>系统管理</span>
      </template>

      <el-menu-item-group>
        <router-link :to="{ name: 'User' }">
          <!-- <router-link to="/sys/user"> -->
          <el-menu-item index="1-1">用户管理</el-menu-item>
        </router-link>
        <router-link :to="{ name: 'Role' }">
          <el-menu-item index="1-2">角色管理</el-menu-item>
        </router-link>
        <router-link :to="{ name: 'Permission' }">
          <el-menu-item index="1-3">权限管理</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-collection"></i>
        <span>图书管理</span>
      </template>
      <el-menu-item-group>
        <router-link :to="{ name: 'Book' }">
          <el-menu-item v-if="flase" index="2-1">图书列表</el-menu-item>
        </router-link>
        <router-link :to="{ name: 'BookType' }">
          <el-menu-item index="2-2">图书类型</el-menu-item>
        </router-link>
        <router-link :to="{ name: 'BookPublisher' }">
          <el-menu-item index="2-3">图书出版商</el-menu-item>
        </router-link>
        <router-link :to="{ name: 'BookBorrowLog' }">
          <el-menu-item index="2-4">图书借阅日志</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
      
   
  </el-menu>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}
</style>

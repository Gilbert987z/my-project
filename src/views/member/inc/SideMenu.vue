<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#fff"
    text-color="#545c64"
    active-text-color="#ffd04b"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- 真的要取name吗？ -->
    <router-link :to="{ name: 'MemberIndex' }">
      <el-menu-item index="Index">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>

    <router-link :to="{ name: 'MemberBook' }">
      <el-menu-item index="1">
        <template slot="title">
          <i class="el-icon-collection"></i>
          <span slot="title">图书列表</span>
        </template>
      </el-menu-item>
    </router-link>

    <router-link :to="{ name: 'MemberBookBorrowLog' }">
      <el-menu-item index="2">
        <template slot="title">
          <i class="el-icon-collection"></i>
          <span slot="title">图书借阅历史</span>
        </template>
      </el-menu-item>
    </router-link>
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

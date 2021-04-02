<template>
  <el-container class="home_box" style="height: 100vh">
    <!-- 头部区域 -->
    <el-header>
      <div class="head_">
        <img :src="img" alt="" class="image_home" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="signOut">退出</el-button>
    </el-header>
    <!-- 页面主体部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- <el-aside width="15vw"> -->
      <el-aside :width="flag ? 60 + 'px' :200+'px'">
        <!-- 侧边栏菜单区域 -->
        <div class="fold_btn" @click="foldAside">|||</div>
        <el-menu
          background-color="#4682B4"
          text-color="#fff"
          active-text-color="yellow"
          :unique-opened="true"
          :collapse="flag"
          :collapse-transition="false"
          router
          :default-active="active_"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="(item, num) in menuList"
            :key="num"
            :index="String(item.id)"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 菜单图标 -->
              <i class="iconfont" :class="icons[num]"></i>
              <!-- 菜单文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + String(item_str.path)"
              v-for="item_str in item.children"
              :key="item_str.id"
              @click="handle('/' + String(item_str.path))"
            >
              <!-- 菜单图标 -->
              <i class="el-icon-menu"></i>
              <!-- 菜单文本 -->
              <span>{{ item_str.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- welcome -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { clear, getItem } from "../utils/storage";
import { setItem } from "../utils/storage";
import { menus } from "../api/menus";

export default {
  data() {
    return {
      img: require("../assets/image/img (2).jpg"),
      menuList: [],
      icons: [
        "icon-user",
        "icon-tijikongjian",
        "icon-3702mima",
        "icon-danju",
        "icon-baobiao",
      ],
      flag: false,
      // 被激活的链接地址
      active_: "",
    };
  },
  created() {
    this.getMenuList();
    this.active_ = getItem("activePath");
  },
  methods: {
    signOut() {
      clear();
      setTimeout(() => {
        this.$router.push("/login");
      }, 1000);
    },
    getMenuList() {
      menus().then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
        // console.log(this.menuList);
      });
    },
    foldAside() {
      this.flag = !this.flag;
    },
    handle(val) {
      setItem("activePath", val);
    },
  },
};
</script>


<style lang="scss" >
.home_box {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: burlywood;
  color: #fff;
  font-size: 20px;
  .head_ {
    display: flex;
    align-items: center;
    .image_home {
      width: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: steelblue;
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: aquamarine;
}
.el-submenu .iconfont {
  margin-right: 10px;
  color: rgb(208, 243, 10);
}
.fold_btn {
  background-color: rgb(18, 116, 245);
  font-size: 15px;
  font-weight: 600;
  line-height: 25px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: #ccc;
}
</style>

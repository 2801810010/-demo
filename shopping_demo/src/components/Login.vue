<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="top_box">
        <img :src="img" alt="" />
      </div>
      <!-- 登陆表单 -->
      <el-form
        label-width=""
        class="from_login"
        :model="loginFrom"
        :rules="loginFromRules"
        ref="loginFromRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginFrom.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn_login">
          <el-button type="danger" @click="login">登陆</el-button>
          <el-button type="primary" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { login_ } from "../api/login.js";
import {setItem} from '../utils/storage.js'

export default {
  data() {
    return {
      img: require("../assets/image/img (1).png"),
      // 登陆表单的数据绑定对象
      loginFrom: {
        username: "admin",
        password: "123456",
      },
      // 表单的验证规则对象
      loginFromRules: {
        // 验证用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //  点击重置表单
    resetLoginFrom() {
      console.log(this.$refs.loginFromRef);
      this.$refs.loginFromRef.resetFields();
    },
    login() {
      this.$refs.loginFromRef.validate((val) => {
        if (!val) return;
        // 发送 axios 请求
        login_(this.loginFrom).then((res) => {
          // 显示登陆状态
          if(res.meta.status !== 200) return this.$message.error({message:"登陆失败 ! ", showClose:'true',});
          this.$message.success({showClose:'true',message:"登陆成功 !"});
          setItem("token",res.data.token)
          setTimeout(()=>{
          this.$router.push("/home");
          },1000)
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/global.scss";

@media only screen and (max-width: 540px) {
  .login,
  .login_box {
    width: 100%;
    height: 100%;
  }
}

@media only screen and (min-width: 540px) {
  .login {
    min-width: 540px;
    height: 100%;
    margin: 0 auto;
    .login_box {
      width: 540px;
    }
  }
}

.login {
  background-color: $color;
}
.login_box {
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  @include center_;
  .top_box {
    position: absolute;
    left: 50%;
    top: -15%;
    transform: translate(-50%);
    height: 130px;
    width: 130px;
    margin: auto;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
  }
  .top_box > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ccc;
  }
}
.from_login {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn_login {
  display: flex;
  justify-content: flex-end;
}
</style>
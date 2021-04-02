<template>
  <div class="users">
    <!-- 导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 图片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userData" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 状态开关插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <!-- 操作插槽 修改、删除、设置-->
          <template slot-scope="scope">
            <!-- 修改用户信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyUserMessage(scope.row.id)"
            >
            </el-button>
            <!-- 删除用户信息按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserList(scope.row.id)"
            >
            </el-button>
            <!-- 分配用户权限按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalData"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <!-- visible.sync 控制对话框的显示隐藏 默认false -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUser"
      width="50%"
      @close="closeFrom"
    >
      <!-- 内容 -->
      <el-form
        :model="addUserList"
        :rules="addUserListRules"
        ref="addUserListRef"
        label-width="100px"
      >
        <el-form-item
          v-for="(item, index) in addUserItem"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input v-model="addUserList[`${item.prop}`]"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUser = false">取 消</el-button>
        <el-button type="primary" @click="addUserMessage">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="modifyVisible"
      width="50%"
      @close="closeCheckFrom"
    >
      <!--  修改用户信息的内容区域-->
      <el-form
        :model="checkUserList"
        :rules="checkUserListRules"
        ref="checkUserListRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="checkUserList.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="checkUserList.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="checkUserList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改用户对话框的底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="defineUserMessage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UserList } from "../../api/user.js";
import { userChangeState } from "../../api/userChange.js";
import { addNewUser } from "../../api/addNewUser.js";
import { modifyUser } from "../../api/modifyUser";
import { defineMessage } from "../../api/defineMessage";
import { removeUser } from "../../api/removeUser";
import request from '../../utils/request'

export default {
  data() {
    // 验证邮箱的规则
    let verifyEmail = (rule, value, callback) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error("请输入正确的邮箱"));
    };
    // 验证手机号的规则
    let verifyMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };
    return {
      // 用户数据列表信息
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userData: [],
      totalData: 0,
      changeState: {},
      // 控制添加用户对话框的显示隐藏
      addUser: false,
      // 添加用户的表单数据
      addUserItem: [
        {
          label: "用户名",
          prop: "username",
        },
        {
          label: "密码",
          prop: "password",
        },
        {
          label: "邮箱",
          prop: "email",
        },
        {
          label: "手机",
          prop: "mobile",
        },
      ],
      //  用户输入的表单数据
      addUserList: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserListRules: {
        // 用户信息的验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 用户密码的验证规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 邮箱的验证规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: verifyEmail,
            trigger: "blur",
          },
        ],
        // 手机的验证规则
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            validator: verifyMobile,
            trigger: "blur",
          },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      modifyVisible: false,
      // 查询到的用户信息对象
      checkUserList: {},
      // 修改表单的验证规则对象
      checkUserListRules: {
        // 邮箱的验证规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: verifyEmail, trigger: "blur" },
        ],
        // 手机的验证规则
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            validator: verifyMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      await UserList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error({
            message: "获取用户列表失败",
            showClose: "true",
          });
        this.userData = res.data.users;
        this.totalData = res.data.total;
      });
    },
    // 监听 pagesize（分页）改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听 switch 开关的状态
    userStateChange(value) {
      let user_url = `/users/${value.id}/state/${value.mg_state}`;
      userChangeState(user_url).then((res) => {
        if (res.meta.status !== 200) {
          value.mg_state = !value.mg_state;
          return this.$message.error("更新用户状态失败");
        }
        this.$message.success({
          showClose: "true",
          message: "更新用户状态成功 !",
        });
      });
    },
    // 监听添加用户对话框的关闭事件
    closeFrom() {
      this.$refs.addUserListRef.resetFields();
    },
    // 点击按钮，添加用户信息
    addUserMessage() {
      this.$refs.addUserListRef.validate((res) => {
        // console.log(res);
        if (!res) return;
        // 验证正确则发送请求
        addNewUser(this.addUserList).then((res) => {
          // console.log(res);
          if (res.meta.status !== 201)
            return this.$message.Error({
              showClose: "true",
              message: "添加用户失败 !",
            });
          this.$message.success({
            showClose: "true",
            message: "添加用户成功 !",
          });
          // 添加成功则隐藏对话框
          this.addUser = false;
          // 重新获取用户列表数据
          this.getUserList();
        });
      });
    },
    // 修改用户信息的对话框
    modifyUserMessage(id) {
      this.modifyVisible = true; //modifyVisible 为true则显示对话框
      let url = "/users" + "/" + id;
      modifyUser(url).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error({
            message: "查询用户信息失败",
            showClose: "true",
          });
        this.checkUserList = res.data;
      });
    },
    // 关闭重置修改用户对话框
    closeCheckFrom() {
      this.$refs.checkUserListRef.resetFields();
    },
    defineUserMessage() {
      this.$refs.checkUserListRef.validate((val) => {
        if (!val) return;
        //发起修改用户信息的请求
        let id = this.checkUserList.id;
        defineMessage("users/" + this.checkUserList.id, {
          email: this.checkUserList.email,
          mobile: this.checkUserList.mobile,
        }).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error({
              message: "更新用户信息失败",
              showClose: "true",
            });
          // 关闭对话框
          this.modifyVisible = false;
          // 刷新数据列表
          this.getUserList();
          // 提示修改成功
          this.$message.success({
            message: "更新用户信息成功",
            showClose: "true",
          });
        });
      });
    },
    // 根据id删除用户信息
    async removeUserList(id) {
      //弹窗询问是否删除
      const removeResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果取消删除，则返回字符串cancel
      // 如果确认删除，则返回字符串confirm
      if (removeResult !== "confirm") {
        return this.$message.info({
          message: "已取消",
          showClose: "true",
        });
      }
      // console.log("确认了删除");
      // 删除用户请求

      // request.delete(String(id))
      removeUser('users/'+id)
      .then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error({
            message: "删除用户失败",
            showClose: "true",
          });
        }
        this.$message.success({
          message: "删除用户成功",
          showClose: "true",
        });
        // 刷新用户数据
         this.getUserList();
      });
    },
  },
};
</script>

<style>
</style>
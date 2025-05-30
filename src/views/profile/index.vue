<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <!-- <div class="text-center">
              <userAvatar :user="adminInfo" />
            </div> -->
            <div class="user-info-head text-center">
              <img v-bind:src="adminInfo.avatar" title="点击上传头像" class="img-circle img-lg" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ adminInfo.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ adminInfo.mobile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ adminInfo.mail }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属租户
                <div class="pull-right">{{ adminInfo.tenant }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">
                  <el-tag v-for="roleId in adminInfo.roleIds" :key="roleId" type="primary"> {{ formatRole(roleId) }} </el-tag>
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ adminInfo.addTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="adminInfo">
              <userInfo :adminInfo="adminInfo" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :adminInfo="adminInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { roleOptions } from '@/api/role'
import { getProfileDetail } from "@/api/profile";


export default {
  name: "Admin",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      roleOptions:[],
      adminInfo: {},
      activeTab: "adminInfo"
    };
  },
  created() {
    
    getProfileDetail().then(response => {
      this.adminInfo = response.data;
    });
    
    roleOptions().then(response => {
      this.roleOptions = response.data.list
    })
  },
  
  methods: {
    
    formatRole(roleId) {
      if(this.roleOptions == null){
        return ''
      }
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    },

  }
};
</script>

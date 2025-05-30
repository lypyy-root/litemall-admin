<template>
  <el-form ref="form" :model="adminInfo" :rules="rules" label-width="80px">
    <el-form-item label="账户名称" prop="username">
      <el-input v-model="adminInfo.username" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="adminInfo.mobile" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="mail">
      <el-input v-model="adminInfo.mail" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="adminInfo.gender">
        <el-radio label="0">未知</el-radio>
        <el-radio label="1">男</el-radio>
        <el-radio label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateProfile } from "@/api/profile";

export default {
  props: {
    adminInfo: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        username: [
          { required: true, message: "账户名称不能为空", trigger: "blur" }
        ],
        mail: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateProfile(this.adminInfo).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>

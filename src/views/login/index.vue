
<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账号登录" name="login">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              placeholder="账号" >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password"
              :type="passwordType"
              name="password"
              auto-complete="on"
              tabindex="2"
              show-password
              placeholder="密码">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>

          <el-form-item prop="code" >
            <el-input v-model="loginForm.code"
              auto-complete="off"
              name="code"
              tabindex="2"
              placeholder="验证码"
              style="width: 63%">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>

            <div class="login-code">
              <el-button
                @click.native.prevent="getCode()"
                class="bind_code_gain"
                :disabled="disabled"
                >{{ btnText }}</el-button>
            </div>
          </el-form-item>

          <el-form-item prop="appid">
            <el-input v-model="loginForm.appid"
              :type="passwordType"
              name="appid"
              auto-complete="on"
              tabindex="2"
              show-password
              placeholder="租户appid">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>

          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>

          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="扫码登陆" name="qrLogin">
          <el-image :src="authQrPath" v-if="authQrPath" style="width: 80%; height: 80%;margin-left: 10%;" @click.native.prevent="getAuthQrCode"/>
          <el-image :src="authQrPath" v-else style="width: 80%; height: 278px;margin-left: 10%;" @click.native.prevent="getAuthQrCode"/>
        </el-tab-pane>
      </el-tabs>

    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2022 927069313@qq.com 版权所有 <a href="https://beian.miit.gov.cn/">黔ICP备2022000992号</a></span>
    </div>
  </div>
</template>

<script>
import { getCaptcha , loginByQr} from '@/api/login'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('管理员密码长度应大于6'))
      } else {
        callback()
      }
    }
    return {
      webSocketUrl: process.env.VUE_APP_BASE_SOCKET,
      activeName: 'login',
      authCode: '',
      authQrPath: '',
      socket: "",
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        appid: '',
      },
      loginRules: {
        username: [{ required: true, message: '管理员账户不允许为空', trigger: 'blur' }],
        password: [
          { required: true, message: '管理员密码不允许为空', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
      },
      passwordType: 'password',
      loading: false, // 登陆按钮是否可以按
      btnText: "发送验证码",
      disabled: false, // 发送验证码按钮是否可以按
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  methods: {
    getAuthQrCode: function () {
      if(typeof(WebSocket) === "undefined"){
          alert("您的浏览器不支持socket")
      }else{
        if (!this.authCode && !this.authQrPath){
          loginByQr(this.loginForm).then(response => {
            this.authCode = response.data.authCode;
            this.authQrPath = response.data.authQrPath;
            this.createWebSocket();
          })
        } else {
          this.createWebSocket();
        }
      }
    },

    handleClick(tab, event) {
      if (tab.name === 'qrLogin') {
        this.getAuthQrCode();
      }
    },

    createWebSocket: function () {
      if(this.socket){
        this.socket.close();
      }
      // 实例化socket
      this.socket = new WebSocket(this.webSocketUrl + this.authCode + "=admin");
      // 监听socket连接
      this.socket.onopen = this.open;
      // 监听socket错误信息
      this.socket.onerror = this.error;
      // 监听socket消息
      this.socket.onmessage = this.onMessage;
    },
    open: function () {
      console.log("连接成功")
    },
    error: function () {
      console.log("连接错误")
    },
    onMessage: function (response) {
      let data = JSON.parse(response.data);
      try {
        let authInfo = JSON.parse(data.data); // 如果不是json字符串就会抛异常
        this.$store.dispatch('LoginByQr', authInfo).then(() => {
          this.loading = false
          this.$router.push({ path: this.redirect || '/' } , () => {})
        })
      } catch(e) {
      	console.log(data.data)
      }
    },

    getCode() {
      //邮箱为空的话
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          getCaptcha(this.loginForm).then(response => {
            this.$notify.success({
              title: '成功',
              message: response.data
            })
            this.disabled = true;
            this.btnText = "请稍候...";
            setTimeout(() => {
              this.doLoop(60);
            }, 500);
          })
        } else {
          return false;
        }
      })
    },

    // 邮箱验证码的倒计时
    doLoop(seconds) {
      seconds = seconds ? seconds : 60;
      this.btnText = seconds + "s后获取";
      let countdown = setInterval(() => {
        if (seconds > 0) {
          this.btnText = seconds + "s后获取";
          --seconds;
        } else {
          this.btnText = "获取验证码";
          this.disabled = false;
          clearInterval(countdown);
        }
      }, 1000);
    },

    //登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && !this.loading) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' } , () => {})
          }).catch(response => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>


<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>

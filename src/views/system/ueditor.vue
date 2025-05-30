<template>
  <div class="app-container">

    <el-form ref="dataForm" :model="dataForm" status-icon label-position="left"  >
      <el-form-item prop="content">
        <vue-ueditor-wrap v-model="dataForm.content" :config="UeditorConfig" @ready="ueditorReady"></vue-ueditor-wrap>
      </el-form-item>
    </el-form>

  </div>
</template>


<style>
.el-dialog {
  width: 1000px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
.el-form-item--medium .el-form-item__content {
    line-height: 0px;
}
</style>


<script>
import { listSysytmLog , readSysytmLog } from '@/api/log'
import Pagination from '@/components/Pagination'
import { getToken , getTenantId } from '@/utils/auth'

export default {
  name: 'UEditor',
  components: { Pagination },
  data() {
    return {
      socket: "",
      webSocketUrl: process.env.VUE_APP_BASE_SOCKET_LOG,
      dataForm: {
        content: "",
      },
      UeditorConfig: {
        // 只读模式
        readonly : false,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 700,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // UEditor 资源文件的存放路径，
        UEDITOR_HOME_URL: '/UEditor/'
      }
    }
  },

  created() {
    this.createWebSocket();
    //读取文件
    readSysytmLog(this.$route.query.filePath).then(response => {})
  },

  methods: {

    // 此方法用来处理上传图片
    ueditorReady: function (editorInstance) {
      UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
      UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage' || action == 'uploadfile') {
            return process.env.VUE_APP_BASE_API + '/storage/uploadFile';
        } else if (action == 'uploadvideo') {
            return process.env.VUE_APP_BASE_API + '/storage/uploadFile';
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
      }
    },

    createWebSocket: function () {
      if(typeof(WebSocket) === "undefined"){
          alert("您的浏览器不支持socket")
          return;
      }
      if(this.socket){
        this.socket.close();
      }
      // 实例化socket
      this.socket = new WebSocket(this.webSocketUrl + getToken());
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
        this.dataForm.content += data.data
      } catch(e) {
        console.log(data.data)
      }
    },
  }
}
</script>

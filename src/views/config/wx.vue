<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>小程序配置</span>
          </div>
          <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="200px">
            <el-tabs>
              <el-tab-pane label="首页配置">
                <el-form-item label="首页懒加载商品显示数量" prop="wx_index_all">
                  <el-input v-model="dataForm.wx_index_all" :style="{width: '60%'}"/>
                </el-form-item>
                <el-form-item label="新品首发栏目商品显示数量" prop="wx_index_new">
                  <el-input v-model="dataForm.wx_index_new" :style="{width: '60%'}"/>
                </el-form-item>
                <el-form-item label="人气推荐栏目商品显示数量" prop="wx_index_hot">
                  <el-input v-model="dataForm.wx_index_hot" :style="{width: '60%'}"/>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="其他配置">
                <el-form-item label="商品分享功能" prop="wx_system_share">
                  <el-radio-group v-model="dataForm.wx_system_share">
                    <el-radio :label="true+''">开启</el-radio>
                    <el-radio :label="false+''">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="微信支付功能" prop="wx_system_pay">
                  <el-radio-group v-model="dataForm.wx_system_pay">
                    <el-radio :label="true+''">开启</el-radio>
                    <el-radio :label="false+''">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="update">确定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listWx, updateWx } from '@/api/config'

export default {
  name: 'ConfigWx',
  data() {
    return {
      dataForm: {},
      rules: {
        wx_index_new: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        wx_index_hot: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        wx_index_all: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      listWx().then(response => {
        this.dataForm = response.data;
      })
    },
    cancel() {
      this.init()
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.doUpdate()
      })
    },
    doUpdate() {
      updateWx(this.dataForm).then(response => {
        this.$notify.success({
          title: '成功',
          message: '配置成功'
        })
        this.init()
      })
    }
  }
}
</script>


<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>运费配置</span>
          </div>
          <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="100px">
            <el-form-item label="消费满" prop="express_freight_min">
              <el-input v-model="dataForm.express_freight_min" style="width: 50%;">
                <template slot="append">元</template>
              </el-input>
              <span class="info">免除运费</span>
            </el-form-item>

            <el-form-item label="运费" prop="express_freight_value">
              <el-input v-model="dataForm.express_freight_value" style="width: 50%;">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>

            <el-form-item size="large">
              <el-button type="primary" @click="update">提交</el-button>
              <el-button @click="cancel">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { listExpress, updateExpress } from '@/api/config'

export default {
  name: 'ConfigExpress',
  data() {
    return {
      dataForm: {
        express_freight_min: 0,
        express_freight_value: 0,
      },
      rules: {
        express_freight_min: [{
          required: true,
          message: '请输入费运运费满减所需最低消费',
          trigger: 'blur'
        }],
        express_freight_value: [{
          required: true,
          message: '请输入运费',
          trigger: 'blur'
        }],
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    init: function() {
      listExpress().then(response => {
        this.dataForm = response.data
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
      updateExpress(this.dataForm).then(response => {
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

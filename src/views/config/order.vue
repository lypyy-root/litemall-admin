
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>订单配置</span>
          </div>
          <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
            <el-form-item label="用户下单后超时" prop="order_unpaid">
              <el-input v-model="dataForm.order_unpaid" class="input-width">
                <template slot="append">分钟</template>
              </el-input>
              <span class="info">用户未付款，则订单自动取消</span>
            </el-form-item>
            <el-form-item label="订单发货后超期" prop="order_unconfirmed">
              <el-input v-model="dataForm.order_unconfirmed" class="input-width">
                <template slot="append"> 天</template>
              </el-input>
              <span class="info">未确认收货，则订单自动确认收货</span>
            </el-form-item>
            <el-form-item label="确认收货后超期" prop="order_comment">
              <el-input v-model="dataForm.order_comment" class="input-width">
                <template slot="append">天</template>
              </el-input>
              <span class="info">未评价商品，则取消评价资格</span>
            </el-form-item>
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
import { listOrder, updateOrder } from '@/api/config'

export default {
  name: 'ConfigOrder',
  data() {
    return {
      dataForm: {
        order_unpaid: 0,
        order_unconfirmed: 0,
        order_comment: 0
      },
      rules: {
        order_unpaid: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        order_unconfirmed: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        order_comment: [
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
      listOrder().then(response => {
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
      updateOrder(this.dataForm).then(response => {
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
<style scoped>
  .input-width {
    width: 50%;
  }
  .info {
    margin-left: 15px;
  }
</style>

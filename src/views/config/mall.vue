
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>商城配置</span>
          </div>
          <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="200px">
            <el-tabs>
              <el-tab-pane label="商城信息">
                <el-form-item label="商城名称" prop="mall_name">
                  <el-input v-model="dataForm.mall_name" :style="{width: '60%'}"/>
                </el-form-item>
                <el-form-item label="商城地址" prop="mall_address">
                  <el-input v-model="dataForm.mall_address" :style="{width: '60%'}"/>
                </el-form-item>
                <el-form-item label="地理坐标">
                  <el-col :span="6">
                    <el-input v-model="dataForm.mall_longitude" placeholder="经度"/>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">-</el-col>
                  <el-col :span="6">
                    <el-input v-model="dataForm.mall_latitude" placeholder="纬度"/>
                  </el-col>
                </el-form-item>
                <el-form-item label="联系电话" prop="mall_phone">
                  <el-input v-model="dataForm.mall_phone" :style="{width: '60%'}"/>
                </el-form-item>
                <el-form-item label="QQ交流群" prop="mall_qq">
                  <el-input v-model="dataForm.mall_qq" :style="{width: '60%'}"/>
                </el-form-item>
                <el-form-item>
                  <el-button @click="cancel">取消</el-button>
                  <el-button type="primary" @click="update">确定</el-button>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="系统信息">
                <el-form-item label="订单服务费比例" prop="mall_order_brokerage">
                  <el-input v-model="dataForm.mall_order_brokerage" style="width: 50%;">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品可设置的最小金额" prop="mall_goods_min_amount">
                  <el-input v-model="dataForm.mall_goods_min_amount" style="width: 50%;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品可设置的最大金额" prop="mall_goods_max_amount">
                  <el-input v-model="dataForm.mall_goods_max_amount" style="width: 50%;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="订单支付最小金额" prop="mall_order_min_amount">
                  <el-input v-model="dataForm.mall_order_min_amount" style="width: 50%;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="订单支付最大金额" prop="mall_order_max_amount">
                  <el-input v-model="dataForm.mall_order_max_amount" style="width: 50%;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>

                <el-form-item>
                  <el-button @click="cancel">取消</el-button>
                  <el-button type="primary" @click="update">确定</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listMall, updateMall } from '@/api/config'

export default {
  name: 'ConfigMail',
  data() {
    return {
      dataForm: {},
      rules: {
        mall_name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_address: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_phone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_qq: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],

        mall_order_brokerage: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_goods_min_amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_goods_max_amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_order_min_amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mall_order_max_amount: [
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
      listMall().then(response => {
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
      updateMall(this.dataForm).then(response => {
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

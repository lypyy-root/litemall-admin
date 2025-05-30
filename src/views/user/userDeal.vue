<template>
  <div class="app-container">

    <div class="table-layout">
      <el-row>
        <el-col :span="3" class="table-cell-title">用户序号</el-col>
        <el-col :span="3" class="table-cell-title">用户昵称</el-col>
        <el-col :span="3" class="table-cell-title">用户头像</el-col>
        <el-col :span="3" class="table-cell-title">手机号</el-col>
        <el-col :span="3" class="table-cell-title">性别</el-col>
        <el-col :span="3" class="table-cell-title">邀请者序号</el-col>
        <el-col :span="3" class="table-cell-title">用户等级</el-col>
        <el-col :span="3" class="table-cell-title">用户余额</el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="table-cell">{{ dealUser.id }}</el-col>
        <el-col :span="3" class="table-cell">{{ dealUser.nickname }}</el-col>
        <el-col :span="3" class="table-cell">
          <el-image :src="dealUser.avatar" :preview-src-list="[dealUser.avatar]" v-if="dealUser.avatar" style="width: 40px;" />
        </el-col>

        <el-col :span="3" class="table-cell">{{ dealUser.mobile }}</el-col>

        <el-col :span="3" class="table-cell">
           <el-tag >{{ genderDic[dealUser.gender] }}</el-tag>
        </el-col>

        <el-col :span="3" class="table-cell">
          <el-tag >{{ dealUser.inviter }}</el-tag>
        </el-col>
        <el-col :span="3" class="table-cell">
          <el-tag :type="dealUser.userLevel == 0 ?'primary':'success'">{{ levelDic[dealUser.userLevel] }}</el-tag>
        </el-col>
        <el-col :span="3" class="table-cell">{{ dealUser.integral }}</el-col>
      </el-row>
    </div>

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="交易类型">
          <el-select v-model="listQuery.dealType" clearable style="width: 200px" class="filter-item" placeholder="请选择交易类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="交易状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择交易状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/user/deal-list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="交易序号" prop="id" sortable/>

      <el-table-column align="center" label="openId" prop="openid"/>

      <el-table-column align="center" label="交易金额" prop="award">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.award > 0 ? "+"+scope.row.award : scope.row.award}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="余额" prop="balance"/>

      <el-table-column align="center" label="交易类型" prop="dealTypeText">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.dealTypeText }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易状态" prop="statusText">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status != 'SUCCESS' ?'danger':'success'">{{ scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址" prop="lastDealIp"/>

      <el-table-column align="center" label="转账单号" prop="outBatchNo"/>

      <el-table-column align="center" label="交易时间" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>

import { userDetail , dealList} from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultTypeOptions = [
  {
    label: '订单类型',
    value: 0
  },
  {
    label: '赏金类型',
    value: 1
  },
  {
    label: '分享类型',
    value: 2
  },
  {
    label: '系统设置',
    value: 3
  },
  {
    label: '手动提现',
    value: 4
  },
  {
    label: '店铺奖励',
    value: 5
  }
]
const defaultStatusOptions = [
  {
    label: '交易成功',
    value: true
  },
  {
    label: '交易失败',
    value: false
  }
]

export default {
  name: 'DealDetail',
  components: { Pagination },
  data() {
    return {
      typeOptions: Object.assign({}, defaultTypeOptions),
      statusOptions: Object.assign({}, defaultStatusOptions),
      dealUser: {},
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        dealType: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
      statusDic: ['可用', '禁用', '注销'],
      downloadLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return
      }
      userDetail(this.$route.query.id).then(response => {
        this.dealUser = response.data
      })
      this.listQuery.userId = this.$route.query.id
      this.getList()
    },
    getList() {
      this.listLoading = true
      dealList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
  .filter-container {
    margin-top: 20px;
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }
  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>

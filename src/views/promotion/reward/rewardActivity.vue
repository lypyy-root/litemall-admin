<template>
  <div class="app-container">

    <div class="table-layout">
      <el-row>
        <el-col :span="3" class="table-cell-title">赏金任务序号</el-col>
        <el-col :span="3" class="table-cell-title">商品序号</el-col>
        <el-col :span="3" class="table-cell-title">商品名称</el-col>
        <el-col :span="3" class="table-cell-title">商品图片</el-col>
        <el-col :span="3" class="table-cell-title">商品价格</el-col>
        <el-col :span="3" class="table-cell-title">奖励金额</el-col>
        <el-col :span="3" class="table-cell-title">活动数量</el-col>
        <el-col :span="3" class="table-cell-title">活动状态</el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="table-cell">{{ reward.id }}</el-col>
        <el-col :span="3" class="table-cell">{{ reward.goodsId }}</el-col>
        <el-col :span="3" class="table-cell">{{ reward.goodsName }}</el-col>
        <el-col :span="3" class="table-cell">
          <el-image :src="reward.picUrl" :preview-src-list="[reward.picUrl]" v-if="reward.picUrl" style="width: 40px;" />
        </el-col>
        <el-col :span="3" class="table-cell">{{ reward.goodsPrice }}元</el-col>
        <el-col :span="3" class="table-cell">{{ reward.award }}元</el-col>
        <el-col :span="3" class="table-cell">{{ reward.rewardMember }}</el-col>
        <el-col :span="3" class="table-cell">
          <el-tag>{{ reward.status | formatStatus }}</el-tag>
        </el-col>
      </el-row>
    </div>

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>
        
        <el-form-item label="用户序号">
          <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户序号"/>
        </el-form-item>

        <el-form-item label="参与序号">
          <el-input v-model="listQuery.rewardId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户序号"/>
        </el-form-item>

        <el-form-item label="参与状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择参与状态">
            <el-option v-for="item in useStatusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        
        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/reward/listuser']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="活动序号" prop="id" sortable/>

      <el-table-column align="center" label="用户序号" prop="userId"/>

      <el-table-column align="center" label="赏金序号" prop="taskId"/>

      <el-table-column align="center" label="参与序号" prop="rewardId"/>

      <el-table-column align="center" label="角色" prop="rewardId">
        <template slot-scope="scope">
          <el-tag :type="scope.row.rewardId == 0 ?'danger':'success'">{{ scope.row.rewardId == 0 ? "分享者":"参与者" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分享者序号" prop="creatorUserId">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.creatorUserId }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单序号" prop="orderId"/>

      <el-table-column align="center" label="参与状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ?'success':'warning'">{{ scope.row.status | formatUseStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="参与时间" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { readReward, listRewardUser } from '@/api/reward'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultUseStatusOptions = [
  {
    label: '待加入',
    value: 0
  },
  {
    label: '已加入',
    value: 1
  },
  {
    label: '已取消',
    value: 2
  }
]
export default {
  name: 'RewardDetail',
  components: { Pagination },
  filters: {
    formatUseStatus(status) {
      if (status === 0) {
        return '待加入'
      } else if (status === 1) {
        return '加入成功'
      } else if (status === 2) {
        return '取消加入'
      }
    },
    formatStatus(status) {
      if (status === 0) {
        return '正常'
      } else if (status === 1) {
        return '已完成'
      } else {
        return '已取消'
      }
    }
  },
  data() {
    return {
      useStatusOptions: Object.assign({}, defaultUseStatusOptions),
      reward: {},
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        taskId: undefined,
        userId: undefined,
        status: undefined,
        rewardId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
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

      readReward(this.$route.query.id).then(response => {
        this.reward = response.data
      })

      this.listQuery.taskId = this.$route.query.id
      this.getList()
    },
    getList() {
      this.listLoading = true
      listRewardUser(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
        .catch(() => {
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

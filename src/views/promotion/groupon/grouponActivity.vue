<template>
  <div class="app-container">

    <div class="table-layout">
      <el-row>
        <el-col :span="3" class="table-cell-title">团购规则序号</el-col>
        <el-col :span="3" class="table-cell-title">商品序号</el-col>
        <el-col :span="3" class="table-cell-title">商品名称</el-col>
        <el-col :span="3" class="table-cell-title">商品图片</el-col>
        <el-col :span="3" class="table-cell-title">团购优惠</el-col>
        <el-col :span="3" class="table-cell-title">团购要求</el-col>
        <el-col :span="3" class="table-cell-title">结束时间</el-col>
        <el-col :span="3" class="table-cell-title">活动状态</el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="table-cell">{{ grouponRule.id }}</el-col>
        <el-col :span="3" class="table-cell">{{ grouponRule.goodsId }}</el-col>
        <el-col :span="3" class="table-cell">{{ grouponRule.goodsName }}</el-col>
        <el-col :span="3" class="table-cell">
          <el-image :src="grouponRule.picUrl" :preview-src-list="[grouponRule.picUrl]" v-if="grouponRule.picUrl" style="width: 40px;" />
        </el-col>
        <el-col :span="3" class="table-cell">{{ grouponRule.discount }}元</el-col>
        <el-col :span="3" class="table-cell">{{ grouponRule.discountMember }}人</el-col>
        <el-col :span="3" class="table-cell">{{ grouponRule.expireTime }}</el-col>
        <el-col :span="3" class="table-cell">
          <el-tag>{{ grouponRule.status | formatStatus }}</el-tag>
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
          <el-input v-model="listQuery.grouponId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户序号"/>
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
          <el-button v-permission="['GET /admin/groupon/listuser']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="活动序号" prop="id" />

      <el-table-column align="center" label="用户序号" prop="userId" />

      <el-table-column align="center" label="订单序号" prop="orderId" />

      <el-table-column align="center" label="参与序号" prop="grouponId" />

      <el-table-column align="center" label="角色" prop="grouponId">
        <template slot-scope="scope">
          <el-tag :type="scope.row.grouponId == 0 ?'danger':'success'">{{ scope.row.grouponId == 0 ? "开团者":"参与者" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="开团者序号" prop="creatorUserId" />

      <el-table-column align="center" label="团购状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatUseStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分享图片"  prop="shareUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.shareUrl" :preview-src-list="[scope.row.shareUrl]" v-if="scope.row.shareUrl" style="width: 40px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="参与时间" prop="addTime" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }

  .gallery {
    width: 80px;
    margin-right: 10px;
  }
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

<script>
import { readGroupon , listGrouponUser } from '@/api/groupon'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultUseStatusOptions = [
  {
    label: '待开团',
    value: 0
  },
  {
    label: '团购中',
    value: 1
  },
  {
    label: '团购失败',
    value: 2
  },
  {
    label: '团购成功',
    value: 3
  },
  {
    label: '团购取消',
    value: 4
  }
]

export default {
  name: 'GrouponActivity',
  components: { BackToTop, Pagination },
  filters: {
    formatUseStatus(status) {
      if (status === 0) {
        return '待开团'
      } else if (status === 1) {
        return '团购中'
      } else if (status === 2) {
        return '团购失败'
      } else if (status === 3) {
        return '团购成功'
      } else if (status === 4) {
        return '团购取消'
      }
    },
    formatStatus(status) {
      if (status === 0) {
        return '正常'
      } else if (status === 1) {
        return '到期下线'
      } else {
        return '提前下线'
      }
    }
  },
  data() {
    return {
      useStatusOptions: Object.assign({}, defaultUseStatusOptions),
      grouponRule: {},
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        ruleId: undefined,
        userId: undefined,
        status: undefined,
        grouponId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      detailDialogVisible: false,
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

      readGroupon(this.$route.query.id).then(response => {
        this.grouponRule = response.data
      })

      this.listQuery.ruleId = this.$route.query.id
      this.getList()
    },

    getList() {
      this.listLoading = true
      listGrouponUser(this.listQuery).then(response => {
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
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/utils/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品序号', '名称', '首页主图', '折扣', '人数要求', '活动开始时间', '活动结束时间']
          const filterVal = ['id', 'name', 'pic_url', 'discount', 'discountMember', 'addTime', 'expireTime']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
          this.downloadLoading = false
        })
    }
  }
}
</script>

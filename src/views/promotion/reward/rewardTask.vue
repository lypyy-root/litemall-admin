<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>
        
        <el-form-item label="商品序号">
          <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品序号" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/reward/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleCreate"
            v-permission="['POST /admin/reward/create']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            :loading="downloadLoading"
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="任务序号" prop="id" />

      <el-table-column align="center" label="商品序号" prop="goodsId" />

      <el-table-column align="center" min-width="100" label="商品名称" prop="goodsName" />

      <el-table-column align="center" property="picUrl" label="商品图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" v-if="scope.row.picUrl" style="width: 40px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品价格" prop="goodsPrice">
        <template slot-scope="scope">
          {{ scope.row.goodsPrice }}元
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务奖励" prop="award">
        <template slot-scope="scope">
          {{ scope.row.award }}元
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务数量" prop="rewardMember">
        <template slot-scope="scope">
          {{ scope.row.rewardMember }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="赏金状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/reward/read']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-permission="['POST /admin/reward/update']" type="info" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/reward/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
        label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品序号" prop="goodsId">
          <el-input v-model="dataForm.goodsId" />
        </el-form-item>
        <el-form-item label="任务奖励" prop="award">
          <el-input v-model="dataForm.award" />
        </el-form-item>
        <el-form-item label="任务数量" prop="rewardMember">
          <el-input v-model="dataForm.rewardMember" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
import { listReward, createReward, deleteReward, editReward } from '@/api/reward'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RewardRule',
  components: { BackToTop, Pagination },
  filters: {
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
			// 显示搜索条件
			showSearch: true,
      list: [],
      total: 0,
      dialogStatus: '',
      listLoading: true,
      downloadLoading: false,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        goodsId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        goodsId: '',
        award: '',
        rewardMember: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        goodsId: [{ required: true, message: '商品不能为空', trigger: 'blur' }],
        award: [{ required: true, message: '奖励金额不能为空', trigger: 'blur' }],
        rewardMember: [{ required: true, message: '活动数量不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listReward(this.listQuery).then(response => {
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

    resetForm() {
      this.dataForm = {
        id: undefined,
        goodsId: '',
        award: '',
        rewardMember: ''
      }
    },

    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createReward(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '创建赏金活动成功'
            })
            this.getList()
          })
        }
      })
    },

    handleDetail(row) {
      this.$router.push({ path: 'rewardActivity', query: { id: row.id }})
    },

    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editReward(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新赏金活动规则成功'
            })
            this.getList()
          })
        }
      })
    },

    handleDelete(row) {
      this.$confirm('确定删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteReward(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除赏金活动规则成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },

    handleDownload() {
      this.downloadLoading = true
        import('@/utils/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品序号', '名称', '商品图片', '商品价格', '任务奖励', '任务数量']
          const filterVal = ['id', 'name', 'pic_url', 'goods_price', 'reward', 'rewardMember']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '赏金活动信息')
          this.downloadLoading = false
        })
    }
  }
}
</script>

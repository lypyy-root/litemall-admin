<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>
        
        <el-form-item label="用户序号">
          <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户序号"/>
        </el-form-item>

        <el-form-item label="商品序号">
          <el-input v-model="listQuery.valueId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品序号"/>
        </el-form-item>
        
        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="收藏序号" prop="id" sortable/>

      <el-table-column align="center" label="用户序号" prop="userId"/>

      <el-table-column align="center" label="内容序号" prop="valueId"/>

      <el-table-column align="center" label="收藏类型" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type == 0 ? "商品": "专题"}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称" prop="name"/>

      <el-table-column align="center" label="价格" prop="price"/>

      <el-table-column align="center" property="picUrl" label="图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" v-if="scope.row.picUrl" style="width: 40px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加时间" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listCollect } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Collect',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        valueId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listCollect(this.listQuery).then(response => {
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
        userId: '',
        valueId: '',
        addTime: undefined
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户序号', '商品序号', '添加时间']
        const filterVal = ['userId', 'valueId', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户收藏信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>

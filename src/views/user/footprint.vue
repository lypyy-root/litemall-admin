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
          <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品序号"/>
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
      <el-table-column align="center" label="足迹序号" prop="id" sortable/>

      <el-table-column align="center" label="用户序号" prop="userId"/>

      <el-table-column align="center" label="商品序号" prop="goodsId"/>

      <el-table-column align="center" label="商品名称" prop="name"/>

      <el-table-column align="center" label="商品简介" prop="brief"/>

      <el-table-column align="center" property="picUrl" label="商品图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" v-if="scope.row.picUrl" style="width: 40px;" />
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="商品价格" prop="retailPrice">
        <template slot-scope="scope">
          {{ scope.row.retailPrice }}元
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="浏览次数" prop="version">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.version + 1 }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加时间" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listFootprint } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'FootPrint',
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
        goodsId: undefined,
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
      listFootprint(this.listQuery).then(response => {
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
        const tHeader = ['用户序号', '商品序号', '添加时间']
        const filterVal = ['userId', 'goodsId', 'addTime']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '用户收藏信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>

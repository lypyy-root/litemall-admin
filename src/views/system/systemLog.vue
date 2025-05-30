<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">

        <el-form-item label="文件名称">
          <el-input v-model="listQuery.fileName" clearable class="filter-item" style="width: 200px;" placeholder="输入文件名称" />
        </el-form-item>

        <el-form-item label="文件地址">
          <el-input v-model="listQuery.filePath" clearable class="filter-item" style="width: 200px;" placeholder="输入文件地址" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/role/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="文件名称" prop="fileName" sortable />

      <el-table-column align="center" label="文件类型" prop="fileType" />

      <el-table-column align="center" label="文件大小" prop="sizeText" />

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/role/update']" type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>


<style>
.el-dialog {
  width: 1000px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
.el-form-item--medium .el-form-item__content {
    line-height: 0px;
}
</style>


<script>
import { listSysytmLog , readSysytmLog } from '@/api/log'
import Pagination from '@/components/Pagination'
import { getToken , getTenantId } from '@/utils/auth'

export default {
  name: 'systemLog',
  components: { Pagination },
  data() {
    return {
      showSearch: true,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {},
      downloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
      listSysytmLog(this.listQuery).then(response => {
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

    handleDetail(row) {
      this.$router.push({ path: 'ueditor', query: { filePath: row.filePath }})
    },

  }
}
</script>

<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="操作管理员">
          <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入操作管理员"/>
        </el-form-item>

        <el-form-item label="操作类别">
          <el-select v-model="listQuery.type" clearable style="width: 200px" class="filter-item" placeholder="请选择操作类别">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="操作状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择操作状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/log/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="操作管理员" prop="admin"/>

      <el-table-column align="center" label="IP地址" prop="ip">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.ip}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作时间" prop="addTime"/>
      <el-table-column align="center" label="操作类别" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作动作" prop="action"/>
      <el-table-column align="center" label="操作状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger' ">{{ scope.row.status ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日志详情" prop="result">
        <template slot-scope="scope">
          <el-dialog :visible.sync="resultDialogVisible" title="日志详情">
            <div v-html="resultDetail" />
          </el-dialog>
          <el-button type="primary" size="mini" @click="showResult(scope.row.result)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注信息" prop="comment"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listLog } from '@/api/log'
import Pagination from '@/components/Pagination'

const typeMap = {
  0: '一般操作',
  1: '安全操作',
  2: '订单操作',
  3: '其他操作'
}

const defaultTypeOptions = [
  {
    label: '一般操作',
    value: 0
  },
  {
    label: '安全操作',
    value: 1
  },
  {
    label: '订单操作',
    value: 2
  },
  {
    label: '其他操作',
    value: 3
  }
]

const defaultStatusOptions = [
  {
    label: '失败',
    value: false
  },
  {
    label: '成功',
    value: true
  }
]

export default {
  name: 'Log',
  components: { Pagination },
  filters: {
    typeFilter(type) {
      return typeMap[type]
    }
  },

  data() {
    return {
      typeOptions: Object.assign({}, defaultTypeOptions),
      statusOptions: Object.assign({}, defaultStatusOptions),
      list: null,
      total: 0,
      listLoading: true,
      resultDetail: '',
      resultDialogVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        status: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listLog(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },

    showResult(result) {
      this.resultDetail = result;
      this.resultDialogVisible = true;
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

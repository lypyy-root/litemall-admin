<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>
        
        <el-form-item label="租户名称">
          <el-input v-model="listQuery.address" clearable class="filter-item" style="width: 200px;" placeholder="请输入租户名称" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/tenant/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/tenant/create']"
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
      <el-table-column align="center" label="序号" prop="id" sortable />

      <el-table-column align="center" label="租户地址" prop="address" min-width="100">
        <template slot-scope="scope">
          <el-tag type="primary"> {{ scope.row.address }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="appId" prop="appId" />

      <el-table-column align="center" label="appSecret" prop="appSecret" />

      <el-table-column align="center" label="添加日期" prop="addTime" />

      <el-table-column align="center" label="修改日期" prop="updateTime" />

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/tenant/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/tenant/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="150px">
        <el-form-item label="租户地址:" prop="address">
          <el-input v-model="dataForm.address" placeholder="请输入租户地址"/>
        </el-form-item>
        <el-form-item label="appId:" prop="appId">
          <el-input v-model="dataForm.appId" placeholder="请输入appId"/>
        </el-form-item>
        <el-form-item label="appSecret:" prop="appSecret">
          <el-input v-model="dataForm.appSecret" placeholder="请输入appSecret"/>
        </el-form-item>
        <el-form-item label="token:" prop="token">
          <el-input v-model="dataForm.token" placeholder="请输入token"/>
        </el-form-item>
        <el-form-item label="aesKey:" prop="aesKey">
          <el-input v-model="dataForm.aesKey" placeholder="请输入aesKey"/>
        </el-form-item>
        <el-form-item label="mchId:" prop="mchId">
          <el-input v-model="dataForm.mchId" placeholder="请输入mchId"/>
        </el-form-item>
        <el-form-item label="mchKey:" prop="mchKey">
          <el-input v-model="dataForm.mchKey" placeholder="请输入mchKey"/>
        </el-form-item>
        <el-form-item label="keyPath:" prop="keyPath">
          <el-input v-model="dataForm.keyPath" placeholder="请输入keyPath"/>
        </el-form-item>
        <el-form-item label="apiV3Key:" prop="apiV3Key">
          <el-input v-model="dataForm.apiV3Key" placeholder="请输入apiV3Key"/>
        </el-form-item>
        <el-form-item label="privateCertPath:" prop="privateCertPath">
          <el-input v-model="dataForm.privateCertPath" placeholder="请输入privateCertPath"/>
        </el-form-item>
        <el-form-item label="privateKeyPath:" prop="privateKeyPath">
          <el-input v-model="dataForm.privateKeyPath" placeholder="请输入privateKeyPath"/>
        </el-form-item>
        <el-form-item label="jdbcUrl:" prop="jdbcUrl">
          <el-input v-model="dataForm.jdbcUrl" placeholder="请输入jdbcUrl"/>
        </el-form-item>
        <el-form-item label="username:" prop="username">
          <el-input v-model="dataForm.username" placeholder="请输入username"/>
        </el-form-item>
        <el-form-item label="password:" prop="password">
          <el-input v-model="dataForm.password" placeholder="请输入password"/>
        </el-form-item>
        <el-form-item label="driverClassName:" prop="driverClassName">
          <el-input v-model="dataForm.driverClassName" placeholder="请输入driverClassName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus ==='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.tenant-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.tenant-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.tenant-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.tenant {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { listTenant, createTenant, deleteTenant , updateTenant } from '@/api/tenant'
import { getToken , getTenantId } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Tenant',
  components: { Pagination },
  data() {
    return {
			// 显示搜索条件
			showSearch: true,
      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dataForm: {
        id: undefined,
        address: undefined,
        addTime: undefined,
        updateTime: undefined,
        deleted: undefined,
      },
      rules: {
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        appId: [{ required: true, message: 'appId不能为空', trigger: 'blur' }],
        appSecret: [{ required: true, message: 'appSecret不能为空', trigger: 'blur' }],
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
      listTenant(this.listQuery).then(response => {
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
        address: undefined,
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createTenant(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '租户添加成功'
            })
            this.getList()
          })
        }
      })
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateTenant(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '租户修改成功'
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
        deleteTenant(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '租户删除成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },

  }
}
</script>

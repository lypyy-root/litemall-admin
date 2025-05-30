<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="店铺名称">
          <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入店铺名称"/>
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/brand/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/brand/create']"
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
      <el-table-column align="center" label="店铺序号" prop="id"/>

      <el-table-column align="center" label="店铺名称" prop="name" :show-overflow-tooltip="true"/>

      <el-table-column align="center" property="picUrl" label="店铺图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" style="width: 60px;height: 60px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="300px" label="介绍" prop="depict" :show-overflow-tooltip="true"/>

      <el-table-column align="center" label="底价" prop="floorPrice"/>

      <el-table-column align="center" label="权重" prop="weight" />

      <el-table-column align="center" label="店铺状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status != 0 ?'warning':'success'">{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/order/list']" type="warning" size="mini" @click="handleOrder(scope.row)">订单</el-button>
          <el-button v-permission="['POST /admin/goods/list']" type="success" size="mini" @click="handleGoods(scope.row)">商品</el-button>
          <el-button v-permission="['POST /admin/brand/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/brand/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>

        <el-form-item label="介绍" prop="depict">
          <el-input v-model="dataForm.depict"/>
        </el-form-item>

        <el-form-item label="通知邮箱" prop="mail">
          <el-input v-model="dataForm.mail"/>
        </el-form-item>

        <el-form-item label="店铺图片" prop="picUrl">
          <ImageUpload :limit="1" :value="dataForm.picUrl" @input="uploadPicUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="底价" prop="floorPrice">
          <el-input v-model="dataForm.floorPrice"/>
        </el-form-item>

        <el-form-item label="权重" prop="weight">
          <el-input v-model="dataForm.weight"/>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>

</style>

<script>
import { listBrand, createBrand, updateBrand, deleteBrand } from '@/api/brand'
import { uploadPath } from '@/api/storage'
import { getToken , getTenantId } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Brand',
  components: { Pagination },
  filters: {
    formatStatus(status) {
      if (status === 0) {
        return '可用'
      } else if (status === 1) {
        return '禁用'
      } else {
        return '注销'
      }
    }
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      statusDic: ['可用', '禁用', '注销'],
      uploadPath,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: '',
        depict: '',
        trueName: '',
        floorPrice: undefined,
        picUrl: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '店铺名称不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    headers() {
      return {
        "X-Litemall-Admin-Token" : getToken(),
        "X-Litemall-TenantId" : getTenantId(),
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listBrand(this.listQuery).then(response => {
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
        name: undefined,
        depict: undefined,
        floorPrice: undefined,
        picUrl: undefined
      }
    },

    handleOrder(row) {
      this.$router.push({ path: '/order/order', query: { brandId: row.id }})
    },

    handleGoods(row) {
      this.$router.push({ path: '/goods/list', query: { brandId: row.id }})
    },

    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    uploadPicUrl: function(response) {
      this.dataForm.picUrl = response;
    },

    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createBrand(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '创建成功'
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
          updateBrand(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新成功'
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
        deleteBrand(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '店铺序号',
          '店铺名称',
          '介绍',
          '低价',
          '店铺图片'
        ]
        const filterVal = ['id', 'name', 'depict', 'floorPrice', 'picUrl']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '店铺信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>

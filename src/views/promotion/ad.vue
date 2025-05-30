<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="广告标题">
          <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入广告标题" />
        </el-form-item>

        <el-form-item label="广告内容">
          <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" placeholder="请输入广告内容" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/ad/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/ad/create']"
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

      <el-table-column align="center" label="广告序号" prop="id" sortable />

      <el-table-column align="center" label="广告标题" prop="name" />

      <el-table-column align="center" label="广告内容" prop="content" />

      <el-table-column align="center" label="广告图片" prop="url">
        <template slot-scope="scope">
          <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" v-if="scope.row.url" style="width: 80px;height: 40px" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="广告位置" prop="position" />

      <el-table-column align="center" label="活动链接" prop="link" />

      <el-table-column align="center" label="权重" prop="weight" />

      <el-table-column align="center" label="是否启用" prop="enabled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'error' ">{{ scope.row.enabled ? '启用' : '不启用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/ad/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/ad/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="广告标题" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>

        <el-form-item label="广告内容" prop="content">
          <el-input v-model="dataForm.content" />
        </el-form-item>

        <el-form-item label="广告图片" prop="url">
          <ImageUpload :limit="1" :value="dataForm.url" @input="uploadUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="广告位置" prop="position">
          <el-select v-model="dataForm.position" placeholder="请选择">
            <el-option :value="1" label="首页" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动链接" prop="link">
          <el-input v-model="dataForm.link" />
        </el-form-item>

        <el-form-item label="权重" prop="weight">
          <el-input v-model="dataForm.weight"/>
        </el-form-item>

        <el-form-item label="是否启用" prop="enabled">
          <el-select v-model="dataForm.enabled" placeholder="请选择">
            <el-option :value="true" label="启用" />
            <el-option :value="false" label="不启用" />
          </el-select>
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
import { listAd, createAd, updateAd, deleteAd } from '@/api/ad'
import { uploadPath } from '@/api/storage'
import { getToken , getTenantId } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Ad',
  components: { Pagination },
  data() {
    return {
			// 显示搜索条件
			showSearch: true,
      uploadPath,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        content: undefined,
        url: undefined,
        link: undefined,
        position: 1,
        enabled: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '广告标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '广告内容不能为空', trigger: 'blur' }
        ],
        url: [{ required: true, message: '广告链接不能为空', trigger: 'blur' }]
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
      listAd(this.listQuery).then(response => {
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
        content: undefined,
        url: undefined,
        link: undefined,
        position: 1,
        enabled: true
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

    uploadUrl: function(response) {
      this.dataForm.url = response;
    },

    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAd(this.dataForm).then(response => {
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
          updateAd(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新广告成功'
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
        deleteAd(row.id).then(response => {
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
          '广告序号',
          '广告标题',
          '广告内容',
          '广告图片',
          '广告位置',
          '活动链接',
          '是否启用'
        ]
        const filterVal = [
          'id',
          'name',
          'content',
          'url',
          'postion',
          'link',
          'enabled'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '广告信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>

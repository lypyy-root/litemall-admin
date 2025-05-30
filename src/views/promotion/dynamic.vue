<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="用户序号">
          <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户序号" />
        </el-form-item>

        <el-form-item label="动态内容">
          <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" placeholder="请输入动态内容" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/dynamic/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/dynamic/create']"
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

      <el-table-column align="center" label="动态序号" prop="id" sortable />

      <el-table-column align="center" label="用户序号" prop="userId" />

      <el-table-column align="center" label="用户昵称" prop="nickName" />

      <el-table-column align="center" label="用户头像" prop="avatarUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatarUrl" :preview-src-list="[scope.row.avatarUrl]" v-if="scope.row.avatarUrl" style="width: 40px;height: 40px" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="动态图片" prop="picUrls">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrls[0]" :preview-src-list="scope.row.picUrls" v-if="scope.row.picUrls[0]" style="width: 40px;height: 40px" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="点赞量" prop="likeCount" />

      <el-table-column align="center" label="访问量" prop="lookCount" />

      <el-table-column align="center" label="管理员" prop="isAdmin">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isAdmin ? 'success' : 'error' ">{{ scope.row.isAdmin ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加日期" prop="addTime" />

      <el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/dynamic/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/dynamic/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:20px;">
        <el-form-item label="用户序号" prop="userId">
          <el-input v-model="dataForm.userId" />
        </el-form-item>

        <el-form-item label="动态内容" prop="content">
          <el-input v-model="dataForm.content" :autosize="{ minRows: 6, maxRows: 8}" type="textarea"/>
        </el-form-item>

        <el-form-item label="动态图片" prop="picUrls">
          <ImageUpload :limit="3" :value="dataForm.picUrls" @input="handleGalleryUrl"></ImageUpload>
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
import { listDynamic, createDynamic, updateDynamic, deleteDynamic } from '@/api/dynamic'
import { uploadPath } from '@/api/storage'
import { getToken , getTenantId } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Dynamic',
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
        userId: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        userId: undefined,
        content: undefined,
        picUrls: [],
        isAdmin: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        userId: [
          { required: true, message: '用户序号不能为空', trigger: 'blur' }
        ],
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
      listDynamic(this.listQuery).then(response => {
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
        userId: undefined,
        content: undefined,
        picUrls: [],
        isAdmin: true
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

    handleGalleryUrl(val) {
      this.dataForm.picUrls = Array.isArray(val) ? val : val.split(',');
    },

    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createDynamic(this.dataForm).then(response => {
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {

          console.log(this.dataForm)
          updateDynamic(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新动态成功'
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
        deleteDynamic(row.id).then(response => {
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
          '动态序号',
          '用户序号',
          '动态内容',
          '动态图片',
          '管理员'
        ]
        const filterVal = [
          'id',
          'userId',
          'content',
          'picUrls',
          'isAdmin'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '动态信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>

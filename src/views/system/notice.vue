<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>
        
        <el-form-item label="标题关键字">
          <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入标题关键字" />
        </el-form-item>

        <el-form-item label="内容关键字">
          <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" placeholder="请输入内容关键字" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/notice/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/notice/create']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleBatchDelete"
            v-permission="['GET /admin/notice/batch-delete']"
          >删除</el-button>
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
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />

      <el-table-column align="center" label="通知标题" prop="title" />

      <el-table-column align="center" label="通知详情" prop="content">
        <template slot-scope="scope">
          <el-dialog :visible.sync="contentDialogVisible" title="通知详情">
            <div v-html="contentDetail" />
          </el-dialog>
          <el-button type="primary" size="mini" @click="showContent(scope.row.content)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加时间" prop="addTime" />

      <el-table-column align="center" label="管理员序号" prop="adminId" />

      <el-table-column align="center" label="操作" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/notice/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/notice/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px">
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <editor v-model="dataForm.content" :init="editorInit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
import { listNotice, createNotice, updateNotice, deleteNotice, batchDeleteNotice } from '@/api/notice'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import _ from 'lodash'
import Editor from '@tinymce/tinymce-vue'
import { createStorage } from '@/api/storage'
import { getToken , getTenantId } from '@/utils/auth'

export default {
  name: 'Notice',
  components: { BackToTop, Pagination, Editor },
  data() {
    return {
			// 显示搜索条件
			showSearch: true,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      multipleSelection: [],
      contentDetail: '',
      contentDialogVisible: false,
      dataForm: {
        id: undefined,
        title: undefined,
        content: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '通知标题不能为空', trigger: 'blur' }
        ]
      },
      editorInit: {
        language: 'zh_CN',
        height: 200,
        convert_urls: false,
        plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData).then(response => {
            success(response.data.url)
          }).catch(() => {
            failure('上传失败，请重新上传')
          })
        }
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
      listNotice(this.listQuery).then(response => {
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
        title: undefined,
        content: undefined
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
          createNotice(this.dataForm).then(response => {
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
          updateNotice(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新广告成功'
            })
            this.getList();
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
        deleteNotice(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除通知成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    showContent(content) {
      this.contentDetail = content
      this.contentDialogVisible = true
    },

    handleBatchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择至少一条记录')
        return
      }
      const ids = []
      _.forEach(this.multipleSelection, function(item) {
        ids.push(item.id)
      })
      batchDeleteNotice({ids : ids}).then(response => {
        this.$notify.success({
          title: '成功',
          message: '批量删除通知成功'
        })
        this.getList()
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '通知序号',
          '通知标题',
          '管理员序号',
          '添加时间',
          '更新时间'
        ]
        const filterVal = [
          'id',
          'title',
          'content',
          'adminId',
          'addTime',
          'updateTime'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '通知')
        this.downloadLoading = false
      })
    }
  }
}
</script>

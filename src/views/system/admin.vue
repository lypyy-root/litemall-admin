<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="管理员账号">
          <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入管理员账号" />
        </el-form-item>

        <el-form-item label="管理员手机号">
          <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入管理员手机号" />
        </el-form-item>

        <el-form-item label="管理员邮箱">
          <el-input v-model="listQuery.mail" clearable class="filter-item" style="width: 200px;" placeholder="请输入管理员邮箱" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/admin/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/admin/create']"
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
      <el-table-column align="center" label="管理员序号" prop="id" sortable />

      <el-table-column align="center" label="管理员账号" prop="username" />

      <el-table-column align="center" label="管理员邮箱" prop="mail" />

      <el-table-column align="center" label="管理员电话" prop="mobile" />

      <el-table-column align="center" label="用户openid" prop="openid" />

      <el-table-column align="center" label="管理员头像" prop="avatar">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" v-if="scope.row.avatar" style="width: 40px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="管理员角色" prop="roleIds">
        <template slot-scope="scope">
          <el-tag v-for="roleId in scope.row.roleIds" :key="roleId" type="primary"> {{ formatValue(roleId , roleOptions) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否在线" prop="checkLogin">
        <template slot-scope="scope">
          <el-tag :type="scope.row.checkLogin ? 'success' : 'danger'"> {{ scope.row.checkLogin ? '在线' : '离线' }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/admin/logout']" type="success" size="mini" @click="handleLogout(scope.row)">强退</el-button>
          <el-button v-permission="['POST /admin/admin/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/admin/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="管理员账号" prop="username">
          <el-input v-model="dataForm.username" />
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="管理员邮箱" prop="mail">
          <el-input v-model="dataForm.mail" />
        </el-form-item>
        <el-form-item label="管理员电话" prop="mobile">
          <el-input v-model="dataForm.mobile" />
        </el-form-item>
        <el-form-item label="管理员头像" prop="avatar">
          <ImageUpload :limit="1" :value="dataForm.avatar" @input="uploadInputImage"></ImageUpload>
        </el-form-item>
        <el-form-item label="用户openid" prop="openid">
          <el-input v-model="dataForm.openid" />
        </el-form-item>
        <el-form-item label="管理员角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" multiple placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员token" prop="loginToken">
          <el-input v-model="dataForm.loginToken" />
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

</style>

<script>
import { listAdmin, createAdmin, updateAdmin, deleteAdmin , logoutAdmin} from '@/api/admin'
import { roleOptions } from '@/api/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
			// 显示搜索条件
			showSearch: true,
      list: null,
      total: 0,
      roleOptions: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        mail: undefined,
        mobile: undefined,
        openid: undefined,
        avatar: undefined,
        roleIds: [],
        tenantId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        mail: [
          { required: true, message: '管理员邮箱不能为空', trigger: 'blur' },
          { pattern: '[1-9][0-9]{5,10}@qq.com' , message: '请正确输入QQ邮箱' }
        ],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },

  created() {
    this.getList()
    roleOptions().then(response => {
      this.roleOptions = response.data.list;
    })
  },
  methods: {

    formatValue(value , options) {
      for (let i = 0; i < options.length; i++) {
        if (value == options[i].value) {
          return options[i].label
        }
      }
      return ''
    },

    getList() {
      this.listLoading = true
      listAdmin(this.listQuery).then(response => {
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
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      }
    },

    //获取文件上传回调
    uploadInputImage(res){
      this.dataForm.avatar = res;
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
          createAdmin(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '添加管理员成功'
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
          updateAdmin(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新管理员成功'
            })
            this.getList();
          })
        }
      })
    },

    handleLogout(row){
      this.$confirm('确定强制退出登录?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        logoutAdmin(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '管理员强制退出成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },

    handleDelete(row) {
      this.$confirm('确定删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteAdmin(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除管理员成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/utils/vendor/Export2Excel').then(excel => {
        const tHeader = ['管理员序号', '管理员邮箱', '管理员头像']
        const filterVal = ['id', 'username', 'avatar']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '管理员信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>

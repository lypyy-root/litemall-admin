<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="用户序号">
          <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户Id"/>
        </el-form-item>

        <el-form-item label="邀请者序号">
          <el-input v-model="listQuery.inviter" clearable class="filter-item" style="width: 200px;" placeholder="请输入邀请者序号"/>
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
        </el-form-item>

        <el-form-item label="用户等级">
          <el-select v-model="listQuery.level" clearable style="width: 200px" class="filter-item" placeholder="请选择用户等级">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
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
      <el-table-column align="center" width="100px" label="用户序号" prop="id" sortable/>

      <el-table-column align="center" label="邀请者" prop="inviter">
        <template slot-scope="scope">
          <el-tag >{{ scope.row.inviter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户昵称" prop="nickName"/>

      <el-table-column align="center" label="用户头像" width="80">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户等级" prop="userLevel">
        <template slot-scope="scope">
          <el-tag :type="scope.row.userLevel == 0 ?'primary':'success'">{{ levelDic[scope.row.userLevel] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户余额" prop="integral"/>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 0 ?'success':'danger'">{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加时间" prop="addTime"/>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleShare(scope.row)">分享</el-button>
          
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 用户编辑对话框 -->
    <el-dialog :visible.sync="userDialogVisible" title="用户编辑">
      <el-form ref="userDetail" :model="userDetail" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="邀请者" prop="inviter">
          <el-input v-model="userDetail.inviter" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userDetail.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userDetail.nickname" />
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="userDetail.mobile" />
        </el-form-item>
        <el-form-item label="用户性别" prop="gender">
          <el-select v-model="userDetail.gender" placeholder="请选择"><el-option v-for="(item, index) in genderDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
        <el-form-item label="用户等级" prop="userLevel">
          <el-select v-model="userDetail.userLevel" placeholder="请选择"><el-option v-for="(item, index) in levelDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
        <el-form-item label="用户余额" prop="integral">
          <el-input v-model="userDetail.integral" />
        </el-form-item>

        <el-form-item label="账号状态" prop="status">
          <el-select v-model="userDetail.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUserUpdate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/salesmanUser'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination


const defaultLevelOptions = [
  {
    label: '普通用户',
    value: 0
  },
  {
    label: 'VIP用户',
    value: 1
  },
  {
    label: '高级VIP用户',
    value: 2
  }
]

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      levelOptions: Object.assign({}, defaultLevelOptions),
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        level: undefined,
        inviter: undefined,
        mobile: undefined,
        userId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false,
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
      statusDic: ['可用', '禁用', '注销'],
      userDialogVisible: false,
      userDetail:{}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if(this.listQuery.userId){
        userDetail(this.listQuery.userId).then(response => {
          this.list = [];
          if(response.data){
            this.list.push(response.data)
            this.total = 1
            this.listLoading = false
          }else{
            this.list = []
            this.total = 0
            this.listLoading = false
          }
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      }else{
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    },

    handleDetail(row) {
      this.userDetail = row
      this.userDialogVisible = true
    },

    handleShare(row){
      this.$router.push({ path: 'userShare', query: { id: row.id }})
    },

    handleDeal(row){
      this.$router.push({ path: 'userDeal', query: { id: row.id }})
    },

    handleUserUpdate(){
      updateUser(this.userDetail).then((response) => {
        this.userDialogVisible = false
        this.$notify.success({
          title: '成功',
          message: '更新用户成功'
        })
        this.getList()
      })
    }
  }
}
</script>

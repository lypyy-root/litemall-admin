<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleCreate"
            v-permission="['POST /admin/category/create']"
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
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row row-key="id">
      <el-table-column align="center" label="类目序号" prop="id"/>
      <el-table-column align="center" label="类目名" prop="name"/>
      <el-table-column align="center" property="iconUrl" label="类目图标">
        <template slot-scope="scope">
          <el-image :src="scope.row.iconUrl" :preview-src-list="[scope.row.iconUrl]" style="width: 40px;" />
        </template>
      </el-table-column>
      <el-table-column align="center" property="picUrl" label="类目图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" style="width: 80px; height: 40px;" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="关键字" prop="keywords"/>
      <el-table-column align="center" min-width="100" label="简介" prop="depict"/>
      <el-table-column align="center" label="级别" prop="level">
        <template slot-scope="scope">
          <el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info' ">{{ scope.row.level === 'L1' ? '一级类目' : '二级类目' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权重" prop="weight" />
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/category/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/category/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>

        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="dataForm.keywords"/>
        </el-form-item>

        <el-form-item label="级别" prop="level">
          <el-select v-model="dataForm.level" @change="onLevelChange">
            <el-option label="一级类目" value="L1"/>
            <el-option label="二级类目" value="L2"/>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="pid">
          <el-select v-model="dataForm.pid">
            <el-option v-for="item in catL1" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="品牌" prop="salesScenarioIds">
          <el-select v-model="dataForm.salesScenarioIds" multiple @change="onBrandChange">
            <el-option
              v-for="item in salesScenarioList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类目图标" prop="iconUrl">
          <ImageUpload :limit="1" :value="dataForm.iconUrl" @input="uploadIconUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="类目图片" prop="picUrl">
          <ImageUpload :limit="1" :value="dataForm.picUrl" @input="uploadPicUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="类目简介" prop="depict">
          <el-input v-model="dataForm.depict"/>
        </el-form-item>

        <el-form-item label="权重" prop="weight">
          <el-input v-model="dataForm.weight"/>
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

<script>
import { listCategory, listCatL1, createCategory, updateCategory, deleteCategory, getSalesScenarioList } from '@/api/category'
import { uploadPath } from '@/api/storage'
import { getToken , getTenantId } from '@/utils/auth'

export default {
  name: 'Category',
  data() {
    return {
      showSearch: true,
      uploadPath,
      list: [],
      listLoading: true,
      catL1: {},
      salesScenarioList: [], // 品牌列表
      dataForm: {
        id: undefined,
        name: '',
        keywords: '',
        level: 'L2',
        pid: 0,
        salesScenarioIds: [], // 这里修改为数组，用于存储多个选中的品牌
        depict: '',
        iconUrl: '',
        picUrl: '',
        weight: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '类目名不能为空', trigger: 'blur' }]
      }
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
    this.getCatL1()
    this.getSalesScenarioList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listCategory().then(response => {
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    },
    getCatL1() {
      listCatL1().then(response => {
        this.catL1 = response.data.list
      })
    },
    getSalesScenarioList() {
      getSalesScenarioList().then(response => {
        this.salesScenarioList = response.data.list
      })
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        keywords: '',
        level: 'L2',
        pid: 0,
        salesScenarioIds: [], // 重置为数组
        depict: '',
        iconUrl: '',
        picUrl: '',
        weight: ''
      }
    },
    onLevelChange(value) {
      if (value === 'L1') {
        this.dataForm.pid = 0
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
    uploadIconUrl(response) {
      this.dataForm.iconUrl = response
    },
    uploadPicUrl(response) {
      this.dataForm.picUrl = response
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$delete(this.dataForm, 'children')
          const categoryData = {
            category: this.dataForm,
            salesScenarioIds: this.dataForm.salesScenarioIds // 传递多个品牌ID
          };
          createCategory(categoryData).then(() => {
            this.getList()
            this.getCatL1()
            this.dialogFormVisible = false
            this.$notify.success({ title: '成功', message: '创建成功' })
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
          this.$delete(this.dataForm, 'children');
          const categoryData = {
            category: this.dataForm,
            salesScenarioIds: this.dataForm.salesScenarioIds // 传递多个品牌ID
          };
          updateCategory(categoryData).then(() => {
            this.getList();
            this.getCatL1();
            this.dialogFormVisible = false;
            this.$notify.success({ title: '成功', message: '更新成功' });
          });
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
        this.$delete(row, 'children')
        deleteCategory(row.id).then(() => {
          this.getList()
          this.getCatL1()
          this.$notify.success({ title: '成功', message: '删除成功' })
        })
      }).catch(() => {})
    },
    onBrandChange(value) {salesScenarioIds
      this.dataForm.salesScenarioIds = value; // 更新品牌ID数组
    }
  }
}
</script>

<style scoped>
</style>

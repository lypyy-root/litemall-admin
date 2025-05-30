<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="对象KEY">
          <el-input v-model="listQuery.key" clearable class="filter-item" style="width: 200px;" placeholder="请输入对象KEY" />
        </el-form-item>

        <el-form-item label="对象名称">
          <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入对象名称" />
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/storage/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/storage/create']"
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

      <el-table-column align="center" label="对象KEY" prop="key" />

      <el-table-column align="center" label="对象名称" prop="name" />

      <el-table-column align="center" label="对象类型" prop="type" />

      <el-table-column align="center" label="对象大小" prop="size">
        <template slot-scope="scope">
          {{  Number((scope.row.size / 1024 / 1024).toFixed(2)) }} M
        </template>
      </el-table-column>

      <el-table-column align="center" property="url" label="图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" v-if="scope.row.url" style="width: 40px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片链接" prop="url" />

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/storage/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :before-close="handleClose">
      <el-upload ref="upload" accept=".jpg, .png, .gif" :auto-upload="false" drag
                 name="file"
                 :multiple="true"
                 :limit="upload.size"
                 :headers="upload.headers"
                 :action="upload.uploadPath"
                 :data="upload.data"
                 :file-list="fileList"
                 :disabled="upload.isUploading"
                 :on-remove="handleRemove"
                 :on-change="handleFileChange"
                 :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或 <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">
          <template v-if="upload.size"> 文件最大上传数量 【 {{upload.size}} 】</template>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpload">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listStorage, createStorage, updateStorage, deleteStorage } from '@/api/storage'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken , getTenantId } from '@/utils/auth';
import { uploadPath } from '@/api/storage';


export default {
  name: 'Storage',
  components: { Pagination },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      fileList: [],
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      // 用户导入参数
      upload: {
        open: false, // 是否显示弹出层
        size: 3,     //上传文件数量
        title: "文件上传", // 弹出层标题
        isUploading: false, // 是否禁用上传
        uploadPath: uploadPath, // 请求地址
        headers: {
          "X-Litemall-Admin-Token" : getToken(),
          "X-Litemall-TenantId" : getTenantId(),
        },
        data: {} // 上传的额外数据，用于文件名
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
      listStorage(this.listQuery).then(response => {
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
      this.listQuery.page = 1;
      this.getList()
    },

    /** 新增按钮操作 */
    handleCreate() {
      this.upload.open = true;
    },

    /** 处理文件上传中 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true; // 禁止修改
    },

    /** 处理上传的文件发生变化 */
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      if(fileList.length >= this.upload.size){
        this.upload.isUploading = true; // 禁止修改
      }else{
        this.upload.isUploading = false; // 可以修改
      }
    },

    /** 发起文件上传 */
    handleUpload() {
      this.$refs.upload.submit();
    },

    // 删除文件
    handleRemove(file, fileList) {
      const findex = fileList.map(f => f.name).indexOf(file.name);
      if(findex > -1) {
        fileList.splice(findex, 1);
      }
    },

    /**清除上传*/
    clearUpload(){
      this.fileList = [];
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
    },

    /** 文件取消上传 */
    handleClose() {
      if(this.fileList.length > 0){
        this.$confirm('文件未上传，是否确认关闭', '提示框').then(() => {
          this.clearUpload();
        }).catch(() => {
          return;
        })
        return;
      }
      this.clearUpload();
    },

    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList) {
      if (response.errno !== "success") {
        this.handleRemove(file , fileList);
        this.$modal.msgError(`文件上传失败, ` + response.errmsg);
        return;
      }
      this.clearUpload();
      this.$modal.msgSuccess("上传成功");
      this.getList();
    },

    /**对象存储删除*/
    handleDelete(row) {
      this.$confirm('确定删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteStorage(row).then(response => {
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
        const tHeader = ['序号', '对象KEY', '对象名称', '对象类型', '对象大小', '访问链接']
        const filterVal = ['id', 'key', 'name', 'type', 'size', 'url']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '对象存储信息')
        this.downloadLoading = false
      })
    }


  }
}
</script>

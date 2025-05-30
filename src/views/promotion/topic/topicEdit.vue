<template>
  <div class="app-container">

    <el-form ref="topic" :rules="rules" :model="topic" status-icon label-position="left" label-width="100px" style="width: 1000px; margin-left:50px;">
      <el-form-item label="专题标题" prop="title">
        <el-input v-model="topic.title"/>
      </el-form-item>

      <el-form-item label="专题子标题" prop="subtitle">
        <el-input v-model="topic.subtitle"/>
      </el-form-item>

      <el-form-item label="专题作者" prop="author">
        <el-input v-model="topic.author"/>
      </el-form-item>

      <el-form-item label="专题图片" prop="picUrl">
        <ImageUpload :limit="1" :value="topic.picUrl" @input="uploadPicUrl"></ImageUpload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <vue-ueditor-wrap v-model="topic.content" :config="UeditorConfig" @ready="ueditorReady"></vue-ueditor-wrap>
      </el-form-item>

      <el-form-item label="商品底价" prop="price">
        <el-input v-model="topic.price"/>
      </el-form-item>

      <el-form-item label="阅读量" prop="readCount">
        <el-input v-model="topic.readCount"/>
      </el-form-item>

      <el-form-item label="权重" prop="weight">
        <el-input v-model="topic.weight"/>
      </el-form-item>

      <el-form-item label="专题商品" prop="goodsIds">

        <el-button  size="mini" type="primary" @click="handleCreate()">添加商品</el-button>
        <!-- 查询结果 -->
        <el-table :data="goodsList" border fit highlight-current-row>

          <el-table-column align="center" label="商品序号" prop="id"/>

          <el-table-column align="center" property="picUrl" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="60">
            </template>
          </el-table-column>

          <el-table-column align="center" label="商品名称" prop="name"/>

          <el-table-column align="center" label="商品介绍" prop="brief"/>

          <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>

    <el-dialog :visible.sync="addVisiable" title="添加商品">
      <div class="search">
        <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
        <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column align="center" label="商品序号" prop="id"/>
          <el-table-column align="center" property="picUrl" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="40">
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" prop="name"/>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisiable = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.el-dialog {
  width: 800px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
.el-form-item--medium .el-form-item__content {
    line-height: 0px;
}
</style>

<script>
import { readTopic, updateTopic } from '@/api/topic'
import { listGoods } from '@/api/goods'
import { uploadPath } from '@/api/storage'
import BackToTop from '@/components/BackToTop'
import Editor from '@tinymce/tinymce-vue'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken , getTenantId } from '@/utils/auth'

export default {
  name: 'TopicEdit',
  components: { BackToTop, Editor, Pagination },
  data() {
    return {
      uploadPath,
      id: 0,
      topic: {},
      goodsList: [],
      addVisiable: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 5,
        id: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      selectedlist: [],
      rules: {
        title: [
          { required: true, message: '专题标题不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '专题作者不能为空', trigger: 'blur' }
        ],
        picUrl: [
          { required: true, message: '专题图片不能为空', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '专题子标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '专题内容不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '专题低价不能为空', trigger: 'blur' }
        ]
      },
      UeditorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // UEditor 资源文件的存放路径，
        UEDITOR_HOME_URL: '/UEditor/'
      },
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
    if (this.$route.query.id == null) {
      return
    }

    this.id = this.$route.query.id
    this.getTopic()
  },
  methods: {

    // 此方法用来处理上传图片
    ueditorReady: function (editorInstance) {
      UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
      UE.Editor.prototype.getActionUrl = function(action) {
          if (action === 'uploadimage' || action === 'uploadscrawl' || action === 'uploadimage' || action === 'uploadfile') {
              return process.env.VUE_APP_BASE_API + '/storage/uploadFile';
          } else if (action === 'uploadvideo') {
              return process.env.VUE_APP_BASE_API + '/storage/uploadFile';
          } else {
              return this._bkGetActionUrl.call(this, action);
          }
      }
    },

    getTopic() {
      this.listLoading = true
      readTopic({ id: this.id })
        .then(response => {
          this.topic = response.data.topic
          this.goodsList = response.data.goodsList
          this.listLoading = false
        })
        .catch(() => {
          this.topic = {}
          this.goodsList = []
          this.listLoading = false
        })
    },
    
    getList() {
      this.listLoading = true
      listGoods(this.listQuery).then(response => {
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
    
    handleSelectionChange(val) {
      this.selectedlist = val
    },
    
    uploadPicUrl: function(response) {
      this.topic.picUrl = response;
    },
    
    handleCreate() {
      this.listQuery = {
        page: 1,
        limit: 5,
        id: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      }
      this.list = []
      this.total = 0
      this.selectedlist = []
      this.addVisiable = true
    },
    
    confirmAdd() {
      const newGoodsIds = []
      const newGoodsList = []
      this.selectedlist.forEach(item => {
        const id = item.id
        let found = false
        this.topic.goodsIds.forEach(goodsId => {
          if (id === goodsId) {
            found = true
          }
        })
        if (!found) {
          newGoodsIds.push(id)
          newGoodsList.push(item)
        }
      })

      if (newGoodsIds.length > 0) {
        this.topic.goodsIds = this.topic.goodsIds.concat(newGoodsIds)
        this.goodsList = this.goodsList.concat(newGoodsList)
      }
      this.addVisiable = false
    },
    
    handleDelete(row) {
      for (var index = 0; index < this.topic.goodsIds.length; index++) {
        if (row.id === this.topic.goodsIds[index]) {
          this.topic.goodsIds.splice(index, 1)
        }
      }
      for (var index2 = 0; index2 < this.goodsList.length; index2++) {
        if (row.id === this.goodsList[index2].id) {
          this.goodsList.splice(index2, 1)
        }
      }
    },
    
    handleCancel() {
      this.$router.push({ path: '/promotion/topicList' })
    },
    
    handleConfirm() {
      this.$refs['topic'].validate(valid => {
        if (valid) {
          updateTopic(this.topic).then(response => {
            this.$router.push({ path: '/promotion/topicList' })
          })
        }
      })
    }
  }
}
</script>

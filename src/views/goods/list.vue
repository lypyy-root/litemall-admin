<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">

        <el-form-item label="商品编号">
          <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号" />
        </el-form-item>

        <el-form-item label="商品序号">
          <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品序号" />
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="店铺序号">
          <el-input v-model="listQuery.brandId" clearable class="filter-item" style="width: 200px;" placeholder="请输入店铺序号" />
        </el-form-item>

        <el-form-item label="商品状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择商品状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
      </el-row>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="商品编号">
              <span>{{ props.row.goodsSn }}</span>
            </el-form-item>
            <el-form-item label="宣传画廊">
              <el-image v-for="pic in props.row.gallery" :key="pic" :src="pic" class="gallery" :preview-src-list="props.row.gallery" style="width: 40px; height: 40px" />
            </el-form-item>
            <el-form-item label="商品介绍">
              <span>{{ props.row.brief }}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="关键字">
              <span>{{ props.row.keywords }}</span>
            </el-form-item>
            <el-form-item label="类目序号">
              <span>{{ props.row.categoryId }}</span>
            </el-form-item>
            <el-form-item label="品牌商序号">
              <span>{{ props.row.brandId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品序号" prop="id" />

      <el-table-column align="center" min-width="100" label="名称" prop="name" :show-overflow-tooltip="true"/>

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" style="width: 40px; height: 40px" />
        </template>
      </el-table-column>

      <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <el-image :src="scope.row.shareUrl" :preview-src-list="[scope.row.shareUrl]" style="width: 40px; height: 40px" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情" prop="detail">
        <template slot-scope="scope">
          <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
            <div class="goods-detail-box" v-html="goodsDetail" />
          </el-dialog>
          <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="市场售价" prop="counterPrice" />

      <el-table-column align="center" label="当前价格" prop="retailPrice" />

      <el-table-column align="center" label="是否新品" prop="isNew">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{ scope.row.isNew ? '新品' : '非新品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否热品" prop="isHot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isHot ? 'success' : 'error' ">{{ scope.row.isHot ? '热品' : '非热品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="权重" prop="weight" />

      <el-table-column align="center" label="商品状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'error' ">{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleDetail(scope.row)">审核</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 商品编辑对话框 -->
    <el-dialog :visible.sync="statusDialogVisible" title="商品编辑">
      <el-form ref="goods" :model="goods" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="goods.status" placeholder="请选择">
            <el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品备注" prop="remarks">
          <el-input v-model="goods.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateStatus">确定</el-button>
      </div>
    </el-dialog>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>


  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
    padding-left: 60px;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
  .goods-detail-box img {
    width: 100%;
  }
</style>

<script>

import { listGoods, deleteGoods , updateOnSale} from '@/api/goods'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultStatusOptions = [
  {
    label: '待审核',
    value: 0
  },
  {
    label: '已上架',
    value: 1
  },
  {
    label: '已下架',
    value: 2
  },
  {
    label: '已驳回',
    value: 3
  }
]
export default {
  name: 'GoodsList',
  components: { BackToTop, Pagination },
  filters: {
    formatStatus(status) {
      if (status === 0) {
        return '待审核'
      } else if (status === 1) {
        return '已上架'
      } else if (status === 2){
        return '已下架'
      } else {
        return '已驳回'
      }
    }
  },
  data() {
    return {
      statusDic: ['待审核', '已上架', '已下架','已驳回'],
      statusOptions: Object.assign({}, defaultStatusOptions),
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        goodsId: undefined,
        brandId: undefined,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goods:{},
      goodsDetail: '',
      statusDialogVisible: false,
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      this.listQuery.brandId = this.$route.query.brandId
      this.getList()
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

    handleCreate() {
      this.$router.push({ path: '/goods/create' })
    },

    handleUpdate(row) {
      this.$router.push({ path: '/goods/edit', query: { id: row.id }})
    },

    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
    },

    handleDetail(row) {
      this.goods = row
      this.statusDialogVisible = true
    },

    handleUpdateStatus(){
      updateOnSale(this.goods).then(response => {
        this.$notify.success({
          title: '成功',
          message: '更新成功'
        })
        this.statusDialogVisible = false
        this.getList()
      })
    },

    handleDelete(row) {
      this.$confirm('确定删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteGoods(row.id).then(response => {
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
        const tHeader = ['商品序号', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目序号', '品牌商序号']
        const filterVal = ['id', 'goodsSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'goodsUnit', 'keywords', 'categoryId', 'brandId']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>

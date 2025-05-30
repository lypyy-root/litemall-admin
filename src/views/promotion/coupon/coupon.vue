<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :model="listQuery" size="small" :inline="true">
        <el-form-item label="序号ID">
          <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
        </el-form-item>

        <el-form-item label="优惠券标题">
          <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入优惠券标题" />
        </el-form-item>

        <el-form-item label="优惠券类型">
          <el-select v-model="listQuery.type" clearable style="width: 200px" class="filter-item" placeholder="请选择优惠券类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="优惠券状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择优惠券状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="查询数量">
          <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
        </el-form-item>

        <el-form-item>
          <el-button v-permission="['GET /admin/coupon/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
            v-permission="['POST /admin/coupon/create']"
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

      <el-table-column align="center" label="优惠券序号" prop="id" sortable />

      <el-table-column align="center" label="优惠券名称" prop="name" />

      <el-table-column align="center" label="优惠券介绍" prop="desc" />

      <el-table-column align="center" label="优惠券标签" prop="tag" />

      <el-table-column align="center" label="最低消费" prop="min">
        <template slot-scope="scope">满{{ scope.row.min }}元可用</template>
      </el-table-column>

      <el-table-column align="center" label="满减金额" prop="discount">
        <template slot-scope="scope">减免{{ scope.row.discount }}元</template>
      </el-table-column>

      <el-table-column align="center" label="每人限领" prop="limit">
        <template slot-scope="scope">{{ scope.row.limit != 0 ? scope.row.limit : "不限" }}</template>
      </el-table-column>

      <el-table-column align="center" label="使用范围" prop="goodsType">
        <template slot-scope="scope">{{ scope.row.goodsType | formatGoodsType }}</template>
      </el-table-column>

      <el-table-column align="center" label="优惠券类型" prop="type">
        <template slot-scope="scope">{{ scope.row.type | formatType }}</template>
      </el-table-column>

      <el-table-column align="center" label="优惠券数量" prop="total">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.total != 0 ? scope.row.total : "不限" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/coupon/read']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-permission="['POST /admin/coupon/update']" type="info" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/coupon/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:20px;">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="优惠券介绍" prop="desc">
          <el-input v-model="dataForm.desc" />
        </el-form-item>
        <el-form-item label="优惠券标签" prop="tag">
          <el-input v-model="dataForm.tag" />
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input v-model="dataForm.discount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低消费" prop="min">
          <el-input v-model="dataForm.min">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每人限领" prop="limit">
          <el-input v-model="dataForm.limit">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="分发类型" prop="type">
          <el-select v-model="dataForm.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券数量" prop="total">
          <el-input v-model="dataForm.total">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期">
          <el-radio-group v-model="dataForm.timeType">
            <el-radio-button :label="0">领券相对天数</el-radio-button>
            <el-radio-button :label="1">指定绝对时间</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dataForm.timeType === 0">
          <el-input v-model="dataForm.days">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="dataForm.timeType === 1">
          <el-col :span="11">
            <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
          </el-col>
          <el-col :span="2" class="line">至</el-col>
          <el-col :span="11">
            <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="商品限制范围">
          <el-radio-group v-model="dataForm.goodsType">
            <el-radio-button :label="0">全场通用</el-radio-button>
            <el-radio-button :label="1">指定分类</el-radio-button>
            <el-radio-button :label="2">指定商品</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dataForm.goodsType === 1">
          <el-cascader
            v-model="selectGoodsCategory"
            clearable
            placeholder="请选择分类名称"
            :options="goodsCategoryOptions"
          />
          <el-button @click="handleAddGoodsCategory()">添加</el-button>
          <el-table
            ref="goodsCateRelationTable"
            :data="couponCategoryList"
            style="width: 100%;margin-top: 20px"
            border
          >
            <el-table-column label="分类名称" align="center">
              <template slot-scope="scope">{{ scope.row.parentCategoryName }}>{{ scope.row.goodsCategoryName }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDeleteGoodsCategory(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-show="dataForm.goodsType === 2">
          <el-select
            v-model="selectGoods"
            filterable
            remote
            reserve-keyword
            placeholder="商品名称/商品货号"
          >
            <el-option
              v-for="item in goodsOptions"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId"
            >
              <span style="float: left">{{ item.goodsName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.goodsSn }}</span>
            </el-option>
          </el-select>
          <el-button @click="handleAddGoods()">添加</el-button>
          <el-table
            ref="goodsRelationTable"
            :data="couponGoodsList"
            style="width: 100%;margin-top: 20px"
            border
          >
            <el-table-column label="商品名称" align="center">
              <template slot-scope="scope">{{ scope.row.goodsName }}</template>
            </el-table-column>
            <el-table-column label="商品编号" align="center" width="80">
              <template slot-scope="scope">{{ scope.row.goodsSn }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="60">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDeleteGoods(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<script>
import { listCoupon, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupon'
import { listCategory } from '@/api/category.js'
import { listGoods } from '@/api/goods.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultTypeOptions = [
  {
    label: '通用领券',
    value: 0
  },
  {
    label: '注册赠券',
    value: 1
  },
  {
    label: '兑换码',
    value: 2
  }
]

const defaultStatusOptions = [
  {
    label: '正常',
    value: 0
  },
  {
    label: '已过期',
    value: 1
  },
  {
    label: '已下架',
    value: 2
  }
]

export default {
  name: 'Coupon',
  components: { Pagination },
  filters: {
    formatType(type) {
      for (let i = 0; i < defaultTypeOptions.length; i++) {
        if (type === defaultTypeOptions[i].value) {
          return defaultTypeOptions[i].label
        }
      }
      return ''
    },
    formatGoodsType(goodsType) {
      if (goodsType === 0) {
        return '全场通用'
      } else if (goodsType === 1) {
        return '指定分类'
      } else {
        return '指定商品'
      }
    },
    formatStatus(status) {
      if (status === 0) {
        return '正常'
      } else if (status === 1) {
        return '已过期'
      } else {
        return '已下架'
      }
    }
  },
  data() {
    return {
			// 显示搜索条件
			showSearch: true,
      typeOptions: Object.assign({}, defaultTypeOptions),
      statusOptions: Object.assign({}, defaultStatusOptions),
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        status: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        desc: undefined,
        tag: undefined,
        total: 0,
        discount: 0,
        min: 0,
        limit: 1,
        type: 0,
        status: 0,
        goodsType: 0,
        goodsIds: [],
        timeType: 0,
        days: 0,
        startTime: null,
        endTime: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '优惠券标题不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '优惠券介绍不能为空', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '优惠券标签不能为空', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '优惠券金额不能为空', trigger: 'blur' }
        ],
        min: [
          { required: true, message: '最低消费不能为空', trigger: 'blur' }
        ],
        limit: [
          { required: true, message: '每人限领不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '分发类型不能为空', trigger: 'blur' }
        ],
        total: [
          { required: true, message: '优惠券数量不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      selectGoods: null,
      goodsOptions: [],
      selectGoodsCategory: null,
      goodsCategoryOptions: [],
      couponGoodsList: [],
      couponCategoryList: []
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
    this.getGoodsList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listCoupon(this.listQuery).then(response => {
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
        desc: undefined,
        tag: undefined,
        total: 0,
        discount: 0,
        min: 0,
        limit: 1,
        type: 0,
        status: 0,
        goodsType: 0,
        goodsIds: [],
        timeType: 0,
        days: 0,
        startTime: null,
        endTime: null
      }
      this.couponCategoryList = []
      this.couponGoodsList = []
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
          if (this.dataForm.goodsType === 1) {
            this.dataForm.goodsIds = this.couponCategoryList.map(item => (item.goodsCategoryId))
          }
          if (this.dataForm.goodsType === 2) {
            this.dataForm.goodsIds = this.couponGoodsList.map(item => (item.goodsId))
          }
          createCoupon(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '创建优惠券成功'
            })
            this.getList()
          })
        }
      })
    },

    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      if (this.dataForm.goodsType === 1) {
        this.couponCategoryList = []
        for (let i = 0, len = row.goodsIds.length; i < len; i++) {
          this.couponCategoryList.push(this.getGoodsCategoryById(row.goodsIds[i]))
        }
      }
      if (this.dataForm.goodsType === 2) {
        this.couponGoodsList = []
        for (let i = 0, len = row.goodsIds.length; i < len; i++) {
          this.couponGoodsList.push(this.getGoodsById(row.goodsIds[i]))
        }
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.dataForm.days === 0) {
          this.dataForm.daysType = 1
        } else {
          this.dataForm.daysType = 0
        }
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dataForm.goodsType === 1) {
            this.dataForm.goodsIds = this.couponCategoryList.map(item => (item.goodsCategoryId))
          }
          if (this.dataForm.goodsType === 2) {
            this.dataForm.goodsIds = this.couponGoodsList.map(item => (item.goodsId))
          }
          this.$delete(this.dataForm,'daysType')
          updateCoupon(this.dataForm).then(() => {
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新优惠券成功'
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
        deleteCoupon(row.id).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除优惠券成功'
          })
          this.getList()
        })
      }).catch(() => {})
    },

    handleDetail(row) {
      this.$router.push({ path: 'couponActivity', query: { id: row.id }})
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/utils/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '优惠券序号',
          '名称',
          '内容',
          '标签',
          '最低消费',
          '减免金额',
          '每人限领',
          '优惠券数量'
        ]
        const filterVal = [
          'id',
          'name',
          'desc',
          'tag',
          'min',
          'discount',
          'limit',
          'total'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '优惠券信息')
        this.downloadLoading = false
      })
    },

    getGoodsList() {
      listGoods({ limit: 0 }).then(response => {
        const goodsList = response.data.list
        this.goodsOptions = []
        for (let i = 0; i < goodsList.length; i++) {
          const item = goodsList[i]
          this.goodsOptions.push({ goodsId: item.id, goodsName: item.name, goodsSn: item.goodsSn })
        }
      }).catch(() => {
        this.goodsOptions = []
      })
    },

    handleAddGoods() {
      if (this.selectGoods === null) {
        this.$message({
          message: '请先选择商品',
          type: 'warning'
        })
        return
      }
      this.couponGoodsList.push(this.getGoodsById(this.selectGoods))
      this.selectGoods = null
    },

    handleDeleteGoods(index, row) {
      this.couponGoodsList.splice(index, 1)
    },

    handleAddGoodsCategory() {
      if (this.selectGoodsCategory === null || this.selectGoodsCategory.length === 0) {
        this.$message({
          message: '请先选择商品分类',
          type: 'warning'
        })
        return
      }
      this.couponCategoryList.push(this.getGoodsCategoryByIds(this.selectGoodsCategory))
      this.selectGoodsCategory = []
    },

    handleDeleteGoodsCategory(index, row) {
      this.couponCategoryList.splice(index, 1)
    },

    getGoodsById(id) {
      for (let i = 0; i < this.goodsOptions.length; i++) {
        if (id === this.goodsOptions[i].goodsId) {
          return this.goodsOptions[i]
        }
      }
      return null
    },
    getCategoryList() {
      listCategory().then(response => {
        const list = response.data.list
        this.goodsCategoryOptions = []
        for (let i = 0; i < list.length; i++) {
          const children = []
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({ label: list[i].children[j].name, value: list[i].children[j].id })
            }
          }
          this.goodsCategoryOptions.push({ label: list[i].name, value: list[i].id, children: children })
        }
      })
    },
    getGoodsCategoryById(id) {
      let name
      let parentName
      for (let i = 0; i < this.goodsCategoryOptions.length; i++) {
        for (let j = 0; j < this.goodsCategoryOptions[i].children.length; j++) {
          if (this.goodsCategoryOptions[i].children[j].value === id) {
            parentName = this.goodsCategoryOptions[i].label
            name = this.goodsCategoryOptions[i].children[j].label
          }
        }
      }
      return { goodsCategoryId: id, goodsCategoryName: name, parentCategoryName: parentName }
    },
    getGoodsCategoryByIds(ids) {
      let name
      let parentName
      for (let i = 0; i < this.goodsCategoryOptions.length; i++) {
        if (this.goodsCategoryOptions[i].value === ids[0]) {
          parentName = this.goodsCategoryOptions[i].label
          for (let j = 0; j < this.goodsCategoryOptions[i].children.length; j++) {
            if (this.goodsCategoryOptions[i].children[j].value === ids[1]) {
              name = this.goodsCategoryOptions[i].children[j].label
            }
          }
        }
      }
      return { goodsCategoryId: ids[1], goodsCategoryName: name, parentCategoryName: parentName }
    }
  }
}
</script>

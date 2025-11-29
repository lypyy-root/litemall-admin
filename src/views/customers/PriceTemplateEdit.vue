<template>
  <div class="app-container">
    <el-page-header
      @back="$router.back()"
      :content="id ? '编辑报价模板' : '新增报价模板'"
      class="mb-2"
    />
    <!-- 终端客户基础信息 -->
    <el-card shadow="never" class="mb-2">
      <h3>模板中的商品</h3>
      <div class="search-goods-input">
        <!-- <el-input v-model="tempGoodsListQuery.goodsName" placeholder="请输入商品名称" clearable>
          <div slot="prepend" type="info">搜索商品</div>
          <el-button slot="append" icon="el-icon-search"
            @click="fetchTempGoodsList"
          ></el-button>
        </el-input> -->
        <el-form :model="tempGoodsListQuery" :inline="true" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="tempGoodsListQuery.goodsName" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <!-- <el-input v-model="listQuery.name" placeholder="请输入类别" clearable></el-input> -->
            <!-- <el-select
              v-model="tempGoodsListQuery.categoryId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择类别"
              :remote-method="searchTempCategory"
              :loading="searchTempCategoryLoading"
            >
              <el-option
                v-for="item of tempCategoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-cascader :options="tempCategoryList" :show-all-levels="false"
              @change="handleCategoryChange" clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="品牌">
            <!-- <el-input v-model="listQuery.name" placeholder="请输入品牌" clearable></el-input> -->
            <el-select
              v-model="tempGoodsListQuery.brandId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择品牌"
              clearable
            >
              <el-option
                v-for="item of tempBrandList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search"
              @click="fetchTempGoodsList($event, 'template')"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="tempGoodsTable"
        v-loading="listLoading"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
        :data="tempGoodsList"
        @selection-change="handleSelectTempGoodsListChange"
        current-row-key="goods.code"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="类别" prop="category.name" />
        <el-table-column label="商品名称" prop="goods.name" />
        <el-table-column label="品牌" prop="salesScenario.name" />
        <el-table-column label="规格" prop="goodsProduct">
          <template #default="{ row }">
            <span>{{ row.goodsProduct.join(' ') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" />
        <el-table-column label="报价" prop="templatePrice" />
        <el-table-column label="单瓶或本价" prop="costPrice" />
        <el-table-column label="建议零售价(单瓶)" prop="retailPrice" />
        <el-table-column label="商品是否上架" prop="status" />
        <el-table-column label="权重" prop="weight" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="text" @click="doUnBindGoodsToTemplate(row)">
              <i class="el-icon-delete"></i>
              <span>释放</span>
            </el-button>
            <el-button type="text" @click="showBindGoodsToTemplate(row, 'update')">
              <i class="el-icon-edit"></i>
              <span>编辑报价</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;">
        <el-button type="primary" @click="doUnBindGoodsToTemplate(null, true)">
          <i class="el-icon-delete"></i>
          <span>批量释放选中商品</span>
        </el-button>
        <el-button @click="showBindGoodsToTemplate(null, 'update', true)">
          <i class="el-icon-edit"></i>
          <span>批量编辑选中商品报价</span>
        </el-button>
      </div>
      <!-- pagination -->
      <div style="margin-top: 16px; text-align: right">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tempGoodsListTotal"
          :page-size="tempGoodsListQuery.limit"
          :current-page="tempGoodsListQuery.page"
          @current-change="onTempGoodsPage"
        />
      </div>
      <div style="margin-top: 50px;"></div>
      <h3>可添加的商品</h3>
      <div class="search-goods-input">
        <!-- <el-input v-model="listQuery.name" placeholder="请输入商品名称" clearable>
          <div slot="prepend" type="info">搜索商品</div>
          <el-button slot="append" icon="el-icon-search"
            @click="fetchGoodsList"
          ></el-button>
        </el-input> -->
        <el-form :model="listQuery" :inline="true" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="listQuery.name" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <!-- <el-input v-model="listQuery.name" placeholder="请输入类别" clearable></el-input> -->
            <!-- <el-select
              v-model="listQuery.categoryId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择类别"
            >
              <el-option
                v-for="item of categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-cascader :options="tempCategoryList" :show-all-levels="false"
              @change="handleCategoryChange($event, 'goods')" clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="品牌">
            <!-- <el-input v-model="listQuery.name" placeholder="请输入品牌" clearable></el-input> -->
            <el-select
              v-model="listQuery.brandId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择品牌"
              clearable
            >
              <el-option
                v-for="item of tempBrandList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search"
              @click="fetchGoodsList"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="goodsTable"
        border
        :data="list"
        v-loading="listLoading"
        element-loading-text="正在查询中。。。"
        current-row-key="goods.code"
        fit
        highlight-current-row
        @selection-change="handleSelectGoodsListChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="类别" prop="category.name" />
        <el-table-column label="商品名称" prop="goods.name" />
        <el-table-column label="品牌" prop="salesScenario.name" />
        <el-table-column label="规格" prop="goodsProduct">
          <template #default="{ row }">
            <span>{{ row.goodsProduct.join(' ') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" />
        <el-table-column label="报价" prop="templatePrice" />
        <el-table-column label="单瓶成本价" prop="costPrice" />
        <el-table-column label="建议零售价(单瓶)" prop="retailPrice" />
        <el-table-column label="商品是否上架" prop="status" />
        <el-table-column label="权重" prop="weight" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="showBindGoodsToTemplate(row)">
              <i class="el-icon-plus"></i>
              <span>添加</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 5px;">
        <el-button type="primary" icon="el-icon-finished" @click="showBindGoodsToTemplate(null, 'add', true)">绑定选中商品</el-button>
      </div>
      <!-- pagination -->
      <div style="margin-top: 16px; text-align: right">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="listQuery.limit"
          :current-page="listQuery.page"
          @current-change="onGoodsPage"
        />
      </div>
    </el-card>
    <el-dialog
      :title="templateEditTitle"
      :visible.sync="showBindGoods"
      width="500px"
      class="bind-goods-dialog"
    >
      <el-form :model="tempGoodsData" :rules="rules" ref="tempGoodsForm" label-width="120px">
        <el-card v-for="(item, index) of tempGoodsData.goods" :key="index" style="margin-bottom: 10px;">
          <el-form-item label="商品名称">
            {{ item.goodsName }}
          </el-form-item>
          <el-form-item label="商品报价" :prop="`goods.${index}.goodsPrice`" :rules="rules.goodsPrice">
            <el-input-number v-model="item.goodsPrice" controls-position="right" :min="1" />
          </el-form-item>
          <el-form-item label="单瓶成本价" :prop="`goods.${index}.unitCost`" :rules="rules.unitCost">
            <el-input-number v-model="item.unitCost" controls-position="right" :min="1" />
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doBindGoodsToTemplate" :loading="updateing">确定</el-button>
        <el-button @click="doCancelBindGoodsToTemplate">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsTemplate,
  getGoodsTemplateDetail,
  bindGoodsToTemplate,
  deleteGoodsTemplateBindGoods,
  updateGoodsTemplateBindGoods,
  getCategoryList,
  getBrandList,
} from '@/api/goodsTemplate'

export default {
  name: "CustomerEdit",
  data() {
    return {
      id: this.$route.params.id || "",
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        goodsId: undefined,
        brandId: undefined,
        goodsSn: undefined,
        categoryId: undefined,
        name: '',
        sort: 'add_time',
        order: 'desc'
      },
      categoryList: [],
      categoryLoading: false,
      brandList: [],
      brandLoading: false,
      listSelectRows: [],
      tempGoodsList: [],
      tempGoodsListQuery: {
        page: 1,
        limit: 20,
        goodsName: '',
        categoryId: undefined,
        brandId: undefined,
      },
      tempGoodsListLoading: false,
      tempGoodsListTotal: 0,
      tempGoodsSelectRows: [],
      showBindGoods: false,
      tempGoodsData: {
        mode: 'add',
        multiBind: false,
        templateId: this.id,
        name: 'test',
        goods: []
      },
      rules: {
        'goodsPrice': [{ required: true, message: '请输入商品报价', trigger: 'blur' }],
        'unitCost': [{ required: true, message: '请输入单瓶成本价', trigger: 'blur' }],
      },
      tempCategoryList: [],
      tempCategoryLoading: false,
      tempBrandList: [],
      tempBrandLoading: false,
      updateing: false,
    };
  },
  created() {
    this.fetchGoodsList();
    this.fetchTempGoodsList();
    this.fetchTempCategoryList('');
    this.fetchTempBrandList('');
    // if (this.id) await this.loadDetail();
    // this.form.userId = this.form.userId || this.id || "";
  },
  computed: {
    templateEditTitle() {
      return this.tempGoodsData.mode === 'add' ? '绑定商品到报价模板' : '更新商品报价模板';
    }
  },
  methods: {
    handleCategoryChange(val, type) {
      if (val.length === 0) {
        if (type === 'goods') {
          this.listQuery.categoryId = undefined;
        } else {
          this.tempGoodsListQuery.categoryId = undefined;
        }
      }
      this.listQuery.categoryId = val[val.length - 1];
    },
    // 获取产品类别
    fetchTempCategoryList(query) {
      this.tempCategoryLoading = true;
      getCategoryList({
        query,
      }).then(res => {
        this.tempCategoryList = res.data.list || [];
      }).finally(() => {
        this.tempCategoryLoading = false;
      })
    },
    // 获取品牌列表
    fetchTempBrandList(query) {
      this.tempBrandLoading = true;
      getBrandList({
        query,
      }).then(res => {
        this.tempBrandList = res.data.list || [];
      }).finally(() => {
        this.tempBrandLoading = false;
      })
    },
    /* fetchCategoryList(query) {
      this.categoryLoading = true;
      getCategoryList(query).then(res => {
        this.categoryList = res.data.list || [];
      }).finally(() => {
        this.categoryLoading = false;
      })
    },
    fetchBrandList(query) {
      this.brandLoading = true;
      getBrandList(query).then(res => {
        this.brandList = res.data.list || [];
      }).finally(() => {
        this.brandLoading = false;
      })
    }, */
    fetchGoodsList() {
      this.listLoading = true;
      getGoodsTemplate(this.listQuery).then(res => {
        this.list = res.data.list || [];
        this.total = res.data.total || 0;
      }).finally(() => {
        this.listLoading = false;
      })
    },
    onGoodsPage(p) {
      this.listQuery.page = p;
      this.fetchGoodsList();
    },
    fetchTempGoodsList() {
      this.tempGoodsListLoading = true;
      getGoodsTemplateDetail({
        ...this.tempGoodsListQuery,
        templateId: this.id,
      }).then(res => {
        this.tempGoodsList = res.data.list || [];
        this.tempGoodsListTotal = res.data.total || 0;
      }).finally(() => {
        this.tempGoodsListLoading = false;
      })
    },
    onTempGoodsPage(p) {
      this.tempGoodsListQuery.page = p;
      this.fetchTempGoodsList();
    },
    showBindGoodsToTemplate(row, mode = 'add', multiBind = false) {
      if (multiBind) {
        if (mode === 'add' && this.tempGoodsSelectRows.length === 0) {
          this.$message.warning('请选择要绑定的商品');
          return;
        } else if (mode === 'update' && this.listSelectRows.length === 0) {
          this.$message.warning('请选择要更新的商品');
          return;
        }
        const goods = [];
        const items = mode === 'add' ? this.tempGoodsSelectRows : this.listSelectRows;
        for (const item of items) {
          const data = {
            goodsName: item.goods.name,
            goodsId: item.goods.code,
            goodsPrice: mode === 'add' ? item.costPrice : item.templatePrice,
            unitCost: mode === 'add' ? item.retailPrice : item.costPrice,
            retailPrice: item.retailPrice,
          }
          goods.push(data);
        }
        this.tempGoodsData = { ...this.tempGoodsData, mode, multiBind, goods };
        /* this.tempGoodsData.mode = mode;
        this.tempGoodsData.multiBind = multiBind;
        this.tempGoodsData.goods = goods; */
        this.showBindGoods = true;
      } else {
        const data = {
          goodsName: row.goods.name,
          goodsId: row.goods.code,
          goodsPrice: mode === 'add' ? row.costPrice : row.templatePrice,
          unitCost: mode === 'add' ? row.retailPrice : row.costPrice,
          retailPrice: row.retailPrice,
        }
        this.tempGoodsData = { ...this.tempGoodsData, mode, multiBind, goods: [data] };
        this.showBindGoods = true;
      }
    },
    doBindGoodsToTemplate() {
      this.$refs.tempGoodsForm.validate(async (valid) => {
        if (!valid) return;
        const data = {
          templateId: this.id,
          name: this.tempGoodsData.name,
          goods: [...this.tempGoodsData.goods],
        }
        this.updateing = true;
        if (this.tempGoodsData.mode === 'add') {
          bindGoodsToTemplate(data).then(res => {
            if (res.errno === 0 || res.errno === 'success') {
              this.$message.success('绑定成功');
              this.fetchTempGoodsList();
            } else {
              this.$message.error(res.errmsg || '绑定失败');
            }
          }).finally(() => {
            this.showBindGoods = false;
            this.$refs.tempGoodsForm.resetFields();
            this.tempGoodsSelectRows = [];
            this.tempGoodsData = {
              mode: 'add',
              templateId: this.id,
              name: 'test',
              goodsId: '',
              goodsPrice: 0,
              unitCost: 0,
              retailPrice: 0,
            }
            this.updateing = false;
          })
        } else {
          updateGoodsTemplateBindGoods(data).then(res => {
            if (res.errno === 0 || res.errno === 'success') {
              this.$message.success('更新成功');
              this.fetchTempGoodsList();
            } else {
              this.$message.error(res.errmsg || '更新失败');
            }
          }).finally(() => {
            this.showBindGoods = false;
            this.$refs.tempGoodsForm.resetFields();
            this.listSelectRows = [];
            this.tempGoodsData = {
              mode: 'add',
              templateId: this.id,
              name: 'test',
              goodsId: '',
              goodsPrice: 0,
              unitCost: 0,
              retailPrice: 0,
            }
            this.updateing = false;
          })
        }
      })
    },
    doUnBindGoodsToTemplate(row, multiBind = false) {
      this.$modal.confirm('确定解绑商品吗？').then((state) => {
        if (state !== 'confirm') return;
        let goodsId = [];
        if (multiBind) {
          goodsId = this.listSelectRows.map(item => item.goods.code);
        } else {
          goodsId = [row.goods.code];
        }
        deleteGoodsTemplateBindGoods({
          templateId: this.id,
          goodsId,
        }).then(res => {
          if (res.errno === 0 || res.errno === 'success') {
            this.$message.success('解绑成功');
            this.fetchTempGoodsList();
          } else {
            this.$message.error(res.errmsg || '解绑失败');
          }
        })
      })
    },
    handleSelectGoodsListChange(selection) {
      this.tempGoodsSelectRows = selection;
    },
    handleSelectTempGoodsListChange(selection) {
      this.listSelectRows = selection;
    },
    doCancelBindGoodsToTemplate() {
      const mode = this.tempGoodsData.mode;
      this.showBindGoods = false;
      this.$refs.tempGoodsForm.resetFields();
      if (mode === 'add') {
        this.$refs.goodsTable.clearSelection();
      } else {
        this.$refs.tempGoodsTable.clearSelection();
      }
      this.tempGoodsData = {
        mode: 'add',
        templateId: this.id,
        name: 'test',
        goodsId: '',
        goodsPrice: 0,
        unitCost: 0,
        retailPrice: 0,
      }
    }
  },
};
</script>

<style>
.bind-goods-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
<style scoped>
.mb-2 {
  margin-bottom: 16px;
}
.mt-8 {
  margin-top: 8px;
}
.ml-8 {
  margin-left: 8px;
}
.req {
  color: #f56c6c;
  margin-right: 4px;
}
.openid-row {
  display: flex;
  align-items: center;
}
.latlng {
  display: flex;
  gap: 8px;
}
.region {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.region-item {
  width: 180px;
}
.inner-card {
  border: 1px solid #f0f2f5;
}
.w-100 {
  width: 100%;
}
.search-goods-input {
  margin-bottom: 10px;
}
</style>

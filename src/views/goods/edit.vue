<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="80px" style="width: 1000px;">
        <el-form-item label="商品序号" prop="id">
          <el-input v-model="goods.id" disabled />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goods.name" />
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsSn">
          <el-input v-model="goods.goodsSn" />
        </el-form-item>
        <el-form-item label="零售条码" prop="retailBarcode">
          <el-input v-model="goods.retailBarcode" />
        </el-form-item>
        <el-form-item label="外箱条码" prop="outBoxBarcode">
          <el-input v-model="goods.outBoxBarcode" />
        </el-form-item>
        <el-form-item label="市场售价" prop="counterPrice">
          <el-input v-model="goods.counterPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="一级售价" prop="counterPrice">
          <el-input v-model="goodsPrice.levelZeroPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="二级售价" prop="counterPrice">
          <el-input v-model="goodsPrice.levelOnePrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="三级售价" prop="counterPrice">
          <el-input v-model="goodsPrice.levelTwoPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="salesScenarioId">
  <el-select v-model="goods.salesScenarioId" @change="onBrandChange" placeholder="请选择品牌">
    <el-option
      v-for="item in salesScenarioList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</el-form-item>




        <el-form-item label="权重" prop="weight">
          <el-input v-model="goods.weight"/>
        </el-form-item>

        <el-form-item label="商品状态" prop="status">
          <el-select v-model="goods.status" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品" prop="isNew">
          <el-radio-group v-model="goods.isNew">
            <el-radio :label="false">非新品</el-radio>
            <el-radio :label="true">新品</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否热卖" prop="isHot">
          <el-radio-group v-model="goods.isHot">
            <el-radio :label="false">非热卖</el-radio>
            <el-radio :label="true">热卖</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否团购" prop="isGroupon">
          <el-radio-group v-model="goods.isGroupon">
            <el-radio :label="false">非团购</el-radio>
            <el-radio :label="true">团购</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品图片" prop="picUrl">
          <ImageUpload :limit="1" :value="goods.picUrl" @input="uploadPicUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="宣传画廊" prop="gallery">
          <ImageUpload :limit="5" :value="goods.gallery" @input="handleGalleryUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="商品单位">
          <el-input v-model="goods.unit" placeholder="件 / 个 / 盒" />
        </el-form-item>

        <el-form-item label="关键字">
          <el-tag v-for="tag in keywords" :key="tag" closable type="primary" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input v-if="newKeywordVisible" ref="newKeywordInput" v-model="newKeyword" class="input-new-keyword" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else class="button-new-keyword" type="primary" @click="showInput">+ 增加</el-button>
        </el-form-item>

        <el-form-item label="商品分类">
          <el-cascader v-model="categoryIds" :options="categoryList" clearable expand-trigger="hover" @change="handleCategoryChange" />
        </el-form-item>

        <el-form-item label="所属店铺">
  <el-select v-model="goods.brandId" multiple clearable placeholder="请选择店铺">
    <el-option
      v-for="item in brandList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="goods.brief" />
        </el-form-item>

        <el-form-item label="商品详情">
          <vue-ueditor-wrap v-model="goods.detail" :config="UeditorConfig" @ready="ueditorReady"></vue-ueditor-wrap>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" v-if="goods.isGroupon">
      <h3>团购规则</h3>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">优惠金额</el-col>
          <el-col :span="6" class="table-cell-title">团购人数</el-col>
          <el-col :span="6" class="table-cell-title">结束日期</el-col>
          <el-col :span="6" class="table-cell-title">操作</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ grouponRules.discount }}</el-col>
          <el-col :span="6" class="table-cell">{{ grouponRules.discountMember }}</el-col>
          <el-col :span="6" class="table-cell">{{ grouponRules.expireTime }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-button type="primary" size="mini" @click="handleGrouponShow()">设置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 添加或修改对话框 -->
      <el-dialog title="设置规则" :visible.sync="grouponVisiable">
        <el-form ref="grouponRules" :rules="rules" :model="grouponRules" status-icon label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
          <el-form-item label="团购折扣" prop="discount">
            <el-input v-model="grouponRules.discount" />
          </el-form-item>

          <el-form-item label="团购人数要求" prop="discountMember">
            <el-input v-model="grouponRules.discountMember" />
          </el-form-item>

          <el-form-item label="过期时间" prop="expireTime">
            <el-date-picker
              v-model="grouponRules.expireTime"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="grouponVisiable = false">取消</el-button>
          <el-button type="primary" @click="createGrouponRules()">确定</el-button>
        </div>
      </el-dialog>
    </el-card>


    <el-card class="box-card">
      <h3>商品规格</h3>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">规格名</el-col>
          <el-col :span="6" class="table-cell-title">规格值</el-col>
          <el-col :span="6" class="table-cell-title">规格图片</el-col>
          <el-col :span="6" class="table-cell-title">操作</el-col>
        </el-row>
        <el-row v-for="item in specifications">
          <el-col :span="6" class="table-cell">{{ item.specification }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-tag type="primary">
              {{ item.value }}
            </el-tag>
          </el-col>
          <el-col :span="6" class="table-cell">
            <img v-if="item.picUrl" :src="item.picUrl" width="40">
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-button type="primary" size="mini" @click="handleSpecificationShow(item)">设置</el-button>
          </el-col>
        </el-row>
      </div>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form ref="specForm" :rules="rules" :model="specForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification" disabled />
          </el-form-item>

          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value" />
          </el-form-item>

          <el-form-item label="规格图片" prop="picUrl">
            <ImageUpload :limit="1" :value="specForm.picUrl" @input="uploadSpecPicUrl"></ImageUpload>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品库存</h3>

      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title" style="width: 20%;">货品规格</el-col>
          <el-col :span="4" class="table-cell-title" style="width: 20%;">货品售价</el-col>
          <el-col :span="4" class="table-cell-title" style="width: 20%;">货品数量</el-col>
          <el-col :span="4" class="table-cell-title" style="width: 20%;">货品图片</el-col>
          <el-col :span="4" class="table-cell-title" style="width: 20%;">操作</el-col>
        </el-row>
        <el-row v-for="item in products">
          <el-col :span="4" class="table-cell" style="width: 20%;">
            <el-tag v-for="tag in item.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </el-col>
          <el-col :span="4" class="table-cell" style="width: 20%;">{{ item.price }}</el-col>
          <el-col :span="4" class="table-cell" style="width: 20%;">{{ item.number }}</el-col>

          <el-col :span="4" class="table-cell" style="width: 20%;">
            <img v-if="item.url" :src="item.url" width="40">
          </el-col>
          <el-col :span="4" class="table-cell" style="width: 20%;">
            <el-button type="primary" size="mini" @click="handleProductShow(item)">设置</el-button>
          </el-col>
        </el-row>
      </div>

      <el-dialog :visible.sync="productVisiable" title="编辑货品">
        <el-form ref="productForm" :model="productForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="货品规格列" prop="specifications">
            <el-tag v-for="tag in productForm.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </el-form-item>

          <el-form-item label="货品售价" prop="price">
            <el-input v-model="productForm.price" />
          </el-form-item>

          <el-form-item label="货品数量" prop="number">
            <el-input v-model="productForm.number" />
          </el-form-item>

          <el-form-item label="货品图片" prop="url">
            <ImageUpload :limit="1" :value="productForm.url" @input="uploadProductUrl"></ImageUpload>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleProductEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品参数</h3>
      <el-button type="primary" @click="handleAttributeShow">添加</el-button>

      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">商品参数名称</el-col>
          <el-col :span="8" class="table-cell-title">商品参数值</el-col>
          <el-col :span="8" class="table-cell-title">操作</el-col>
        </el-row>
        <el-row v-for="item in attributesData">
          <el-col :span="8" class="table-cell">{{ item.attribute }}</el-col>
          <el-col :span="8" class="table-cell">{{ item.value }}</el-col>
          <el-col :span="8" class="table-cell">
            <el-button type="primary" size="mini" @click="handleAttributeShow(item)">设置</el-button>
            <el-button type="danger" size="mini" @click="handleAttributeDelete(item)">删除</el-button>
          </el-col>
        </el-row>
      </div>

      <el-dialog :visible.sync="attributeVisiable" :title="attributeAdd ? '添加商品参数' : '编辑商品参数'">
        <el-form ref="attributeForm" :model="attributeForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute" />
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button v-if="attributeAdd" type="primary" @click="handleAttributeAdd">确定</el-button>
          <el-button v-else type="primary" @click="handleAttributeEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新商品</el-button>
    </div>

  </div>
</template>


<style scoped>
  .filter-container {
    margin-top: 20px;
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }
  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }

</style>


<style>
.el-card {
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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
.op-container {
  display: flex;
  justify-content: center;
}
.el-form-item--medium .el-form-item__content {
      line-height: 0px;
  }
</style>

<script>
import { detailGoods, editGoods, listCatAndBrand } from '@/api/goods'
import { uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { getSalesScenarioList } from '@/api/category'
import { getToken , getTenantId } from '@/utils/auth'

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
  name: 'GoodsEdit',
  components: { Editor },
  data() {
    return {
      statusOptions: Object.assign({}, defaultStatusOptions),
      uploadPath,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      galleryFileList: [],
      categoryList: [],
      brandList: [],
      categoryIds: [],
      grouponRules: {discount: undefined, discountMember: undefined, expireTime: undefined},
      grouponVisiable: false,
      goods: { picUrl: '', gallery: [], isHot: false, isNew: true, status: 0, isGroupon: false, unit: '',salesScenarioId:''},
      goodsPrice: {},
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
      productVisiable: false,
      productForm: {id: 0,specifications: [],price: 0.0,number: 0,url: ''},
      products: [
        { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '' }
      ],
      attributeVisiable: false,
      attributeAdd: true,
      attributeForm: { attribute: '', value: '' },
      attributes: [],
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
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
    },
    attributesData() {
      var attributesData = []
      for (var i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].deleted) {
          continue
        }
        attributesData.push(this.attributes[i])
      }
      return attributesData
    }
  },
  created() {
    this.init()
    this.getSalesScenarioList()
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


    init: function() {
      if (this.$route.query.id == null) {
        return
      }

      const goodsId = this.$route.query.id
      detailGoods(goodsId).then(response => {
        this.goods = response.data.goods
        // 稍微调整一下前后端不一致
        if (this.goods.brandId === 0) {
          this.goods.brandId = null
        }
        if (this.goods.keywords === '') {
          this.goods.keywords = null
        }

        // 处理 brandId，确保其为数组类型
    try {
      if (typeof this.goods.brandId === 'string') {
        this.goods.brandId = JSON.parse(this.goods.brandId)
      }
    } catch (e) {
      console.error('解析 brandId 失败', e)
      this.goods.brandId = []
    }


        this.grouponRules = response.data.grouponRules
        this.specifications = response.data.specifications
        this.products = response.data.products
        this.attributes = response.data.attributes
        this.categoryIds = response.data.categoryIds
        this.goodsPrice = response.data.goodsPrice

        this.galleryFileList = []
        for (var i = 0; i < this.goods.gallery.length; i++) {
          this.galleryFileList.push({
            url: this.goods.gallery[i]
          })
        }
        const keywords = response.data.goods.keywords
        if (keywords !== null) {
          this.keywords = keywords.split(',')
        }
      })

      listCatAndBrand().then(response => {
        this.categoryList = response.data.categoryList
        this.brandList = response.data.brandList
      })
    },

    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1]
    },

    handleCancel: function() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/goods/list' })
    },

    handleEdit: function() {
       // ✅ 把 brandId 转为字符串
       this.goods.brandId = JSON.stringify(this.goods.brandId);
      const finalGoods = {
        goods: this.goods,
        products: this.products,
        attributes: this.attributes,
        grouponRules: this.grouponRules,
        specifications: this.specifications,
        goodsPrice: this.goodsPrice,
      }
      editGoods(finalGoods).then(response => {
        this.$notify.success({
          title: '成功',
          message: '编辑成功'
        })
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/goods/list' })
      })
    },

    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1)
      this.goods.keywords = this.keywords.toString()
    },

    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const newKeyword = this.newKeyword
      if (newKeyword) {
        this.keywords.push(newKeyword)
        this.goods.keywords = this.keywords.toString()
      }
      this.newKeywordVisible = false
      this.newKeyword = ''
    },

    uploadPicUrl: function(response) {
      this.goods.picUrl = response;
    },

    //商品轮播图
    handleGalleryUrl(val) {
      this.goods.gallery = Array.isArray(val) ? val : val.split(',');
    },

    specChanged: function(label) {
      if (label === false) {
        this.specifications = [
          { specification: '规格', value: '标准', picUrl: '' }
        ]
        this.products = [
          { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '' }
        ]
      } else {
        this.specifications = []
        this.products = []
      }
    },

    uploadSpecPicUrl: function(response) {
      this.specForm.picUrl = response;
    },

    handleGrouponShow(){
      this.grouponVisiable = true
    },

    createGrouponRules(){
      let discount = this.grouponRules.discount;
      let discountMember = this.grouponRules.discountMember;
      let expireTime = this.grouponRules.expireTime;
      if(discount > 0 && discountMember > 0 && expireTime){
        this.grouponVisiable = false;
      }else{
        this.$message({
          type: 'warning',
          message: "团购信息不正确"
        })
      }
    },

    handleSpecificationShow(row) {
      this.specForm = Object.assign({}, row)
      this.specVisiable = true
    },

    handleSpecificationEdit() {
      if(!this.specForm.specification || !this.specForm.value || !this.specForm.picUrl){
        this.$message({
          type: 'warning',
          message: '商品规格参数不完整'
        })
        return
      }

      this.specForm.updateTime = ''
      /*for (var i = 0; i < this.specifications.length; i++) {
        const v = this.specifications[i]
        if (v.id === this.specForm.id) {
          this.specifications.splice(i, 1, this.specForm)
          break
        }
      }*/
      const index = this.specifications.findIndex(v => v.specification === this.specForm.specification)
      this.specifications.splice(index, 1, this.specForm)
      this.specVisiable = false
      this.specToProduct()
    },

    specToProduct() {
      if (this.specifications.length === 0) {
        return
      }
      // 根据specifications创建临时规格列表
      var specValues = []
      var spec = this.specifications[0].specification
      var values = []
      values.push(0)

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification

        if (aspec === spec) {
          values.push(i)
        } else {
          specValues.push(values)
          spec = aspec
          values = []
          values.push(i)
        }
      }
      specValues.push(values)

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0
      var products = []
      var combination = []
      var n = specValues.length
      for (var s = 0; s < n; s++) {
        combination[s] = 0
      }
      var index = 0
      var isContinue = false
      do {
        var specifications = []
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]]
          specifications.push(this.specifications[z].value)
        }
        products[productsIndex] = { id: productsIndex, specifications: specifications, price: 0.00, number: 0, url: '' }
        productsIndex++

        index++
        combination[n - 1] = index
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0
            index = 0
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1
            }
          }
        }
        isContinue = false
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true
          }
        }
      } while (isContinue)

      this.products = products
    },

    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },

    uploadProductUrl: function(response) {
      this.productForm.url = response;
    },

    handleProductEdit() {
      if(!this.productForm.price || !this.productForm.number || !this.productForm.url){
        this.$message({
          type: 'warning',
          message: '商品库存参数不完整'
        })
        return
      }
      this.productForm.updateTime = ''
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i]
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm)
          break
        }
      }
      this.productVisiable = false
    },

    handleAttributeShow(row) {
      if (row.attribute) {
        this.attributeForm = Object.assign({}, row)
        this.attributeAdd = false
      } else {
        this.attributeForm = {}
        this.attributeAdd = true
      }
      this.attributeVisiable = true
    },

    handleAttributeAdd() {
      if(!this.attributeForm.attribute || !this.attributeForm.value){
        this.$message({
          type: 'warning',
          message: '商品参数参数不完整'
        })
        return
      }
      this.attributes.unshift(this.attributeForm)
      this.attributeVisiable = false
    },

    handleAttributeEdit() {
      if(!this.attributeForm.attribute || !this.attributeForm.value){
        this.$message({
          type: 'warning',
          message: '商品参数参数不完整'
        })
        return
      }
      // 这是一个trick，设置updateTime的值为空，告诉后端这个记录已编辑需要更新。
      this.attributeForm.updateTime = ''
      for (var i = 0; i < this.attributes.length; i++) {
        const v = this.attributes[i]
        if (v.id === this.attributeForm.id) {
          this.attributes.splice(i, 1, this.attributeForm)
          break
        }
      }
      this.attributeVisiable = false
    },

    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    },
    getSalesScenarioList() {
      getSalesScenarioList().then(response => {
        this.salesScenarioList = response.data.list
      })
    },
  }
}
</script>

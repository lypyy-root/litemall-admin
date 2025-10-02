<!-- src/views/customer/PriceTemplateEdit.vue -->
<template>
  <div class="app-container">
    <el-breadcrumb separator="/" class="mb-3">
      <el-breadcrumb-item to="/customer/price-templates"
        >模板列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>模板</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never">
      <el-form :model="form" label-width="90px" inline>
        <el-form-item label="模板名称">
          <el-input
            v-model="form.name"
            placeholder="请输入"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="apply">沿用模板</el-button>
          <el-button type="success" @click="addProducts">添加商品</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="items" style="margin-top: 12px">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="spec" label="规格" width="140" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="price" label="商品价格" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.price" :min="0" :step="0.1" />
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="单瓶成本价" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.cost" :min="0" :step="0.1" />
          </template>
        </el-table-column>
        <el-table-column label="建议零售价(单瓶)" width="160">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; align-items: center">
              <el-input-number
                v-model="row.retailPerBottle"
                :min="0"
                :step="0.1"
              />
              <span>元</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bottleCount" label="商品价格/瓶数" width="160">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; align-items: center">
              <el-input-number v-model="row.bottleCount" :min="1" />
              <span>元</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="onShelf" label="商品是否上架" width="140">
          <template #default="{ row }">
            <el-select
              v-model="row.onShelf"
              placeholder=""
              style="width: 100px"
            >
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="修改时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ $index }">
            <el-link type="danger" @click="remove($index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: right; margin-top: 12px">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="items.length"
          :page-size="10"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PriceTemplateEdit",
  data() {
    return {
      form: { id: this.$route.params.id, name: "" },
      items: [
        {
          category: "功能饮料",
          name: "尖叫",
          brand: "农夫",
          spec: "500ml*15",
          unit: "箱",
          price: 32,
          cost: 0,
          retailPerBottle: 6,
          bottleCount: 6,
          onShelf: true,
          updatedAt: "—",
        },
      ],
    };
  },
  methods: {
    save() {
      this.$message.success("已保存（接入API即可）");
    },
    apply() {
      this.$message.info("沿用模板：待接入API");
    },
    addProducts() {
      this.$message.info("打开商品选择器：待接入");
    },
    remove(i) {
      this.items.splice(i, 1);
    },
  },
};
</script>

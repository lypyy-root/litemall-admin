<!-- src/views/customer/ProductLibrary.vue -->
<template>
  <div class="app-container product-library">
    <el-card shadow="never">
      <el-form :inline="true" :model="q" class="mb-3">
        <el-form-item label="商品大类">
          <el-select
            v-model="q.big"
            placeholder="请选择大类"
            clearable
            style="width: 200px"
          >
            <el-option v-for="o in bigCats" :key="o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品小类">
          <el-select
            v-model="q.small"
            placeholder="请选择小类"
            clearable
            style="width: 200px"
          >
            <el-option v-for="o in smallCats" :key="o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="q.name"
            placeholder="全部"
            clearable
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="reset">清空筛选条件</el-button>
          <el-button @click="openTemplate">设置模板</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column label="商品描述" min-width="320">
          <template #default="{ row }">
            <div style="display: flex; gap: 12px; align-items: center">
              <el-image
                :src="row.img"
                style="width: 70px; height: 70px; border-radius: 4px"
                fit="cover"
              />
              <div>
                <div>{{ row.title }}</div>
                <div class="text-muted" style="color: #909399; font-size: 12px">
                  箱规: {{ row.spec }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="默认价格" width="120" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="statusText" label="商品状态" width="100" />
        <el-table-column prop="stock" label="商品库存" width="120" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" @click="edit(row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link v-if="row.onShelf" @click="toggle(row)">下架</el-link>
            <el-link v-else type="success" @click="toggle(row)">上架</el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" @click="del(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <div
        class="mt-3"
        style="margin-top: 12px; display: flex; justify-content: space-between"
      >
        <div>
          <el-button @click="batchPrice">批量设置价格</el-button>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="rows.length"
          :page-size="10"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ProductLibrary",
  data() {
    return {
      q: { big: "", small: "", name: "" },
      bigCats: ["饮料", "水果", "零食"],
      smallCats: ["功能饮料", "碳酸饮料", "果汁"],
      rows: [
        {
          id: 1,
          img: "https://picsum.photos/seed/a/100/100",
          title: "东方树叶茉莉花茶500ml*15",
          spec: "箱规: 15  规格: 500ml*15",
          price: "¥169.5",
          brand: "农夫山泉",
          onShelf: true,
          statusText: "上架",
          stock: 300,
        },
        {
          id: 2,
          img: "https://picsum.photos/seed/b/100/100",
          title: "东方树叶青柠黄萃",
          spec: "箱规: 15  规格: 500ml*15",
          price: "¥119.9",
          brand: "农夫山泉",
          onShelf: false,
          statusText: "下架",
          stock: 1000,
        },
      ],
    };
  },
  methods: {
    onSearch() {
      /* hook to API */
    },
    reset() {
      this.q = { big: "", small: "", name: "" };
    },
    openTemplate() {
      this.$router.push({ name: "PriceTemplateList" });
    },
    edit(row) {
      this.$message.info(`编辑 ${row.title}`);
    },
    toggle(row) {
      row.onShelf = !row.onShelf;
      row.statusText = row.onShelf ? "上架" : "下架";
    },
    del() {
      this.$confirm("确认删除该商品？", "提示").then(() =>
        this.$message.success("已删除（接入API）")
      );
    },
    batchPrice() {
      this.$message.info("打开批量设置价格弹窗（待接入）");
    },
  },
};
</script>

<style scoped>
.product-library .mb-3 {
  margin-bottom: 16px;
}
</style>

<!-- src/views/customer/PriceTemplateList.vue -->
<template>
  <div class="app-container">
    <el-card shadow="never">
      <div
        class="flex items-center"
        style="display: flex; gap: 12px; align-items: center"
      >
        <el-input
          v-model="q.keyword"
          placeholder="搜索模板"
          clearable
          style="max-width: 260px"
        />
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onCreate">新增模板</el-button>
      </div>
      <el-table :data="rows" class="mt-3" style="margin-top: 16px">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="模板ID" width="140" />
        <el-table-column prop="name" label="模板名称" min-width="160" />
        <el-table-column prop="customerCount" label="使用客户数" width="120" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" @click="goEdit(row)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-3" style="margin-top: 16px; text-align: right">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="onPage"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PriceTemplateList",
  data() {
    return {
      q: { keyword: "" },
      rows: [
        {
          id: "232345235",
          name: "台球厅",
          customerCount: 40,
          updatedAt: "2021-09-28 18:54:39",
        },
      ],
      total: 1,
      pageSize: 10,
    };
  },
  methods: {
    onSearch() {
      /* hook to API */
    },
    onCreate() {
      this.$router.push({ name: "PriceTemplateEdit", params: { id: "new" } });
    },
    goEdit(row) {
      this.$router.push({ name: "PriceTemplateEdit", params: { id: row.id } });
    },
    onPage() {
      /* hook to API */
    },
  },
};
</script>

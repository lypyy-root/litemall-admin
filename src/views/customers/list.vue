<!-- src/views/customer/list.vue -->
<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="query" class="mb-2">
      <el-form-item label="客户ID">
        <el-input v-model="query.userId" placeholder="输入客户ID" clearable />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input
          v-model="query.username"
          placeholder="输入客户名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="query.mobile" placeholder="输入电话" clearable />
      </el-form-item>
      <el-form-item label="渠道ID">
        <el-input
          v-model="query.channelId"
          placeholder="输入渠道ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="query.leadeId" placeholder="输入负责人" clearable />
      </el-form-item>
      <el-form-item label="业务员">
        <el-input
          v-model="query.salesmanId"
          placeholder="输入业务员"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border>
      <el-table-column type="index" label="#" width="60" />
      <el-table-column prop="userId" label="客户ID" min-width="160" />
      <el-table-column prop="name" label="客户名称" min-width="140" />
      <el-table-column
        prop="templateName"
        label="价格执行策略"
        min-width="120"
      />
      <el-table-column prop="salesmanName" label="业务员" min-width="100" />
      <el-table-column prop="status" label="客户状态" min-width="100" />
      <el-table-column prop="channelName" label="客户渠道" min-width="120" />
      <el-table-column prop="leaderName" label="负责人" min-width="100" />
      <el-table-column prop="leaderPhone" label="联系电话" min-width="140" />
      <el-table-column prop="time" label="下单周期" min-width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <!-- <template #default="{ row }"> -->
        <el-button type="text" @click="goEdit(row)">编辑</el-button>
        <!-- <el-divider direction="vertical"></el-divider>
          <el-popconfirm
            title="确定删除该客户吗？"
            ok-text="删除"
            cancel-text="取消"
            @confirm="handleDelete(row)"
          >
            <el-button type="text" slot="reference">删除</el-button>
          </el-popconfirm> -->
        <!-- </template> -->
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt-2" style="text-align: right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="query.page"
        :page-size.sync="query.limit"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getList"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script>
import { getCustomerList, deleteCustomer } from "@/api/customer";

export default {
  name: "CustomerList",
  data() {
    return {
      query: {
        userId: "",
        username: "",
        mobile: "",
        channelId: "",
        leadeId: "",
        salesmanId: "",
        page: 1,
        limit: 10,
      },
      list: [],
      total: 0,
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data } = await getCustomerList(this.query);

        this.list = (data && data.list) || [];
        this.total = (data && data.total) || 0;
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.query.page = 1;
      this.getList();
    },
    resetQuery() {
      this.query = {
        userId: "",
        username: "",
        mobile: "",
        channelId: "",
        leadeId: "",
        salesmanId: "",
        page: 1,
        limit: 10,
      };
      this.getList();
    },
    goEdit(row) {
      this.$router.push({ path: "/customer/edit", query: { id: row.userId } });
    },
    async handleDelete(row) {
      try {
        await deleteCustomer(row.userId);
        this.$message.success("删除成功");
        this.getList();
      } catch (e) {
        this.$message.error("删除失败，请检查接口或权限");
      }
    },
  },
};
</script>

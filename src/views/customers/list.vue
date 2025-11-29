<!-- src/views/customer/list.vue -->
<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div style="display: flex; align-items: center">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="query" style="margin-left: 20px">
        <el-form-item>
          <el-input v-model="query.userId" placeholder="输入客户ID" clearable />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="query.username"
            placeholder="输入客户名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.mobile" placeholder="输入电话" clearable />
        </el-form-item>
        <el-form-item>
          <!-- <el-input
            v-model="query.channelId"
            placeholder="输入渠道ID"
            clearable
          /> -->
          <el-select
            v-model="query.channelId"
            placeholder="请选择渠道"
            class="w-100"
          >
            <el-option v-for="item in brandList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-input
            v-model="query.leadeId"
            placeholder="输入负责人"
            clearable
          /> -->
          <el-select v-model="query.leadeId" placeholder="请选择负责人" class="w-100" clearable>
            <el-option
              v-for="item of adminList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-input
            v-model="query.salesmanId"
            placeholder="输入业务员"
            clearable
          /> -->
          <el-select v-model="query.salesmanId" placeholder="请选择业务员" class="w-100" clearable>
            <el-option
              v-for="item of salesmanList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="query.region" placeholder="区域" clearable /> -->
          <el-select
            v-model="query.region"
            placeholder="区域（示例：朝阳区）"
            class="region-item"
            @change="query.street = ''"
            clearable
          >
            <el-option v-for="item in districtList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <!-- <el-input v-model="query.street" placeholder="街道" clearable /> -->
           <el-select
              v-model="query.street"
              placeholder="街道（示例：金盏街道）"
              class="region-item"
              clearable
            >
              <el-option v-for="item in wardList(query.region)" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item>
          <!-- <el-date-picker
            v-model="query.orderCycle"
            type="date"
            placeholder="下单周期"
            value-format="yyyy-MM-dd"
            clearable
          /> -->
          <el-input v-model="query.orderCycle" placeholder="下单周期(天数)" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">
            查询
          </el-button>
          <el-button icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 20px">
      <!-- 新增客户按钮 -->
      <el-button type="primary" icon="el-icon-plus" @click="goAdd">
        新增客户
      </el-button>
    </div>
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
      <el-table-column prop="salesmanName" label="业务员" min-width="100">
        <template #default="{ row }">
          {{ (row.salesmanName !== null && row.salesmanName !== 'null') ? row.salesmanName : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="客户状态" min-width="100" />
      <el-table-column prop="channelName" label="客户渠道" min-width="120">
        <template #default="{ row }">
          {{ (row.channelName !== null && row.channelName !== 'null') ? row.channelName : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="leaderName" label="负责人" min-width="100">
        <template #default="{ row }">
          {{ (row.leaderName !== null && row.leaderName !== 'null') ? row.leaderName : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="leaderPhone" label="联系电话" min-width="140" />
      <el-table-column prop="time" label="下单周期" min-width="180" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="goEdit(row)">编辑</el-button>
        </template>
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
import { getCustomerList, deleteCustomer, getResponsiblePerson, getSalesmanList, getRegionList } from "@/api/customers";
import { getChannelList } from "@/api/goodsTemplate";
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
        region: "",
        street: "",
        orderCycle: "",
        page: 1,
        limit: 10,
      },
      list: [],
      total: 0,
      loading: false,
      salesmanList: [],
      adminList: [],
      brandList: [],
      regionList: [],
    };
  },
  created() {
    this.getList();
    this.fetchResponsiblePerson();
    this.fetchSalesmanList();
    this.fetchBrandList();
    this.fetchRegionList();
  },
  computed: {
    districtList() {
      return [...this.regionList[0].children[0].children]
    },
  },
  methods: {
    wardList(id) {
      const list = this.districtList.find(d => d.id === id)
      console.log(list);
      return list?.streets || []
    },
    // 获取区域列表
    async fetchRegionList() {
      const res = await getRegionList();
      const ok = res?.errno === "success" || res?.errno === 0;
      const data = ok ? res.data || res : null;
      if (!data) {
        this.$message.error(res?.errmsg || "获取区域列表失败");
        throw new Error("NotFound");
      }
      this.regionList = data.list || [];
    },
    // 获取渠道列表
    async fetchBrandList() {
      const res = await getChannelList({
        page: 1,
        limit: 50,
      });
      const ok = res?.errno === "success" || res?.errno === 0;
      const data = ok ? res.data || res : null;
      if (!data) {
        this.$message.error(res?.errmsg || "获取渠道列表失败");
        throw new Error("NotFound");
      }
      this.brandList = data.list || [];
    },
    // 获取负责人列表
    async fetchResponsiblePerson() {
      const res = await getResponsiblePerson();
      const ok = res?.errno === "success" || res?.errno === 0;
      const data = ok ? res.data || res : null;
      if (!data) {
        this.$message.error(res?.errmsg || "获取负责人列表失败");
        // throw new Error("NotFound");
      }
      this.adminList = data.list || [];
    },
    // 获取业务员列表
    async fetchSalesmanList() {
      const res = await getSalesmanList();
      const ok = res?.errno === "success" || res?.errno === 0;
      const data = ok ? res.data || res : null;
      if (!data) {
        this.$message.error(res?.errmsg || "获取业务员列表失败");
        // throw new Error("NotFound");
      }
      this.salesmanList = data.list || [];
    },
    async getList() {
      this.loading = true;
      try {
        const params = {};
        Object.keys(this.query).forEach((k) => {
          if (
            this.query[k] !== "" &&
            this.query[k] !== null &&
            this.query[k] !== undefined
          ) {
            params[k] = this.query[k];
          }
        });
        const { data } = await getCustomerList(params);
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
        region: "",
        street: "",
        orderCycle: "",
        page: 1,
        limit: 10,
      };
      this.getList();
    },
    goAdd() {
      this.$router.push({ path: "/customers/edit" });
    },
    goEdit(row) {
      this.$router.push({ path: "/customers/edit", query: { id: row.userId } });
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

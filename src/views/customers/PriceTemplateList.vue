<template>
  <div class="app-container">
    <el-card shadow="never">
      <!-- toolbar -->
      <div style="display: flex; gap: 12px; align-items: center">
        <el-input
          v-model="q.keyword"
          placeholder="搜索模板"
          clearable
          style="max-width: 260px"
          @keyup.enter.native="onSearch"
        />
        <el-select
          v-model="q.numberSort"
          placeholder="排序(按使用次数)"
          style="width: 160px"
        >
          <el-option label="按使用次数降序" value="desc" />
          <el-option label="按使用次数升序" value="asc" />
        </el-select>
        <el-button type="primary" :loading="loading" @click="onSearch"
          >查询</el-button
        >
        <el-button type="primary" @click="openCreateDialog">新增模板</el-button>
      </div>

      <!-- table -->
      <el-table :data="rows" :loading="loading" style="margin-top: 16px">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="模板ID" width="180" />
        <el-table-column prop="name" label="模板名称" min-width="160" />
        <el-table-column prop="customerCount" label="使用客户数" width="120" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" @click="goEdit(row)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination -->
      <div style="margin-top: 16px; text-align: right">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="onPage"
        />
      </div>
    </el-card>

    <!-- 新增模板对话框 -->
    <el-dialog title="新增模板" :visible.sync="dialogVisible" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="用户ID" prop="addAdminUserId">
          <el-input
            v-model.trim="form.addAdminUserId"
            placeholder="请输入创建者用户ID"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="updateAdminUserName">
          <el-input
            v-model.trim="form.updateAdminUserName"
            placeholder="请输入创建者用户名"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitCreate"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listGoodsTemplates, createGoodsTemplate } from "@/api/goodsTemplate";

const ErrMap = {
  0: "成功",
  success: "成功",
  409: "模板已存在，不能重复添加",
  501: "请登录",
};

export default {
  name: "PriceTemplateList",
  data() {
    return {
      q: { keyword: "", numberSort: "desc" },
      loading: false,
      rows: [],
      total: 0,
      page: 1,
      pageSize: 10,

      dialogVisible: false,
      submitting: false,
      form: { name: "", addAdminUserId: "", updateAdminUserName: "" },
      rules: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        addAdminUserId: [
          { required: true, message: "请输入用户ID", trigger: "blur" },
        ],
        updateAdminUserName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.fetchList();
    console.log("Component mounted");
  },
  methods: {
    async fetchList() {
      console.log("fetchList called");
      this.loading = true;
      try {
        const res = await listGoodsTemplates({
          name: this.q.keyword,
          numberSort: this.q.numberSort,
          page: this.page,
          limit: this.pageSize,
        });

        console.log(
          "[fetchList] about to request /admin/goods/template/list with:",
          params
        );
        console.log("[fetchList] response received");
        const { errno, errmsg, data } = res || {};
        if (errno === "success" || errno === 0) {
          this.rows = (data.list || []).map((it) => ({
            id: it.id,
            name: it.name,
            customerCount: it.number,
            updatedAt: it.updateTime,
          }));
          this.total = data.total || 0;
        } else if (errno === 501) {
          this.$message.warning(ErrMap[errno] || errmsg);
          this.$router.push({ path: "/login" });
        } else {
          this.$message.error(errmsg || "获取列表失败");
        }
      } catch (e) {
        this.$message.error("网络或服务器异常");
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.page = 1;
      this.fetchList();
    },
    onPage(p) {
      this.page = p;
      this.fetchList();
    },
    goEdit(row) {
      // IMPORTANT: use your route name "TemplateEdit"
      this.$router.push({ name: "TemplateEdit", params: { id: row.id } });
    },

    // dialog flow
    openCreateDialog() {
      this.dialogVisible = true;
      this.form = { name: "", addAdminUserId: "", updateAdminUserName: "" };
      this.$nextTick(() => this.$refs.formRef?.clearValidate?.());
    },
    submitCreate() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const res = await createGoodsTemplate(this.form);
          const { errno, errmsg, data } = res || {};
          if (errno === "success" || errno === 0) {
            this.$message.success(ErrMap[errno] || "创建成功");
            this.dialogVisible = false;
            // refresh to keep server sort/number in sync
            this.page = 1;
            await this.fetchList();
            // 可选：创建后直接进入详情
            // this.$router.push({ name: 'TemplateEdit', params: { id: data.id } })
          } else {
            this.$message.error(ErrMap[errno] || errmsg || "创建失败");
          }
        } catch (e) {
          this.$message.error("网络或服务器异常");
        } finally {
          this.submitting = false;
        }
      });
    },
  },
};
</script>

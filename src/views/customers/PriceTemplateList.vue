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
       <!--  <el-select
          v-model="q.numberSort"
          placeholder="排序(按使用次数)"
          style="width: 160px"
        >
          <el-option label="按使用次数降序" value="desc" />
          <el-option label="按使用次数升序" value="asc" />
        </el-select> -->
        <el-button type="primary" :loading="loading" @click="onSearch"
          icon="el-icon-search"
        >查询</el-button>
      </div>
      <div class="mt-20">
        <el-button type="primary" icon="el-icon-plus" @click="openCreateDialog('', '')">新增模板</el-button>
      </div>
      <!-- table -->
      <el-table
        :data="rows" :loading="loading" style="margin-top: 16px" border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="模板ID" width="180" />
        <el-table-column prop="name" label="模板名称" min-width="160" />
        <el-table-column prop="number" label="使用客户数" width="120" />
        <!-- <el-table-column prop="status" label="状态" width="150">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="1" inactive-value="0" active-text="启用" inactive-text="停用" />
          </template>
        </el-table-column> -->
        <el-table-column prop="addTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="text" icon="el-icon-edit" @click="goEdit(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-plus" @click="openCreateDialog(row.id, row.name)">沿用模板创建</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination -->
      <div class="pagination">
        <div class="batchButton">
          <el-button icon="el-icon-delete">
            <span>批量释放</span>
            <span v-if="selectedRows.length > 0">({{ selectedRows.length }}条)</span>
          </el-button>
          <el-button icon="el-icon-refresh">
            <span>批量转派</span>
            <span v-if="selectedRows.length > 0">({{ selectedRows.length }}条)</span>
          </el-button>
        </div>
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
        <template v-if="form.templateId && form.templateName">
          <el-form-item label="沿用模板">{{ form.templateName }}</el-form-item>
        </template>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <!-- <el-form-item label="用户ID" prop="addAdminUserId">
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
        </el-form-item> -->
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
import { listGoodsTemplates, createGoodsTemplate, copyCreateGoodsTemplate } from "@/api/goodsTemplate";

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
      selectedRows: [],
      q: { keyword: "", numberSort: "desc" },
      loading: false,
      rows: [],
      total: 0,
      page: 1,
      pageSize: 10,

      dialogVisible: false,
      submitting: false,
      form: { name: "", templateId: "", templateName: "" },
      rules: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
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

        console.log("[fetchList] response received");
        const { errno, errmsg, data } = res || {};
        if (errno === "success" || errno === 0) {
          this.rows = (data.list || []);
          this.total = data.total || 0;
        } else if (errno === 501) {
          this.$message.warning(ErrMap[errno] || errmsg);
          this.$router.push({ path: "/login" });
        } else {
          this.$message.error(errmsg || "获取列表失败");
        }
      } catch (e) {
        this.$message.error("网络或服务器异常", e);
      } finally {
        this.loading = false;
      }
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
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
    openCreateDialog(templateId = '', templateName = '') {
      this.dialogVisible = true;
      console.log(this.$store.state.user);
      this.form = { name: "", templateId, templateName, addAdminUserId: '123111', addAdminUserName: this.$store.state.user.name };
      this.$nextTick(() => this.$refs.formRef?.clearValidate?.());
    },
    submitCreate() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const formData = {
            name: this.form.name,
            addAdminUserId: this.form.addAdminUserId,
            addAdminUserName: this.form.addAdminUserName,
          }
          if (this.form.templateId) {
            formData.id = this.form.templateId;
            copyCreateGoodsTemplate(formData).then(({ errno, errmsg }) => {
              if (errno === "success" || errno === 0) {
                this.$message.success(ErrMap[errno] || "创建成功");
                this.dialogVisible = false;
                // refresh to keep server sort/number in sync
                this.page = 1;
                this.fetchList();
                // 可选：创建后直接进入详情
                // this.$router.push({ name: 'TemplateEdit', params: { id: data.id } })
              } else {
                this.$message.error(ErrMap[errno] || errmsg || "创建失败");
              }
            })
          } else {
            createGoodsTemplate(formData).then(({ errno, errmsg }) => {
              if (errno === "success" || errno === 0) {
                this.$message.success(ErrMap[errno] || "创建成功");
                this.dialogVisible = false;
                // refresh to keep server sort/number in sync
                this.page = 1;
                this.fetchList();
                // 可选：创建后直接进入详情
                // this.$router.push({ name: 'TemplateEdit', params: { id: data.id } })
              } else {
                this.$message.error(ErrMap[errno] || errmsg || "创建失败");
              }
            })
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

<style lang="scss" scoped>
.mt-20 {
  margin-top: 20px;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  .batchButton {
    display: flex;
    align-items: center;
  }
}
</style>
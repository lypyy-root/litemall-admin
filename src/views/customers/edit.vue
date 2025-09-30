<!-- src/views/customers/edit.vue -->
<template>
  <div class="app-container">
    <el-page-header
      @back="$router.back()"
      :content="id ? '编辑客户' : '新增客户'"
      class="mb-2"
    />

    <!-- 终端客户基础信息 -->
    <el-card shadow="never" class="mb-2" header="终端客户基础信息">
      <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
          <!-- 左列 -->
          <el-col :span="12">
            <el-form-item label="店主姓名">
              <el-input v-model="form.userName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="客户openID绑定">
              <div class="openid-row">
                <el-input v-model="form.openId" placeholder="请输入" />
                <el-button class="ml-8" @click="handleQueryOpenId"
                  >查询</el-button
                >
                <el-button class="ml-8" type="primary" @click="handleBindOpenId"
                  >绑定</el-button
                >
              </div>
            </el-form-item>

            <el-form-item label="客户来源">
              <el-select v-model="form.source" placeholder="请选择">
                <el-option label="线上引流" value="online" />
                <el-option label="线下拜访" value="offline" />
                <el-option label="转介绍" value="refer" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>

            <el-form-item label="客户状态">
              <el-radio-group v-model="form.userStatus">
                <el-radio :label="0">潜在</el-radio>
                <el-radio :label="1">意向</el-radio>
                <el-radio :label="2">购买中</el-radio>
                <el-radio :label="3">流失</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="客户报价策略">
              <el-radio-group v-model="form.userLevel">
                <el-radio :label="0">默认价格</el-radio>
                <el-radio :label="1">客户专属价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 右列 -->
          <el-col :span="12">
            <el-form-item label="店铺名称">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="店铺电话">
              <el-input v-model="form.phone" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="负责人电话/姓名">
              <el-input v-model="form.adminName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="业务员电话/姓名">
              <el-input v-model="form.salesmanName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="渠道">
              <el-select v-model="form.channel" placeholder="请选择">
                <el-option label="台球厅" value="billiards" />
                <el-option label="商超" value="market" />
                <el-option label="医药渠道" value="pharma" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 门店信息 -->
    <!-- 门店信息 -->
    <el-card shadow="never" class="mb-2" header="门店信息">
      <div class="mb-2">
        <el-button type="primary" @click="addStore">新增门店</el-button>
      </div>

      <el-collapse v-model="activeStores">
        <el-collapse-item
          v-for="(s, idx) in form.storeList"
          :key="s.id || idx"
          :name="String(idx)"
          :title="`门店 ${idx + 1}`"
        >
          <!-- ⚠️ 给每个门店一份独立的 el-form，这样 el-form-item 能正常布局显示 -->
          <el-form :model="s" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="门店名称">
                  <el-input v-model="s.storeName" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店主姓名">
                  <el-input v-model="s.storeNikeName" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="店主电话">
                  <el-input v-model="s.storePhone" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订货负责人">
                  <el-input v-model="s.leadName" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="门店地址">
                  <el-input
                    v-model="s.storeAddress"
                    placeholder="请输入详细地址"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="下单周期">
                  <el-input v-model="s.orderCycle" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="门店面积">
                  <el-input v-model="s.storeArea" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-button type="danger" @click="removeStore(idx)"
                  >删除该门店</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 财务信息（总是展示表单；即使对象为空也初始化） -->
    <!-- 财务信息 -->
    <el-card shadow="never" class="mb-2" header="财务信息">
      <!-- 用 el-form 包裹，避免表单项“消失”样式问题 -->
      <el-form :model="form.finance" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否开票">
              <el-switch v-model="form.finance.isInvoice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户名称">
              <el-input v-model="form.finance.account" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人识别号">
              <el-input v-model="form.finance.taxpayerSn" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行">
              <el-input v-model="form.finance.bankOfDeposit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行账号">
              <el-input v-model="form.finance.accountNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="form.finance.address" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 操作 -->
    <div style="text-align: right">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomerDetail, updateCustomerDetail } from "@/api/customers";

export default {
  name: "CustomerEdit",
  data() {
    return {
      id: this.$route.query.id || "",
      form: {
        // 提交所需
        userId: "",
        userName: "",
        userStatus: 0,
        userLevel: 0,
        isSigning: 0,
        templateId: "",
        // 展示扩展
        name: "",
        openId: "",
        phone: "",
        source: "",
        adminName: "",
        salesmanName: "",
        channel: "",
        // 门店 + 财务
        storeList: [],
        finance: {
          isInvoice: false,
          account: "",
          taxpayerSn: "",
          address: "",
          bankOfDeposit: "",
          accountNumber: "",
        },
      },
      activeStores: [],
      blankStore: {
        storeName: "",
        storeNikeName: "",
        storePhone: "",
        leadName: "",
        storeAddress: "",
        orderCycle: "",
        storeArea: "",
      },
    };
  },
  async created() {
    if (this.id) {
      try {
        await this.loadDetail();
      } catch (e) {
        this.$message.error("无效的客户ID或数据获取失败");
        this.$router.back();
        return;
      }
    }
  },
  methods: {
    async loadDetail() {
      const { data } = await getCustomerDetail(this.id);
      if (!data) throw new Error("NotFound");
      this.form = Object.assign(this.form, data);
      if (data.userTemplate && data.userTemplate.code) {
        this.form.templateId = data.userTemplate.code;
      }
      this.activeStores = (this.form.storeList || []).map((_, i) => i);
    },

    async handleSave() {
      try {
        const payload = {
          userId: this.form.userId,
          userName: this.form.userName,
          userStatus: this.form.userStatus,
          userLevel: this.form.userLevel,
          isSigning: this.form.isSigning,
          templateId: this.form.templateId,
          storeList: this.form.storeList,
          finance: {
            ...this.form.finance,
            isInvoice: this.form.finance.isInvoice ? 1 : 0,
          },
        };
        await updateCustomerDetail(payload);
        this.$message.success("保存成功");
        this.$router.back();
      } catch (e) {
        this.$message.error("保存失败");
      }
    },

    addStore() {
      this.form.storeList.push({
        storeName: "",
        storeNikeName: "",
        storePhone: "",
        leadName: "",
        storeAddress: "",
        orderCycle: "",
        storeArea: "",
      });
      this.activeStores = this.form.storeList.map((_, i) => String(i));
    },

    removeStore(idx) {
      this.$confirm("确认删除该门店吗？", "提示", { type: "warning" })
        .then(() => {
          this.form.storeList.splice(idx, 1);
          this.ensureOneStoreForm();
          this.activeStores = this.form.storeList.map((_, i) => i);
        })
        .catch(() => {});
    },

    // OpenID 查询/绑定占位
    handleQueryOpenId() {
      this.$message.info("TODO: 调用后端查询 OpenID 的接口");
    },
    handleBindOpenId() {
      this.$message.info("TODO: 调用后端绑定 OpenID 的接口");
    },
  },
};
</script>

<style scoped>
.mb-2 {
  margin-bottom: 16px;
}
.openid-row {
  display: flex;
  align-items: center;
}
.ml-8 {
  margin-left: 8px;
}
</style>

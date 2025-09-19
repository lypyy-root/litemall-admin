<!-- 
<template>
  <div class="app-container">
    <el-page-header @back="$router.back()" content="编辑客户" class="mb-2" />

    <el-card shadow="never" class="mb-2" header="终端客户基础信息">
      <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="店主姓名">
              <el-input v-model="form.userName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺名称">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户OpenID">
              <el-input v-model="form.openId" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺电话">
              <el-input v-model="form.phone" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="客户状态">
              <el-select v-model="form.userStatus" placeholder="请选择">
                <el-option :value="0" label="潜在" />
                <el-option :value="1" label="意向" />
                <el-option :value="2" label="购买中" />
                <el-option :value="3" label="流失" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="报价策略">
              <el-radio-group v-model="form.level">
                <el-radio :label="0">默认价格</el-radio>
                <el-radio :label="1">专属报价</el-radio>
                <el-radio :label="2">客户单独价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mb-2" header="门店信息">
      <div class="mb-2">
        <el-button type="primary" @click="addStore">新增门店</el-button>
      </div>

      <el-collapse v-model="activeStores">
        <el-collapse-item
          v-for="(s, idx) in form.storeList"
          :key="s.id || idx"
          :name="idx"
          :title="`门店 ${idx + 1}`"
        >
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
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-card shadow="never" class="mb-2" header="财务信息">
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
    </el-card>

    <div style="text-align: right">

      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template> -->

<!-- <script>
import { getCustomerDetail, updateCustomerDetail } from "@/api/customer";

export default {
  name: "CustomerEdit",
  data() {
    return {
      id: this.$route.query.id,
      form: {
        userId: "",
        userName: "",
        userStatus: 0,
        userLevel: 0,
        isSigning: 0,
        templateId: "",
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
    };
  },
  async created() {
    await this.loadDetail();
  },

  methods: {
    async loadDetail() {
      const { data } = await getCustomerDetail(this.id);
      // 直接覆盖（对齐文档字段）
      if (data) {
        this.form = Object.assign(this.form, data);
        this.activeStores = this.form.storeList.map((_, i) => i);
      }
    },
    async handleSave() {
      try {
        await updateCustomerDetail(this.form);
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
      this.activeStores = this.form.storeList.map((_, i) => i);
    },
    removeStore(idx) {
      this.$confirm("确认删除该门店吗？", "提示", { type: "warning" })
        .then(() => {
          this.form.storeList.splice(idx, 1);
          this.activeStores = this.form.storeList.map((_, i) => i);
        })
        .catch(() => {});
    },
  },
};
</script> -->
<!-- src/views/customer/edit.vue -->
<template>
  <div class="app-container">
    <el-page-header @back="$router.back()" content="编辑客户" class="mb-2" />

    <el-card shadow="never" class="mb-2" header="终端客户基础信息">
      <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="店主姓名">
              <el-input v-model="form.userName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺名称">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户OpenID">
              <el-input v-model="form.openId" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺电话">
              <el-input v-model="form.phone" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="客户状态">
              <el-select v-model="form.userStatus" placeholder="请选择">
                <el-option :value="0" label="潜在" />
                <el-option :value="1" label="意向" />
                <el-option :value="2" label="购买中" />
                <el-option :value="3" label="流失" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="报价策略">
              <el-radio-group v-model="form.userLevel">
                <el-radio :label="0">默认价格</el-radio>
                <el-radio :label="1">专属报价</el-radio>
                <el-radio :label="2">客户单独价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mb-2" header="门店信息">
      <div class="mb-2">
        <el-button type="primary" @click="addStore">新增门店</el-button>
      </div>

      <el-collapse v-model="activeStores">
        <el-collapse-item
          v-for="(s, idx) in form.storeList"
          :key="s.id || idx"
          :name="idx"
          :title="`门店 ${idx + 1}`"
        >
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
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-card shadow="never" class="mb-2" header="财务信息">
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
    </el-card>

    <div style="text-align: right">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomerDetail, updateCustomerDetail } from "@/api/customer";

export default {
  name: "CustomerEdit",
  data() {
    return {
      id: this.$route.query.id,
      form: {
        userId: "",
        userName: "",
        userStatus: 0,
        userLevel: 0,
        isSigning: 0,
        templateId: "",
        name: "",
        openId: "",
        phone: "",
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
    };
  },
  async created() {
    await this.loadDetail();
  },
  methods: {
    async loadDetail() {
      const { data } = await getCustomerDetail(this.id);
      if (data) {
        this.form = Object.assign(this.form, data);
        if (data.userTemplate) {
          this.form.templateId = data.userTemplate.code;
        }
        this.activeStores = this.form.storeList.map((_, i) => i);
      }
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
      this.activeStores = this.form.storeList.map((_, i) => i);
    },
    removeStore(idx) {
      this.$confirm("确认删除该门店吗？", "提示", { type: "warning" })
        .then(() => {
          this.form.storeList.splice(idx, 1);
          this.activeStores = this.form.storeList.map((_, i) => i);
        })
        .catch(() => {});
    },
  },
};
</script>

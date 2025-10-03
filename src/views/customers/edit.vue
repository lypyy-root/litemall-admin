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
      <el-form ref="baseForm" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <!-- 左列 -->
          <el-col :span="12">
            <el-form-item label="店主姓名" prop="userName">
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

            <el-form-item required label="客户状态">
              <el-radio-group v-model="form.userStatus">
                <el-radio :label="0">潜在</el-radio>
                <el-radio :label="1">意向</el-radio>
                <el-radio :label="2">购买中</el-radio>
                <el-radio :label="3">流失</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item required label="客户报价策略">
              <el-radio-group v-model="form.userLevel">
                <el-radio :label="0">默认价格</el-radio>
                <el-radio :label="1">客户专属价</el-radio>
                <el-radio :label="2">客户单独价</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 财务信息（放在报价策略下方） -->
            <el-card shadow="never" class="mb-2 inner-card" header="财务信息">
              <el-form :model="form.finance" label-width="120px">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="结算方式">
                      <el-radio-group v-model="form.isSigning">
                        <el-radio :label="0">签单</el-radio>
                        <el-radio :label="1">线上支付</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="发票">
                      <el-radio-group v-model="form.finance.isInvoice">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                      </el-radio-group>
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
                    <el-form-item label="开户行地址">
                      <el-input v-model="form.finance.address" />
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
                </el-row>
              </el-form>
            </el-card>

            <el-form-item label="报价模板ID">
              <el-input
                v-model="form.templateId"
                placeholder="userTemplate.code"
              />
            </el-form-item>
          </el-col>

          <!-- 右列 -->
          <el-col :span="12">
            <el-form-item label="店铺名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="店铺电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="负责人电话/姓名">
              <el-input v-model="form.adminName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="业务员电话/姓名">
              <el-input v-model="form.salesmanName" placeholder="请输入" />
            </el-form-item>

            <!-- 必填：渠道（右列底部） -->
            <el-form-item required>
              <template #label>渠道 </template>
              <el-select
                v-model="form.channel"
                placeholder="请选择"
                class="w-100"
              >
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
          <!-- 每个门店独立表单（便于布局） -->
          <el-form :model="s" label-width="120px">
            <el-row :gutter="20">
              <!-- 收货人名称（必填） -->
              <el-col :span="12">
                <el-form-item required>
                  <template #label> 收货人名称 </template>
                  <el-input v-model="s.storeNikeName" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <!-- 收货人电话（必填） -->
              <el-col :span="12">
                <el-form-item required>
                  <template #label> 收货人电话 </template>
                  <el-input v-model="s.storePhone" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <!-- 门头照（单张） -->
              <el-col :span="12">
                <el-form-item required label="门头照（限1张）">
                  <template #label> 门头照 </template>
                  <el-upload
                    :action="null"
                    list-type="picture-card"
                    :limit="1"
                    :file-list="s._storePicFile"
                    :before-upload="beforeImageUpload"
                    :http-request="(opts) => uploadStorePic(opts, s)"
                    :on-remove="() => onStorePicRemove(s)"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>

              <!-- 客户经纬度（必填） -->
              <el-col :span="12">
                <el-form-item required>
                  <template #label> 客户经纬度 </template>
                  <div class="latlng">
                    <el-input v-model="s.storeAccuracy" placeholder="精度" />
                    <el-input v-model="s.storeDimensions" placeholder="纬度" />
                  </div>
                </el-form-item>
              </el-col>

              <!-- 客户详细地址（必填 -> 城市/区域/街道 + 详细地址） -->
              <el-col :span="24">
                <el-form-item required>
                  <template #label> 客户详细地址 </template>
                  <div class="region">
                    <el-input
                      v-model="s.city"
                      placeholder="城市（示例：北京市）"
                      class="region-item"
                    />
                    <el-input
                      v-model="s.district"
                      placeholder="区域（示例：朝阳区）"
                      class="region-item"
                    />
                    <el-input
                      v-model="s.street"
                      placeholder="街道（示例：金盏街道）"
                      class="region-item"
                    />
                  </div>
                  <el-input
                    class="mt-8"
                    v-model="s.storeAddress"
                    placeholder="请输入详细地址"
                  />
                </el-form-item>
              </el-col>

              <!-- 下单周期 -->
              <el-col :span="12">
                <el-form-item required label="下单周期">
                  <template #label> 下单周期 </template>
                  <el-input v-model="s.orderCycle" placeholder="请输入天数" />
                </el-form-item>
              </el-col>

              <!-- 门店面积 -->
              <el-col :span="12">
                <el-form-item label="门店面积">
                  <el-input v-model="s.storeArea" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <!-- 配送路线（多张） -->
              <el-col :span="12">
                <el-form-item label="配送路线（多张）">
                  <el-upload
                    :action="null"
                    list-type="picture-card"
                    multiple
                    :file-list="s._deliveryFiles"
                    :before-upload="beforeImageUpload"
                    :http-request="(opts) => uploadRoutePic(opts, s)"
                    :on-remove="(file) => onRouteRemove(file, s)"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>

              <!-- 配送备注信息 -->
              <el-col :span="12">
                <el-form-item label="配送备注信息">
                  <el-input v-model="s.deliveryRemarks" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <!-- 删除门店 -->
              <el-col :span="24">
                <el-button type="danger" @click="removeStore(idx)"
                  >删除门店</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
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
import { uploadImage } from "@/api/upload";
// 如需上传鉴权：import { getToken } from '@/utils/auth'

export default {
  name: "CustomerEdit",
  data() {
    return {
      id: this.$route.query.id || "",

      form: {
        // 提交字段
        userId: "",
        userName: "",
        userStatus: 0,
        userLevel: 0,
        isSigning: 0,
        templateId: "",
        // 展示字段
        name: "",
        openId: "",
        phone: "",
        adminName: "",
        salesmanName: "",
        source: "",
        channel: "",
        // 门店 + 财务
        storeList: [],
        finance: {
          isInvoice: 0,
          account: "",
          taxpayerSn: "",
          address: "",
          bankOfDeposit: "",
          accountNumber: "",
        },
      },

      rules: {
        userName: [
          { required: true, message: "请输入店主姓名", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        phone: [{ required: true, message: "请输入店铺电话", trigger: "blur" }],
      },
      activeStores: [],
    };
  },
  async created() {
    if (this.id) await this.loadDetail();
    this.form.userId = this.form.userId || this.id || "";
  },
  methods: {
    async loadDetail() {
      const res = await getCustomerDetail(this.id);
      const ok = res?.errno === "success" || !res?.errno;
      const data = ok ? res.data || res : null;
      if (!data) {
        this.$message.error(res?.errmsg || "获取客户详情失败");
        throw new Error("NotFound");
      }

      // 合并顶层
      this.form = Object.assign(this.form, data);
      this.form.userId = data.userId || data.id || this.id;
      this.form.templateId = data?.userTemplate?.code || "";

      // 门店 normalize
      const rawStores = Array.isArray(data.storeList) ? data.storeList : [];
      this.form.storeList = rawStores.map((s) => {
        // deliveryUrl 可能是 null / 字符串(JSON) / 数组
        let urls = [];
        if (Array.isArray(s.deliveryUrl)) urls = s.deliveryUrl;
        else if (typeof s.deliveryUrl === "string" && s.deliveryUrl.trim()) {
          try {
            urls = JSON.parse(s.deliveryUrl);
          } catch {
            urls = [s.deliveryUrl];
          }
        }
        const storePic = s.storePicUrl
          ? [{ name: "门头照", url: s.storePicUrl }]
          : [];
        return {
          city: s.city || "",
          district: s.district || "",
          street: s.street || "",
          ...s,
          deliveryUrl: urls, // 实际提交字段
          _storePicFile: storePic, // 上传组件预览
          _deliveryFiles: urls.map((u, i) => ({ name: `route-${i}`, url: u })),
        };
      });

      // 财务 normalize
      const f = data.finance || {};
      this.form.finance = Object.assign(
        {
          isInvoice: 0,
          account: "",
          taxpayerSn: "",
          address: "",
          bankOfDeposit: "",
          accountNumber: "",
        },
        f
      );

      this.activeStores = this.form.storeList.map((_, i) => String(i));
    },

    // 图片校验：图片类型 + <=5MB
    beforeImageUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) this.$message.error("仅支持图片文件");
      if (!isLt5M) this.$message.error("图片大小不能超过 5MB");
      return isImage && isLt5M;
    },

    // 门头照 上传成功
    onStorePicSuccess(res, file, store) {
      const url =
        res?.url ||
        res?.data?.url ||
        (file.response && (file.response.url || file.response.data?.url)) ||
        "";
      if (!url) return this.$message.error("上传失败：未返回URL");
      store.storePicUrl = url;
      store._storePicFile = [{ name: file.name || "门头照", url }];
    },
    // 门头照 移除
    onStorePicRemove(store) {
      store.storePicUrl = "";
      store._storePicFile = [];
    },

    // 配送路线 上传成功
    onRouteUploadSuccess(res, file, store) {
      const url =
        res?.url ||
        res?.data?.url ||
        (file.response && (file.response.url || file.response.data?.url)) ||
        "";
      if (!url) return this.$message.error("上传失败：未返回URL");
      if (!Array.isArray(store.deliveryUrl)) store.deliveryUrl = [];
      if (!Array.isArray(store._deliveryFiles)) store._deliveryFiles = [];
      store.deliveryUrl.push(url);
      store._deliveryFiles.push({
        name: file.name || `route-${Date.now()}`,
        url,
      });
    },
    // 配送路线 移除
    onRouteRemove(file, store) {
      store._deliveryFiles = (store._deliveryFiles || []).filter(
        (f) => f.url !== file.url
      );
      store.deliveryUrl = (store.deliveryUrl || []).filter(
        (u) => u !== file.url
      );
    },

    addStore() {
      this.form.storeList.push({
        id: "",
        userId: this.form.userId,
        addressId: "",
        // 必填/核心
        storeNikeName: "",
        storePhone: "",
        storeAccuracy: "",
        storeDimensions: "",
        city: "",
        district: "",
        street: "",
        storeAddress: "",
        // 其他
        storeName: "",
        orderCycle: "",
        storeArea: "",
        leadName: "",
        leadPhone: "",
        storePicUrl: "",
        deliveryUrl: [],
        deliveryRemarks: "",
        isDefault: false,
        channel: "",
        // 上传组件 file-list
        _storePicFile: [],
        _deliveryFiles: [],
      });
      this.activeStores = this.form.storeList.map((_, i) => String(i));
    },

    removeStore(idx) {
      this.$confirm("确认删除该门店吗？", "提示", { type: "warning" })
        .then(() => {
          this.form.storeList.splice(idx, 1);
          this.activeStores = this.form.storeList.map((_, i) => String(i));
        })
        .catch(() => {});
    },

    // 顶部 openid 按钮占位
    handleQueryOpenId() {
      this.$message.info("TODO: 调用后端查询 OpenID 的接口");
    },
    handleBindOpenId() {
      this.$message.info("TODO: 调用后端绑定 OpenID 的接口");
    },

    // 提交前校验（顶部 + 门店关键字段 + 渠道）
    async handleSave() {
      // 基础表单校验
      const valid = await new Promise((resolve) => {
        this.$refs.baseForm.validate((ok) => resolve(ok));
      });
      if (!valid) return;

      if (!this.form.channel) {
        this.$message.error("请选择渠道");
        return;
      }

      // 校验每个门店的必填
      for (let i = 0; i < this.form.storeList.length; i++) {
        const s = this.form.storeList[i];
        if (!s.storeNikeName)
          return this.$message.error(`门店${i + 1}: 请填写收货人名称`);
        if (!s.storePhone)
          return this.$message.error(`门店${i + 1}: 请填写收货人电话`);
        if (!s.storeAccuracy || !s.storeDimensions)
          return this.$message.error(`门店${i + 1}: 请填写客户经纬度`);
        if (!s.storeAddress)
          return this.$message.error(`门店${i + 1}: 请填写客户详细地址`);
      }

      // 确保 userId
      this.form.userId = this.form.userId || this.id;
      if (!this.form.userId) {
        this.$message.error("缺少用户ID，无法保存");
        return;
      }

      // 组装 payload
      const payload = {
        userId: this.form.userId,
        userName: this.form.userName,
        userStatus: this.form.userStatus,
        userLevel: this.form.userLevel,
        isSigning: this.form.isSigning,
        templateId: this.form.templateId,
        storeList: this.form.storeList.map((s) => {
          const { _storePicFile, _deliveryFiles, ...rest } = s;
          // 若后端需要字符串：rest.deliveryUrl = JSON.stringify(rest.deliveryUrl || [])
          return rest;
        }),
        finance: {
          ...this.form.finance,
          isInvoice: this.form.finance.isInvoice ? 1 : 0,
        },
      };

      try {
        await updateCustomerDetail(payload);
        this.$message.success("保存成功");
        this.$router.back();
      } catch (e) {
        this.$message.error("保存失败");
      }
    },
  },
};
</script>

<style scoped>
.mb-2 {
  margin-bottom: 16px;
}
.mt-8 {
  margin-top: 8px;
}
.ml-8 {
  margin-left: 8px;
}
.req {
  color: #f56c6c;
  margin-right: 4px;
}
.openid-row {
  display: flex;
  align-items: center;
}
.latlng {
  display: flex;
  gap: 8px;
}
.region {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.region-item {
  width: 180px;
}
.inner-card {
  border: 1px solid #f0f2f5;
}
.w-100 {
  width: 100%;
}
</style>

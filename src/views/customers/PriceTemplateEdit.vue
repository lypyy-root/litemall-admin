<!-- src/views/customer/PriceTemplateEdit.vue
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
</script> -->
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

            <!-- 财务信息 -->
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
          <el-form :model="s" label-width="120px">
            <el-row :gutter="20">
              <!-- 收货人名称 -->
              <el-col :span="12">
                <el-form-item required>
                  <template #label>收货人名称</template>
                  <el-input v-model="s.storeNikeName" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <!-- 收货人电话 -->
              <el-col :span="12">
                <el-form-item required>
                  <template #label>收货人电话</template>
                  <el-input v-model="s.storePhone" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <!-- 门头照（单张） -->
              <el-col :span="12">
                <el-form-item required label="门头照（限1张）">
                  <template #label>门头照</template>
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

              <!-- 客户经纬度 -->
              <el-col :span="12">
                <el-form-item required>
                  <template #label>客户经纬度</template>
                  <div class="latlng">
                    <el-input v-model="s.storeAccuracy" placeholder="精度" />
                    <el-input v-model="s.storeDimensions" placeholder="纬度" />
                  </div>
                </el-form-item>
              </el-col>

              <!-- 详细地址 -->
              <el-col :span="24">
                <el-form-item required>
                  <template #label>客户详细地址</template>
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
                  <template #label>下单周期</template>
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
import { uploadImage } from "@/api/upload"; // POST /admin/storage/create

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

      this.form = Object.assign(this.form, data);
      this.form.userId = data.userId || data.id || this.id;
      this.form.templateId = data?.userTemplate?.code || "";

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
          deliveryUrl: urls,
          _storePicFile: storePic,
          _deliveryFiles: urls.map((u, i) => ({ name: `route-${i}`, url: u })),
        };
      });

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

    // 上传前校验
    beforeImageUpload(file) {
      const isImage = file.type?.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) this.$message.error("仅支持图片文件");
      if (!isLt5M) this.$message.error("图片大小不能超过 5MB");
      return isImage && isLt5M;
    },

    // 自定义上传：门头照（单图）
    async uploadStorePic({ file, onSuccess, onError }, store) {
      try {
        const res = await uploadImage(file);
        if (res?.errno === "success" || res?.errno === 0) {
          const url = res?.data?.url || res?.url;
          if (!url) throw new Error("未返回URL");
          store.storePicUrl = url;
          store._storePicFile = [{ name: file.name || "门头照", url }];
          this.$message.success("门头照上传成功");
          onSuccess?.(res.data || { url }, file);
        } else if (res?.errno === 501) {
          this.$message.error("请登录");
          this.$router.push("/login");
          onError?.(new Error("Unauthenticated"));
        } else {
          const msg = res?.errmsg || "上传失败";
          this.$message.error(msg);
          onError?.(new Error(msg));
        }
      } catch (e) {
        this.$message.error("网络或服务器异常");
        onError?.(e);
      }
    },

    // 移除门头照
    onStorePicRemove(store) {
      store.storePicUrl = "";
      store._storePicFile = [];
    },

    // 自定义上传：配送路线（多图）
    async uploadRoutePic({ file, onSuccess, onError }, store) {
      try {
        const res = await uploadImage(file);
        if (res?.errno === "success" || res?.errno === 0) {
          const url = res?.data?.url || res?.url;
          if (!url) throw new Error("未返回URL");
          if (!Array.isArray(store.deliveryUrl)) store.deliveryUrl = [];
          if (!Array.isArray(store._deliveryFiles)) store._deliveryFiles = [];
          store.deliveryUrl.push(url);
          store._deliveryFiles.push({
            name: file.name || `route-${Date.now()}`,
            url,
          });
          this.$message.success("配送路线图片上传成功");
          onSuccess?.(res.data || { url }, file);
        } else if (res?.errno === 501) {
          this.$message.error("请登录");
          this.$router.push("/login");
          onError?.(new Error("Unauthenticated"));
        } else {
          const msg = res?.errmsg || "上传失败";
          this.$message.error(msg);
          onError?.(new Error(msg));
        }
      } catch (e) {
        this.$message.error("网络或服务器异常");
        onError?.(e);
      }
    },

    // 移除配送路线图片
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
        storeNikeName: "",
        storePhone: "",
        storeAccuracy: "",
        storeDimensions: "",
        city: "",
        district: "",
        street: "",
        storeAddress: "",
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

    handleQueryOpenId() {
      this.$message.info("TODO: 调用后端查询 OpenID 的接口");
    },
    handleBindOpenId() {
      this.$message.info("TODO: 调用后端绑定 OpenID 的接口");
    },

    // 保存
    async handleSave() {
      // 顶部验证
      const valid = await new Promise((resolve) => {
        this.$refs.baseForm.validate((ok) => resolve(ok));
      });
      if (!valid) return;

      if (!this.form.channel) {
        this.$message.error("请选择渠道");
        return;
      }

      // 校验每个门店
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

      this.form.userId = this.form.userId || this.id;
      if (!this.form.userId) {
        this.$message.error("缺少用户ID，无法保存");
        return;
      }

      const payload = {
        userId: this.form.userId,
        userName: this.form.userName,
        userStatus: this.form.userStatus,
        userLevel: this.form.userLevel,
        isSigning: this.form.isSigning,
        templateId: this.form.templateId,
        storeList: this.form.storeList.map((s) => {
          const { _storePicFile, _deliveryFiles, ...rest } = s;
          // 如需要字符串：rest.deliveryUrl = JSON.stringify(rest.deliveryUrl || [])
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

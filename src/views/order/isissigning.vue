<template>
    <div class="app-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container">
        <el-form :model="listQuery" size="small" :inline="true">
<!--          <el-form-item label="序号ID">
            <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
          </el-form-item>-->

          <el-form-item label="订单编号">
            <el-input v-model="listQuery.orderSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单编号" />
          </el-form-item>

<!--          <el-form-item label="查询类型">
            <div class="show-type">
              <el-switch v-model="listQuery.showType" />
              <div>{{listQuery.showType ? '已付款' : '未付款'}}</div>
            </div>
          </el-form-item>-->

<!--          <el-form-item label="商品序号">
            <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品序号" />
          </el-form-item>-->

          <el-form-item label="店铺序号">
            <el-input v-model="listQuery.brandId" clearable class="filter-item" style="width: 200px;" placeholder="请输入店铺序号" />
          </el-form-item>

<!--          <el-form-item label="物流单号">
            <el-input v-model="listQuery.shipSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入物流单号" />
          </el-form-item>

          -->

<!--          <el-form-item label="订单状态">
            <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择订单状态">
              <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value" />
            </el-select>
          </el-form-item>-->

          <el-form-item label="起始日期">
            <el-date-picker v-model="listQuery.timeArray" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
          </el-form-item>

          <el-form-item label="查询数量">
            <el-input v-model="listQuery.limit" clearable class="filter-item" style="width: 200px;" placeholder="输入0查询全部" />
          </el-form-item>

          <el-form-item>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出订单</el-button>
            <el-button :loading="downloadLoadingBHD" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownloadBHD">下载备货单</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-tabs v-model="listQuery.showType" type="card" @tab-click="handleClick">
        <el-tab-pane :label="`全部`" name="0"></el-tab-pane>
<!--        <el-tab-pane :label="`待付款 (${info.n1})`" name="1"></el-tab-pane>-->
        <el-tab-pane :label="`未付款`" name="1"></el-tab-pane>
<!--        <el-tab-pane :label="`待发货 (${info.n2})`" name="2"></el-tab-pane>-->
<!--        <el-tab-pane :label="`待收货 (${info.n3})`" name="3"></el-tab-pane>-->
        <el-tab-pane :label="`已付款`" name="2"></el-tab-pane>
<!--        <el-tab-pane :label="`已取消 (${info.n5})`" name="5"></el-tab-pane>-->
      </el-tabs>
      <!-- 查询结果 -->
      <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

        <el-table-column type="expand">
          <template slot-scope="props">
            <GoodDetail v-for="item in props.row.goodsVoList" :good="item" :key="item.id"></GoodDetail>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="120" label="订单编号" prop="orderSn" />

        <el-table-column align="center" label="用户头像" width="80">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.userAvatar" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="用户昵称" prop="userName" />

        <el-table-column align="center" label="下单日期" prop="addTime" min-width="100">
          <template slot-scope="scope">
            {{ (scope.row.addTime || '').substring(0, 10) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="订单状态" prop="orderStatus" min-width="130">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.orderStatusText }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="商品总价" prop="goodsPrice" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.goodsPrice }} 元
          </template>
        </el-table-column>

        <el-table-column align="center" label="实付金额" prop="actualPrice" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.actualPrice }} 元
          </template>
        </el-table-column>

        <el-table-column align="center" label="支付时间" prop="payTime">
          <template slot-scope="scope">
            {{ (scope.row.payTime || '').substring(11) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="收货姓名" prop="consignee">
          <template slot-scope="scope">
            <span style="color:red; font-weight:bold;">{{ scope.row.consignee }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="收货电话" prop="mobile" min-width="120" />

        <el-table-column align="center" label="收货地址" prop="address" min-width="180"/>

        <el-table-column align="center" label="物流单号" prop="shipSn" />

        <el-table-column align="center" label="物流渠道" prop="shipChannel" />

        <el-table-column align="center" label="订单备注" prop="message" :show-overflow-tooltip="true"/>

        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <!-- <el-button v-if="scope.row.orderStatus == 102 || scope.row.orderStatus == 103" type="info" size="mini" @click="handleDelete(scope.row)">删除</el-button> -->
            <el-button v-if="scope.row.orderStatus == 200 || scope.row.orderStatus == 201 || scope.row.orderStatus == 304" type="info" size="mini" @click="handleCancel(scope.row)">取消</el-button>
            <el-button v-if="scope.row.orderStatus == 101 || scope.row.orderStatus == 301" type="warning" size="mini" @click="handlePay(scope.row)">收款</el-button>
            <el-button v-if="scope.row.orderStatus == 200 || scope.row.orderStatus == 201 || scope.row.orderStatus == 304 || scope.row.orderStatus == 100" type="success" size="mini" @click="handleShip(scope.row)">发货</el-button>
            <el-button v-if="scope.row.orderStatus == 202 || scope.row.orderStatus == 303" type="danger" size="mini" @click="handleRefund(scope.row)">退款</el-button>

          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


      <!-- 收款对话框 -->
      <el-dialog :visible.sync="payDialogVisible" title="订单收款" width="60%" center>
        <el-form ref="payForm" :model="payForm" status-icon label-position="left" label-width="100px">
          <div style="margin-bottom: 10px;">
            确认当前订单【订单编号 {{ payForm.orderSn }} ) 已经完成线下收款  ？
          </div>
          <el-form-item label="订单金额" prop="oldMoney">
            <el-input-number v-model="payForm.oldMoney" :controls="false" disabled />
          </el-form-item>
          <el-form-item label="付款金额" prop="newMoney">
            <el-input-number v-model="payForm.newMoney" :controls="false" />
          </el-form-item>
        </el-form>
        <el-table :data="payForm.goodsList">
          <el-table-column property="goodsName" label="商品" />
          <el-table-column label="规格">
            <template slot-scope="scope">
              {{ scope.row.specifications.join('-') }}
            </template>
          </el-table-column>
          <el-table-column property="onumber" width="100" label="下单数量" />
          <el-table-column label="实际数量" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.number" :min="0" :controls="false" />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="payDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmPay">确定</el-button>
        </div>
      </el-dialog>

      <!-- 发货对话框 -->
      <el-dialog :visible.sync="shipDialogVisible" title="确认发货？">
        <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="快递公司" prop="shipChannel">
            <el-select v-model="shipForm.shipChannel" placeholder="请选择">
              <el-option v-for="item in channels" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="shipSn">
            <el-input v-model="shipForm.shipSn" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="shipDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmShip">确定</el-button>
        </div>
      </el-dialog>

       <!-- 分配业务员对话框 -->
       <el-dialog :visible.sync="assocationSalesman2" title="分配业务员？">
        <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="快递公司" prop="shipChannel">
            <el-select v-model="shipForm.shipChannel" placeholder="请选择">
              <el-option v-for="item in channels" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="shipSn">
            <el-input v-model="shipForm.shipSn" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assocationSalesman2 = false">取消</el-button>
          <el-button type="primary" @click="confirmShip">确定</el-button>
        </div>
      </el-dialog>

      <!-- 删除对话框 -->
      <el-dialog :visible.sync="deleteDialogVisible" title="确认删除？" width="80%">
        <el-form ref="deleteForm" :model="deleteForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete">确定</el-button>
        </div>
      </el-dialog>

      <!-- 退款对话框 -->
      <el-dialog :visible.sync="refundDialogVisible" title="退款">
        <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="退款金额" prop="refundMoney">
            <el-input v-model="refundForm.refundMoney" :disabled="true" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="refundDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmRefund">确定</el-button>
        </div>
      </el-dialog>


      <!-- 订单详情对话框 -->
      <el-dialog :visible.sync="orderDialogVisible" title="订单详情"  width="80%">
        <el-form :data="orderDetail" label-position="left">
          <div class="new-cover" >
            <div class="printBox" ref="pr" id="print">
              <div id="imgBox">
                <div style="height: 30px;"></div>
                <div class="title">订单详情</div>
                <div style="height: 30px;"></div>

                <el-form-item label="订单信息" class="tab"></el-form-item>
                <div class="table-layout tab" >
                  <el-row>
                    <el-col :span="4" class="table-cell-title">订单编号</el-col>
                    <el-col :span="4" class="table-cell-title">订单状态</el-col>
                    <el-col :span="4" class="table-cell-title">商品总数</el-col>
                    <el-col :span="4" class="table-cell-title">商品金额</el-col>
                    <el-col :span="4" class="table-cell-title">实际付款</el-col>
                    <el-col :span="4" class="table-cell-title">用户留言</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" class="table-cell">{{orderDetail.orderSn}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.orderStatusText}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.goodsNumber}}</el-col>
                    <el-col :span="4" class="table-cell">¥{{orderDetail.goodsPrice}}</el-col>
                    <el-col :span="4" class="table-cell">¥{{orderDetail.actualPrice}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.message}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" class="table-cell-title">下单用户</el-col>
                    <el-col :span="4" class="table-cell-title">下单电话</el-col>
                    <el-col :span="4" class="table-cell-title">收件姓名</el-col>
                    <el-col :span="4" class="table-cell-title">收件电话</el-col>
                    <el-col :span="4" class="table-cell-title">收货地址</el-col>
                    <el-col :span="4" class="table-cell-title">下单时间</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" class="table-cell">{{orderDetail.userName}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.userMobile}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.consignee}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.mobile}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.address}}</el-col>
                    <el-col :span="4" class="table-cell">{{orderDetail.addTime}}</el-col>
                  </el-row>
                </div>

                <div style="height: 30px;"></div>

                <el-form-item label="商品信息" class="tab">
                  <el-table :data="orderDetail.goodsVoList" border fit highlight-current-row>
                    <el-table-column align="center" label="商品名称" prop="goodsName" />
                    <el-table-column align="center" label="商品编号" prop="goodsSn" />
                    <el-table-column align="center" label="货品规格" prop="specifications" />
                    <el-table-column align="center" label="货品价格" prop="price" />
                    <el-table-column align="center" label="货品数量" prop="number" />
                    <el-table-column align="center" label="货品图片" prop="picUrl">
                      <template slot-scope="scope">
                        <img :src="scope.row.picUrl" width="40">
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品小计" prop="picUrl">
                      <template slot-scope="scope">
                        ¥{{ Number(scope.row.price * scope.row.number).toFixed(2) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>

                <div style="height: 30px;"></div>

                <el-form-item label="费用信息" class="tab">
                   <span>
                      【实际支付：{{ orderDetail.actualPrice }}元】
                     =【商品总价：{{ orderDetail.goodsPrice }}元】
                     +【物流费用：{{ orderDetail.freightPrice }}元】
                     -【团购优惠：{{ orderDetail.grouponPrice }}元】
                     -【优惠券减免：{{ orderDetail.couponPrice }}元】
                     -【余额减免：{{ orderDetail.integralPrice }}元】
                   </span>
                 </el-form-item>
                 <el-form-item label="支付信息" class="tab">
                   <span>【支付渠道：微信支付】</span>
                   <span>【支付时间：{{ orderDetail.payTime }}】</span>
                 </el-form-item>
                <el-form-item label="物流信息" class="tab">
                   <span>【物流公司：{{ orderDetail.shipChannel }}】</span>
                   <span>【物流单号：{{ orderDetail.shipSn }}】</span>
                   <span>【发货时间：{{ orderDetail.shipTime }}】</span>
                 </el-form-item>
                 <el-form-item label="退款信息" class="tab">
                   <span>【退款金额：{{ orderDetail.refundAmount }}元】</span>
                   <span>【退款类型：{{ orderDetail.refundType }}】</span>
                   <span>【退款备注：{{ orderDetail.refundContent }}】</span>
                   <span>【退款时间：{{ orderDetail.refundTime }}】</span>
                 </el-form-item>
                 <el-form-item label="收货信息" class="tab">
                   <span>【确认收货时间：{{ orderDetail.confirmTime }}】</span>
                 </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="printDetail">打 印</el-button>
        </span>
      </el-dialog>

    </div>
  </template>


  <style lang="scss" scoped>
    .new-cover {
      width: 75vw;
      height: 125vh;
      left: 0;
      top: 0;
      background-color: rgb(154, 154, 154);
      z-index: 99;

      .printBox {
        width: 1154px;
        height: 991px;
        background: #FFFFFF;
        border-radius: 17px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;

        .tab {
          width: 1050px;
          margin: 0 auto;
        }

        .title {
          width: 96px;
          height: 33px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1C1D21;
          margin: 0 auto;
        }
      }
    }


    .filter-container {
      margin-top: 20px;
    }

    .table-layout {
      margin-top: 20px;
      border-left: 1px solid #DCDFE6;
      border-top: 1px solid #DCDFE6;
    }
    .table-cell {
      height: 60px;
      line-height: 40px;
      border-right: 1px solid #DCDFE6;
      border-bottom: 1px solid #DCDFE6;
      padding: 10px;
      font-size: 14px;
      color: #606266;
      text-align: center;
      overflow: hidden;
    }
    .table-cell-title {
      border-right: 1px solid #DCDFE6;
      border-bottom: 1px solid #DCDFE6;
      padding: 10px;
      background: #F2F6FC;
      text-align: center;
      font-size: 14px;
      color: #303133;
    }

    .el-link {
      margin-left: 12px;
    }

    .table-expand {
      font-size: 0;
      padding-left: 60px;
    }

    .table-expand label {
      width: 100px;
      color: #99a9bf;
    }

    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
    }

    .gallery {
      width: 80px;
      margin-right: 10px;
    }

    .goods-detail-box img {
      width: 100%;
    }

    .show-type {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  </style>


  <script>

  import html2canvas from 'html2canvas';
  import GoodDetail from '@/components/GoodDetail'
  import { detailOrder, orderIsissig, listChannel, refundOrder, payOrder, deleteOrder, shipOrder , cancelOrder ,infoOrder} from '@/api/order'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import checkPermission from '@/utils/permission' // 权限判断函数

  const statusMap = {
    101: '未付款',
    102: '用户取消',
    103: '系统取消',
    104: '管理员取消',
    200: '线下付款',
    201: '已付款',
    202: '申请退款',
    203: '已退款',
    301: '待开团',
    302: '团购中',
    303: '团购失败',
    304: '团购成功',
    401: '已发货',
    402: '用户收货',
    403: '系统收货',
    404: '评价已超时',
    405: '交易完成',
    601: '售后申请中',
    602: '售后处理中',
    603: '售后已完成',
    604: '售后已拒绝',
  }

  export default {
    name: 'Order',
    components: { Pagination , GoodDetail},
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          showType: false,
          brandId: undefined,
          orderSn: undefined,
          timeArray: [],
          orderStatusArray: [],
          sort: 'add_time',
          order: 'desc'
        },
        info: {
          n0: 0, //全部
          n1: 0, //待付款
          n6: 0, //已签单
          n2: 0, //代发货
          n3: 0, //待收货
          n4: 0, //已完成
          n5: 0, //已取消
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        statusMap,
        orderDetail: {},
        shipForm: {
          orderId: undefined,
          shipChannel: undefined,
          shipSn: undefined
        },
        deleteForm: {
          orderId: undefined,
        },
        payForm: {
          orderId: undefined,
          orderSn: '',
          oldMoney: 0,
          newMoney: 0,
          goodsList: []
        },
        refundForm: {
          orderId: undefined,
          refundMoney: undefined
        },
        orderDialogVisible: false,
        shipDialogVisible: false,
        assocationSalesman2: false,
        payDialogVisible: false,
        refundDialogVisible: false,
        deleteDialogVisible: false,
        downloadLoading: false,
        downloadLoadingBHD: false,
        channels: []
      }
    },
    created() {
      this.init()
      this.getChannel()
    },
    methods: {
      checkPermission,

      init: function() {
        this.listQuery.brandId = this.$route.query.brandId
        this.getList()
      },

      handleClick(tab, event) {
        console.log('tab query', tab.index, tab.name);
       /* if (tab.index === '0') {
          this.listQuery.orderStatusArray = []
        } else {
          this.listQuery.orderStatusArray = [tab.index]
        }*/
        this.listQuery.page = 1
        this.getList()
      },

      getList() {
        this.listLoading = true
        const queryParams = Object.assign({}, this.listQuery);
        if (queryParams.timeArray && queryParams.timeArray.length === 2) {
          queryParams.start = queryParams.timeArray[0]
          queryParams.end = queryParams.timeArray[1]
        } else {
          queryParams.start = null
          queryParams.end = null
        }
        if (queryParams.showType === true) {
          queryParams.showType = 1
        } else {
          queryParams.showType = 0
        }
        orderIsissig(queryParams).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })

        infoOrder().then(response => {
          this.info = response.data;
        })
      },

      getChannel() {
        listChannel().then(response => {
          this.channels = response.data
        })
      },

      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },

      handlePay(row) {
        this.payForm.orderId = row.id
        this.payForm.orderSn = row.orderSn
        this.payForm.oldMoney = row.actualPrice
        this.payForm.newMoney = row.actualPrice
        this.payForm.goodsList = row.goodsVoList
        this.payForm.goodsList.forEach(element => {
          element.onumber = element.number
        })
        this.payDialogVisible = true
      },

      confirmPay() {
        if (this.payForm.oldMoney !== this.payForm.newMoney) {
          const diff = this.payForm.newMoney - this.payForm.oldMoney
          this.$confirm('差额 ' + diff + '元， 是否确认提交').then(_ => {
            this.confirmPay2()
          }).catch(_ => {})
        } else {
          this.confirmPay2()
        }
      },

      confirmPay2() {
        payOrder(this.payForm).then(response => {
          this.$notify.success({
            title: '成功',
            message: '订单收款操作成功'
          })
          this.getList()
        }).finally(() => {
          this.payDialogVisible = false
        })
      },

      handleCancel(row){
        this.$confirm('确定要取消订单?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          cancelOrder(row).then(response => {
            this.$notify.success({
              title: '成功',
              message: '订单取消成功'
            })
            this.getList()
          })
        }).catch(() => {})
      },

      handleShip(row) {
        this.shipForm.orderId = row.id
        this.shipForm.shipChannel = row.shipChannel
        this.shipForm.shipSn = row.shipSn

        this.shipDialogVisible = true
        this.$nextTick(() => {
          this.$refs['shipForm'].clearValidate()
        })
      },
      // 分配业务员
      assocationSalesman(row) {
        this.shipForm.orderId = row.id
        this.shipForm.shipChannel = row.shipChannel
        this.shipForm.shipSn = row.shipSn

        this.assocationSalesman2 = true
        this.$nextTick(() => {
          this.$refs['shipForm'].clearValidate()
        })
      },

      confirmShip() {
        this.$refs['shipForm'].validate((valid) => {
          if (valid) {
            shipOrder(this.shipForm).then(response => {
              this.shipDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '确认发货成功'
              })
              this.getList()
            })
          }
        })
      },

      handleDelete(row) {
        this.deleteForm.orderId = row.id
        this.deleteDialogVisible = true
        this.$nextTick(() => {
          this.$refs['deleteForm'].clearValidate()
        })
      },

      confirmDelete() {
        this.$refs['deleteForm'].validate((valid) => {
          if (valid) {
            deleteOrder(this.deleteForm.orderId).then(response => {
              this.deleteDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '订单删除成功'
              })
              this.getList()
            })
          }
        })
      },

      handleRefund(row) {
        this.refundForm.orderId = row.id
        this.refundForm.refundMoney = row.actualPrice

        this.refundDialogVisible = true
        this.$nextTick(() => {
          this.$refs['refundForm'].clearValidate()
        })
      },

      confirmRefund() {
        this.$refs['refundForm'].validate((valid) => {
          if (valid) {
            refundOrder(this.refundForm).then(response => {
              this.refundDialogVisible = false
              this.$notify.success({
                title: '成功',
                message: '确认退款成功'
              })
              this.getList()
            })
          }
        })
      },

      handleDetail(row) {
        this.orderDetail = row
        this.orderDialogVisible = true
      },

      //打印订单货品清单
      printDetail(){
        let dom = document.getElementById("print");
        setTimeout(()=>{
          html2canvas(dom, {
            width: 1150,
            height: 990
          }).then(canvas => {
            const imgUrl = canvas.toDataURL("image/jpeg");
            //导出图片
            let a = document.createElement("a")
            a.href = imgUrl;
            a.setAttribute("download", "订单详情.jpeg");
            a.click();
          }).catch(e => {
            console.log("!!!err", e);
          })
        },80)
      },

      handleDownload() {
        this.downloadLoading = true
        import('@/utils/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '序号', '订单编号', '用户昵称', '用户电话',
            '用户ID', '下单时间', '订单金额','商品总价', '商品数量',
            '余额减免', '微信支付', '收件姓名', '收货电话','收货地址',
            '物流单号','物流渠道', '备注'
          ]
          const filterVal = [
            'id', 'orderSn', 'userName', 'userMobile',
            'userId', 'addTime', 'orderPrice', 'goodsPrice', 'goodsNumber',
            'integralPrice', 'actualPrice', 'consignee', 'mobile', 'address',
            'shipSn','shipChannel', 'message'
          ]

          excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
          this.downloadLoading = false
        })
      },

      //下载备货单
      handleDownloadBHD(){
        this.downloadLoadingBHD = true
        import('@/utils/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '序号','订单编号','订单状态','下单用户','下单电话','用户ID',
            '下单时间','商品名称','商品数量','商品单价','商品总价'
          ]
          const filterVal = [
            'id', 'orderSn', 'orderStatusText', 'userName','userMobile',
            'userId', 'addTime', 'goodsName', 'number','price','allPrice'
          ]

          let orderList = this.list;
          let goodsList = [];
          for(let order of orderList){
            for(let goods of order.goodsVoList){
              let goodsVo = {
                id: goods.id,
                orderSn: order.orderSn,
                orderStatusText: order.orderStatusText,
                userName: order.userName,
                userMobile: order.userMobile,
                userId: order.userId,
                addTime: order.addTime,
                goodsName: goods.goodsName,
                number: goods.number,
                price: goods.price,
                allPrice: Number(goods.price * goods.number).toFixed(2)
              }
              goodsList.push(goodsVo);
            }
          }
          excel.export_json_to_excel2(tHeader, goodsList, filterVal, '备货单信息')
          this.downloadLoadingBHD = false
        })
      },

      //订单打印
      printOrder() {
        this.$print(this.$refs.print)
        this.orderDialogVisible = false
      }
    }
  }
  </script>

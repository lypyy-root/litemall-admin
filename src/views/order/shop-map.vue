<script>
 import checkPermission from '@/utils/permission' // 权限判断函数
 import Pagination from '@/components/Pagination'
 import {orderMap} from '@/api/order'; // Secondary package based on el-pagination

const statusMap = {
  0: '全部',
  1: '已发货',
  2: '未发货',
}
export default {
  name: 'shopMap',
  comments: {
    Pagination,
  },
  data() {
    return {
      listQuery: {
        nikeName: '',
        phone: '',
        driverName: '',
        address: '',
        timeArray: [],
        orderStatusArray: ['0'],
      },
      list: [],
      statusMap,
      listLoading: false,
      zoom: 12,
      currnetOrderList: [],
      currnetOrder: {},
      /*markers: Array.from({ length: 500 }, (_, i) => ({
        position: [116.3 + Math.random() * 0.5, 39.8 + Math.random() * 0.5],
        extData: `cluster-${i}`,
      })),*/

    }
  },
  created() {
    this.getList()
  },
  beforeUpdate() {
    console.log('mounted', );
    // this.$refs.mousetoolRef.open('polylineTool');
    this.doStartPolyline()
  },
  computed: {
    markers() {
      if (!this.list.length) return []
      const res = this.list.map(item => {
        return {
          position: [item.storeDimensions, item.storeAccuracy],
          extData: item.storeName,
        }
      })
      res.push({
        position: [116.579152,39.889871],
        extData: '发货地址'
      })
      console.log('markers', res);
      return res
    },
    mapCenter() {
      return [116.579152,39.889871]
      /* if (!this.list.length) return [116.579152,39.889871]
      // const res = [this.list[0].storeDimensions, this.list[0].storeAccuracy];
      
      console.log('mapCenter', res);
      return res */
    },
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      const queryParams = {};
      if (this.listQuery.timeArray && this.listQuery.timeArray.length === 2) {
        queryParams.startTime = this.listQuery.timeArray[0]
        queryParams.endTime = this.listQuery.timeArray[1]
      }
      if (this.listQuery.nikeName) {
        queryParams.nikeName = this.listQuery.nikeName
      }
      if (this.listQuery.driverName) {
        queryParams.driverName = this.listQuery.driverName
      }
      if (this.listQuery.address) {
        queryParams.address = this.listQuery.address
      }
      if (this.listQuery.phone) {
        queryParams.phone = this.listQuery.phone
      }
      console.log('queryParams', this.listQuery.orderStatusArray);
      if (this.listQuery.orderStatusArray && this.listQuery.orderStatusArray.length > 0) {
        queryParams.orderStatusArray = this.listQuery.orderStatusArray
      }
      orderMap(queryParams).then(response => {
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
      this.currnetOrder = {};
    },
    handleMarkerClick(item) {
      console.log('handleMarkerClick', item);
      const list = this.list.filter(d => d.userId === item.userId);
      this.currnetOrderList = list;
      this.currnetOrder = list[0];
    },
    handleChangeGoods(item) {
      this.currnetOrder = item;
    },
    onMarkMouseup(e) {
      console.log(e);
    },
    doStartPolyline() {
      this.$refs.mousetoolRef.open('polylineTool');
    }
    /*handleDownload() {
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
    },*/
  }
}
</script>

<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
      <div class="filter-container">
        <el-form :model="listQuery" size="small" :inline="true">
<!--          <el-form-item label="序号ID">
            <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入查询序号ID" />
          </el-form-item>-->

          <el-form-item label="店铺名称">
            <el-input v-model="listQuery.nikeName" clearable class="filter-item" style="width: 200px;" placeholder="请输入店铺名称" />
          </el-form-item>

          <el-form-item label="店铺手机号">
            <el-input v-model="listQuery.phone" clearable class="filter-item" style="width: 200px;" placeholder="请输入店铺手机号" />
          </el-form-item>

<!--          <el-form-item label="商品序号">
            <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品序号" />
          </el-form-item>-->

          <el-form-item label="配送司机">
            <el-input v-model="listQuery.driverName" clearable class="filter-item" style="width: 200px;" placeholder="请输入配送司机" />
          </el-form-item>

          <el-form-item label="配送地址">
            <el-input v-model="listQuery.address" clearable class="filter-item" style="width: 200px;" placeholder="请输入配送地址" />
          </el-form-item>


          <el-form-item label="订单状态">
            <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择订单状态">
              <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value" />
            </el-select>
          </el-form-item>

          <el-form-item label="起始日期">
            <el-date-picker v-model="listQuery.timeArray" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
          </el-form-item>

          <el-form-item>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
<!--            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出订单</el-button>
            <el-button :loading="downloadLoadingBHD" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownloadBHD">下载备货单</el-button>-->
          </el-form-item>
        </el-form>
      </div>

      <div class="map-container">
        <tdt-map :zoom="zoom" :center="mapCenter">
          <tdt-marker
            v-for="(item, index) of list"
            :key="index"
            :position="[item.storeDimensions, item.storeAccuracy]"
            :icon="item.storePicUrl"
            @click="handleMarkerClick(item)"
          ></tdt-marker>
          <tdt-marker
            :position="[116.579152,39.889871]"
            extData="发货地址"
          ></tdt-marker>
          <tdt-mousetool ref="mousetoolRef" :markTool="{ follow: true }" :polylineTool="{showLabel: true}" @mark-mouseup="onMarkMouseup"></tdt-mousetool>
        </tdt-map>
        <div class="goods-container" v-if="currnetOrderList.length > 0">
          <div class="goods-title">店铺：{{currnetOrderList[0].storeName}}</div>
          <div class="goods-tabs">
            <div
               v-for="(item, index) of currnetOrderList"
               :key="`goods-${index}`"
               @click="handleChangeGoods(item)"
               class="tab-item"
               :class="{active: currnetOrder.orderId === item.orderId}"
            >
              订单{{index}}
            </div>
          </div>
          <template v-if="Object.keys(currnetOrder).length > 0">
            <el-row class="goods-info">
              <el-col>店铺名称：{{currnetOrder.storeName}}</el-col>
              <el-col>店主名：{{currnetOrder.storeNikeName}}</el-col>
              <el-col>手机号：{{currnetOrder.storePhone}}</el-col>
              <el-col>地址：{{currnetOrder.storeAddress}}</el-col>
              <el-col>配送司机：{{currnetOrder.orderListResults.shipSn}}</el-col>
              <el-col>收货人：{{currnetOrder.orderListResults.consignee}}</el-col>
              <el-col>收货人电话：{{currnetOrder.orderListResults.mobile}}</el-col>
              <el-col>收货地址：{{currnetOrder.orderListResults.address}}</el-col>
              <el-col>订单编号：{{currnetOrder.orderListResults.orderSn}}</el-col>
              <el-col>商品数量：{{currnetOrder.orderListResults.goodsNumber}}</el-col>
              <el-col>总费用：{{currnetOrder.orderListResults.goodsPrice}}</el-col>
              <el-col>下单时间：{{currnetOrder.orderListResults.orderStatusText}}</el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col style="margin-bottom: 10px;">订单</el-col>
              <el-col v-for="(item) of currnetOrder.orderListResults.goodsVoList" class="goods-card">
                <div class="order-list">
                  <img :src="item.picUrl" class="order-img"/>
                  <div class="order-list-item">
                    <div>{{item.goodsName}}</div>
                    <div>数量：{{item.number}}</div>
                    <div>规格：{{item.specifications.join(',')}}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </template>
        </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: calc(100vh - 270px);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.goods-title {
  font-size: 20px;
  margin-bottom: 10px;
  line-height: 35px;
  font-weight: 700;
}
.goods-info {
  color: #333;
}
.goods-card {
  margin-bottom: 10px;
  background:#f0f0f0;
  padding: 10px;
  border-radius: 5px;
}
.order-list {
  display: flex;
  gap: 8px;
  font-size: 12px;
  .order-list-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .order-img {
    width: 100px;
  }
}

.goods-container {
  min-width: 300px;
  max-width: 300px;
  border: 1px solid #eee;
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  overflow-y: auto;
  .goods-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    .tab-item {
      background: rgba(0, 0, 0, 0.05);
      padding: 3px 10px;
      cursor: pointer;
      border-radius: 5px;
      &.active {
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }
}
.show-type {
  display: flex;
  align-items: center;
  gap: 10px;
}
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
</style>

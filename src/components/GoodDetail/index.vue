<template>
  <div class="root">
    <div>
      <img :src="good.picUrl" />
    </div>
    <div class="desc">
      <div class="good-name">{{good.goodsName}}</div>
      <div class="good-std">
        <div class="std">商品规格：</div>
        <div class="spec">{{good.specifications}}</div>
      </div>
      <div class="good-footer">
        <div>
          <div class="std">商品价格：</div>
          <div class="price">￥{{good.price}}</div>
        </div>
       <div>
         <div class="std">商品数量：</div>
         <div class="num">{{good.number}}</div>
       </div>
       <div>
         <div class="std">合计：</div>
         <div class="price">￥{{ Number((good.price * good.number).toFixed(2)) }}</div>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      good: {
        default: {
          picUrl: '',
          price: 0,
          number: 0,
          specifications: ['标准'],
          goodsName: ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .num{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1D85D8;
  }
  .std {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8890A3;
  }
  .price{
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #F64D24;
  }
  .root {
    margin: 0;
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
    display: flex;
    border-bottom: 1px solid #EAECF5;


    img {
      width: 69px;
      height: 69px;
      border-radius: 8px;
      margin-left: 80px;
      margin-right: 20px;
    }

    .good-footer{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width:424px;
      &>div{
        display: flex;
        align-items: center;
      }
    }
    .desc {
      .good-name {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4C475A;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
      }

      .good-std {
        display: flex;
        margin: 5px 0;
      }
    }

  }
</style>

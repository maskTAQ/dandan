<template>
  <div class="goods-card" @click="click">
    <div
      class="img"
      :style="{ background: `url('${data.gImg}') no-repeat center / cover` }"
    />
    <p class="name ellipsis line-2">{{ data.gName }}</p>
    <p class="old-price">￥{{ data.linePrice }}</p>
    <div class="bottom flex-row main-between center">
      <div class="price flex-row center">
        <i class="label">积分</i>
        <i class="value">{{ data.tallyPrice }}</i>
        <i class="add">+</i>
        <i class="unit">￥</i>
        <i class="value">{{ data.price }}</i>
      </div>
      <!-- <button class="buy align">购买</button> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "GoodsCard",
  props: ["data"],
  methods: {
    buy() {
      this.$emit("buy");
    },
    click() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/theme.scss";
.goods-card {
  .img {
    margin: 0 auto;
    width: 1.32rem;
    height: 1.32rem;
    margin-bottom: 0.04rem;
  }
  .name {
    margin: 0.05rem 0;
    font-size: 0.15rem;
    font-weight: 400;
    color: #333333;
  }
  .old-price {
    font-size: 0.12rem;
    color: #999999;
    font-weight: 500;
    text-decoration: line-through;
  }
  .bottom {
    /* margin: 10px 0;
    font-weight: 500; */
    font-weight: bold;
    .price {
      flex-wrap: wrap;
      position: relative;
      width: 0;
      flex: 1;
      /* height: .2rem;
        line-height: .2rem; */
      /* align-items: flex-end; */
      .label {
        margin-right: 0.04rem;
        font-size: 0.12rem;
        color: #999999;
      }
      .value {
        font-size: 0.18rem;
        color: #ff5601;
      }
      .unit {
        position: relative;
        top: 0.02rem;
        font-size: 0.12rem;
        color: #ff5601;
      }
      .add {
        font-size: 0.16rem;
        margin: 0 0.04rem;
        font-weight: bold;
        color: #ff5601;
      }
    }
    .buy {
      height: 0.2rem;
      /* line-height: 0.2rem; */
      font-size: 0.12rem;
      padding: 0 $padding;
      border: 1px solid $color2;
      border-radius: 0.1rem;
    }
  }
}
</style>
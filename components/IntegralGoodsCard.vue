<template>
  <div class="goods-card flex-row" @click="click">
    <CoverImage class="img" :url="data.gImg"></CoverImage>
    <div>
      <p class="name ellipsis line-2">{{ data.gName }}</p>
      <div class="old-price flex-row center">
        <span class="label">原价</span>
        <span class="value">￥{{ data.linePrice }}</span>
      </div>
      <div class="bottom flex-row main-between center">
        <div class="price flex-row center">
          <i class="label">总计</i>
          <i class="unit">￥</i>
          <i class="value">{{ data.ThePrice }}</i>
          <template v-if="!data.tallyPrice">
            <i class="add">+</i>
            <i class="label">积分</i>
            <i class="value">80{{ data.tallyPrice }}</i>
          </template>
        </div>
        <!-- <button class="buy align">购买</button> -->
      </div>
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
    width: 1rem;
    height: 1rem;
    margin-right: 0.1rem;
  }
  .name {
    margin-bottom: 0.05rem;
    font-size: 0.16rem;
    font-weight: 400;
    color: rgb(16, 22, 35);
  }
  .old-price {
    font-size: 0.12rem;
    color: rgb(173, 173, 173);
    font-weight: 500;
    .value {
      text-decoration: line-through;
    }
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
      .unit,
      .value {
        position: relative;
        top: -0.02rem;
        font-size: 0.22rem;
        color: rgb(255, 136, 9);
      }
      .add {
        position: relative;
        top: -0.02rem;
        font-size: 0.22rem;
        margin: 0 0.04rem;
        font-weight: 600;
        color: rgba(51, 51, 51, 0.51);
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
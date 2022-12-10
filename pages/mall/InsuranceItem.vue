<template>
  <div class="insurance-item flex-row"  @click="click">
    <CoverImage class="img" :url="data.gImg" />
    <div class="info flex-column main-between">
      <div>
        <p class="name ellipsis">{{ data.gName }}</p>
        <p class="subtitle">{{ data.gTital }}</p>
      </div>
      <div class="bottom flex-row main-between center">
        <div class="price flex-row center">
          <i class="unit">￥</i>
          <i class="value">{{ data.price }}</i>
          <i class="label">/起</i>
        </div>
        <!-- <button class="buy align">购买</button> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "insurance-item",
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
<style lang="scss">
.insurance-item {
  .img {
    margin-right: 0.08rem;
    width: 0.86rem;
    height: 0.86rem;
  }
  .info {
    width: 0;
    flex: 1;
    .name {
      font-size: 0.15rem;
      font-weight: 600;
      color: #231916;
    }
    .subtitle {
      font-size: 0.12rem;
      font-weight: 400;
      color: #999999;
    }
    .bottom {
      .price {
        position: relative;
        .unit {
          font-size: 0.08rem;
          color: #ff5601;
        }
        .value {
          position: relative;
          top: -0.04rem;
          margin-top: 4px;
          font-size: 0.18rem;
          font-weight: bold;
          color: #ff5601;
        }
        .label {
          font-size: 0.1rem;
          color: #777a78;
        }
      }
      .buy {
        height: 0.2rem;
        /* line-height: 0.2rem; */
        font-size: 0.12rem;
        padding: 0 10px;
        border: 1px solid red;
        border-radius: 0.1rem;
      }
    }
  }
}
</style>
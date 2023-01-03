<template>
  <div class="by-item flex-row" @click="click">
    <CoverImage class="img" :url="data.gImg" />
    <div class="info flex-column main-between">
      <div>
        <p class="name ellipsis">{{ data.gName }}</p>
        <p class="subtitle">{{ data.gTital }}</p>
        <p class="tag ellipsis">{{ tag }}</p>
      </div>
      <div class="bottom flex-row main-between center">
        <div class="price flex-row center">
          <i class="unit">￥</i>
          <i class="value">{{ data.ThePrice }}</i>
          <i class="label">/周期</i>
        </div>
        <!-- <span class="yy">{{ data.SalesNum }}人次预约</span> -->
        <!-- <button class="buy align">购买</button> -->
      </div>
    </div>
  </div>
</template>
<script>
import { getTagList } from "@/utils";
export default {
  name: "by-item",
  props: ["data"],
  methods: {
    buy() {
      this.$emit("buy");
    },
    click() {
      this.$emit("click");
    },
  },
  computed: {
    tag() {
      return getTagList({ text: this.data.Tag }).join(" ");
    },
  },
};
</script>
<style lang="scss">
.by-item {
  padding: 0.05rem 0;
  .img {
    margin-right: 0.08rem;
    width: 0.86rem;
    height: 0.86rem;
    border-radius: 0.04rem;
  }
  .info {
    width: 0;
    flex: 1;
    .name {
      font-size: 0.12rem;
      font-weight: 500;
      color: rgb(51, 51, 51);
    }
    .subtitle {
      font-size: 0.1rem;
      font-weight: 400;
      color: rgb(153, 153, 153);
    }
    .tag {
      font-size: 0.1rem;
      font-weight: 400;
      color: rgb(105, 199, 199);
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
      .yy {
        font-size: 0.1rem;
        font-weight: 400;
        color: rgb(106, 106, 106);
      }
    }
  }
}
</style>
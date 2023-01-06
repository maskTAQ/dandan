<template>
  <div class="coupon flex-row center">
    <div class="left flex-column align">
      <div class="price flex-row">
        <span class="unit">￥</span>
        <span class="value">{{ data.AmtText || "0" }}</span>
      </div>
      <p class="time">{{ data.time }}</p>
    </div>
    <div class="right flex-column main-center">
      <p class="name">{{ data.cardName }}</p>
      <p class="type">{{ data.cardType == 1 ? "抵扣券" : "打折券" }}</p>
      <p class="hint">领取优惠券进入粉丝福利</p>
    </div>
    <button :isabled="type === '-1'" @click="go" class="use">去使用</button>
  </div>
</template>
<script>
import day from "dayjs";

import { img } from "@/assets";
import { router, COUPON } from "@/utils";
export default {
  name: "coupon",
  props: {
    data: {
      type: Object,
    },
    use: {
      type: Boolean,
      default: true,
    },
    type: [String, Number],
  },
  data() {
    return {
      img,
    };
  },
  computed: {
    time() {
      const { overTime } = this.data;
      return overTime ? day(overTime * 1000).format("YYYY/MM/DD HH:mm:ss") : "";
    },
  },
  methods: {
    go() {
      COUPON.USE(this.data);
      router.back();

      // const gid = this.data.gid;
      // if (gid) {
      //   router.push({
      //     path: "/goods-detail",
      //     id: gid,
      //   });
      // } else {
      //   router.push({
      //     path: "/mall",
      //   });
      // }
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.coupon {
  position: relative;
  /* margin-bottom: 0.14rem; */
  height: 1.1rem;
  background: url("./imgs/normal.png") no-repeat left center / 100%;
  background-size: 100% 100%;
  &.used {
    background: url("./imgs/disabled.png") no-repeat left center / 100%;
  }

  .left {
    width: 0.9rem;
  }
  .right {
    width: 0;
    flex: 1;
    padding-left: 0.1rem;
    height: 100%;
    .name {
      font-size: 0.15rem;
      font-weight: bold;
      color: #333333;
    }
    .type {
      margin-top: 0.045rem;
      margin-bottom: 0.1rem;
      font-size: 0.13rem;
      color: #666666;
    }
  }
  .desc {
    font-size: 0.1rem;
    color: #fff;
  }
  .price {
    position: relative;
    align-items: flex-end;
    color: #fff;
    .unit {
      position: relative;
      top: -0.04rem;
      font-size: 0.09rem;
      font-weight: 600;
    }
    .value {
      font-size: 0.24rem;
      font-weight: 600;
    }
  }
  .time {
    font-size: 0.1rem;
    color: rgba($color: #fff, $alpha: 0.53);
  }
  .use {
    margin-right: 0.15rem;
    height: 0.29rem;
    padding: 0 0.1rem;
    font-size: 0.12rem;
    font-weight: 600;
    color: #ff6543;
    background: #fff6f3;
    border-radius: 0.08rem;
    border: 1px solid #ff6742;
  }
}
</style>
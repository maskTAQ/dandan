<template>
  <div class="hospital-card" @click="click">
    <div class="flex-row">
      <CoverImage class="img" :url="data.gImg">
        <div class="badge align" :style="badgeStyle">
          {{ data.Country }}
        </div>
      </CoverImage>
      <div class="info flex-column main-between">
        <div>
          <p class="name ellipsis">{{ data.gName }}</p>
          <div class="flex-row main-between center">
            <div :class="['cgl-box flex-row', { red: isRed }]">
              <span class="value align">{{ data.SuccessRate }}%</span>
              <span class="label align">成功率</span>
            </div>
            <i class="yy">{{ data.SalesNum }}人次预约</i>
          </div>
        </div>
        <div class="bottom flex-row main-between center">
          <div class="price-box flex-row center">
            <i class="label">试管费用：</i>
            <i class="unit">￥</i>
            <i class="value">{{ data.ThePrice }}</i>
            <i class="label">起</i>
          </div>
          <!-- <button class="buy align">购买</button> -->
        </div>
      </div>
    </div>
    <ScrollView v-if="typeList.length">
      <div class="type-list flex-row">
        <div class="type-item flex-column align" v-for="item in typeList" :key="item.itemid">
          <p class="name">{{ item.itemName }}</p>
          <p class="price">
            <span class="unit">￥</span>
            <span class="value">{{ item.itemPrice }}</span>
          </p>
        </div>
      </div>
    </ScrollView>
  </div>
</template>
<script>
export default {
  name: "hospital-card",
};
</script>
<script>
import TagList from "@/components/TagList";
import ScrollView from "@/components/ScrollView";
import { icons } from "@/assets";

export default {
  name: "hospital-card",
  props: ["data"],
  computed: {
    isRed() {
      return parseInt(this.data.SuccessRate) > 90;
    },
    badgeStyle() {
      if (this.isRed) {
        return {
          background: `url(${icons.nation2}) no-repeat center center / 100% 100%`,
        };
      }
      return {
        background: `url(${icons.nation1}) no-repeat center center / 100% 100%`,
      };
    },
    typeList() {
      return this.data.bonusitem || [];
    },
  },
  methods: {
    buy() {
      this.$emit("buy");
    },
    click() {
      this.$emit("click");
    },
  },
  components: {
    TagList,
    ScrollView,
  },
};
</script>
<style lang="scss">
.hospital-card {
  padding: 0.12rem 0;
  border-bottom: 1px solid #eeeeee;
  .img {
    position: relative;
    margin-right: 0.08rem;
    width: 0.86rem;
    height: 0.64rem;
    .badge {
      position: absolute;
      top: 0;
      right: 0;
      width: 0.5rem;
      height: 0.2rem;
      font-size: 0.12rem;
      color: #fff;
    }
  }
  .info {
    width: 0;
    flex: 1;
    .name {
      margin-bottom: 0.04rem;
      font-size: 0.15rem;
      font-weight: 600;
      color: #231916;
    }
    .subtitle {
      font-size: 0.12rem;
      font-weight: 400;
      color: #999999;
    }
    .cgl-box {
      height: 0.21rem;
      border-radius: 4px;
      border: 1px solid #33ca57;
      overflow: hidden;
      .value {
        min-width: 0.34rem;
        padding: 0 0.04rem;
        font-size: 0.12rem;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(90deg, #76d77f 0%, #2ec954 100%);
      }
      .label {
        min-width: 0.42rem;
        font-size: 0.12rem;
        color: #33ca57;
      }
      &.red {
        border: 1px solid #ff7f48;
        .value {
          background: linear-gradient(90deg, #ff894c 0%, #fe5337 100%);
        }
        .label {
          color: #fe5839;
        }
      }
    }
    .yy {
      font-size: 0.12rem;
      font-weight: 400;
      color: #777a78;
    }
    .bottom {
      .price-box {
        .label {
          font-size: 0.12rem;
          color: #777a78;
        }
        .unit {
          font-size: 0.08rem;
          font-weight: bold;
          color: #f91e00;
        }
        .value {
          position: relative;
          top: -0.02rem;
          font-size: 0.18rem;
          font-weight: bold;
          color: #f91e00;
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
  .type-list {
    margin-top: 0.08rem;
    /* flex-wrap: wrap; */
    .type-item {
      margin-right: 0.05rem;
      height: 0.4rem;
      padding: 0 0.11rem;
      background: rgba(45, 78, 245, 0.1);
      border-radius: 0.08rem;
      .name {
        font-size: 0.1rem;
        color: #6dc7c6;
      }
      .price {
        color: #6dc7c6;
        .unit {
          font-size: 0.07rem;
        }
        .valie {
          font-size: 0.13rem;
        }
      }
    }
  }
}
</style>
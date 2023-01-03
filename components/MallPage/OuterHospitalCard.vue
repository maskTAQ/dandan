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
          <p class="name ellipsis line-2">{{ data.gName }}</p>
          <div class="flex-row center">
            <div :class="['cgl-box flex-row', { red: isRed }]">
              <span class="label align">成功率</span>
              <span class="value align">{{ data.SuccessRate }}%</span>
            </div>
            <span class="line"></span>
            <span class="yy">{{ data.SalesNum }}人次预约</span>
          </div>
          <div class="score-box flex-row center">
            <van-rate
              :value="data.pjScore"
              :size="9"
              color="rgba(0, 188, 197, 0.8)"
              void-icon="star"
              void-color="rgba(0, 188, 197, 0.3);"
            />
            <span class="score">{{data.pjScore}}分</span>
          </div>
        </div>
        <div class="price-box flex-row center">
          <span class="label">试管费用:</span>
          <span class="unit">￥</span>
          <span class="value">{{ data.ThePrice }}</span>
          <span class="label">起</span>
        </div>
      </div>
    </div>
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
import { getTagList } from "@/utils";

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
          background: `url(${icons.nation1}) no-repeat center center / 100% 100%`,
        };
      }
      return {
        background: `url(${icons.nation1}) no-repeat center center / 100% 100%`,
      };
    },
    tagList() {
      return getTagList({ text: this.data.Tag, max: 3 });
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
  /* border-bottom: 1px solid #eeeeee; */
  .img {
    position: relative;
    margin-right: 0.08rem;
    width: 0.96rem;
    height: 0.8rem;
    border-radius: 0.08rem;
    .badge {
      position: absolute;
      top: 0;
      left: 0;
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
      margin-bottom: 0.08rem;
      font-size: 0.12rem;
      font-weight: 600;
      color: rgb(0, 0, 0);
    }
    .subtitle {
      font-size: 0.12rem;
      font-weight: 400;
      color: #999999;
    }
    .cgl-box {
      font-size: 0.1rem;
      font-weight: 400;
      .label {
        color: rgba(116, 116, 116, 0.8);
      }
      .value {
        color: rgb(215, 96, 43);
      }
      /* &.red {
      border: 1px solid #ff7f48;
      .value {
        background: linear-gradient(90deg, #ff894c 0%, #fe5337 100%);
      }
      .label {
        color: #fe5839;
      }
    } */
    }
    .line {
      margin: 0 0.05rem;
      width: 1px;
      height: 0.1rem;
      background: rgb(116, 116, 116);
    }
    .score-box {
      .score {
        margin-left: 0.04rem;
        font-size: 0.1rem;
        color: rgb(153, 153, 153);
      }
    }
    .price-box {
      /* margin-top: 0.11rem; */
      font-size: 0.1rem;
      font-weight: 400;
      .label {
        color: rgb(0, 0, 0);
      }
      .unit {
        font-size: 0.12rem;
        font-weight: 500;
        color: rgb(215, 96, 43);
      }
      .value {
        position: relative;
        top: -0.02rem;
        font-size: 0.18rem;
        font-weight: 500;
        color: rgb(215, 96, 43);
      }
    }

    .tag-list-1 {
      margin-top: 0.04rem;
      .tag {
        margin-right: 0.1rem;
        height: 0.19rem;
        line-height: 0.19rem;
        padding: 0 0.1rem;
        font-size: 0.1rem;
        color: #fff;
        background: rgb(255, 166, 56);
        box-shadow: 0px 0px 20px rgba(30, 36, 58, 0.04);
        border-radius: 0.04rem;
      }
    }
    .yy {
      font-size: 0.12rem;
      font-weight: 400;
      color: #777a78;
    }
    .bottom {
      .addr {
        font-size: 0.1rem;
        color: rgb(106, 106, 106);
      }
      .distance {
        font-size: 0.1rem;
        color: rgb(106, 106, 106);
      }
    }
  }
  .type-list {
    margin-top: 0.08rem;
    /* flex-wrap: wrap; */
    .type-item {
      margin-right: 0.05rem;
      border-radius: 0.08rem;
      .type-cover {
        width: 0.86rem;
        height: 0.54rem;
        border-radius: 0.05rem;
      }
      .name {
        margin: 0.05rem 0;
        font-size: 0.1rem;
        color: rgb(0, 0, 0);
      }
      .price {
        font-size: 0.1rem;
        color: rgb(244, 72, 72);
      }
    }
  }
}
</style>
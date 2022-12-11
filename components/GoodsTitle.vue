<template>
  <div class="goods-title">
    <div :class="['hospital-name', { 'has-country': showCountry }]">
      <span v-if="showCountry" class="tag align">{{ data.fTypeName }}</span>
      <p class="label ellipsis line-2">{{ data.gName }}</p>
    </div>
    <p class="subtitle">{{ data.gTital }}</p>
    <div class="rate-box flex-row center">
      <van-rate
        :value="3"
        :size="9"
        color="rgba(0, 188, 197, 0.8)"
        void-icon="star"
        void-color="rgba(0, 188, 197, 0.3);"
      />
      <span class="value">3分</span>
    </div>
    <div v-if="showKD" class="postage flex-row center">
      <i class="label">快递：{{ data.isInv == "1" ? "包邮" : "不包邮" }}</i>
      <!-- <i class="value">销量：{{ data.SalesNum }}</i> -->
    </div>
    <div v-if="yyLayout === 'row'" class="yy-row-box flex-row main-end">
      <p class="text">预约人数:{{ data.SalesNum }}</p>
    </div>
    <div v-if="yyLayout === 'column'" class="yy-column-box">
      <div class="inner flex-column align">
        <p class="value">{{ data.SalesNum }}</p>
        <p class="yy">预约人数</p>
      </div>
    </div>
    <div v-if="yyLayout === 'goods'" class="yy-goods-box">
      <div class="inner flex-column">
        <p class="xl">销量：{{ data.SalesNum }}</p>
        <div class="price-box flex-row center">
          <span class="old-price">{{ data.linePrice }}</span>
          <span class="unit">￥</span>
          <span class="value">{{ data.ThePrice }}</span>
        </div>
      </div>
    </div>
    <div class="flex-row main-between center">
      <div
        v-if="showSuccess && data.SuccessRate"
        :class="['cgl-box flex-row', { red: isRed }]"
      >
        <span class="value align">{{ data.SuccessRate }}%</span>
        <span class="label align">成功率</span>
      </div>
      <div v-else></div>
      <div v-if="showPrice" class="price-box flex-row center">
        <span class="label">预约费用</span>
        <span class="unit">￥</span>
        <span class="value">{{ data.ThePrice }}</span>
        <span class="label">起</span>
      </div>
      <div v-else></div>
    </div>
    <ScrollView v-if="showType">
      <div class="type-list flex-row">
        <div class="type">
          <div class="cover"></div>
          <p class="name">规格名称</p>
          <p class="price">￥9300</p>
        </div>
      </div>
    </ScrollView>
    <div class="alert" v-if="showTag && tagList.length">
      <span v-for="tag in tagList" :key="tag">{{ tag }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "GoodsTitle",
  props: {
    data: Object,
    showCountry: {
      type: Boolean,
      default: true,
    },
    showSuccess: {
      type: Boolean,
      default: true,
    },
    showPrice: {
      type: Boolean,
      default: true,
    },
    showTag: {
      type: Boolean,
      default: true,
    },
    showType: {
      type: Boolean,
      default: true,
    },
    showKD: {
      type: Boolean,
      default: false,
    },
    yyLayout: {
      type: String,
      default: "column", //row column goods
    },
  },
  computed: {
    tagList() {
      return String(this.data.Tag || "")
        .split(/;/gim)
        .filter((v) => !!v);
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.goods-title {
  background: #fff;
  padding-bottom: 0.2rem;
  .hospital-name {
    /* margin-bottom: 0.08rem; */
    position: relative;
    &.has-country {
      p {
        text-indent: 0.7rem;
      }
    }
    .tag {
      position: absolute;
      top: 0.04rem;
      left: 0;
      width: 0.58rem;
      height: 0.21rem;
      background: rgb(38, 185, 190);
      border-radius: 2px;
      font-size: 0.12rem;
      font-weight: 400;
      color: #ffffff;
    }
    p {
      line-height: 0.28rem;
      font-size: 0.2rem;
      font-weight: 600;
      color: rgb(16, 22, 35);
    }
  }
  .subtitle {
    font-size: 0.14rem;
    font-weight: 500;
    color: rgb(173, 173, 173);
  }
  .rate-box {
    .value {
      margin-left: 0.1rem;
      font-size: 0.14rem;
      font-weight: 600;
      color: rgb(0, 188, 197);
    }
  }
  .yy-row-box {
    .text {
      font-size: 0.14rem;
      color: rgb(153, 153, 153);
    }
  }
  .yy-goods-box {
    position: relative;
    height: 0.22rem;
    .inner {
      position: absolute;
      top: -0.22rem;
      right: 0;
      align-items: flex-end;
    }
    .xl {
      font-size: 0.14rem;
      color: rgb(153, 153, 153);
    }
    .old-price {
      position: relative;
      top: 0.02rem;
      font-size: 0.12rem;
      color: rgb(173, 173, 173);
    }
    .unit,
    .value {
      font-size: 0.26rem;
      font-weight: 600;
      color: rgb(16, 22, 35);
    }
  }
  .yy-column-box {
    position: relative;
    height: 0.22rem;
    .inner {
      position: absolute;
      top: -0.22rem;
      right: 0;
      .value {
        font-size: 0.16rem;
        font-weight: 500;
        color: rgb(215, 96, 43);
      }
      .label {
        margin-top: 0.1rem;
        font-size: 0.1rem;
        font-weight: 500;
        color: rgb(51, 51, 51);
      }
    }
  }
  .cgl-box {
    font-size: 0.16rem;
    font-weight: 600;
    .value {
      color: rgb(0, 0, 0);
    }
    .label {
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
  .price-box {
    /* margin-top: 0.11rem; */
    .label {
      font-size: 0.14rem;
      color: rgb(173, 173, 173);
    }
    .unit {
      font-size: 0.13rem;
      font-weight: bold;
      color: rgb(215, 96, 43);
    }
    .value {
      position: relative;
      top: -0.02rem;
      font-size: 0.24rem;
      font-weight: bold;
      color: rgb(215, 96, 43);
    }
  }
  .postage {
    margin: 0.04rem 0;
    font-size: 0.14rem;
    color: rgb(102, 102, 102);
  }
  .type-list {
    margin: 0.1rem 0;
    .type {
      margin-right: 0.12rem;
    }
    .cover {
      width: 0.91rem;
      height: 0.54rem;
      border-radius: 4px;
      border: 1px solid red;
    }
    .name {
      margin-top: 0.08rem;
      margin-bottom: 0.04rem;
      font-size: 0.1rem;
      color: rgb(0, 0, 0);
    }
    .price {
      font-size: 0.1rem;
      color: rgb(244, 72, 72);
    }
  }
  .alert {
    min-height: 0.5rem;
    /* padding-left: 0.15rem; */
    padding: 0.06rem 0;
    line-height: 0.2rem;
    font-size: 0.14rem;
    font-weight: 500;
    color: rgba(0, 188, 197, 0.8);
    span {
      margin-right: 0.2rem;
    }
  }
}
</style>
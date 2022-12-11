<template>
  <div class="goods-card" @click="click">
    <div class="flex-row center">
      <CoverImage class="cover" :url="data.gImg" />
      <div class="info flex-column main-between">
        <div>
          <p class="name ellipsis">{{ data.gName }}</p>
          <TagList class="tag-list" :data="['B超检查']" />
        </div>
        <div class="flex-row main-between center">
          <span class="yuyue">423人次预约</span>
          <span class="city">北京市 120.12km</span>
        </div>
      </div>
    </div>
    <ul class="spec-list flex-row center">
      <li class="spec">
        <p class="name ellipsis">普通陪诊</p>
        <p class="price">
          <span class="unit">￥</span>
          <span class="value">19.90</span>
        </p>
      </li>
      <li class="spec">
        <p class="name ellipsis">首诊+复诊陪诊</p>
        <p class="price">
          <span class="unit">￥</span>
          <span class="value">129.90</span>
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
import CoverImage from "@/components/CoverImage";
import TagList from "@/components/TagList";

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
  components: {
    CoverImage,
    TagList,
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/theme.scss";
.goods-card {
  padding: 0.12rem 0;
  border-bottom: 1px solid #eeeeee;
  .cover {
    margin-right: 0.08rem;
    width: 0.86rem;
    height: 0.64rem;
    border-radius: 4px;
  }
  .info {
    width: 0;
    flex: 1;
    .name {
      font-size: 0.15rem;
      color: #231916;
    }
    .tag-list {
      margin-top: 4px;
    }
    .yuyue {
      font-size: 0.12rem;
      color: #777a78;
    }
    .city {
      font-size: 0.1rem;
      color: #999990;
    }
  }
  .spec-list {
    margin-top: 0.08rem;

    .spec {
      margin-right: .05rem;
      height: 0.42rem;
      padding: 0.04rem 0.11rem;
      background: rgba(45, 78, 245, 0.1);
      border-radius: 8px;
      color: #6dc7c6;
    }
    .name {
      font-size: 0.12rem;
      font-weight: 400;
    }
    .price {
      .unit {
        font-size: 0.07rem;
      }
      .value {
        font-size: 0.13rem;
      }
    }
  }
}
</style>
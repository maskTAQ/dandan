<template>
  <div :class="['search-result-card',type]">
    <HospitalCard
      v-if="type === TYPE.HOSPITAL"
      @buy="
        go({
          path: '/hospital-detail',
          query: {
            id: data.gid,
          },
        })
      "
      @click="
        go({
          path: '/hospital-detail',
          query: {
            id: data.gid,
          },
        })
      "
      class="goods"
      :data="data"
    />
    <PZItem
      v-if="type === TYPE.SERVER"
      :data="data"
      @click="
        go({
          path: '/goods-detail',
          query: {
            id: data.gid,
          },
        })
      "
    />
    <div
      @click="
        go({
          path: '/goods-detail',
          query: {
            id: data.gid,
          },
        })
      "
      v-if="type === TYPE.GOODS"
      class="classify-goods mall flex-row center"
    >
      <div
        :style="{
          background: `url('${
            toArray(data.gImg, '||')[0]
          }') no-repeat left center / 100%`,
        }"
        class="cover"
      />
      <div class="info flex-column main-between">
        <div>
          <p class="name">{{ data.gName }}</p>
          <div class="tag-list flex-row center">
            <div
              v-for="item in (data.Tag || '').split(';')"
              :key="item"
              class="tag"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="bottom flex-row main-between center">
          <i class="price">￥{{ data.ThePrice || data.linePrice }}</i>
          <i class="sell-num">销量{{ data.SalesNum }}次</i>
        </div>
      </div>
    </div>
    <div
      @click="
        go({
          path: '/class-detail',
          query: { type: '孕圈', id: data.bid },
        })
      "
      v-if="type === TYPE.WIKI"
      class="wiki-goods class flex-row center"
    >
      <CoverImage class="cover" :url="data.PageImg" />
      <div class="info flex-column main-between">
        <p class="name ellipsis line-2">{{ data.Tital }}</p>
        <div class="bottom flex-row main-between center">
          <i class="time">{{ formatTime(data.CreateTime) }}</i>
          <i class="read-num">热度:{{ data.HotNum }}</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HospitalCard from "@/pages/hospital/HospitalCard.vue";
import PZItem from "@/pages/mall/PZItem.vue";

import { router, formatTime, toArray } from "@/utils";
const TYPE = {
  HOSPITAL: "Hospital",
  SERVER: "Service",
  GOODS: "Goods",
  WIKI: "Content",
};
export default {
  name: "",
  props: ["type", "data"],
  data() {
    return {
      TYPE,
    };
  },
  methods: {
    formatTime,
    toArray,
    go({ path, query }) {
      router.push({
        path,
        query,
      });
    },
  },
  components: {
    HospitalCard,
    PZItem,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.search-result-card {
  padding: 0.14rem 0;
  min-height: 1.2rem;

  &.Content,
  &.Goods {
    border-bottom: 1px solid #efefef;
  }
  .tag-list {
    flex-wrap: wrap;
  }
  .doctor {
    .cover {
      margin-right: 0.19rem;
      width: 0.78rem;
      height: 0.78rem;
    }
    .info {
      width: 0;
      flex: 1;
    }
    .name {
      margin-right: 4px;
      font-size: 0.16rem;
      color: #565656;
    }
    .position {
      font-size: 0.12rem;
      color: #565656;
    }
    .hospital {
      margin: 0.06rem 0;
      font-size: 0.1rem;
      color: #2d4ef5;
    }
    .intro {
      font-size: 0.1rem;
      color: #a9a9a9;
    }
  }
  .mall {
    .cover {
      margin-right: 0.19rem;
      width: 0.78rem;
      height: 0.78rem;
    }
    .info {
      width: 0;
      flex: 1;
      min-height: 0.78rem;
    }
    .name {
      font-size: 0.14rem;
      font-weight: bold;
      color: #1f1d3a;
    }
    .tag-list {
      .tag {
        margin-top: 0.04rem;
        margin-right: 0.04rem;
        padding: 0 0.06rem;
        height: 0.18rem;
        line-height: 0.18rem;
        background: rgba($color: $color1, $alpha: 0.08);
        font-size: 0.09rem;
        color: $color1;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .price {
      font-size: 0.14rem;
      color: #f82c5d;
    }
    .sell-num {
      font-size: 0.12rem;
      color: #999999;
    }
  }
  .class {
    .cover {
      margin-right: 0.19rem;
      width: 0.78rem;
      height: 0.78rem;
    }
    .info {
      width: 0;
      flex: 1;
      min-height: 0.78rem;
    }
    .name {
      font-size: 0.14rem;
      font-weight: bold;
      color: #1f1d3a;
    }

    .bottom {
      font-size: 0.1rem;
      color: #999999;
    }
  }
}
</style>
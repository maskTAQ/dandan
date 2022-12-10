<template>
  <div class="mall">
    <div class="content flex-row">
      <StatusHandle :status="goodsClassify.status">
        <div class="sidebar">
          <div
            :class="[
              'sidebar-item flex-row center',
              { selected: !currentType },
            ]"
            @click="currentType = ''"
          >
            <span v-if="!currentType" class="border" />
            <i class="label">全部</i>
          </div>
          <div
            v-for="item in goodsClassify.data || []"
            :key="item.value"
            :class="[
              'sidebar-item flex-row center',
              { selected: currentType === item.value },
            ]"
            @click="currentType = item.value"
          >
            <span v-if="currentType === item.value" class="border" />
            <i class="label">{{ item.label }}</i>
          </div>
        </div>
      </StatusHandle>
      <StatusHandle v-if="goodsClassify.success" status="success">
        <div class="goods-area">
          <SortFilter :data="filter" v-model="sort" />
          <div class="goods-group flex-row">
            <List
              :request="request"
              columnNum="2"
              :renderItem="renderItem"
              class="list"
              ref="list"
            />
          </div>
        </div>
      </StatusHandle>
    </div>
    <TabBar />
  </div>
</template>
<script>
import { mapState } from "vuex";

import { mock, get } from "@/api/http";
import GoodsCard from "@/components/GoodsCard";
import { router, goKf } from "@/utils";

const API = {
  LIST(params) {
    return get("/Api/getGoodsList_api.php", params);
  },
};

export default {
  name: "Mall",
  head() {
    return {
      title: "周边",
    };
  },
  data() {
    return {
      currentType: "",
      filter: [
        {
          label: "销量",
          key: "SalesNum",
        },
        {
          label: "价格",
          key: "price",
        },
      ],
      sort: {
        selcted: "",
        value: "",
      },
      params: {},
    };
  },
  created() {
    this.getGoodsClassify();
  },
  watch: {
    sort() {
      this.refresh();
    },
    currentType() {
      this.refresh();
    },
  },
  computed: mapState(["goodsClassify"]),
  methods: {
    goKf,
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    getGoodsClassify() {
      this.$store.dispatch("getGoodsClassify");
    },
    request(params) {
      const { currentType } = this;
      const { selcted = "OrderNo", value } = this.sort;
      return API.LIST({
        tid: currentType,
        OrderType: selcted,
        AscType: value,
        ...params,
      });
    },
    renderItem(item, i, instance) {
      return (
        <GoodsCard
          onBuy={() => {
            router.push({
              path: "/goods-detail",
              query: {
                id: item.gid,
              },
            });
          }}
          onClick={() => {
            router.push({
              path: "/goods-detail",
              query: {
                id: item.gid,
              },
            });
          }}
          class="goods"
          data={item}
        />
      );
    },
    handleSearchChange(v) {},
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.mall {
  /* margin: 0 -0.15rem; */
  height: 100vh;
  .tool-bar {
    padding: 0.06rem $padding;
    padding-top: 0.21rem;
    margin-bottom: 0.16rem;
  }
  .content {
    height: calc(100vh - 0.76rem);
    .sidebar {
      width: 1rem;
      .sidebar-item {
        position: relative;
        height: 0.5rem;
        /* line-height: 0.5rem; */
        font-size: 0.13rem;
        padding-left: $padding;
        color: $color5;
        &.selected {
          font-size: 0.15rem;
          font-weight: 500;
          background: #fff;
          color: $color4;
        }
        .border {
          position: absolute;
          left: 0;
          top: 0.11rem;
          width: 0.04rem;
          height: 0.28rem;
          border-radius: 0px 0.04rem 0.04rem 0px;
          background: $color2;
        }
      }
    }
    .goods-area {
      width: 0;
      flex: 1;
      height: 100vh;
      background: #fff;
      overflow: auto;
    }
  }
  .goods-group {
    height: calc(100vh - 0.32rem);
    /* margin-left: $padding; */

    .list {
      width: 100vh;
      height: 100vh;
      padding-top: 0.16rem;
      .column-0 {
        padding: 0 0.12rem;
      }
      .column-1 {
        padding-right: 0.12rem;
      }
    }
  }
}
</style>
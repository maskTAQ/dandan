<template>
  <div class="mall page-tab">
    <div class="mall-top">
      <SearchTool2 placeholder="搜索医院/服务/笔记等内容" />
      <StatusHandle :get="getAD">
        <Banner class="banner" :root="bannerType" />
      </StatusHandle>
    </div>
    <div class="filter-area flex-row center">
      <div
        :class="['sidebar-item flex-row center', { selected: !currentType }]"
        @click="currentType = ''"
      >
        <span v-if="!currentType" class="border" />
        <i class="label">海外机构</i>
      </div>
      <GoodsSortFilter
        :isAll="!currentType"
        allText="全部国家"
        @selectAll="currentType = ''"
        :data="filter"
        v-model="sort"
      />
    </div>
    <div class="content flex-row">
      <StatusHandle :status="classify.status">
        <div class="sidebar">
          <div
            v-for="item in classify.data || []"
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
      <StatusHandle v-if="classify.success" status="success">
        <div class="goods-area">
          <div class="goods-group flex-row">
            <List
              :request="request"
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
import { router, goKf } from "@/utils";
import Header from "@/components/Header.vue";
import Search from "@/components/Search.vue";
import Banner from "@/components/Banner.vue";
import GoodsCard from "@/components/GoodsCard";
import IntegralGoodsCard from "@/components/IntegralGoodsCard";
import InsuranceItem from "./InsuranceItem.vue";
import HospitalCard from "./HospitalCard.vue";
import PZItem from "./PZItem.vue";

const API = {
  AD() {
    return get("/Api/getBannerList_api.php", { root: "陪诊服务banner" });
  },
  LIST(params) {
    return get("/Api/getGoodsList_api.php", params);
  },
};

const icons = {
  logo: require("./imgs/icon-text.png"),
  msg: require("./imgs/msg.png"),
  search: require("./imgs/search.png"),
};
export default {
  name: "Mall",
  props: {
    config: {
      type: Object,
    },
  },
  data() {
    return {
      icons,
      currentType: "",
      banner: ["", ""],
      filter: [
        {
          label: "评分",
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
    const { tid } = this.$route.query;
    if (tid) {
      this.currentType = tid;
    }
    if (this.config.type === "hospital") {
      this.getHospitalClassify();
    }
    if (this.config.type === "mall") {
      this.getGoodsClassify();
    }
  },
  watch: {
    sort() {
      this.refresh();
    },
    currentType() {
      this.refresh();
    },
  },
  computed: {
    ...mapState(["hospitalClassify", "goodsClassify"]),
    classify(){
      if(this.config.type === 'hospital'){
        return this.hospitalClassify;
      }else{
        return this.goodsClassify;
      }
    },
    bannerType() {
      const {
        currentType,
        classify: { data },
        config: { defaultBanner },
      } = this;
      let name;
      if (currentType) {
        const match = (data || []).find((item) => item.value === currentType);
        if (!match && (data || []).length) {
          this.currentType = "";
        }
        name = match?.label;
      }
      if (!name) {
        name = defaultBanner;
      }
      return name + "banner";
    },
  },
  methods: {
    goKf,
    getAD() {
      return API.AD().then((res) => {
        console.log(res, "res");
        // this.data.adList = res;
      });
    },
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    getHospitalClassify() {
      this.$store.dispatch("getHospitalClassify");
    },
    getGoodsClassify() {
      this.$store.dispatch("getGoodsClassify");
    },
    request(params) {
      const { currentType, config } = this;
      const { selcted = "OrderNo", value } = this.sort;
      return API.LIST({
        tid: currentType,
        root: currentType ? "" : config.root,
        OrderType: selcted,
        AscType: value,
        ...params,
      });
    },
    renderItem(item, i, instance) {
      if (this.config.type === "hospital") {
        return (
          <HospitalCard
            onBuy={() => {
              router.push({
                path: "/hospital-detail",
                query: {
                  id: item.gid,
                },
              });
            }}
            onClick={() => {
              router.push({
                path: "/hospital-detail",
                query: {
                  id: item.gid,
                },
              });
            }}
            class="goods"
            data={item}
          />
        );
      } else {
        if (!this.currentType) {
          return (
            <PZItem
              data={item}
              onClick={() => {
                router.push({
                  path: "/goods-detail",
                  query: {
                    id: item.gid,
                  },
                });
              }}
            />
          );
        }
        switch (item.TypeName) {
          case "试管保险":
          case "保险服务": {
            return (
              <InsuranceItem
                data={item}
                onClick={() => {
                  router.push({
                    path: "/goods-detail",
                    query: {
                      id: item.gid,
                    },
                  });
                }}
              />
            );
          }
          case "陪诊服务":
          case "备孕门诊": {
            return (
              <PZItem
                data={item}
                onClick={() => {
                  router.push({
                    path: "/goods-detail",
                    query: {
                      id: item.gid,
                    },
                  });
                }}
              />
            );
          }

          default: {
            return (
              <IntegralGoodsCard
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
          }
        }
      }
    },
    handleSearchChange(v) {},
  },
  components: {
    Header,
    Search,
    Banner,
    InsuranceItem,
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.mall {
  background: #f1f5f8;
  .mall-top {
    height: 2.57rem;
    padding: 0 0.15rem;
    .search {
      margin-top: 0.1rem;
      margin-bottom: 0.15rem;
      height: 0.34rem;
      .placeholder {
        margin-left: 0.09rem;
        font-size: 0.14rem;
        line-height: 0.34rem;
      }
    }
    .banner {
    }
  }
  .sidebar {
    width: 1rem;
  }
  .sidebar-item {
    width: 1rem;
    position: relative;
    height: 0.45rem;
    /* line-height: 0.5rem; */
    font-size: 0.14rem;

    padding-left: 0.13rem;
    color: $color5;
    &.selected {
      font-weight: 500;
      /* background: #fff; */
      color: $color2;
    }
    .border {
      position: absolute;
      left: 0;
      top: 0.1rem;
      width: 0.04rem;
      height: 0.28rem;
      /* border-radius: 0px 0.04rem 0.04rem 0px; */
      background: #6dc7c6;
      border-radius: 0px 50px 50px 0px;
    }
  }
  .content {
    height: calc(100% - 2.82rem);
    padding-top: 0.16rem;
    background: #fff;
    /* height: 100%; */

    .goods-area {
      width: 0;
      flex: 1;
      padding-right: 0.15rem;
      height: 100%;
      background: #fff;
      overflow: auto;
    }
  }
  .goods-group {
    height: 100%;
    /* margin-left: $padding; */

    .list {
      width: 100%;
      height: 100%;
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
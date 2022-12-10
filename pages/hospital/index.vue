<template>
  <div class="mall page-tab">
    <div class="mall-top">
      <Header :icons="icons" />
      <Search class="search" placeholder="搜索医院/服务/笔记等内容" />
      <StatusHandle :get="getAD">
        <Banner class="banner" :root="bannerType" />
      </StatusHandle>
    </div>
    <GoodsSortFilter
      :isAll="!currentType"
      @selectAll="currentType = ''"
      :data="filter"
      v-model="sort"
    />
    <div class="content flex-row">
      <StatusHandle :status="hospitalClassify.status">
        <div class="sidebar">
          <div
            v-for="item in hospitalClassify.data || []"
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
      <StatusHandle v-if="hospitalClassify.success" status="success">
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
  head() {
    return {
      title: "医院",
    };
  },
  data() {
    return {
      icons,
      currentType: "",
      banner: ["", ""],
      filter: [
        {
          label: "产品销量",
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
    this.getHospitalClassify();
    
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
    ...mapState(["hospitalClassify"]),
    bannerType() {
      const {
        currentType,
        hospitalClassify: { data },
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
        name = "海外医院";
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
    request(params) {
      const { currentType } = this;
      const { selcted = "OrderNo", value } = this.sort;
      return API.LIST({
        tid: currentType,
        root: currentType ? "" : "医院",
        OrderType: selcted,
        AscType: value,
        ...params,
      });
    },
    renderItem(item, i, instance) {
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
  background: #fff;
  .mall-top {
    height: 2.5rem;
    padding: 0.15rem;
    background: linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%, #ffffff 100%);
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
      height: 1.37rem;
      border-radius: 4px;
      overflow: hidden;
      .swiper-slide {
        height: 1.37rem;
      }
    }
  }
  .content {
    height: calc(100% - 2.82rem);
    padding-top: 0.16rem;
    /* height: 100%; */
    .sidebar {
      width: 1rem;
      .sidebar-item {
        position: relative;
        height: 0.5rem;
        /* line-height: 0.5rem; */
        font-size: 0.14rem;

        padding-left: 0.13rem;
        color: $color5;
        &.selected {
          font-weight: 500;
          background: #fff;
          color: $color2;
        }
        .border {
          position: absolute;
          left: 0;
          top: 0.21rem;
          width: 0.04rem;
          height: 0.08rem;
          /* border-radius: 0px 0.04rem 0.04rem 0px; */
          background: #5c79fb;
          border-radius: 0px 50px 50px 0px;
        }
      }
    }
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
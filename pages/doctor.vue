<template>
  <div ref="scroll" class="doctor page-tab" @scroll="throttleScroll">
    <div class="doctor" @click="go({ path: '/inquiry-list' })">
      <!-- <div class="img"></div> -->
    </div>
    <div class="bottom">
      <div class="title flex-row center">
        <span class="line"></span>
        <span class="label">公益科普</span>
      </div>
      <div v-show="sticky" class="sticky">
        <Tabs
          v-model="tab"
          ref="fixedTab"
          placeholder="全部"
          :data="data.tabList"
        />
      </div>
      <div class="padding-box">
        <StatusHandle :get="getTabList">
          <Tab
            :style="{ opacity: sticky ? 0 : 1 }"
            ref="tab"
            v-model="tab"
            :data="data.tabList"
            placeholder="全部"
            @load="computedY"
          />
        </StatusHandle>

        <img
          v-if="sticky"
          src="../assets/img/scroll-top.png"
          alt=""
          class="scroll-top"
          @click="scrollTo"
        />
        <List
          :request="request"
          :renderItem="renderItem"
          class="list"
          ref="list"
          customControl
        />
      </div>
    </div>

    <TabBar />
  </div>
</template>
<script>
import { mapState } from "vuex";
import _ from "lodash";

import { icons } from "@/assets";
import { get } from "@/api/http";
import { router, toArray, goKf, UID } from "@/utils";
import ArticleCard from "@/components/ArticleCard.vue";
import LoginModal from "@/components/LoginModal";
import ForceLoginModal from "@/components/ForceLoginModal";
import { LIVE_STATUS } from "@/constant";
import HomeBanner from "@/components/HomeBanner";
//
const API = {
  AD() {
    return get("/Api/getBannerList_api.php", { root: "主页banner1" });
  },
  GORUP_LIST(params) {
    return get("/Api/getQQGroupList_api.php", params);
  },
  GORUP_DETAIL() {
    return get("/Api/getQQGroupInfo_api.php");
  },
  COURSE_LIST() {
    return get("/Api/getForumTop_api.php");
  },
  GOODS_LIST() {
    return get("/Api/getGoodsList_api.php", {
      pageIndex: 1,
      pageNum: 3,
    });
  },
  TAB_LIST() {
    return get("/Api2/getContentTypeList_api.php", { root: "医生百科" }).then(
      (list) => (list && list[0] ? list[0]?.children : [])
    );
  },
  LIST(params) {
    return get("/Api/getBaikeList2_api.php", params);
  },
  CURRENT_LIVE() {
    return get("/Api/getNowLive_api.php");
  },
  INSURANCE_INFO() {
    return get("/Api/getBxInfo_api.php");
  },
  PREGNANT_STATUS() {
    return get("/Api/getUserInfo_api.php");
  },
};
export default {
  name: "Home",
  data() {
    return {
      sticky: false,
      icons,
      data: {
        tabList: [],
      },
      tab: "",
    };
  },
  activated() {
    if (this.scrollTop && this.$refs.scroll) {
      this.$refs.scroll.scrollTop = this.scrollTop;
    }
  },
  deactivated() {
    this.scrollTop = this.$refs.scroll.scrollTop;
  },
  created() {
    this.throttleScroll = _.throttle(this.onScroll, 100);
  },
  watch: {
    tab() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    sticky(v) {
      const { tab, fixedTab } = this.$refs;
      if (v) {
        fixedTab.setSelected(tab.selected);
      } else {
        tab.setSelected(fixedTab.selected);
      }
    },
  },
  computed: {
    ...mapState(["myDoctor"]),
    tabList() {
      const { isPregnant } = this;
      return isPregnant ? tabListMap.yes : tabListMap.no;
    },
  },
  methods: {
    initTab() {
      const match = this.data.tabList.find(
        (item) => String(item.tid) === String(this.$route.query.tab)
      );
      if (match) {
        console.log({
          children: match.children,
          value: match.tid,
          node: match,
        });
        this.$refs.tab.setSelected([
          {
            children: match.children,
            value: match.tid,
            node: match,
          },
        ]);
        this.$refs.scroll.scrollTo(0, this.$refs.scroll.scrollHeight);
      }
    },
    routerPush(params) {
      router.push(params);
      // if (UID.GET()) {
      //   router.push(params);
      // } else {
      //   this.forceLoginModalVisible = true;
      //   // this.AdvancedRewardsModalVisible = true
      // }
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(0, 0);
      window.a = this;
    },
    goKf() {
      goKf("doctor");
    },
    toArray,
    getMyDoctor() {
      this.$store.dispatch("getMyDoctor");
    },
    computedY() {
      const { scroll, tab } = this.$refs;
      const y = tab.$el.getBoundingClientRect().y;
      this.tabY = scroll.scrollTop + y;
    },
    getTabList() {
      return API.TAB_LIST().then((res) => {
        this.data.tabList = res;
        this.$nextTick(() => {
          setTimeout(this.initTab, 100);
        });
      });
    },
    request(params) {
      return API.LIST({
        ...params,
        // TypeName2: this.tab,
        tid: this.tab,
        root: this.tab ? "" : "医生百科",
      }).then((res) => {
        console.log(res, "res");
        return res;
      });
    },
    renderItem(item, i, instance) {
      const { PageImg, cover, VideoUrl, Tital, CreateTime, HotNum } = item;
      return (
        <div
          onClick={() => this.goClassDetail(item)}
          class="item flex-row main-between center"
        >
          <div
            class="cover"
            style={{
              background: VideoUrl
                ? `url('${
                    icons.play
                  }') no-repeat center center / .32rem auto,url('${
                    cover || PageImg
                  }') no-repeat center center / cover`
                : `url('${PageImg}') no-repeat center center / 100% auto`,
            }}
          />
          <div class="info flex-column main-between">
            <p class="name ellipsis line-2">{Tital}</p>
            <div class="flex-row main-between center">
              <i class="text">{day(CreateTime * 1000).format("YYYY/MM/DD")}</i>
              <i class="text">{HotNum}人阅读</i>
            </div>
          </div>
        </div>
      );
    },
    renderItem1(item, i, instance) {
      return (
        <ArticleCard
          // imgH={i % 2 === 0 ? "1.5rem" : "1.4rem"}
          imgH={"0.95rem"}
          class="article-card"
          data={item}
          onClick={() => {
            this.routerPush({
              path: "/class-detail",
              query: { type: "百科", id: item.bid },
            });
          }}
        />
      );
    },

    onScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      // let offsetHeight = Math.ceil(e.target.getBoundingClientRect().height);
      const currentHeight = scrollTop + offsetHeight;
      if (this.$refs.list && currentHeight >= scrollHeight) {
        this.$refs.list.loadmore();
      }
      const { scroll, tab } = this.$refs;
      if (scroll && tab && this.tabY) {
        const scrollTop = scroll.scrollTop;
        this.sticky = scrollTop >= this.tabY;
      }
    },
    go({ path, onClick }) {
      if (onClick) {
        onClick();
      }
      if (path) {
        this.routerPush({ path });
      }
    },
    goClassDetail(v) {
      this.routerPush({ path: "/class-detail", query: { id: v.bid } });
    },
    showModel(data) {
      const { qQR } = data;
      this.model = {
        visible: true,
        data: {
          code: qQR,
          title: "长按扫码加群",
          subtitle: "免费获得多项助孕服务",
        },
      };
    },
  },
  components: {
    LoginModal,
    ForceLoginModal,
    HomeBanner,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.doctor {
  .doctor {
    height: 1.33rem;
    padding: 0.15rem;
    background: #fff;
    border-bottom: 5px solid #f1f5fb;
    background: #fff url("../assets/img/doctor-ad.png") no-repeat center
      center/100% 100%;
    /* .img {
      height: 1.33rem - 0.3rem;
      border: 1px solid red;
      background: #fff url("../assets/img/doctor-ad.png") no-repeat center
        center/100% 100%;
    } */
  }
  .bottom {
  }

  .title {
    margin: 0.18rem 0;
    .line {
      margin-right: 0.08rem;
      width: 4px;
      height: 0.18rem;
      background: #2D4EF5;
      border-radius: 0px 3px 3px 0px;
      border: 1px solid #2D4EF5;
    }
    .label {
      font-size: 0.18rem;
      font-weight: bold;
      color: #333333;
    }
  }
  .scroll-top {
    position: fixed;
    top: 80%;
    right: 0.15rem;
    width: 0.3rem;
    z-index: 999;
  }
  .padding-box {
    padding: 0 0.15rem;
  }
  .sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    z-index: 999;
    background: #fff;
    .scroll-content {
      padding: 0 0.15rem;
    }
  }
  .list {
    height: auto;
    .column-0 {
      margin-right: 0.08rem;
    }
    .article-card {
      margin-bottom: 0.08rem;
    }
    .item {
      margin-bottom: 0.16rem;
      .cover {
        margin-right: 0.08rem;
        width: 1.4rem;
        height: 0.9rem;
      }
      .info {
        width: 0;
        flex: 1;
        height: 0.9rem;
      }
      .name {
        font-size: 0.15rem;
        color: $color4;
      }
      .text {
        font-size: 0.12rem;
        color: $color6;
      }
    }
  }
}
</style>
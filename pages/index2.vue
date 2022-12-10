<template>
  <div ref="scroll" class="home page-tab" @scroll="throttleScroll">
    <StatusHandle :get="getPregnantStatus">
      <div :class="['bg-box', isPregnant ? 'yes' : 'no']">
        <ToolBar placeholder="这里有您需要的药品" @clickRightIcon="goKf" />
        <StatusHandle :status="myDoctor.status" @retry="getMyDoctor">
          <DoctorCard :data="myDoctor.data" isParent />
        </StatusHandle>
        <div class="tab-card flex-row">
          <div
            v-for="item in tabList"
            :key="item.title"
            class="item flex-column align"
            @click="go(item)"
          >
            <img :src="item.icon" alt="" />
            <p class="title">{{ item.title }}</p>
          </div>
        </div>
        <div class="goods-tab-card flex-row">
          <div
            v-for="item in goodsTabList"
            :key="item.title"
            class="item flex-column align"
            @click="go(item)"
          >
            <img :src="item.icon" alt="" />
            <p class="title">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </StatusHandle>
    <div class="padding-box">
      <StatusHandle :get="getAD">
        <van-swipe class="ad-list" :indicator="false">
          <van-swipe-item
            v-for="ad in data.adList"
            :key="ad.bid"
            @click="goAD(ad)"
          >
            <CoverImage :url="ad.theImgs[0]" class="ad" />
          </van-swipe-item>
          <div slot="indicator"></div>
        </van-swipe>
      </StatusHandle>

      <StatusHandle :get="getCourseList">
        <div class="course-list flex-row" @click="go({ path: '/class-list' })">
          <Group
            title="热门孕圈"
            more
            moreText="更多"
            :rightIcon="icons.rightBlue"
          >
            <div class="list">
              <div
                v-for="item in data.courseList"
                @click="goClassDetail(item)"
                :key="item.bid"
                class="item flex-row center"
              >
                <CoverImage :url="item.PageImg" class="cover" />
                <div class="info">
                  <p class="title ellipsis line-2">{{ item.Tital }}</p>
                  <!-- <div class="flex-row center main-between">
                    <span class="name">{{ item.writer }}</span>
                    <div class="flex-row center">
                      <img :src="icons.eye" class="eye" alt="" />
                      <span class="num">{{ item.HotNum }}</span>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </Group>
          <div class="my" />
        </div>
      </StatusHandle>

      <div class="gray-box">
        <p class="title">线下服务</p>
        <StatusHandle :get="getGoodsList">
          <van-swipe class="goods-recommend" :indicator="true">
            <van-swipe-item
              v-for="goods in data.goodsList"
              :key="goods.bid"
              @click="goAD(goods)"
            >
              <div class="goods flex-row center">
                <CoverImage :url="goods.gImg" class="cover" />
                <div class="info">
                  <p class="name">{{ goods.gName }}</p>
                  <p class="addr">{{ goods.gTital }}</p>
                  <TagList v-if="goods.Tag" :data="goods.Tag" />
                </div>
                <button class="reserve align">预约体验</button>
              </div>
            </van-swipe-item>
            <div slot="indicator"></div>
          </van-swipe>
        </StatusHandle>
      </div>

      <div id="孕产百科" />
      <StatusHandle :get="getTabList">
        <Tab
          :style="{ opacity: sticky ? 0 : 1 }"
          ref="tab"
          v-model="tab"
          :data="data.tabList"
          @load="computedY"
        />
      </StatusHandle>
      <div v-show="sticky" class="sticky">
        <Tab v-model="tab" ref="fixedTab" :data="data.tabList" />
      </div>
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
    <div
      v-if="data.live"
      :style="{
        background: `url('${data.live.PageImg}') no-repeat left center / cover`,
      }"
      @click="goLive"
      class="live"
    >
      <div class="info flex-row align">
        <img :src="icons.live" alt="" class="icon" />
        <p class="status">{{ LIVE_STATUS[data.live.LiveFlag] }}</p>
      </div>
      <img
        @click.stop="data.live = null"
        :src="icons.close"
        alt=""
        class="close"
      />
    </div>
    <!-- <CodeModal v-model="model.visible" :data="model.data" />
    <LoginModal />
    <ForceLoginModal
      :visible="forceLoginModalVisible"
      @close="forceLoginModalVisible = false"
    /> -->

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
    return get("/Api2/getContentTypeList_api.php", { root: "百科" }).then(
      (list) => list[0].children
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
const tabListMap = {
  yes: [
    {
      title: "成功率评估",
      path: "/propaganda/answers",
      icon: require("../assets/img/cgl-f.png"),
    },
    {
      title: "全周期管理",
      path: "/propaganda/full-cycle-manage-plan",
      icon: require("../assets/img/qzq-f.png"),
    },
    {
      title: "多学科会诊",
      path: "/propaganda/joint-consultation",
      icon: require("../assets/img/hz-f.png"),
    },
    {
      title: "好孕课堂",
      path: "/class-list",
      icon: require("../assets/img/leason-f.png"),
    },
  ],
  no: [
    {
      title: "成功率评估",
      path: "/propaganda/answers",
      icon: require("../assets/img/cgl.png"),
    },
    {
      title: "全周期管理",
      path: "/propaganda/full-cycle-manage-plan",
      icon: require("../assets/img/qzq.png"),
    },
    {
      title: "多学科会诊",
      path: "/propaganda/joint-consultation",
      icon: require("../assets/img/hz.png"),
    },
    {
      title: "好孕课堂",
      path: "/class-list",
      icon: require("../assets/img/leason.png"),
    },
  ],
};
const goodsTabListMap = {
  no: [
    {
      title: "绿通",
      path: "/mall",
      icon: require("../assets/img/vip.png"),
    },
    {
      title: "心理",
      path: "/mall",
      icon: require("../assets/img/xl.png"),
    },
    {
      title: "减重",
      path: "/mall",
      icon: require("../assets/img/jz.png"),
    },
    {
      title: "营养",
      path: "/mall",
      icon: require("../assets/img/yy.png"),
    },
    {
      title: "易学优孕",
      path: "/mall",
      icon: require("../assets/img/dnlc.png"),
    },
    {
      title: "保健",
      path: "/mall",
      icon: require("../assets/img/jz.png"),
    },
  ],
  yes: [
    {
      title: "绿通",
      path: "/mall",
      icon: require("../assets/img/lt-f.png"),
    },
    {
      title: "心理",
      path: "/mall",
      icon: require("../assets/img/xl-f.png"),
    },
    {
      title: "减重",
      path: "/mall",
      icon: require("../assets/img/tz-f.png"),
    },
    {
      title: "营养",
      path: "/mall",
      icon: require("../assets/img/yy-f.png"),
    },
    {
      title: "母婴用品",
      path: "/mall",
      icon: require("../assets/img/my-f.png"),
    },
  ],
};
export default {
  name: "Home",
  data() {
    return {
      sticky: false,
      icons,
      model: {
        visible: false,
        data: {},
      },
      data: {
        adList: [],
        groupList: [],
        courseList: [],
        goodsList: [],
        tabList: [],
        live: null,
        insuranceInfo: null,
      },
      LIVE_STATUS,
      tab: "",
      text: "一次性给付高额赔偿，“手术不成功不花钱”",
      forceLoginModalVisible: false,
      advancedRewardsModalVisible: true,
      isPregnant: false,
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
    this.getMyDoctor();
    this.getCurrentLive();
  },
  // beforeRouteEnter(){
  //   console.log('beforeRouteEnter');
  // },
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
    goodsTabList() {
      const { isPregnant } = this;
      return isPregnant ? goodsTabListMap.yes : goodsTabListMap.no;
    },
  },
  methods: {
    getPregnantStatus() {
      if (!UID.GET()) {
        return Promise.resolve();
      }
      return API.PREGNANT_STATUS().then((res) => {
        this.isPregnant = +res.isState === 0;
      });
    },
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
      goKf("home");
    },
    goPropaganda() {
      //goods-detail?id=163&uid
      return this.routerPush({
        path: "/goods-detail",
        query: {
          id: 160,
        },
      });
    },
    toArray,
    getMyDoctor() {
      this.$store.dispatch("getMyDoctor");
    },
    getAD() {
      return API.AD().then((res) => {
        this.data.adList = res;
      });
    },
    goAD(ad) {
      const { LinkUrl } = ad;
      if (LinkUrl) {
        const url = (LinkUrl || "").includes("http")
          ? LinkUrl
          : `http://${LinkUrl}`;
        console.log(url, "url");
        window.location.href = url;
      }
    },
    getCurrentLive() {
      API.CURRENT_LIVE().then((res) => {
        this.data.live = res;
      });
    },
    getInsuranceInfo() {
      return API.INSURANCE_INFO().then((res) => {
        this.data.insuranceInfo = res;
      });
    },
    goLive() {
      this.routerPush({
        path: "/class-detail",
        query: { type: "孕圈", id: this.data.live.bid },
      });
    },
    getGroupList() {
      return API.GORUP_LIST({ top: 4 }).then((res) => {
        this.data.groupList = res;
      });
    },
    getCourseList() {
      return API.COURSE_LIST().then((res) => {
        // res.length = 2;
        this.data.courseList = res;
      });
    },
    getGoodsList() {
      return API.GOODS_LIST().then((res) => {
        console.log(res, "res");
        this.data.goodsList = res;
      });
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
        root: "三笙",
      })
      .then(res=>{
        console.log(res,'res');
        return res;
      })
    },
    renderItem(item, i, instance) {
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
    goWithParams(path, query) {
      //this.routerPush({ path, query });
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
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.home {
  .bg-box {
    padding: 0.12rem $margin;
    padding-bottom: 0;
    &.yes {
      background: url("../assets/img/home-radius.png") no-repeat center top
          1.34rem / 100% auto,
        url("../assets/img/home-bg-f.png") no-repeat center top / 100% auto;
    }
    &.no {
      background: url("../assets/img/home-radius.png") no-repeat center top
          1.34rem / 100% auto,
        url("../assets/img/home-bg.png") no-repeat center top / 100% auto;
    }
  }
  .padding-box {
    padding: 0.12rem $margin;
    padding-top: 0;
  }
  .live {
    position: fixed;
    right: 0;
    top: 50%;
    margin-top: -0.22rem;
    width: 0.8rem;
    height: 0.45rem;
    z-index: 99;
    border-radius: 4px 0 0 4px;
    .info {
      width: 100%;
      height: 0.16rem;
      margin-top: 0.45rem - 0.16rem;
      background: rgba($color: #000000, $alpha: 0.2);
      .icon {
        margin: 0.04rem;
        width: 0.1rem;
      }
      .status {
        font-size: 0.1rem;
        color: #fff;
      }
    }
    .close {
      position: absolute;
      top: -0.07rem;
      left: -0.07rem;
      width: 0.14rem;
    }
  }
  .tab-card {
    margin-top: 0.24rem;
    .item {
      flex: 1;
    }
    img {
      width: 0.34rem;
      /* height: 0.48rem; */
    }
    .title {
      margin-top: 0.11rem;
      font-size: 0.12rem;
      color: #fff;
      font-weight: 400;
    }
  }
  .goods-tab-card {
    margin-top: 0.24rem;
    padding: 0.24rem 0;
    .item {
      flex: 1;
    }
    img {
      /* width: 0.48rem; */
      height: 0.3rem;
    }
    .title {
      margin-top: 0.1rem;
      font-size: 0.12rem;
      color: #2a2a2a;
      font-weight: 400;
    }
  }
  .ad {
    margin-bottom: 0.24rem;
    display: block;
    width: 100%;
    height: 1.3rem;
    background-size: cover;
    border-radius: 0.1rem;
  }
  .gray-box {
    margin: 0 -0.15rem;
    padding: 0.15rem 0;
    background: #f8f8f8;
    .title {
      margin-bottom: 0.1rem;
      font-size: 0.18rem;
      padding: 0 0.15rem;
      color: #2a2a2a;
      font-weight: bold;
    }
    .goods-recommend {
      .goods {
        position: relative;
        margin: 0 0.15rem;
        padding-left: 0.1rem;
        height: 1.35rem;
        background: url("../assets/img/goods-card.png") no-repeat center center /
          100% 100%;
        .cover {
          width: 0.93rem;
          height: 1rem;
          border-radius: 0.1rem;
        }
        .info {
          margin-top: 0.2rem;
          width: 0;
          flex: 1;
          margin-left: 0.11rem;
        }
        .name {
          font-size: 0.14rem;
          color: #2a2a2a;
          font-weight: bold;
        }
        .addr {
          margin-top: 0.04rem;
          margin-bottom: 0.06rem;
          font-size: 10px;
          font-weight: 400;
          color: #939ba5;
        }
        .reserve {
          position: absolute;
          right: 0;
          bottom: 0.19rem;
          width: 0.8rem;
          height: 0.26rem;
          font-size: 11px;
          font-weight: 500;
          color: #ffffff;
          background: linear-gradient(90deg, #c1daa3 0%, #b3cf90 100%);
          box-shadow: 0px 5px 13px 0px rgba(135, 180, 108, 0.3);
          border-radius: 13px 0px 0px 13px;
        }
      }
    }
  }

  .scroll-top {
    position: fixed;
    top: 80%;
    right: 0.15rem;
    width: 0.3rem;
    z-index: 999;
  }
  .course-list {
    margin-bottom: 0.13rem;
    .group {
      width: 0;
      flex: 1;
      height: 1.52rem;
      padding: 0.07rem;
      background: linear-gradient(-30deg, #eaefff 0%, #f7fbff 99%);
      border-radius: 0.1rem;
      .title {
        margin: 0 0.04rem;
        .label {
          font-size: 0.14rem;
          font-weight: bold;
          color: #4f76eb;
        }
        .more .label {
          font-size: 0.1rem;
          color: #4f76eb;
        }
        .right-icon {
          margin-left: 0;
        }
      }
    }
    .item {
      margin-top: 0.07rem;
      height: 0.53rem;
      background: #fff;
      border-radius: 0.1rem;
      overflow: hidden;
      .cover {
        width: 0.53rem;
        height: 0.53rem;
      }
      .info {
        width: 0;
        flex: 1;
        height: 100%;
        padding: 0.04rem 0.07rem;
        /* margin-left: 0.07rem; */
      }
      .title {
        margin: 0;
        /* margin-bottom: 0.07rem; */
        font-size: 0.1rem;
        color: #2a2a2a;
      }
      .eye {
        margin-right: 0.02rem;
        width: 0.1rem;
      }
      .name,
      .num {
        font-size: 0.09rem;
        color: #b0b3b7;
      }
    }
    .my {
      margin-left: 0.1rem;
      width: 1.45rem;
      height: 1.52rem;
      background: url("../assets/img/my.png") no-repeat center center / cover;
    }
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
  }
}
</style>
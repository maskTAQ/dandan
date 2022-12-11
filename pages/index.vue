<template>
  <div ref="scroll" class="home page-tab" @scroll="throttleScroll">
    <div class="header-area">
      <div class="title flex-row main-between center">
        <span class="logo">旦旦医学</span>
        <div class="search flex-row center">
          <img :src="icons.search" alt="" class="icon" />
          <p class="placeholder">关键字搜索百科/服务/周边/医生</p>
        </div>
        <div @click="go({ auth: true, path: '/messages' })" class="msg-box">
          <img :src="icons.msg" alt="" class="msg" />
          <div class="dot"></div>
        </div>
      </div>
      <HomeBanner class="banner" />
    </div>
    <div class="padding-box">
      <ul class="tab-card-list flex-row">
        <li
          class="tab-card flex-column align"
          v-for="tab in tabCardList"
          :key="tab.label"
        >
          <img :src="tab.icon" alt="" class="icon" />
          <p class="label">{{ tab.title }}</p>
        </li>
      </ul>

      <StatusHandle :get="getDoctorLiveList">
        <Group
          title="名医直播"
          class="doctor-live-list-card"
          v-if="data.doctorLiveList.length"
        >
          <ScrollView>
            <div class="doctor-live-list flex-row">
              <DoctorLiveCard
                class="card"
                :data="item"
                v-for="item in data.doctorLiveList"
                :key="item.gid"
              />
            </div>
          </ScrollView>
        </Group>
      </StatusHandle>
      <StatusHandle :get="getDoctorList">
        <Group
          title="专家直达"
          class="doctor-info-list-card"
          v-if="data.doctorList.length"
        >
          <ScrollView>
            <div class="doctor-info-list flex-row">
              <DoctorInfoCard
                class="card"
                :data="item"
                v-for="item in data.doctorList"
                :key="item.gid"
              />
            </div>
          </ScrollView>
        </Group>
      </StatusHandle>
    </div>
    <div class="padding-box white-area">
      <Group title="合作机构">
        <TopGoods />
      </Group>

      <StatusHandle :get="getGoodsList">
        <Group
          title="精选周边"
          class="goods-list-card"
          v-if="data.doctorList.length"
        >
          <ScrollView>
            <div class="goods-list flex-row">
              <div
                v-for="item in data.goodsList"
                :key="item.gid"
                class="goods-card"
                @click="go({ path: '/goods-detail', id: item.gid })"
              >
                <CoverImage class="cover" :url="item.gImg" />
                <div class="info flex-column main-between">
                  <p class="name">{{ item.gName }}</p>
                  <div class="price-box flex-row center">
                    <span class="unit">￥</span>
                    <span class="value">{{ item.ThePrice }}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollView>
        </Group>
      </StatusHandle>
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
    <div class="padding-box tab-area">
      <div id="孕产百科" />
      <StatusHandle :get="getTabList">
        <Tab
          :style="{ opacity: sticky ? 0 : 1 }"
          ref="tab"
          v-model="tab"
          :data="data.tabList"
          placeholder="推荐百科"
          @load="computedY"
          @change="handTabClick"
          hint
        />
      </StatusHandle>
      <div v-show="sticky" class="sticky">
        <Tab
          v-model="tab"
          ref="fixedTab"
          placeholder="推荐百科"
          :data="data.tabList"
          hint
        />
      </div>
      <img
        v-if="sticky"
        src="../assets/img/scroll-top.png"
        alt=""
        class="scroll-top"
        @click="scrollTo"
      />
    </div>
    <div class="tab-content">
      <List
        :request="request"
        :columnNum="['punch', 'note'].includes(tab) ? 1 : 2"
        :renderItem="renderItem"
        :class="[
          'main-list',
          {
            padding: tab !== 'punch',
          },
        ]"
        ref="list"
        customControl
        resetDatasource
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

import { icons, img } from "@/assets";
import { get } from "@/api/http";
import { router, toArray, goKf, UID, wxApi, getRoot } from "@/utils";
import ArticleCard from "@/components/ArticleCard.vue";
import LoginModal from "@/components/LoginModal";
import ForceLoginModal from "@/components/ForceLoginModal";
import { LIVE_STATUS } from "@/constant";
import HomeBanner from "@/components/HomeBanner";
// import Mall from "@/components/Mall";
import HomeTask from "@/components/HomeTask.vue";
import NoteItem from "@/components/NoteItem.vue";
import Header from "@/components/Header.vue";
import CoverImage from "@/components/CoverImage";
import DoctorLiveCard from "@/components/DoctorLiveCard.vue";
import ScrollView from "@/components/ScrollView";
import TopGoods from "@/components/TopGoods";

//
const BASE_TABS = [
  // {
  //   TypeName: "好孕笔记",
  //   type: "note",
  //   tid: "note",
  // },
  {
    TypeName: "精选打卡",
    type: "punch",
    tid: "punch",
  },
  // {
  //   TypeName: "好物分享",
  //   type: "goods",
  //   tid: "goods",
  // },
];
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
    return get("/Api/getBaikeList_api.php", {
      pageIndex: 1,
      pageNum: 1,
      root: "首页推荐",
    });
  },
  GOODS_LIST(params) {
    return get("/Api/getGoodsList_api.php", params);
  },
  TAB_LIST() {
    return get("/Api2/getContentTypeList_api.php").then((list) => {
      // list && list[0] ? [...list[0]?.children, ...BASE_TABS] : BASE_TABS
      return list;
    });
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
  NOTES(params) {
    return get("/Api/getForumList_api.php", params);
  },
  PUNCH_LIST(params) {
    return get("/Api/getShareClockList_api.php", params);
  },
  COVER(root) {
    return get("/Api/getBannerList_api.php", { root });
  },
  GOODS_TYPE_LIST(root) {
    return get("/Api/getGoodsType_api.php", { root });
  },
  USER_INFO() {
    return get("/Api/getUserInfo_api.php", {}, { showError: false });
  },
};

export default {
  name: "Home",
  data() {
    return {
      sticky: false,
      icons,
      img,
      model: {
        visible: false,
        data: {},
      },
      data: {
        adList: [],
        groupList: [],
        courseList: [],
        goodsTypeList: [],
        goodsList: [],
        tabList: [],
        live: null,
        insuranceInfo: null,
        recommend: null,
        doctorLiveList: [],
        doctorList: [],
      },
      LIVE_STATUS,
      tab: "",
      text: "一次性给付高额赔偿，“手术不成功不花钱”",
      forceLoginModalVisible: false,
      advancedRewardsModalVisible: true,
      isPregnant: false,
      clickTabTime: 0,
      groupCover: "",
      bannerY: 0,
      fixedSearch: false,
      currentGoodsTab: "",
      userInfo: null,
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
    API.COVER("首页卡片图").then((res) => {
      console.log(res, "res");
      // this.groupCover = res[0].theImg;
    });
    this.bannerY = getRoot() * (3.75 - 0.6);
  },
  // beforeRouteEnter(){
  //   console.log('beforeRouteEnter');
  // },
  mounted() {
    const data = {
      // desc: res.Tital2, // 描述
      title: `旦旦医学`, // 分享标题
      desc: "缔造好孕 共育未来", // 分享描述
      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "https://sanshengzhiyun.com/h5/_nuxt/assets/icon/logo.png", // 分享图标
    };
    wxApi.onMenuShareAppMessage(data);
    wxApi.updateTimelineShareData(data);
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
    data() {
      setTimeout(() => {
        this.computedY();
      });
    },
  },
  computed: {
    ...mapState(["myDoctor"]),
    tabCardList() {
      // const { isPregnant } = this;
      return [
        {
          title: "服务",
          path: "/propaganda/static/zytl",
          icon: icons.zytl,
        },
        {
          title: "金融",
          path: "/propaganda/static/sgqzqzyfw",
          icon: icons.sggl,
        },
        {
          title: "百科",
          icon: icons.yq,
          onClick: this.goPunchTab,
        },
        {
          title: "活动",
          path: "/punch",
          icon: icons.punch,
        },
      ];
    },
    goodsTabList() {
      // const { isPregnant } = this;
      return [
        {
          title: "试管医院",
          path: "/hospital",
          icon: icons.sgyy,
          // query: {
          //   tid: "2",
          // },
        },
        {
          title: "陪诊服务",
          path: "/mall",
          icon: icons.pzfw,
          query: {
            tid: "22",
          },
        },
        {
          title: "备孕门诊",
          path: "/hospital",
          icon: icons.bymz,
          query: {
            tid: "26",
          },
        },
        {
          title: "试管保险",
          path: "/mall",
          icon: icons.sgbx,
          query: {
            tid: "23",
          },
        },
        {
          title: "好孕日记",
          path: "/notes",
          icon: icons.hyrj,
        },
        {
          title: "大咖直播",
          path: "/live-list",
          icon: icons.dkzb,
        },
        {
          title: "好孕积分",
          path: "/integral",
          icon: icons.hyjf,
          // query: {
          //   tid: "10",
          // },
        },
        {
          title: "关于新生",
          path: "/about",
          icon: icons.about,
        },
      ];
    },
    byIcon() {
      const { userInfo } = this;
      switch (true) {
        case userInfo && !!userInfo.UserPhoto: {
          return userInfo.UserPhoto;
        }
        case !!UID.GET(): {
          return icons.logo;
        }
        default: {
          return img.beiyun;
        }
      }
    },
  },
  methods: {
    getUserInfo() {
      if (UID.GET()) {
        return API.USER_INFO()
          .then((res) => {
            this.userInfo = res;
          })
          .catch((e) => {});
      } else {
        return Promise.resolve();
      }
    },
    goChat() {
      this.routerPush({
        path: "/chat",
        auth: true,
      });
    },
    handleGoodsTabChange() {
      if (this.$refs.goodsList) {
        this.$refs.goodsList.refresh();
      }
    },
    getDoctorLiveList() {
      return API.GOODS_TYPE_LIST("医院").then((res) => {
        this.data.doctorLiveList = res;
      });
    },
    getDoctorList() {
      return API.GOODS_TYPE_LIST("医院").then((res) => {
        this.data.doctorList = res;
      });
    },
    getGoodsType() {
      return API.GOODS_TYPE_LIST("医院").then((res) => {
        if (res && res.length) {
          // const match = res[0];
          // this.currentGoodsTab = match.tid;
          // setTimeout(() => {
          //   this.$refs.goodsType.setSelected([
          //     {
          //       children: match.children,
          //       value: match.tid,
          //       node: match,
          //     },
          //   ]);
          // });
        }
        this.data.goodsTypeList = res;
      });
    },
    goPunchTab() {
      this.goTab("好孕接力");
    },
    goRecommend() {
      router.push({
        path: "/class-detail",
        query: {
          id: this.data.recommend.bid,
        },
      });
    },
    handTabClick() {
      this.clickTabTime = Date.now();
    },
    goPunch() {
      if (Date.now() - this.clickTabTime >= 500) {
        router.push({
          path: "/punch",
        });
      }
    },
    getPregnantStatus() {
      if (!UID.GET()) {
        return Promise.resolve();
      }
      return API.PREGNANT_STATUS().then((res) => {
        this.isPregnant = +res.isState === 0;
      });
    },
    goTab(tid) {
      const match = this.data.tabList.find(
        (item) => String(item.tid) === String(tid) || item.TypeName === tid
      );
      if (match) {
        // console.log({
        //   children: match.children,
        //   value: match.tid,
        //   node: match,
        // });
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
      if (params.auth && !UID.GET()) {
        this.$store.commit("toggleForceLoginModalVisible", true);
      } else {
        router.push(params);
      }
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
    goHospital(item) {
      router.push({
        path: "/hospital-detail",
        query: {
          id: item.gid,
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
        query: { type: "好孕", id: this.data.live.bid },
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
        // this.data.courseList = res;
        this.data.recommend = res[0];
      });
    },
    getGoodsList() {
      return API.GOODS_LIST({
        tid: this.currentGoodsTab,
        root: "医院",
      }).then((res) => {
        this.data.goodsList = res;
      });
    },
    computedY() {
      const { scroll, tab } = this.$refs;
      if (tab && tab.$el) {
        const y = tab.$el.getBoundingClientRect().y;
        //需要减去固定的头部的高度
        this.tabY = scroll.scrollTop + y; //- getRoot() * 0.6;
        console.log("computedY", this.tabY, { y, screenTop: scroll.scrollTop });
      }
    },
    getTabList() {
      return API.TAB_LIST().then((res) => {
        this.data.tabList = res;
        this.$nextTick(() => {
          setTimeout(this.goTab, 100, this.$route.query.tab);
        });
      });
    },
    request(params) {
      switch (this.tab) {
        case "note": {
          return API.NOTES(params).then((res) => {
            return res;
          });
        }
        case "punch": {
          return API.PUNCH_LIST(params).then((res) => {
            return res;
          });
        }
        default: {
          return API.LIST({
            ...params,
            // TypeName2: this.tab,
            tid: this.tab,
            root: this.tab ? "" : "好孕",
          }).then((res) => {
            return res;
          });
        }
      }
    },
    //
    renderItem(item, i, instance) {
      if (this.tab === "punch") {
        return (
          <HomeTask
            data={{
              ...item,
              isclock: 1,
            }}
          />
        );
      }
      if (this.tab === "note") {
        return <NoteItem class="note-item" data={item} />;
      }

      return (
        <ArticleCard
          // imgH={i % 2 === 0 ? "1.5rem" : "1.4rem"}
          imgH={"0.95rem"}
          class="article-card"
          data={item}
          onCoverLoad={() => {
            setTimeout(() => {
              this.$refs.list && this.$refs.list.composing();
            });
          }}
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
      if (this.$refs.list && currentHeight >= scrollHeight - 10) {
        this.$refs.list.loadmore();
      }
      const { scroll, tab } = this.$refs;
      window._scroll = scroll;
      if (scroll && tab && this.tabY) {
        const scrollTop = scroll.scrollTop;
        this.sticky = scrollTop >= this.tabY;
      }
      this.fixedSearch = scrollTop >= this.bannerY;
    },
    go(params) {
      const { path, onClick } = params;
      if (Date.now() - this.clickTabTime >= 500) {
        if (onClick) {
          return onClick();
        }
        if (path) {
          this.routerPush(params);
        }
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
    HomeBanner,
    Header,
    ScrollView,
    CoverImage,
    DoctorLiveCard,
    TopGoods,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.home {
  background: #f3f7fa;
  .header-area {
    margin-bottom: 0.4rem;
    height: 2.2rem;
    padding: 0.18rem;
    background: #4d6eff;
    .title {
      .logo {
        font-size: 0.16rem;
        font-weight: bold;
        color: #fff;
      }
      .search {
        width: 0;
        flex: 1;
        height: 0.3rem;
        padding: 0 0.1rem;
        margin-left: 0.08rem;
        margin-right: 0.11rem;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 0.18rem;
        .icon {
          width: 0.14rem;
          height: 0.14rem;
        }
        .placeholder {
          margin-left: 0.1rem;
          font-size: 0.12rem;
          color: #fff;
          line-height: 0.3rem;
          font-weight: 500;
        }
      }
      .text {
        margin-left: 0.06rem;
        font-size: 0.16rem;
        color: #fff;
      }
      .msg-box {
        position: relative;
        .msg {
          height: 0.18rem;
        }
        .dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ff4040;
        }
      }
    }
    .search {
      margin: 0.12rem 0;
    }
    .banner {
      /* margin-top: -0.5rem;
    position: relative; */
      height: 1.4rem;
      background: #fff;
      /* border-radius: 0.2rem; */
    }
  }
  .tab-card-list {
    height: 0.98rem;
    background: #fff;
    box-shadow: 0px 4px 12px rgba(139, 156, 164, 0.17);
    border-radius: 0.1rem;
    .tab-card {
      flex: 1;
    }
    .icon {
      margin-bottom: 0.1rem;
      width: 0.3rem;
      height: 0.3rem;
    }
    .label {
      font-size: 0.12rem;
      color: rgb(42, 42, 42);
    }
  }
  .doctor-live-list-card {
    .content {
      margin: 0 -0.15rem;
    }
    .doctor-live-list {
      padding: 0.15rem;
    }
    .card {
      margin-right: 0.15rem;
    }
  }
  .doctor-info-list-card {
    .content {
      margin: 0 -0.15rem;
    }
    .doctor-info-list {
      padding: 0.15rem;
      padding-top: 0.25rem;
    }
    .card {
      margin-right: 0.15rem;
    }
  }
  .goods-list-card {
    .goods-card {
      margin-right: 0.15rem;
      .cover {
        min-width: 0.72rem;
        height: 0.72rem;
      }
      .name {
        margin-top: 0.1rem;
        margin-bottom: 0.04rem;
        font-size: 0.12rem;
        color: rgb(42, 42, 42);
      }
      .price-box {
        font-weight: bold;
        color: rgb(217, 51, 26);
        .unit {
          font-size: 0.1rem;
        }
        .value {
          font-size: 0.16rem;
        }
      }
    }
  }
  .hospital-area {
    margin-bottom: 0.2rem;
    .tag-list {
      flex-wrap: nowrap;
      overflow: auto;
    }
    .card {
      margin-right: 0.11rem;
      min-width: 2.48rem;
      height: 1.03rem;
      padding: 0.16rem;
      background: #ffffff;
      box-shadow: 0px 4px 11px 0px rgba(139, 156, 164, 0.17);
      border-radius: 9px;
      .cover {
        margin-right: 0.1rem;
        width: 0.72rem;
        height: 0.72rem;
        border-radius: 6px;
      }
      .info {
        flex: 1;
        height: 0.72rem;
        .name {
          margin-bottom: 0.04rem;
          font-size: 0.12rem;
          color: #2a2a2a;
          font-weight: bold;
        }
        .city {
          font-size: 0.11rem;
          color: #2a2a2a;
        }
        .distance {
          height: 0.15rem;
          padding: 0 0.05rem;
          background: #f6f6f6;
          border-radius: 8px;
          .icon {
            margin-right: 0.04rem;
            height: 0.08rem;
          }
          .text {
            font-size: 0.09rem;
            color: #2a2a2a;
          }
        }
      }
    }
  }
  .bg-box {
    padding: 0.12rem 0;
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
    &.white-area {
      background: rgb(255, 255, 255);
      box-shadow: 0px 4px 12px rgba(139, 156, 164, 0.17);
    }
    &.tab-area {
      padding-top: 0.12rem;
    }
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
  .goods-list-box {
    margin: 0.18rem 0;
    padding: 0.14rem 0.18rem;
    background: #fff;
    box-shadow: 0px 4px 11px 0px rgba(139, 156, 164, 0.17);
    .title {
      margin-bottom: 0.1rem;
      font-size: 0.16rem;
      font-weight: 600;
      color: #2a2a2a;
    }
    .goods-list {
      flex-wrap: wrap;
      .item {
        /* margin-right: 0.11rem; */
        width: 25%;
        /* height: 0.94rem; */
        padding: 0.11rem 0.09rem;
        /* background: #fff;
        border-radius: 0.05rem; */
      }
      .icon {
        height: 0.27rem;
      }
      .title {
        margin-top: 0.13rem;
        margin-bottom: 0;
        font-size: 0.11rem;
        color: #2a2a2a;
        font-weight: 400;
      }
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
    bottom: 1.5rem;
    right: 0.15rem;
    width: 0.3rem;
    z-index: 999;
  }
  .course-list {
    height: 1.83rem;
    margin-bottom: 0.13rem;

    .item {
      flex: 1;
      padding: 0.2rem 0.1rem;
      border-radius: 0.1rem;
      background: #fff;
    }
    .left {
      margin-right: 0.09rem;

      /* background: #fff url("../assets/img/mom.png") no-repeat right -0.3rem bottom/1.1rem
        auto; */
    }
    .right {
      background: #fff url("../assets/img/doctor.png") no-repeat right -0.1rem bottom/1rem
        auto;
    }
    .title {
      font-size: 0.18rem;
      color: #ebb177;
      font-weight: bold;
    }
    .name {
      width: 1.1rem;
      margin-top: 0.15rem;
      margin-bottom: 0.1rem;
      font-size: 0.16rem;
      font-weight: bold;
      color: #2b2b2b;
    }
    .username {
      margin-bottom: 0.1rem;
      font-size: 0.14rem;
      color: #858585;
    }
    .label {
      font-size: 0.15rem;
      font-weight: bold;
      color: #464646;
    }
    .value {
      font-size: 0.14rem;
      color: #8c8c8c;
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
  .tab-content {
    min-height: 2.6rem;
  }
  .main-list {
    height: auto;
    &.padding {
      padding: 0 0.15rem;
    }
    /* border: 1px solid red; */
    .column-0 {
      margin-right: 0.08rem;
    }
    .article-card {
      margin-bottom: 0.08rem;
    }
  }
  .note-item {
    margin-bottom: 0.1rem;
    background: #fff;
    box-shadow: none;
  }
}
</style>
<template>
  <Page :title="title">
    <AttentionModal
      ref="attentionModal"
      :visible="visible"
      @change="(v) => (visible = v)"
    />
    <RemindModal ref="remainModal" @cancel="toggleRemind" />
    <div class="class-detail page-full" @click="handlePageClick">
      <StatusHandle :get="getData" ref="page">
        <div
          v-if="data"
          ref="scroll"
          :class="['class-detail-scroll page-full', { 'flex-column': isLive }]"
          @scroll="throttleScroll"
        >
          <div
            v-if="(isLive || isYG) && timing"
            class="time-tool-bar flex-row main-between center"
          >
            <p>据开始还剩{{ timing }}</p>
            <van-button
              @click="beforeRemind"
              :loading="remind"
              :class="['btn', { none: !data.isTX }]"
              >{{ data.isTX ? "取消提醒" : "直播提醒" }}</van-button
            >
          </div>
          <template v-if="isVideo || isLive">
            <Player
              v-if="isVideo || isLive"
              :live="isLive"
              :src="src"
              :poster="poster"
              class="player"
              :key="data.bid"
            >
            </Player>
            <CoverImage
              v-else
              :url="data.cover || data.PageImg"
              class="player"
            ></CoverImage>
          </template>
          <Banner v-else :data="data.PageImg" class="banner" />
          <!-- <div
            v-if="isInfo"
            class="cover"
            :style="{
              background: `url('${
                toArray(data.PageImg)[0]
              }') no-repeat center center / cover`,
            }"
          /> -->

          <div v-if="isLive || isYG" class="live-info flex-column">
            <div class="header">
              <div class="live-user flex-row main-between center">
                <div class="anchor flex-row center">
                  <CoverImage class="cover" />
                  <div>
                    <p class="user-name">王海娟·主任医师</p>
                    <div class="flex-row center">
                      <span class="date">{{ liveTime }}</span>
                      <div class="status flex-row center">
                        <span
                          :style="{ background: liveInfo.color }"
                          class="circle"
                        />
                        <span
                          class="label"
                          :style="{ color: liveInfo.color }"
                          >{{ liveInfo.label }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="+data.LiveFlag === 2"
                  class="user-list flex-row center"
                >
                  <div
                    class="portrait-list flex-row"
                    v-if="data.fictitiousImgs.length"
                    :style="{
                      width: (data.fictitiousImgs.length + 1) * 0.16 + 'rem',
                    }"
                  >
                    <div
                      v-for="(item, index) in data.fictitiousImgs"
                      :key="item"
                      v-if="index < 11"
                      class="portrait"
                      :style="{
                        background: `url('${item}') center center / cover`,
                        left: index * 0.16 + 'rem',
                        zIndex: index,
                      }"
                    />
                  </div>
                  <p class="num">{{ data.fictitiousNum }}人正在观看直播</p>
                </div>
              </div>
              <p class="title">{{ data.Tital }}</p>
              <div class="data-bar flex-row main-end center">
                <div class="flex-row center">
                  <div class="icon-box flex-row center">
                    <img :src="icons.message" alt="" class="icon" />
                    <i class="label">{{ messageCount }}</i>
                  </div>
                  <div
                    id="hot"
                    @click="addHot"
                    class="icon-box flex-row center"
                  >
                    <img :src="icons.hot" alt="" class="icon" />
                    <i class="label">{{ hotCount }}</i>
                  </div>
                </div>
              </div>

              <div class="tab-list flex-row center" ref="tabList">
                <div
                  v-for="item in tabList"
                  @click="tab = item"
                  :key="item"
                  :class="['tab flex-column', { selected: tab === item }]"
                >
                  <i class="label">{{ item }}</i>
                  <span v-if="tab === item" class="line"></span>
                </div>
              </div>
            </div>
            <div
              class="html-content"
              v-show="tab === '课程详情'"
              v-html="data.RoomJS"
            />
            <keep-alive>
              <ChatRoom
                v-show="tab === '讨论区'"
                :update="tab === '讨论区'"
                class="chat-room"
                :data="data"
                :barFixed="true"
                @message="onUpdate"
              />
            </keep-alive>
          </div>

          <div v-else class="info">
            <p class="title">{{ data.Tital }}</p>
            <div class="like-area flex-row center">
              <CoverImage
                v-if="data.writerImg"
                :url="data.writerImg"
                class="portrait"
              />
              <div class="like-area-info flex-row main-between center">
                <div>
                  <p class="name">{{ data.writer }}</p>
                  <p class="date">{{ formatTime(data.CreateTime) }}</p>
                </div>
                <van-button
                  @click="like"
                  :class="['like-box', { liked: +data.isGood === 1 }]"
                  :loading="loading"
                >
                  <img
                    :src="+data.isGood ? icons.likeWhite : icons.plUnlike"
                    alt=""
                    class="icon"
                  />
                  <i class="label">点赞</i>
                </van-button>
              </div>
            </div>
            <p v-if="data.Tital2" class="subtitle">{{ data.Tital2 }}</p>

            <div class="html-content" v-html="data.RoomJS"></div>
            <!-- <van-button
              @click="like"
              :loading="loading"
              :class="['like', { liked: +data.isGood === 1 }]"
            >
              <div class="flex-row center">
                <img
                  :src="+data.isGood === 1 ? icons.goodActive : icons.good"
                  alt=""
                  class="icon"
                />
                <i class="label"
                  >有帮助 <i v-if="+data.GoodNum">({{ data.GoodNum }})</i></i
                >
              </div>
            </van-button> -->
            <div v-if="adVisible && data.advImg" @click="goAd" class="ad">
              <img
                class="close"
                src="../assets/img/ad-close.png"
                alt=""
                srcset=""
                @click.stop="closeAd"
              />
              <img :src="data.advImg" alt="" />
            </div>
            <div class="split-line"></div>
            <CommentGroup
              style="margin-bottom: 0.2rem"
              v-if="data"
              :data="data"
              ref="commentGroup"
            />
            <Group title="相关推荐">
              <List
                :request="request"
                columnNum="2"
                :renderItem="renderItem"
                class="list"
                ref="list"
                eventPassthrough
              />
            </Group>
          </div>
          <img
            v-if="sticky"
            src="../assets/img/scroll-top.png"
            alt=""
            class="scroll-top"
            @click="scrollTo"
          />
        </div>
      </StatusHandle>
    </div>
  </Page>
</template>
<script>
// import videojs from "video.js";
// import "video.js/dist/video-js.css";
import _ from "lodash";

import Player from "@/components/Player";
import AttentionModal from "@/components/AttentionModal";
import RemindModal from "@/components/RemindModal";
import CommentGroup from "@/components/CommentGroup";
import {
  wxApi,
  LoadingControl,
  formatTime,
  size,
  getRoot,
  toArray,
  split,
  router,
  timeDiff,
  OS,
} from "@/utils";
import { get, mock } from "@/api/http";
import { icons } from "@/assets";
import { LIVE_STATUS } from "@/constant";
import injectLikeEffect from "@/utils/flowers";
const API = {
  DETAIL(params) {
    return get("/Api/getRoomInfo_api.php", params, { showError: false });
  },
  LIST(params) {
    return get("/Api/getRoomlist_api.php", params);
  },
  //增加热度
  ADD_HOT(bid) {
    return get("/Api/setRoomHot_api.php", { bid });
  },
  ADD_LIVE_HOT(bid) {
    return get("/Api/setRoomWatch_api.php", { bid });
  },
  HOT_COUNT(bid) {
    return get("/Api/getHotChatsNum_api.php", { bid });
  },
  //
  LIKE(bid) {
    return get("/Api/setBaikeGood_api.php", { bid });
  },
  ///Api/setLiveGZ_api.php
  REMAID(bid) {
    return get("/Api/setLiveGZ_api.php", { bid });
  },
};
export default {
  name: "class-detail",
  head() {
    return {
      title: "旦旦医学",
      script: [
        {
          src: "https://webrtc-demo.myqcloud.com/pull-sdk/TXLivePlayer-0.0.2-beta.min.js",
        },
      ],
    };
  },
  data() {
    return {
      adVisible: true,
      size,
      formatTime,
      icons,
      status: "init",
      data: null,
      tabList: ["讨论区", "课程详情"],
      tab: "讨论区",
      hotCount: "",
      messageCount: "",
      loading: false,
      root: 1,
      barFixed: false,
      remind: false,
      visible: false,
      timingKey: 1,
      sticky: false,
    };
  },
  watch: {
    $route() {
      // this.getData();
    },
    hotCount() {
      if (this.likeEffect) {
        this.likeEffect.emit();
      }
    },
  },
  computed: {
    isYG() {
      return this.data.LiveFlag == 1;
    },
    isLive() {
      return this.data.LiveFlag == 2;
    },
    isVideo() {
      return this.data.LiveFlag == 3; // || this.data.VideoUrl;
    },
    isInfo() {
      const { isVideo, isLive } = this;
      return !(isVideo || isLive);
    },
    src() {
      const { isLive, isVideo, data } = this;
      return isLive ? data.LiveUrl : data.VideoUrl;
    },
    poster() {
      const { data } = this;
      return data.cover || toArray(data.PageImg)[0];
    },
    id() {
      return this.$route.query.id;
    },
    type() {
      const { type = "孕圈" } = this.$route.query;
      return type === "会务" ? "会务直播" : "孕圈";
    },
    liveTime() {
      // formatTime(data.CreateTime);
      const { LiveSTime, LiveETime } = this.data;
      const isSameData =
        formatTime(LiveSTime, "MM/DD") === formatTime(LiveETime, "MM/DD");
      if (isSameData) {
        return `${formatTime(LiveSTime, "MM/DD HH:mm")} - ${formatTime(
          LiveETime,
          "HH:mm"
        )}`;
      }
      return `${formatTime(LiveSTime, "MM/DD HH:mm")} - ${formatTime(
        LiveETime,
        "MM/DD HH:mm"
      )}`;
    },
    title() {
      const { data } = this;
      if (!data) {
        return "旦旦医学";
      }
      let title = split(this.data.Tital || "旦旦医学", 18);
      document.title = title;
      return title;
    },
    timing() {
      this.timingKey;
      return timeDiff(this.data.LiveSTime * 1000);
    },
    liveInfo() {
      const { LiveFlag, LiveSTime, VideoUrl, LiveUrl } = this.data;
      //   const dif = day(LiveSTime * 1000).diff(day(), "s");
      if (LiveFlag === 2) {
        return {
          color: "rgb(245, 67, 67)",
          label: "直播中",
        };
      }
      if (LiveFlag == 1) {
        return {
          color: "rgb(69, 188, 188)",
          label: "直播预告",
        };
      }
      if (LiveFlag === 3) {
        return {
          color: "rgb(253, 142, 74)",
          label: "观看回放",
        };
      }
      return {
        color: "rgb(253, 142, 74)",
        label: "回放生成中",
      };
    },
  },
  created() {
    this.initPage();
    this.getUserInfo();
  },
  mounted() {
    this.root = getRoot();
    this.throttleScroll = _.throttle(this.handleScroll, 100);
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    clearInterval(this.timeout);
  },
  methods: {
    handlePageClick() {
      if (this.$refs.commentGroup) {
        this.$refs.commentGroup.setFocus(false);
      }
    },
    getUserInfo() {
      return this.$store.dispatch("getUserInfo");
    },
    timeDiff,
    toArray,
    initPage() {
      this.addLiveNum();
      this.getHot();
      this.timeout = setInterval(() => {
        this.timingKey += 1;
      }, 1000);
    },
    onUpdate(v) {
      // console.log(v,'v')
      this.messageCount = v.count;
      this.hotCount = v.HotNum;
      this.$set(this.data, "fictitiousNum", v.fictitiousNum);
    },
    handleScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      this.sticky = scrollTop >= offsetHeight / 2;
      const { tab } = this;
      if (tab === "讨论区") {
        const tabList = this.$refs.tabList;
        if (!tabList) {
          return;
        }
        // const all = document.documentElement.clientHeight;
        // const top = tabList.getBoundingClientRect().top;
        // const height = tabList.offsetHeight;
        // const barH = this.root * 0.5;
        // let next = all >= top + height + barH;
        // if (this.barFixed !== next) {
        //   this.barFixed = next;
        // }
        // // console.log({ all, top, height, barH }, "tabList");
        // window.tabList = tabList;
      }
      // console.log('handleScroll')
    },
    addHot() {
      API.ADD_HOT(this.id).then((res) => {
        this.hotCount = res.HotNum;
      });
    },
    addLiveNum() {
      API.ADD_LIVE_HOT(this.id);
    },
    closeAd() {
      this.adVisible = false;
    },
    goAd() {
      const { advLink } = this.data;
      if (advLink) {
        location.href = advLink.includes("http")
          ? advLink
          : `http://${advLink}`;
      }
    },
    getHot() {
      return API.HOT_COUNT(this.id).then((res) => {
        this.hotCount = res.HotNum;
      });
    },
    like() {
      // if (!+this.data.isGood) {
      LoadingControl({
        call: API.LIKE,
        params: this.id,
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        if (+this.data.isGood) {
          this.data.isGood = 0;
          this.data.GoodNum -= 1;
        } else {
          this.data.isGood = 1;
          this.data.GoodNum += 1;
        }

        this.data = { ...this.data };
      });
      // }
    },
    beforeRemind() {
      if (this.data.isTX) {
        this.$refs.remainModal.show("error");
      } else {
        // console.log(this.$refs.attentionModal, "this.$refs.attentionModal");
        if (this.$refs.attentionModal.data) {
          this.visible = true;
        } else {
          this.toggleRemind();
        }
      }
    },
    toggleRemind() {
      LoadingControl({
        call: API.REMAID,
        params: this.id,
        change: ({ loading }) => {
          this.remind = loading;
        },
      }).then((res) => {
        this.data.isTX = +!this.data.isTX;
        if (this.data.isTX) {
          this.$refs.remainModal.show("success");
        }
      });
    },
    getData() {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      // this.data = {};
      return API.DETAIL({ bid: this.id }).then((res) => {
        res.fictitiousNum = +res.fictitiousNum + 1;
        this.data = res;
        if (!!res.LiveUrl && !res.isSgin) {
          this.tab = "课程详情";
          router.replace({
            path: "/live-info-record",
            query: {
              id: this.id,
            },
          });
          return;
        }
        wxApi.onMenuShareAppMessage({
          desc: res.Tital2, // 描述
          title: res.Tital, // 分享标题
          // desc: desc, // 分享描述
          link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl:
            res.PageImg ||
            "https://sanshengzhiyun.com/h5/_nuxt/assets/icon/logo.png", // 分享图标
        });
        wxApi.updateTimelineShareData({
          desc: res.Tital2,
          title: res.Tital, // 分享标题
          link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl:
            res.PageImg ||
            "https://sanshengzhiyun.com/h5/_nuxt/assets/icon/logo.png",
        });
        setTimeout(() => {
          this.likeEffect = injectLikeEffect({
            jqDomID: "hot",
            className: "live-flowers",
            container: this.$refs.scroll,
          });
          // setTimeout(() => {
          //   const canvas = document.querySelector(".live-flowers");
          //   if (canvas && OS.isWechat) {
          //     canvas.style.top = "-0.2rem";
          //   }
          // }, 1000);
        }, 1000);
      });
    },

    request(params) {
      return API.LIST({
        ...params,
        root: this.type,
        // isTj:1,
        bid: this.data.bid,
        pageNum: 6,
      });
    },
    renderItem(item, i, instance) {
      const { cover, PageImg, Tital, LiveFlag, VideoUrl, LiveUrl, bid } = item;
      return (
        <div
          key={bid}
          class="item"
          onClick={() => {
            if (bid === this.id) {
              return;
            }
            router.replace({ query: { id: bid } });
            setTimeout(() => {
              this.initPage();
              this.$refs.page && this.$refs.page.refresh();
            });
            if (this.$refs.scroll) {
              this.$refs.scroll.scrollTop = 0;
            }
          }}
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
                : `url('${cover || PageImg}') no-repeat center center / cover`,
            }}
          />
          {LiveUrl ? (
            <div class="live flex-row align">
              <img class="icon" src={icons.live} />
              <i class="label">{LIVE_STATUS[LiveFlag]}</i>
            </div>
          ) : null}
          <p class="name ellipsis">{Tital}</p>
        </div>
      );
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(0, 0);
    },
  },
  components: {
    Player,
    AttentionModal,
    RemindModal,
    CommentGroup,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
canvas.live-flowers {
  position: absolute;
  top: 0.5rem;
  left: 2.6rem;
  z-index: -1;
  transform: scale(0.5);
  transform-origin: center;
}
.class-detail {
  position: relative;
  background: #eff0f1;
  padding-bottom: 0.58rem;
  .banner .swiper-container {
    border-radius: 0;
  }
  .scroll-top {
    position: fixed;
    bottom: 1.5rem;
    right: 0.15rem;
    width: 0.3rem;
    z-index: 999;
  }
  .vjs-poster {
    background-size: cover;
  }
  .class-detail-scroll {
    position: relative;
  }
  #hot {
    position: relative;
    z-index: 999;
  }
  .time-tool-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.4rem;
    font-size: 0.13rem;
    color: #fff;
    padding: 0 0.11rem;
    z-index: 99;
    background: rgba(0, 0, 0, 0.3);
    .btn {
      padding: 0 0.12rem;
      height: 0.24rem;
      border-radius: 0.12rem;
      font-size: 0.12rem;
      border: none;
      color: #000;
      &.none {
        background: #6dc7c6;
        color: #fff;
      }
    }
  }
  .html-content {
    padding: 0.2rem 0;
    /* * {
      display: block;
      max-width: 100%;
    } */
  }
  .like-area {
    /* padding-top: 0.1rem;*/
    padding-bottom: 0.1rem;
    .portrait {
      margin-right: 0.15rem;
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 50%;
    }
    .like-area-info {
      width: 0;
      flex: 1;
    }
    .name {
      margin-bottom: 0.04rem;
      /* line-height: 0.12rem; */
      font-size: 0.13rem;
      color: #343434;
      font-weight: bold;
    }
    .date {
      line-height: 0.12rem;
      font-size: 0.11rem;
      color: #656667;
    }
    .like-box {
      padding: 0 0.1rem;
      height: 0.29rem;
      background: #fff;
      border-radius: 0.14rem;
      .icon {
        margin-right: 0.04rem;
        width: 0.13rem;
      }
      .label {
        font-size: 0.11rem;
        font-weight: bold;
        color: #6dc7c6;
      }
      &.liked {
        background: #6dc7c6;
        .label {
          color: #fff;
        }
      }
    }
  }
  .video-js,
  .cover {
    height: 2.11rem;
    .vjs-big-play-button {
      left: 50%;
      margin-left: -1.5em;
      top: 50%;
      margin-top: -0.8em;
    }
  }
  .player {
    position: relative;
    .button {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 999;
    }
  }
  .ad {
    position: relative;
    /* height: 1rem; */
    /* border: 1px solid red; */
    padding: 0.1rem;
    border-radius: 4px;
    overflow: hidden;
    min-height: 0.5rem;
    .close {
      position: absolute;
      top: 0.1rem;
      right: 0.1rem;
      width: 0.3rem;
    }
    img {
      display: block;
      width: 100%;
    }
  }
  .player {
    display: block;
    width: 100%;
  }
  .info {
    padding-top: 0.2rem;
    overflow: auto;
    padding: 0 0.12rem;
    /* padding-top: 0; */
    .title {
      margin: 0.12rem 0;
      font-size: 0.2rem;
      color: $color4;
    }
    .subtitle {
      margin-bottom: 0.12rem;
      font-size: 0.16rem;
      padding: 0.06rem 0.1rem;
      color: #767676;

      background: #fbfbfb;
      border-radius: 8px;
    }
  }
  .split-line {
    margin: 0 -0.12rem;
    height: 4px;
    background: #f6f6f6;
  }
  /* .like {
    margin-top: 0.24rem;
    margin-bottom: 0.4rem;
    height: 0.32rem;
    padding: 0 0.12rem;
    font-size: 0.14rem;
    color: $color6;
    background: $color12;
    border-radius: 0.16rem;
    &.liked {
      color: $color1;
    }
    .icon {
      width: 0.22rem;
      margin-right: 0.04rem;
    }
  } */
  .list {
    .item {
      position: relative;
      margin-top: 0.16rem;
      .live {
        position: absolute;
        top: 0;
        left: 0;
        width: 0.6rem;
        height: 0.2rem;
        background: url("../assets/icon/live-bg.png") no-repeat center center /
          100% 100%;
        .icon {
          margin-right: 0.04rem;
          width: 0.12rem;
        }
        .label {
          font-size: 0.1rem;
          color: #fff;
        }
      }
    }
    .cover {
      height: 0.95rem;
      border-radius: 0.04rem;
    }
    .name {
      margin: 0;
      margin-top: 0.08rem;
    }
  }
  .live-info {
    /* height: 0;
    flex: 1; */
    background: #fff;
    background: #fff;
    border-radius: 0 0 0.14rem 0.14rem;
    margin-bottom: 0.06rem;
    .live-user {
      margin-bottom: 0.25rem;
      .anchor {
        flex-shrink: 0;
        .cover {
          margin-right: 0.06rem;
          width: 0.36rem;
          height: 0.36rem;
          border-radius: 50%;
          border: 1px solid red;
        }
        .user-name {
          margin-bottom: 0.08rem;
          font-size: 0.16rem;
          font-weight: 600;
          color: rgb(51, 51, 51);
        }
        .date {
          font-size: 0.1rem;
          font-weight: 400;
          color: rgb(119, 119, 119);
        }
        .status {
          margin-left: 0.04rem;
          .circle {
            margin-right: 0.04rem;
            width: 0.05rem;
            height: 0.05rem;
            border-radius: 50%;
          }
          .label {
            font-size: 0.1rem;
            font-weight: 400;
          }
        }
      }
    }
    .title {
      margin-bottom: 0.12rem;
      font-size: 0.2rem;
      color: #333;
    }
    .header {
      padding: 0.16rem 0.12rem;
      padding-bottom: 0;
      background: #fff;
      .title {
        margin-bottom: 0.12rem;
        font-size: 0.2rem;
        color: $color4;
      }
      .data-bar {
        font-size: 0.14rem;
        justify-content: flex-end;
        color: rgb(102, 102, 102);
        .icon-box {
          &:first-child {
            margin-right: 0.25rem;
          }
        }
        .icon {
          margin-right: 0.05rem;
          width: 0.12rem;
        }
      }
      .user-list {
        margin-bottom: 0.04rem;
        .portrait-list {
          margin-right: 0.16rem;
          position: relative;
          height: 0.32rem;
          .portrait {
            position: absolute;
            top: 0;
            width: 0.28rem;
            height: 0.28rem;
            border-radius: 50%;
            overflow: hidden;
          }
        }
        .icon {
          margin-right: 0.08rem;
          width: 0.14rem;
        }
        .num {
          font-size: 0.1rem;
          font-weight: 400;
          color: rgb(119, 119, 119);
        }
      }
      .tab-list {
        padding-top: 0.24rem;
        justify-content: space-around;
        border-bottom: 1px solid rgba(112, 112, 112, 0.22);
        .tab {
          position: relative;
          font-size: 0.16rem;
          color: rgba(0, 0, 0, 0.4);
          &.selected {
            color: rgb(105, 199, 199);
          }
          .label {
            margin-bottom: 0.1rem;
          }
          .line {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background: $color1;
            border-radius: 2px;
          }
        }
      }
    }
  }
}
</style>
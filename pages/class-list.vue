<template>
  <Page :title="title" :left="root === '孕圈'">
    <div class="class-list page-full">
      <div v-if="live" class="live">
        <div
          class="preview"
          :style="{
            background: `url('${live.PageImg}') no-repeat center center / cover`,
          }"
          @click="go(live)"
        >
          <div class="tag">{{ LIVE_STATUS[live.LiveFlag] }}</div>
          <i v-if="timeout" class="count-down">{{ timeout }}</i>
        </div>
        <p class="name">{{ live.Tital }}</p>
        <div class="time main-between flex-row center">
          <i class="label">{{
            `${formatTime(live.LiveSTime, "YYYY/MM/DD HH:mm")} ~ ${formatTime(
              live.LiveETime,
              "HH:mm"
            )}`
          }}</i>
          <button class="hint">直播提醒</button>
        </div>
      </div>
      <StatusHandle :get="getAD">
        <van-swipe class="ad-list" :indicator="false">
          <van-swipe-item v-for="ad in adList" :key="ad.bid" @click="goAD(ad)">
            <CoverImage :url="ad.theImgs[0]" class="ad" />
          </van-swipe-item>
          <div slot="indicator"></div>
        </van-swipe>
      </StatusHandle>

      <List
        :request="request"
        columnNum="2"
        :renderItem="renderItem"
        class="list"
        ref="list"
        disabledLoadmore
        eventPassthrough
      />
    </div>
  </Page>
</template>
<script>
import day from "dayjs";

import { get } from "@/api/http";
import { icons } from "@/assets";
import { formatTime, router } from "@/utils";
import { LIVE_STATUS } from "@/constant";

const API = {
  LIST(root) {
    return get("/Api/getRoomlist_api.php", {
      PageIndex: 0,
      root,
    });
  },
  AD(root) {
    return get("/Api/getBannerList_api.php", { root: `${root}banner1` });
  },
};
export default {
  name: "ClassList",
  head() {
    return {
      title: "",
    };
  },
  data() {
    return {
      day,
      LIVE_STATUS,
      live: null,
      t: 0,
      adList: [],
    };
  },
  computed: {
    timeout() {
      if (this.live) {
        const { LiveSTime } = this.live;
        const dif = day(LiveSTime * 1000).diff(day(), "s");
        const days = Math.floor(dif / (24 * 60 * 60));
        const hours = Math.floor(dif / (60 * 60)) - days * 24;
        const minutes = Math.floor(dif / 60) - days * 24 * 60 - hours * 60;
        const seconds = dif % 60;
        // return { days, hours, minutes, seconds }
        return `距开始还剩${this.fill(days)}天 ${this.fill(hours)}:${this.fill(
          minutes
        )}:${this.fill(seconds)}`;
      } else {
        return null;
      }
    },
    root() {
      const { type = "孕圈" } = this.$route.query;
      return type === "office" ? "会务直播" : "孕圈";
    },
    title() {
      let title = "";
      if (this.root === "会务直播") {
        title = "三笙会务";
      } else {
        title = "百科列表";
      }
      if (process.browser) {
        window.document.title = title;
      }
      return title;
    },
  },
  methods: {
    formatTime,
    getAD() {
      return API.AD(this.root).then((res) => {
        this.adList = res;
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
    fill(v, l = 2) {
      if (!+v || String(v).length >= 2) {
        return v;
      } else {
        return new Array(l - 1).fill(0).join("") + v;
      }
    },
    startTimeCount() {
      this.live = { ...this.live };
      clearTimeout(this.t);
      this.t = setTimeout(this.startTimeCount, 1000);
    },
    request(params) {
      return API.LIST(this.root).then((list) => {
        const i = list.findIndex((item) => item.LiveUrl);
        console.log(i,'i')
        if (i > -1) {
          this.live = list[i];
          this.startTimeCount();
          list.splice(i, 1);
        }
        return list;
      });
    },
    renderItem(item, i, instance) {
      const { PageImg, cover, Tital, bid, VideoUrl } = item;
      const c = PageImg && PageImg[0] ? PageImg : cover;
      return (
        <div key={bid} class="item" onClick={() => this.go(item)}>
          <div
            class="cover"
            style={{
              background: VideoUrl
                ? `url('${icons.play}') no-repeat center center / .32rem auto,url('${c}') no-repeat center center / cover`
                : `url('${c}') no-repeat center center / cover`,
            }}
          ></div>
          <p class="name ellipsis">{Tital}</p>
        </div>
      );
    },
    go(item) {
      router.push({ path: "/class-detail", query: { id: item.bid } });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.class-list {
  padding: 0.16rem 0.12rem;
  background: #fff;
  .live {
    margin-bottom: 0.1rem;
    .preview {
      position: relative;
      height: 2rem;
      border-radius: 0.04rem;
      overflow: hidden;
      background-size: 100% 100%;
      .tag {
        position: absolute;
        left: 0;
        top: 0;
        width: 0.8rem;
        height: 0.2rem;
        line-height: 0.2rem;
        text-align: center;
        font-size: 0.1rem;
        color: #fff;
        background: $color1;
        border-radius: 0px 0px 8px 0px;
      }
      .count-down {
        position: absolute;
        left: 0.12rem;
        bottom: 0.11rem;
        font-size: 0.13rem;
        color: #fff;
      }
    }
    .name {
      margin-top: 0.12rem;
      margin-bottom: 0.1rem;
      font-size: 0.16rem;
      color: $color4;
    }
    .time {
      .label {
        font-size: 0.15rem;
        color: $color6;
      }
      .hint {
        height: 0.24rem;
        line-height: 0.24rem;
        padding: 0 0.12rem;
        background: rgba($color: $color1, $alpha: 0.3);
        color: $color1;
        border-radius: 0.12rem;
      }
    }
  }
  .ad {
    margin-bottom: 0.1rem;
    display: block;
    width: 100%;
    height: 0.88rem;
    border-radius: 0.04rem;
  }

  .list {
    .item {
        margin-top: 0.16rem;
        &:first-child {
          margin-top: 0;
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
}
</style>
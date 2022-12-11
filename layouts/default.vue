<template>
  <div id="app">
    <!-- <HintLoginModal :visible="true" />
    <AdvancedRewardsModal ref="advancedRewardsModal" /> -->

    <button
      class="copy-input"
      id="copy-trigger"
      data-clipboard-text="12"
    ></button>
    <a href="" id="mobile-call"></a>
    <client-only>
      <ForceLoginModal
        :visible="forceLoginModalVisible"
        @close="forceLoginModalVisible = false"
      />
      <div>
        <div class="fixed-actions">
          <button v-if="isShowGoHome" @click="goHome" class="align">
            <img src="../assets/fixed-actions/home.png" alt="" srcset="" />
          </button>
          <input class="copy-input" id="url" type="text" :value="url" />
          <!-- Trigger -->
          <button
            ref="share"
            v-if="isShowShare"
            id="share"
            class="align"
            data-clipboard-target="#url"
            @click="share"
          >
            <img src="../assets/fixed-actions/share.png" alt="" srcset="" />
          </button>
        </div>
        <div
          @click="shareLayerVisible = false"
          class="share-layer"
          v-if="shareLayerVisible"
        >
          <img src="../assets/fixed-actions/share-hint.png" alt="" srcset="" />
        </div>
      </div>
    </client-only>
    <Nuxt keep-alive :keep-alive-props="{ include: ['Home', 'index'] }" />
  </div>
</template>
<script>
import { initApp, PARENT, router, Tip, wxApi, getPath, OS } from "@/utils";
import HintLoginModal from "@/components/HintLoginModal";
import AdvancedRewardsModal from "@/components/AdvancedRewardsModal";
import ForceLoginModal from "@/components/ForceLoginModal";
const isInHomePath = ["/", "/mall", "/messages", "/user"];
const showGoHomePathList = [
  "/propaganda/*",
  "/propaganda/insurance",
  "/class-list",
  "/class-detail",
  "/doctor-list",
  "/goods-detail",
];
const showSharePathList = [
  // "/propaganda/insurance",
  // "/class-list",
  // "/class-detail",
  // "/doctor-list",
  "/hospital-detail",
  "/goods-detail",
  // "/mall",
];
export default {
  name: "layout",
  created() {
    if (process.browser) {
      this.init();
      initApp(this);
      PARENT.BIND();
    }
  },
  data() {
    return {
      shareLayerVisible: false,
    };
  },
  computed: {
    path() {
      return getPath(this.$route.path);
    },
    url() {
      //加console是为了 url跟着path改变
      console.log(this.path, "-");
      return process.browser ? window.location.href : "";
    },
    isShowGoHome() {
      if (this.path === "/class-list" && this.$route.query.type === "office") {
        return false;
      }
      if (["", "/", "/login",'/hospital','/mall','/user'].includes(this.path)) {
        return false;
      }
      return true;
      // const result = showGoHomePathList
      //   .filter((path) => path.includes("*"))
      //   .some((path) => {
      //     return this.path.includes(path.replace('/*',''));
      //   });
      // if (result) {
      //   return true;
      // }
      // return showGoHomePathList.includes(this.path);
    },
    isShowShare() {
      return showSharePathList.includes(this.path);
    },
    forceLoginModalVisible() {
      return this.$store.state.forceLoginModalVisible;
    },
  },
  watch: {
    path(v) {
      if (isInHomePath.includes(v)) {
        this.$store.commit("toggleGoHomeBtn", false);
      }
    },
  },
  mounted() {
    if (process.browser && !OS.isWechat) {
      let clipboard = new ClipboardJS("#share");
      clipboard.on("success", (e) => {
        Tip.success("链接复制成功,粘贴发送给好友吧!");
        e.clearSelection();
      });
      clipboard.on("error", function () {
        Tip.error("复制失败");
      });
    }
    this.$nuxt.$on("share", this.share);
    this.cnzz();
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
  methods: {
    cnzz() {
      var _hmt = _hmt || [];
      (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?2c5c32586601926ed5e5ecd25846ee34";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    },
    init() {
      const type =
        "orientationchange" in window ? "orientationchange" : "resize";
      const doc = window.document;
      if (doc.addEventListener) {
        window.addEventListener(type, this.resize, !1);
        doc.addEventListener("DOMContentLoaded", this.resize, !1);
      }
      this.resize();
      // this.$store.commit("initLocale");
    },
    resize() {
      const w = Math.min(680, document.body.offsetWidth);
      window.document.documentElement.style.fontSize = (w / 375) * 100 + "px";
    },
    goHome() {
      router.replace({
        path: "/",
      });
      // this.$store.commit("toggleGoHomeBtn", false);
    },
    share() {
      if (OS.isWechat) {
        this.shareLayerVisible = true;
      }
    },
  },
  components: {
    HintLoginModal,
    AdvancedRewardsModal,
    ForceLoginModal,
  },
};
</script>

<style lang="scss">
/* *{
  opacity: 0;
} */
.fixed-actions {
  position: absolute;
  right: 0.2rem;
  bottom: 0.7rem;
  z-index: 2000;
  button {
    background: rgba($color: #fff, $alpha: 0.85);
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
    img {
      display: block;
      width: 70%;
      /* background: #e5e9f0; */
    }
    &:first-child {
      margin-bottom: 0.13rem;
    }
  }
}
.copy-input {
  position: fixed;
  z-index: -146;
  top: -4000px;
  left: 0;
}
.share-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba($color: #000000, $alpha: 0.8);
  img {
    position: absolute;
    top: 0;
    right: 0.24rem;
    width: 3rem;
  }
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 100px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.__nuxt {
  font-size: 0.12rem;
}
#app {
  position: relative;
  width: 100%;
  overflow: hidden;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>

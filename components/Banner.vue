<template>
  <StatusHandle :get="getData" ref="statusHandle">
    <div class="banner-box">
      <div class="swiper-container" @click="handleClick">
        <div class="swiper-wrapper">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="swiper-slide"
            :style="{
              background: `url('${getUrl(item)}') no-repeat center / cover`,
            }"
            @click="goAD(item)"
          />
        </div>
      </div>
      <div class="paging-box align">
        <div v-if="list.length" class="paging flex-row center">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="outer align"
            :class="{
              active: current === index,
              prev: current === index + 1,
              next: current === index - 1,
            }"
          >
            <div class="inner"></div>
          </div>
        </div>
      </div>
    </div>
  </StatusHandle>
</template>
<script>
import Swiper from "swiper";
// import Swiper styles
import "swiper/swiper-bundle.css";

import { mock, get } from "@/api/http";
const API = {
  AD(root) {
    return get("/Api/getBannerList_api.php", { root });
  },
};

export default {
  name: "Banner",
  props: {
    data: Array,
    root: String,
  },
  data() {
    return {
      current: 0,
      apiData: [],
      realIndex: 0,
    };
  },
  mounted() {},
  computed: {
    list() {
      const { root, data, apiData } = this;
      return root ? apiData : data;
    },
  },
  watch: {
    root() {
      if (this.$refs.statusHandle) {
        this.$refs.statusHandle.refresh();
      }
    },
  },
  methods: {
    init() {
      const that = this;
      this.mySwiper = new Swiper(".swiper-container", {
        // Optional parameters
        // direction: "vertical",
        loop: true,
        on: {
          slideChangeTransitionStart() {
            that.realIndex = this.realIndex;
            that.current = this.realIndex + (1 % that.list.length);
          },
        },
      });
      window.s = this.mySwiper;
    },
    getData() {
      const { root } = this;
      if (root) {
        return API.AD(root).then((res) => {
          this.apiData = res;
          this.$nextTick(() => {
            setTimeout(() => this.init(), 1000);
          });
        });
      } else {
        return Promise.resolve().then((res) => {
          this.$nextTick(() => {
            setTimeout(() => this.init(), 1000);
          });
        });
      }
    },
    getUrl(item) {
      if (typeof item === "object") {
        // return item?.theImgs?[0] || '';
        try {
          return item.theImgs[0];
        } catch (e) {
          return "";
        }
      } else {
        return item;
      }
    },
    handleClick() {
      this.$emit("click");
    },
    goAD(ad) {
      if (typeof ad !== "object") {
        return;
      }
      const { LinkUrl } = ad;
      if (LinkUrl) {
        const url = (LinkUrl || "").includes("http")
          ? LinkUrl
          : `http://${LinkUrl}`;
        console.log(url, "url");
        window.location.href = url;
      }
    },
  },
};
</script>
<style lang="scss">
.banner-box {
  position: relative;
  .paging-box {
    position: absolute;
    z-index: 99;
    left: 0;
    right: 0;
    bottom: -0.2rem;
    .outer {
      /* margin: 0 4px; */
      width: 15px;
      height: 15px;
      border: 2px solid transparent;
      border-radius: 50%;
      &.active {
        border: 2px solid #6dc7c6;
        .inner {
          background: #6dc7c6;
        }
      }
      .inner {
        width: 5px;
        height: 5px;
        background: #d8edef;
        border-radius: 50%;
      }
    }
  }
}
.swiper-container {
  /* margin-top: 0.1rem; */

  height: 1.6rem;
  border-radius: 0.1rem;
}
</style>
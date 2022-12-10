<template>
  <client-only>
    <div :class="['page', { fixed }]" ref="page" @scroll="throttleScroll">
      <slot v-if="OS.isWechat"></slot>
      <div v-if="!OS.isWechat" class="page-header align" :style="style">
        <template v-if="left">
          <div
            v-if="router.list.length"
            class="return-area align"
            @click="back"
          >
            <van-icon name="arrow-left" :color="color" size=".22rem" />
          </div>
          <div v-else class="return-area align" @click="goHome">
            <van-icon name="wap-home-o" :color="color" size=".22rem" />
          </div>
        </template>
        <p class="page-title ellipsis" :style="{ color }">{{ title }}</p>
      </div>
      <div
        v-if="!OS.isWechat"
        class="page-view"
        @scroll="throttleScroll"
        ref="scroll"
      >
        <slot></slot>
      </div>
    </div>
  </client-only>
</template>
<script>
import _ from "lodash";
import Header from "@/components/Header.vue";

import { router, size, OS } from "@/utils";
const H = size(50);
export default {
  name: "Page",
  props: {
    title: {
      type: String,
      default: "",
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "white",
    },

    left: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      OS,
      sticky: false,
      scrollY: 0,
      router,
    };
  },
  computed: {
    color() {
      const { fixed, sticky, theme } = this;
      if (sticky) {
        return "#333";
      }
      return fixed
        ? theme === "white"
          ? "#fff"
          : "#000"
        : theme === "black"
        ? "#fff"
        : "#000";
    },
    style() {
      const { fixed, theme, scrollY, color } = this;
      if (!fixed) {
        // return { background: theme === "white" ? "#fff" : "#000" };
        return { background: theme, color };
      }
      const opacity = Math.min(scrollY, H) / 50;
      return {
        background: `rgba(255,255,255,${opacity})`,
      };
    },
  },
  created() {
    if (this.fixed) {
      this.throttleScroll = _.throttle(this.onScroll, 100);
    } else {
      this.throttleScroll = this.empty;
    }
  },
  methods: {
    goHome() {
      router.replace({ path: "/" });
    },
    empty() {},
    onScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      this.sticky = scrollTop >= H;
      this.scrollY = scrollTop;
      this.$emit("scroll", e, this.scrollY);
    },
    back() {
      return router.back();
    },
    getContainer() {
      if (OS.isWechat) {
        return this.$refs.page;
      } else {
        return this.$refs.scroll;
      }
    },
  },
  components: {
    Header,
  },
};
</script>
<style lang="scss">
.page {
  height: 100%;
  $h: 0.5rem;
  /* padding-top: 0.6rem; */
  overflow: auto;
  .page-header {
    position: relative;
    height: $h;
    font-size: 0.16rem;
    font-weight: bold;
    background: #fff;
    transition: all 0.5s;
    .return-area {
      position: absolute;
      top: 0;
      left: 0;
      height: $h;
      padding-left: 0.1rem;
    }
  }
  .page-view {
    height: calc(100% - #{$h});
    overflow: auto;
  }
  &.fixed {
    top: 0;
    .page-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 99;
      height: $h;
      color: #fff;
      background: transparent;
    }
    .page-view {
      height: 100%;
    }
  }
  .page-title {
    padding-left: 0.4rem;
    padding-right: 0.2rem;
  }
}
</style>
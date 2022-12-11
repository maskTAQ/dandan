<template>
  <div class="header flex-row main-between center">
    <div class="logo flex-row center">
      <img :src="icons.logo || img.logo" alt="" class="icon" />
      <!-- <span class="text">旦旦医学</span> -->
    </div>
    <div @click="go({ path: '/messages' })" class="msg-box">
      <img :src="icons.msg || defaultIcons.msg" alt="" class="msg" />
      <div class="dot"></div>
    </div>
  </div>
</template>
<script>
import { icons as defaultIcons, img } from "@/assets";
import { goKf, router } from "@/utils";

export default {
  name: "Header",
  props: {
    icons: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      img,
      defaultIcons,
    };
  },
  methods: {
    go(params) {
      if (UID.GET()) {
        router.push(params);
      } else {
        this.$store.commit("toggleForceLoginModalVisible", true);
      }
    
    },
    goKf() {
      goKf("home");
    },
  },
};
</script>
<style lang="scss">
.header {
  .icon {
    height: 20px;
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
</style>
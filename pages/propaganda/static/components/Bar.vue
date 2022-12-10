<template>
  <div class="common-bar flex-row">
    <button @click="goKf" class="zx align">
      <img src="../imgs/kf.png" alt="" class="kf" />
      <span class="label">在线咨询</span>
    </button>
    <button @click="go" class="yy align">
      <span class="label">立即预约￥9.9元起</span>
    </button>
  </div>
</template>
<script>
import { goKf, router } from "@/utils";
export default {
  name: "common-bar",
  methods: {
    goKf() {
      goKf("home");
    },
    go() {
      router.push({
        path: "/goods-detail",
        query: {
          id: 202,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.common-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.57rem;
  background: #fff;
  button {
    flex: 1;
  }
  .zx {
    .kf {
      width: 0.2rem;
      margin-right: 0.1rem;
    }
    .label {
      font-size: 0.16rem;
      color: #ebb177;
    }
  }
  .yy {
    background: #ebb177;
    border-top-left-radius: 0.2rem;
    .label {
      font-size: 0.16rem;
      color: #fff;
    }
  }
}
</style>
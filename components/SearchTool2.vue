<template>
  <div class="search-tool2 flex-row center">
    <img :src="icons.logor" class="logo" alt="" />
    <img :src="icons.logoTextT" class="logo-text" alt="" />
    <div class="search-con" @click="go">
      <img class="search-icon" :src="icons.search3" alt="" />
      {{ placeholder || text }}
    </div>
    <div @click="goMessage">
      <img :src="icons.xiaox" class="xiaox" alt="" />
      <img v-if="isNew" :src="icons.ry" alt="" class="show-red" />
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
export default {
  name: "tool2",
  props: ["text", "isNew", "placeholder"],
  data() {
    return {
      icons,
    };
  },
  methods: {
    go() {
      router.push({
        path: "/search",
      });
    },
    goMessage() {
      router.push({
        path: "/messages",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.search-tool2 {
  padding: 0.15rem 0;

  .logo {
    height: 0.37rem;
    margin-right: 0.05rem;

    img {
      width: 100%;
    }
  }

  .logo-text {
    height: 0.28rem;
  }

  .search-con {
    border: 1px solid rgb(196, 196, 196);
    height: 0.34rem;
    position: relative;
    flex: 1;
    margin: 0px 0.15rem;
    border-radius: 0.06rem;
    line-height: 0.34rem;
    padding-left: 0.3rem;
    font-size: 0.11rem;
    color: rgb(131, 133, 146);

    .search-icon {
      position: absolute;
      top: 10px;
      left: 10px;
      height: 0.13rem;
      width: 0.13rem;
    }
  }

  .xiaox {
    height: 0.24rem;
  }

  .show-red {
    position: absolute;
    top: 19px;
    right: 11px;
    height: 0.1rem;
  }
}
</style>
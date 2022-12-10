<template>
  <div class="search flex-row center">
    <img
      :src="icons.search || defaultIcons.search"
      class="icon"
      alt=""
      srcset=""
    />
    <div @click="go" class="placeholder">{{ placeholder }}</div>
  </div>
</template>
<script>
import { icons as defaultIcons } from "@/assets";
import { router } from "@/utils";

export default {
  name: "Search",
  props: {
    icons: {
      type: Object,
      default() {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: "搜索医院/服务/笔记等内容",
    },
  },
  data() {
    return {
      defaultIcons,
    };
  },
  methods: {
    go() {
      router.push({
        path: "/search",
      });
    },
  },
};
</script>
<style lang="scss">
.search {
  height: 0.37rem;
  padding: 0 0.16rem;
  background: #ffffff;
  border-radius: 0.2rem;
  .icon {
    height: .16rem;
  }
  .placeholder {
    margin-left: 0.07rem;
    flex: 1;
    height: 100%;
    line-height: 0.37rem;
    font-size: 0.12rem;
    color: #b6b6b6;
  }
}
</style>
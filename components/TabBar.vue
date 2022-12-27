<template>
  <van-tabbar class="tabbar" :value="current" @change="go">
    <van-tabbar-item v-for="item in tabs" :key="item.label">
      <div class="item flex-column align">
        <img
          :src="path === item.path ? item.selectedIcon : item.icon"
          alt=""
          class="icon"
        />
        <span :class="['label', { selected: path === item.path }]">{{
          item.label
        }}</span>
      </div>
    </van-tabbar-item>
  </van-tabbar>
</template>
<script>
import { tabbar } from "@/assets";
import { router } from "@/utils";

export default {
  name: "TabBar",
  data() {
    return {
      tabs: [
        {
          label: "首页",
          path: "/",
          icon: tabbar.home,
          selectedIcon: tabbar.home_active,
        },
        
        {
          label: "医院",
          path: "/hospital",
          icon: tabbar.hospital,
          selectedIcon: tabbar.hospital_active,
        },
        {
          label: "服务",
          path: "/mall",
          icon: tabbar.mall,
          selectedIcon: tabbar.mall_active,
        },
        {
          label: "我的",
          path: "/user",
          icon: tabbar.user,
          selectedIcon: tabbar.user_active,
        },
      ],
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    current() {
      return this.tabs.findIndex((item) => item.path === this.path);
    },
  },

  methods: {
    go(index) {
      router.push({
        path: this.tabs[index].path,
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.tabbar {
  height: .6rem;
  box-shadow: 0px -6px 10px 0px rgba(161, 177, 198, 0.05);
  .item {
    .icon {
      width: 0.19rem;
    }
    .label {
      margin-top: .08rem;
      font-size: 0.12rem;
      color: #A2A2B0;
      &.selected {
        color: rgb(103, 210, 210);
      }
    }
  }
}
</style>
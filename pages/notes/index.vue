<template>
  <Page title="好孕笔记">
    <div class="notes-page page-full">
      <ul v-if="false" class="tabs flex-row align">
        <li
          :class="['tab', { selected: tab === item.value }]"
          v-for="item in TABS"
          :key="item.value"
          @click="onTabChange(item.value)"
        >
          {{ item.label }}
        </li>
      </ul>
      <List
        :request="request"
        :renderItem="renderItem"
        class="list"
        ref="list"
        disabledLoadmore
      />
      <button class="add" @click="handleMenuClick"></button>
      <div v-if="layerVisible" class="layer" @click="layerVisible = false">
        <ul class="menus">
          <li
            class="menu align"
            v-for="menu in menus"
            :key="menu.query"
            @click.stop="handleMenuClick(menu)"
          >
            {{ menu.label }}
          </li>
        </ul>
      </div>
    </div>
  </Page>
</template>
<script>
import day from "dayjs";

import { get, post } from "@/api/http";
import { Tip, router } from "@/utils";
import CoverImage from "@/components/CoverImage";
import { formatTime } from "../../utils";
import NoteItem from "@/components/NoteItem";
const API = {
  LIST(params) {
    return get("/Api/getForumList_api.php", params);
  },
  SEND(params) {
    return post("/Api/sendInquiry_api.php", params, { json: false });
  },
  QUERY_NUM() {
    return get("/Api/getUserSendNum_api.php");
  },
};
const TABS = [
  { label: "笔记", value: "笔记" },
  { label: "文章", value: "文章" },
];
export default {
  name: "notes",
  head() {
    return {
      title: "好孕笔记",
    };
  },
  data() {
    return {
      tab: "笔记",
      TABS,
      menus: [
        {
          label: "笔记",
          query: "1",
        },
        {
          label: "文章",
          query: "2",
        },
      ],
      layerVisible: false,
    };
  },
  methods: {
    onTabChange(tab) {
      this.tab = tab;
      this.$nextTick(this.refresh);
    },
    request() {
      return API.LIST({ theType: this.tab });
      // return API.LIST();
    },
    refresh() {
      this.$refs.list && this.$refs.list.refresh();
    },
    format(item) {
      // console.log(item, "item");
      const { SendDate, redate, ...o } = item;
      const d = day((SendDate || redate) * 1000);
      return {
        ...o,
        day: d.format("MM/DD"),
        time: d.format("HH:mm"),
        isChild: !!redate,
      };
    },
    renderItem(item) {
      return <NoteItem data={item} onRefresh={this.refresh} />;
    },
    handleMenuClick(menu) {
      router.push({
        path: "/notes/publish",
        query: {
          // type: menu.query,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.notes-page {
  /* padding: 0.1rem 0.12rem; */
  background: #eaedf5;
  .tabs {
    font-size: 0.14rem;
    color: #101010;
    .tab {
      height: 0.3rem;
      border-bottom: 3px solid transparent;
      &.selected {
        border-color: #2d4ef5;
      }
      &:first-child {
        margin-right: 0.9rem;
      }
    }
  }
  .list {
    /* height: calc(100% - 0.3rem); */
    height: 100%;
    padding: 0.1rem;
  }

  .add {
    position: fixed;
    right: 0.2rem;
    bottom: 0.28rem;
    width: 0.48rem;
    height: 0.48rem;
    font-size: 0.3rem;
    color: #fff;
    border-radius: 50%;
    background: rgba(3, 121, 255, 100) url("../../assets/icon/add-white.png")
      no-repeat center center / 0.3rem auto;
  }
  .layer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .menus {
      position: absolute;
      right: 0.7rem;
      bottom: 0.34rem;
      padding: 0 0.15rem;
      background: rgba(3, 121, 255, 100);
      border-radius: 10px;
      .menu {
        width: 1.4rem;
        font-size: 0.14rem;
        color: #fff;
        height: 0.4rem;
        &:first-child {
          border-bottom: 1px solid rgba($color: #fff, $alpha: 0.4);
        }
      }
    }
  }
}
</style>
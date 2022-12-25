<template>
  <Page title="系统消息" class="system-messages">
    <List :request="request" :renderItem="renderItem" class="list" ref="list" />
  </Page>
</template>
<script>
import { mock } from "@/api";
import { get } from "@/api/http";
import MessageCard from "./components/MessageCard";
import { router, formatTime } from "@/utils";
import dayjs from "dayjs";

const API = {
  LIST(params) {
    return get("/Api/getSysMsgList_api.php", params);
  },
};

export default {
  name: "Messages",
  head() {
    return {
      title: "系统消息",
    };
  },
  methods: {
    request(params) {
      return API.LIST(params);
    },
    go(item) {
      const { cid } = item;
      // router.push({
      //   path: "/consult-doctor",
      //   query: {
      //     id: bid,
      //   },
      // });
      console.log(item, "item");
      router.push({
        path: "/card-list",
        query: {
          id: cid,
        },
      });
    },
    renderItem(item, i, instance) {
      const {
        adminPhoto,
        adminName,
        adminType,
        cType,
        cardText,
        SendDate,
        ...o
      } = item;

      return <MessageCard data={item} class="item" click={this.go} />;
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.system-messages {
  height: 100%;
  background: $color8;
  .list {
    height: 100%;
  }
}
</style>
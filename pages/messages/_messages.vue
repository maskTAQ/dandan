<template>
  <div class="messages page-tab">
    <List :request="request" :renderItem="renderItem" class="list" ref="list" />
    <TabBar />
  </div>
</template>
<script>
import { mock } from "@/api";
import { get } from "@/api/http";
import DoctorCard from "@/components/DoctorCard";
import { router, formatTime } from "@/utils";
import dayjs from "dayjs";

const API = {
  LIST(params) {
    return get("/Api/getDoctorMessageList_api.php", params);
  },
};

export default {
  name: "Messages",
  head() {
    return {
      title: "消息",
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
      const data = {
        ...o,
        exPhoto: adminPhoto,
        exName: adminName,
        exRoom: adminType,
        exLevel: cType,
        HsName: "--",
        time: formatTime(SendDate, "MM-DD HH:mm"),
      };
      return (
        <DoctorCard
          data={data}
          ask={false}
          reply={cardText}
          badge={item.NoRead}
          class="item"
          click={this.go}
        />
      );
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.messages {
  background: $color8;
  .list {
    height: 100%;
    padding: 0.1rem 0.12rem;
    .item {
      margin-bottom: 0.1rem;
    }
  }
}
</style>
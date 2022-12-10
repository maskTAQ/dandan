<template>
  <Page title="消息管理">
    <div class="messages">
      <List
        :request="request"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import { mock } from "@/api";
import { get } from "@/api/http";
import DoctorCard from "@/components/DoctorCard";
import { router, formatTime } from "@/utils";
import dayjs from "dayjs";

const API = {
  LIST(params) {
    return get("/Api/MsgList_api.php", params);
  },
};

export default {
  name: "Messages",
  head() {
    return {
      title: "消息管理",
    };
  },
  methods: {
    request(params) {
      return API.LIST(params)//.then((res) => [{}]);
    },
    go(item) {
      const { cid } = item;
      // router.push({
      //   path: "/consult-doctor",
      //   query: {
      //     id: bid,
      //   },
      // });
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
        <div
          onClick={() => {
            this.go(item);
          }}
          class="item flex-row center"
        >
          <CoverImage class="portrait" />
          <div class="info">
            <div class="flex-row center">
              <span class="name">王博超</span>
              <span class="tag align">专属顾问</span>
            </div>
            <p class="desc">国家生殖咨询管理师</p>
          </div>
        </div>
      );
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.messages {
  height: 100%;
  background: #f3f5f9;
  .list {
    height: 100%;
    .item {
      margin-top: 0.1rem;
      height: 0.88rem;
      background: #fff;
      padding: 0.15rem;
      .portrait {
        margin-right: 0.09rem;
        width: 0.57rem;
        height: 0.57rem;
        border: 1px solid red;
      }
      .name {
        margin-right: 0.05rem;
        font-size: 0.16rem;
        font-weight: 500;
        color: #000000;
      }
      .tag {
        height: 0.19rem;
        padding: 0 0.06rem;
        background: linear-gradient(160deg, #fea845 0%, #fe6a22 100%);
        border-radius: 0.09rem;
        font-size: 0.11rem;
        font-weight: 400;
        color: #ffffff;
      }
      .desc {
        margin-top: 0.1rem;
        font-size: 0.13rem;
        color: #666666;
      }
    }
  }
}
</style>
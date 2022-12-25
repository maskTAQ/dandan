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
import CoverImage from "@/components/CoverImage";
import { router, formatTime } from "@/utils";
import dayjs from "dayjs";
import { link } from "../../utils";

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
      return API.LIST(params); //.then((res) => [{}]);
    },
    go(item) {
      const { OrderNo, WxUrl, theName } = item;
      switch (+OrderNo) {
        case 1: {
          if (WxUrl) {
            link({
              title: theName,
              src: WxUrl,
            });
          }
          break;
        }
        case 2: {
          router.push({
            path: "/chat",
          });
          break;
        }
        case 3: {
          router.push({
            path: "/messages/system",
          });
          break;
        }
        case 4: {
          router.push({
            path: "/messages/comments",
          });
          break;
        }
      }
      console.log(item, "item");
      // router.push({
      //   path: "/consult-doctor",
      //   query: {
      //     id: bid,
      //   },
      // });
      // router.push({
      //   path: "/card-list",
      //   query: {
      //     id: cid,
      //   },
      // });
    },
    renderItem(item, i, instance) {
      const { theName, Icon, IsTag, Msg, isRead } = item;
      return (
        <div
          onClick={() => {
            this.go(item);
          }}
          class="item flex-row center"
        >
          <CoverImage url={Icon} class="portrait">
            {!!isRead && <div class="dot" />}
          </CoverImage>
          <div class="info">
            <div class="flex-row center">
              <span class="name">{theName}</span>
              {!!IsTag && <span class="tag align">专属顾问</span>}
            </div>
            {!!Msg && <p class="desc">{Msg}</p>}
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
        position: relative;
        margin-right: 0.09rem;
        width: 0.57rem;
        height: 0.57rem;
        .dot {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fd4548;
        }
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
<template>
  <div class="message-card">
    <p class="date">{{ formatTime(data.MsgTime, "YYYY年MM月04日 HH:mm") }}</p>
    <div class="flex-row" style="flex: 1">
      <CoverImage :url="data.MsgPhoto" class="portrait" />
      <div class="message-info">
        <p class="name">{{ data.MsgName }}</p>
        <div class="bubbles">
          <img :src="icons.bubblesBadge" alt="" class="badge" />
          <p class="text">{{ data.MsgText }}</p>

          <div class="img-list flex-row centere">
            <CoverImage
              v-for="(item, index) of data.MsgImg || []"
              :key="item"
              :url="item"
              class="item"
              @click="showImg(data.MsgImg, index)"
            />
          </div>
        </div>
        <div class="link-box flex-row main-end" v-if="data.MsgUrl">
          <button class="link flex-row center" @click="go">
            <div class="icon-box align">
              <img :src="icons.link" alt="" class="icon" />
            </div>
            <span class="text">{{ data.MsgUrl }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";

import { icons } from "@/assets";
import { formatTime, toArray, Tip } from "@/utils";

import { get, mock } from "@/api/http";
import { link } from "../../../utils";
const API = {
  DELETE(params) {
    return get("/Api2/delPL_api.php", params);
  },
};
export default {
  name: "message-card",
  props: {
    data: Object,
    project: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value: 2.5,
      icons,
    };
  },
  computed: {
    rateList() {
      return toArray(this.data.pfItem);
    },
  },
  methods: {
    formatTime,
    showImg(imgList, index) {
      ImagePreview({
        images: imgList,
        startPosition: index,
      });
    },
    go() {
      const { MsgUrl, MsgName } = this.data;
      link({
        title: MsgName,
        src: MsgUrl,
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.message-card {
  /* padding: 0.15rem 0; */
  padding: 0.25rem 0.15rem;
  padding-bottom: 0.1rem;
  margin-bottom: 0.1rem;
  .date {
    margin-bottom: 0.14rem;
    font-size: 0.14rem;
    color: #cecece;
    text-align: center;
  }
  .portrait {
    flex-shrink: 0;
    margin-right: 0.13rem;
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 50%;
  }
  .message-info {
    flex: 1;
  }
  .name {
    font-size: 0.16rem;
    color: #2d2d2d;
  }
  .bubbles {
    margin-top: 0.07rem;
    margin-bottom: 0.09rem;
    position: relative;
    padding: 0.15rem 0.22rem;
    border-radius: 0.1rem;
    background: #dee4f7;
    .badge {
      position: absolute;
      top: 0.05rem;
      left: -0.11rem;
      width: 0.11rem;
      font-size: 0.15rem;
      color: #2d2d2d;
    }
    .img-list {
      flex-wrap: wrap;
      margin: 0.1rem 0;
      .item {
        margin-right: 0.12rem;
        width: 0.74rem;
        height: 0.74rem;
        border-radius: 4px;
        background-size: contain !important;
      }
    }
  }
  .link {
    background: rgba(45, 78, 245, 0.3);
    border-radius: 0px 5px 5px 0px;
    .icon {
      width: 0.18rem;
      height: 0.18rem;
    }
    .text {
      padding: 0 0.02rem;
      font-size: 0.09rem;
      color: #fff;
    }
  }
}
</style>
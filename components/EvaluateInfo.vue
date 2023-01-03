<template>
  <div class="evaluate-info flex-row">
    <CoverImage :url="data.UserPhoto" class="portrait" />
    <div class="main">
      <div class="user-info flex-row main-between">
        <div class="flex-row center">
          <p class="name ellipsis">{{ data.NickName }}</p>
          <img
            v-if="data.isFine === '1'"
            :src="icons.youzhi"
            class="icon"
            alt=""
            srcset=""
          />
        </div>
        <span class="time">{{ formatTime(data.pjTime, "YYYY/MM/DD") }}</span>
      </div>
      <div class="rate-list">
        <div
          class="rate-item flex-row center"
          v-for="rate in rateList"
          :key="rate.theTitle"
        >
          <span class="label">{{ rate.theTitle }}</span>
          <van-rate
            :value="+rate.theScore"
            :size="9"
            color="#FFC100"
            void-icon="star"
            void-color="#ebeef0"
          />
        </div>
      </div>

      <p class="message">{{ data.pjValue }}</p>
      <div v-if="(data.pjImgs || []).length" class="img-list flex-row centere">
        <CoverImage
          v-for="(item, index) of data.pjImgs || []"
          :key="item"
          :url="item"
          class="item"
          @click="showImg(data.pjImgs, index)"
        />
      </div>
      <div v-if="data.replyValue" class="reply">
        <div class="reply-top flex-row main-between center">
          <div class="flex-row center">
            <i class="name">官方回复</i>
            <img class="icon" :src="icons.admin_reply" alt="" />
          </div>
          <i class="time">{{ formatTime(data.reTime, "YYYY/MM/DD") }}</i>
        </div>
        <div class="img-list flex-row centere">
          <CoverImage
            v-for="(item, index) of data.reImgs || []"
            :key="item"
            :url="item"
            class="item"
            @click="showImg(data.reImgs, index)"
          />
        </div>
        <p class="reply-message">{{ data.replyValue }}</p>
      </div>
      <p class="split"></p>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";

import { icons } from "@/assets";
import { formatTime, toArray } from "@/utils";
export default {
  name: "evaluate-info",
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
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.evaluate-info {
  /* padding: 0.15rem 0; */
  margin-bottom: 0.1rem;
  .portrait {
    width: 0.43rem;
    height: 0.43rem;
    border-radius: 50%;
  }
  .main {
    margin-left: 9px;
    width: 0;
    flex: 1;
    .split {
      margin-left: 5px;
      height: 1px;
      background: #eeeeee;
    }
  }
  .rate-list {
    .label {
      margin-right: 0.05rem;
    }
  }
  .user-info {
    .name {
      margin-bottom: 4px;
      font-size: 0.14rem;
      font-weight: 600;
      color: #141414;
    }
    .time {
      font-size: 0.13rem;
      color: #989898;
    }
    .icon {
      margin-left: 0.08rem;
      width: 0.6rem;
    }
  }

  .message {
    margin: 0.15rem 0;
    font-size: 0.14rem;
    color: #4e4e4e;
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
  .reply {
    font-size: 0.14rem;
    color: #333333;
    .name {
      margin-right: 4px;
    }
    .icon {
      width: 0.6rem;
    }
    .reply-message {
      margin-top: 0.1rem;
    }
  }
}
</style>
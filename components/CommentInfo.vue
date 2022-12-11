<template>
  <div class="comment-info flex-row">
    <CoverImage :url="data.UserPhoto" class="portrait" />
    <div class="main">
      <div class="user-info flex-row main-between center">
        <div>
          <p class="name ellipsis">{{ data.UserName }}</p>
          <span class="time">{{ formatTime(data.PLTime, "YYYY/MM/DD HH:mm:ss") }}</span>
        </div>
        <div class="like-box flex-row center" @click="toggle(data)">
          <img
            :src="+data.isHot ? icons.plLike : icons.plUnlike"
            alt=""
            class="like-icon"
          />
          <span class="value">{{ data.hotNum }}</span>
        </div>
      </div>
      <p class="message" v-html="message"></p>
      <div class="reply-btn-box flex-row main-end">
        <button class="reply-btn align" @click="emitReply({ data })">
          回复
        </button>
      </div>
      <div class="reply-list" v-if="children.length">
        <div
          v-for="(reply, index) in showList"
          :key="reply.id"
          class="reply flex-row"
        >
          <CoverImage :url="reply.UserPhoto" class="portrait" />
          <div class="main">
            <div class="user-info flex-row main-between center">
              <div class="flex-row center">
                <p class="name ellipsis">{{ reply.UserName }}</p>
                <p class="reply-message" v-if="reply.AtNickName">
                  @{{ reply.AtNickName }}
                </p>
              </div>
              <div class="like-box flex-row center" @click="toggle(reply)">
                <img
                  :src="+reply.isHot ? icons.plLike : icons.plUnlike"
                  alt=""
                  class="like-icon"
                />
                <span class="value">{{ reply.hotNum }}</span>
              </div>
            </div>
            <span class="time">{{ formatTime(data.PLTime, "YYYY/MM/DD HH:mm:ss") }}</span>
            <p class="message" v-html="getEmojiHTML(reply.Content)"></p>
            <div class="reply-btn-box flex-row main-end">
              <button
                class="reply-btn align"
                @click="emitReply({ data: reply, index, parent: data })"
              >
                回复
              </button>
            </div>
          </div>
        </div>
        <div v-if="children.length > 3" class="toggle" @click="toggleVisible">
          {{ toggleLabel }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";

import { icons } from "@/assets";
import { formatTime, toArray } from "@/utils";
import emojiData from "./Emoji/data";

let emojiList = [];
Object.values(emojiData).forEach((obj) => {
  emojiList = emojiList.concat(Object.keys(obj));
});

export default {
  name: "comment-info",
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
      visible: false,
    };
  },
  computed: {
    rateList() {
      return toArray(this.data.pfItem);
    },
    children() {
      return toArray(this.data.children || []) || [];
    },
    showList() {
      const { children, visible } = this;
      console.log({ children, visible });
      if (children.length > 3 && !visible) {
        return children.slice(0, 3);
      } else {
        return children;
      }
    },
    toggleLabel() {
      const { children, visible } = this;
      if (children.length > 3 && !visible) {
        return `查看剩余${children.length - 3}条`;
      } else {
        return "收起";
      }
    },

    message() {
      return this.getEmojiHTML(this.data.Content);
    },
  },
  methods: {
    getEmojiHTML(msg) {
      return String(msg || "").replace(/\[[a-z_]+\]/gim, (emoji) => {
        if (emojiList.includes(emoji)) {
          const imgName = emoji.replace(/\[|\]/g, "") + ".png";
          return `<img class="emoji" src="/h5/emoji/${imgName}" />`;
        } else {
          return emoji;
        }
      });
    },
    toggleVisible() {
      this.visible = !this.visible;
    },
    formatTime,
    showImg(imgList, index) {
      ImagePreview({
        images: imgList,
        startPosition: index,
      });
    },
    emitReply({ data, parent, index }) {
      if (parent) {
        this.$emit("reply", {
          ...data,
          parent,
          index: index + 1,
        });
      } else {
        this.$emit("reply", data);
      }
    },
    toggle(data) {
      this.$emit("toggle", data);
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.comment-info {
  /* padding: 0.15rem 0; */
  margin-bottom: 0.1rem;
  .portrait {
    width: 0.43rem;
    height: 0.43rem;
    border-radius: 50%;
  }
  .reply {
    .portrait {
      width: 0.29rem;
      height: 0.29rem;
    }
    .name {
      line-height: 0.29rem;
    }
  }
  .main {
    margin-left: 7px;
    width: 0;
    flex: 1;
    .split {
      margin-left: 5px;
      height: 1px;
      background: #eeeeee;
    }
  }
  .user-info {
    .name {
      font-size: 0.14rem;
      font-weight: 600;
      color: #141414;
    }
    .time {
      font-size: 0.13rem;
      color: #989898;
    }
  }

  .message {
    margin-top: 0.1rem;
    font-size: 0.14rem;
    color: #4e4e4e;
    .emoji {
      width: 0.24rem;
    }
  }
  .reply-message {
    font-size: 0.14rem;
    color: #6dc7c6;
    margin-left: 0.1rem;
  }
  .toggle {
    margin-bottom: 0.1rem;
    font-size: 0.12rem;
    color: #4d6eff;
  }
  .reply-btn {
    margin-bottom: 0.2rem;
    width: 0.44rem;
    height: 0.22rem;
    font-size: 0.11rem;
    color: #4d6eff;
    background: rgba($color: #6dc7c6, $alpha: 0.1);
    border-radius: 0.14rem;
  }
  .reply-list {
    /* margin-left: -0.3rem; */
  }
  .like-box {
    .like-icon {
      margin-right: 0.04rem;
      width: 0.13rem;
    }
    .value {
      font-size: 0.11rem;
      color: #4e4e4e;
    }
  }
}
</style>
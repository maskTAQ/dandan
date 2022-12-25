<template>
  <div class="comments-info" @click="go">
    <div class="user-info flex-row main-between center">
      <div class="flex-row center">
        <CoverImage :url="data.UserPhoto" class="portrait" />
        <div>
          <p class="name">{{ data.UserName }}</p>
          <p class="date">{{ formatTime(data.PLTime, "MM-DD HH:mm") }}</p>
        </div>
      </div>
      <button @click="_delete" class="delete">删除</button>
    </div>
    <p class="message">
      <span v-if="data.AtNickName" class="reply">@{{ data.AtNickName }}</span>
      {{ data.Content }}
    </p>
    <div class="info-card flex-row center">
      <CoverImage :url="data.PageImg" class="cover" />
      <div class="text-box">
        <p class="name">{{ data.writer }}</p>
        <p class="text ellipsis">{{ data.Tital }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";

import { icons } from "@/assets";
import { formatTime, toArray, Tip } from "@/utils";

import { get, mock } from "@/api/http";
const API = {
  DELETE(params) {
    return get("/Api2/delPL_api.php", params);
  },
};
export default {
  name: "comments-info",
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
    _delete() {
      Tip.request({
        title: "确定删除?",
        content: "删除的信息将不能找回,确定删除吗",
        call: API.DELETE,
        params: {
          pid: this.data.pid,
        },
      }).then((res) => {
        this.$emit("refresh");
        Tip.success("删除成功成功");
      });
    },
    go() {
      router.push({
        path: "/class-detail",
        query: {
          id: this.data.bid,
        },
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.comments-info {
  /* padding: 0.15rem 0; */
  padding: 0.25rem 0.15rem;
  background: #fff;
  border-radius: 0.04rem;
  margin-bottom: 0.1rem;
  .user-info {
    .portrait {
      margin-right: 0.09rem;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }
    .name {
      margin-bottom: 0.05rem;
      font-size: 0.17rem;
      font-weight: 500;
      color: #666666;
    }
    .date {
      font-size: 0.12rem;
      color: #666666;
    }
    .delete {
      padding: 0 0.2rem;
      height: 0.29rem;
      font-size: 0.13rem;
      color: #fff;
      background: linear-gradient(
        180deg,
        #5986fb 0%,
        rgba(45, 78, 245, 0.58) 100%
      );
      border-radius: 0.04rem;
    }
  }

  .message {
    margin-top: 0.18rem;
    margin-bottom: 0.16rem;
    font-size: 0.13rem;
    color: #666666;
  }
  .reply {
    margin-right: 0.1rem;
    color: #666666;
    font-weight: 600;
  }
  .info-card {
    height: 0.62rem;
    background: rgba($color: #d8d8d8, $alpha: 0.29);
    border-radius: 0.05rem;
    overflow: hidden;
    .cover {
      width: 0.62rem;
      height: 0.62rem;
    }
    .text-box {
      padding: 0 0.13rem;
    }
    .name {
      font-size: 0.13rem;
      color: #2a2a2a;
    }
    .text {
      margin-top: 0.05rem;
      font-size: 0.13rem;
      color: #2a2a2a;
    }
  }
}
</style>
<template>
  <div class="punch-record">
    <div v-if="!home" class="user-info flex-row center">
      <CoverImage class="portrait" :url="data.UserPhoto" />
      <p class="username">{{ data.NickName }}</p>
    </div>
    <p class="msg">{{ data.message }}</p>
    <div class="img-list flex-row">
      <CoverImage
        v-for="(img, index) in data.imgList"
        :key="index"
        :url="img"
        class="img"
        @click="showImg(index)"
      />
    </div>
    <div v-if="home" class="user-info flex-row main-between center">
      <div class="flex-row center">
        <CoverImage class="portrait" :url="data.UserPhoto" />
        <p class="username">{{ data.NickName }}</p>
        <p class="time">{{ formatTime(data.ctime) }}</p>
      </div>
      <p class="read">{{ data.readNum || "-" }}人阅读</p>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
import { formatTime } from "@/utils";
export default {
  name: "PunchRecord",
  props: {
    data: Object,
    home: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgList: ["", "", "", "", "", ""],
    };
  },
  methods: {
    formatTime,
    showImg(index) {
      const { imgList } = this.data;
      ImagePreview({
        images: imgList,
        startPosition: index,
      });
    },
  },
};
</script>
<style lang="scss">
.punch-record {
  .portrait {
    margin-right: 0.07rem;
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 50%;
    /* border: 1px solid red; */
  }
  .user-info {
    padding-bottom: 0.1rem;
  }
  .username {
    font-size: 0.12rem;
    font-weight: 500;
    color: rgba(33, 33, 33, 0.84);
  }
  .time {
    margin-left: 0.1rem;
    font-size: 0.12rem;
    color: #999999;
  }
  .read {
    font-size: 0.12rem;
    color: #999999;
  }
  .msg {
    margin-top: 0.08rem;
    margin-bottom: 0.1rem;
    font-size: 0.14rem;
    color: rgba(77, 77, 77, 0.84);
  }
  .img-list {
    flex-wrap: wrap;
    .img {
      margin-right: 0.08rem;
      margin-bottom: 0.08rem;
      width: 0.54rem;
      height: 0.54rem;
      /* border: 1px solid #979797; */
    }
  }
}
</style>
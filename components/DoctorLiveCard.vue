<template>
  <div class="doctor-live-card" @click="go">
    <div class="status-tag flex-row center">
      <span class="dot" :style="{ background: liveInfo.color }" />
      <span class="label">{{ liveInfo.label }}</span>
    </div>
    <CoverImage class="cover" :url="data.PageImg">
      <img src="" alt="" class="play" />
    </CoverImage>
    <div class="info">
      <p class="card-title">{{ data.Tital || "-" }}</p>
      <p class="date">
        {{ formatTime(data.CreateTime || data.LiveSTime, "MM/DD HH:mm") }}
      </p>
    </div>
  </div>
</template>
<script>
import { formatTime, router } from "@/utils";

export default {
  name: "DoctorLiveCard",
  props: {
    data: Object,
  },
  computed: {
    liveInfo() {
      const { LiveFlag, LiveSTime, VideoUrl, LiveUrl } = this.data;
      //   const dif = day(LiveSTime * 1000).diff(day(), "s");
      if (LiveFlag === 2) {
        return {
          color: "rgb(69, 188, 188)",
          label: "直播中",
        };
      }
      if (LiveFlag == 1) {
        return {
          color: "rgb(69, 188, 188)",
          label: "直播预告",
        };
      }
      if (LiveFlag === 3) {
        return {
          color: "rgb(253, 142, 74)",
          label: "观看回放",
        };
      }
      return {
        color: "rgb(253, 142, 74)",
        label: "回放生成中",
      };
    },
  },
  methods: {
    formatTime,
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
.doctor-live-card {
  position: relative;
  width: 1.4rem;
  /* height: 1.58rem; */
  background: rgb(255, 255, 255);
  box-shadow: 0px 4px 12px rgba(139, 156, 164, 0.17);
  border-radius: 0.1rem;
  overflow: hidden;
  .status-tag {
    position: absolute;
    height: 0.16rem;
    padding: 0 0.08rem;
    top: 0.06rem;
    left: 0.06rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 0.08rem;
    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }
    .label {
      margin-left: 0.06rem;
      font-size: 0.1rem;
      color: rgb(42, 42, 42);
    }
  }
  .cover {
    height: 1rem;
    background: #000;
  }
  .info {
    padding: 0.1rem;
  }
  .card-title {
    margin: 0.06rem 0;
    font-size: 0.12rem;
    font-weight: bold;
    color: rgb(51, 51, 51);
  }
  .date {
    font-size: 0.1rem;
    color: rgb(153, 153, 153);
  }
}
</style>
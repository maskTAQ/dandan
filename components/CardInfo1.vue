<template>
  <div class="hw-item" @click="go">
    <CoverImage :url="data.gImg" class="exPhoto" />
    <div class="info">
      <p class="title ellipsis">{{ data.gTital }}</p>
      <div class="flex-row center main-between">
        <span class="type">{{ data.ThePrice }}元</span>
        <span class="fw">服务{{ data.SalesNum }}次</span>
      </div>
    </div>
  </div>
</template>
<script>
import { icons, img } from "@/assets";
import CoverImage from "@/components/CoverImage.vue";
export default {
  name: "CardInfo1",
  props: {
    data: Object,
  },
  components: {
    CoverImage,
  },
  data() {
    return {
      icons,
      img,
    };
  },
  methods: {
    go() {
      router.push({
        path: "/hospital-detail",
        query: {
          id: this.data.gid,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.hw-item {
  .info {
    line-height: 22px;
    padding: 0.1rem;
  }

  .exPhoto {
    height: 1.34rem;
    width: 100%;
    border-radius: 0.15rem;
    // background-size: contain;
    // background-size: 100% 100%;
  }

  .title {
    font-size: 0.14rem;
    font-weight: 500;
    // padding: 0.05rem 0rem;
  }

  .type {
    color: rgb(241, 85, 32);
    font-size: 0.12rem;
    font-weight: 400;
  }

  .fw {
    color: rgb(153, 153, 153);
    font-size: 0.1rem;
  }
}
</style>
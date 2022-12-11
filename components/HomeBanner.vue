<template>
  <StatusHandle :get="get">
    <div class="home-banner swiper-container">
      <div class="swiper-wrapper">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="swiper-slide"
          :class="{
            active: realIndex === index,
            prev: realIndex === index + 1,
            next: realIndex === index - 1,
          }"
          @click="goAD(item)"
        >
          <CoverImage class="img" :url="item.theImg[0]" />
        </div>
      </div>
      <div class="paging-box align">
        <div v-if="data.length > 1" class="paging flex-row center">
          <span
            v-for="index in data.length"
            :key="index"
            :class="{
              active: current === index,
              prev: current === index + 1,
              next: current === index - 1,
            }"
          />
        </div>
      </div>
    </div>
  </StatusHandle>
</template>
<script>
import Swiper from "swiper";
// import Swiper styles
import "swiper/swiper-bundle.css";

import { get } from "@/api/http";

const API = {
  LIST(root) {
    return get("/Api/getRoomlist_api.php", {
      PageIndex: 0,
      root,
    });
  },
  AD(root) {
    return get("/Api/getBannerList_api.php", { root: `主页banner` });
  },
};

export default {
  name: "Banner",
  data() {
    return {
      realIndex: 0,
      current: 0,
      data: [],
    };
  },
  mounted() {
    console.log("mounted");
  },
  methods: {
    get() {
      // return new Promise((resolve)=>{
      //   setTimeout(resolve,999999999)
      // })
      return API.AD()
        .then((res) => {
          console.log(res, "banner");
          this.data = res;
          setTimeout(() => {
            this.init();
          }, 100);
        })
        .catch((e) => {});
    },
    init() {
      const that = this;
      this.mySwiper = new Swiper(".swiper-container", {
        slidesPerView: "auto",
        autoplay: true,
        centeredSlides: true,
        spaceBetween: 11,
        centeredSlides: true,
        loop: true,
        on: {
          slideChangeTransitionStart() {
            
            that.realIndex = this.realIndex;
            that.current = this.realIndex + (1 % that.data.length);
          },
        },
      });
      window.mySwiper = this.mySwiper;
    },
    goAD(ad) {
      const { LinkUrl } = ad;
      if (LinkUrl) {
        const url = (LinkUrl || "").includes("http")
          ? LinkUrl
          : `http://${LinkUrl}`;
        console.log(url, "url");
        window.location.href = url;
      }
    },
  },
};
</script>
<style lang="scss">
.home-banner.swiper-container {
  height: 1.4rem;
  /* border-radius: 0.2rem; */
  /* box-shadow: 0px -1px 12px 0px rgba(77, 110, 255, 0.8); */
  /* width: 3.3rem; */

  .swiper-wrapper {
    height: 1.4rem;
    
  }
  .swiper-slide {
    .img {
      margin: 0 auto;
      width: 100%;
      height: 100%;
    }
  }

  /* .swiper-slide,
  .prev,
  .swiper-slide-prev {
    .img {
      position: relative;
      top: 0.05rem;
      right: -0.3rem;
      width: 100%;
      height: 1rem;
    }
  }
  .active,
  .swiper-slide-active,
  .swiper-slide-duplicate-active {
    .img {
      top: 0;
      right: 0;
      width: 3rem;
      height: 100%;
    }
  }
  .next,
  .swiper-slide-next {
    .img {
      position: relative;
      top: 0.05rem;
      left: -0.3rem;
      width: 100%;
      height: 1rem;
    }
  } */

  .paging-box {
    margin-top: -0.14rem;
  }
  .paging {
    z-index: 99;
    span {
      margin: 0 4px;
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      &.active {
        width: 11px;
        height: 4px;
        background: #fff;
        border-radius: 2px;
      }
    }
  }
}
</style>
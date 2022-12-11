<template>
  <div class="doctor-card">
    <div class="main">
      <div class="doctor-head flex-row main-between center">
        <CoverImage :url="data.exPhoto" class="exPhoto" />
        <div class="info">
          <p class="title ellipsis">{{ data.exName }}</p>
          <p class="exRoom">{{ data.HsName }}</p>
          <div>
            <span class="tag" v-if="tag">{{ tag }}</span>
            <span class="exLevel">
              <span class="circular"></span>
              {{ data.exLevel }}</span
            >
          </div>
        </div>
      </div>
      <div class="doctor-footer flex-row main-between center">
        <div>
          <div class="exRoom ellipsis">{{ data.exRoom }}</div>
          <div class="intro ellipsis">{{ intro }}</div>
        </div>
        <div class="btn" @click="go">医生主页</div>
      </div>
    </div>
    <div class="border-area"></div>
  </div>
</template>
<script>
import CoverImage from "@/components/CoverImage.vue";
import { icons } from "@/assets";
import { router, goKf } from "@/utils";
export default {
  name: "DoctorCard",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    ask: {
      type: Boolean,
      default: true,
    },
    isParent: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    reply: {
      type: String,
      default: "",
    },
    intro: String,
    badge: [String, Number],
    click: Function,
  },
  components: {
    CoverImage,
  },
  data() {
    return {
      icons,
      unfold: false,
    };
  },
  methods: {
    toggle() {
      this.unfold = !this.unfold;
    },
    handleClick() {
      // this.$emit("click");

      if (this.click) {
        this.click(this.data);
      } else {
        router.push({
          path: "/doctor-detail",
          query: {
            id: this.data.exid,
          },
        });
      }
    },
    go() {
      router.push({ path: "/doctor-detail", query: { id: this.data.exid } });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.doctor-card {
  position: relative;
  padding-bottom: 0.12rem;
  .main {
    position: relative;
    z-index: 2;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(232, 243, 241);
    border-radius: 16px;
    padding: 0.17rem;
    .doctor-head {
      .exPhoto {
        height: 0.9rem;
        width: 0.9rem;
        border-radius: 50%;
        margin-right: 0.1rem;
      }

      .title {
        font-size: 0.16rem;
        font-weight: 600;
      }

      .exRoom {
        font-size: 0.12rem;
        color: #989898;
        line-height: 30px;
        margin-bottom: 0.1rem;
        border-bottom: 1px solid #e0e0e0;
      }

      .circular {
        background: #48988e;
        display: inline-block;
        height: 0.08rem;
        width: 0.08rem;
        border-radius: 0.3rem;
      }
      .exLevel {
        font-size: 0.12rem;
      }
      .tag {
        background: #eaf3f1;
        color: #48988e;
        border-radius: 0.05rem;
        padding: 0.05rem;
        font-weight: 600;
        font-size: 0.12rem;
      }

      .info {
        width: 0;
        flex: 1;
      }
    }

    .doctor-footer {
      margin-top: 0.1rem;

      .btn {
        /* Rectangle 515 */
        width: 1.12rem;
        height: 0.34rem;
        background: rgb(0, 188, 197);
        border-radius: 4px;
        color: #fff;
        font-size: 0.12rem;
        font-weight: bold;
        text-align: center;
        line-height: 0.34rem;
      }

      .exRoom {
        color: rgb(0, 188, 197);
        width: 100px;
        font-size: 0.13rem;
      }

      .intro {
        color: #989898;
        width: 150px;
        font-size: 0.12rem;
      }
    }
  }
  .border-area {
    position: absolute;
    z-index: 1;
    height: 1.65rem;
    bottom: 0;
    left: 0.12rem;
    right: 0.12rem;
    background: rgb(249, 249, 251);
    border: 1px solid rgb(232, 243, 241);
    border-radius: 0.16rem;
  }
}
</style>
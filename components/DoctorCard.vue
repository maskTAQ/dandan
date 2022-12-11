<template>
  <div v-if="data" class="doctor-card">
    <div class="doctor-head flex-row main-between center">
      <CoverImage :url="data.exPhoto" class="exPhoto" />
      <div class="info">
        <p class="title">{{ data.exName }}</p>
        <p class="exRoom">{{ data.exRoom }}</p>
        <div>
          <span class="tag">{{ data.tag }}公立三甲</span>
          <span class="exLevel">{{ data.exLevel }}</span>
        </div>
      </div>
    </div>
    <div class="doctor-footer flex-row main-between center">
      <div>
        <div class="exRoom ellipsis">{{ data.exRoom }}</div>
        <div class="intro ellipsis">{{ data.intro }}111111111111111111111111111111111111111111111111</div>
      </div>
      <div class="btn">医生主页</div>
    </div>
  </div>
  <!-- <div v-if="data" @click="handleClick" :class="['doctor-card', { shadow }]">
    <div class="main flex-row center">
      <van-icon
        class="portrait align"
        :name="data.exPhoto"
        :badge="+badge ? badge : ''"
      />
      <div class="info">
        <div class="top flex-row main-between center">
          <div class="title-box flex-row center">
            <i class="name">{{ data.exName }}</i>
            <p class="title ellipsis">{{ data.exRoom }} {{ data.exLevel }}</p>
          </div>
          <i v-if="data.time" class="time">{{ data.time }}</i>
        </div>
        <div class="hospital flex-row center">
          <div v-if="tag" class="tag">{{ tag }}</div>
          <p class="label">{{ data.HsName }}</p>
        </div>
        <p v-if="intro" class="intro ellipsis">{{ intro }}</p>
      </div>
      <div @click.stop="goAsk" v-if="isParent" class="ask flex-column align">
        <img :src="icons.ask" alt="" />
        <i class="label">私聊医生</i>
      </div>
    </div>
    <div class="my-docyor-tag align" v-if="data.OrderNo === '-1'">我的医生</div>
    <div v-if="reply" class="reply flex-row center">
      <i class="label">回复内容:</i>
      <i class="value ellipsis">{{ reply }}</i>
    </div>

    <div v-if="$slots.intro" :class="['intro-box', { unfold }]">
      <slot name="intro"></slot>
      <div @click="toggle" class="toggle-btn align">
        <img
          :src="unfold ? icons.unfold : icons.pack_up"
          alt=""
          class="toggle"
        />
      </div>
    </div>

    <p v-if="price" class="price">￥{{ price }}</p>
  </div> -->
</template>
<script>
import CoverImage from "@/components/CoverImage.vue"
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
    CoverImage

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
    goAsk() {
      // router.push({ path: "/inquiry" });
      goKf('doctor');
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.doctor-card {
  background: rgb(255, 255, 255);
  border: 1px solid rgb(232, 243, 241);
  border-radius: 16px;
  padding: 0.17rem;

  .doctor-head {
    .exPhoto {
      height: 0.9rem;
      width: 0.9rem;
      margin-right: 0.10rem;
    }

    .title {
      font-size: 0.15rem;
    }

    .exRoom {
      font-size: 0.13rem;
      color: #989898;
      line-height: 30px;
      margin-bottom: 0.10rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .tag {
      background: #eaf3f1;
      color: #48988e;
      border-radius: 0.05rem;
      padding: 0.05rem;
      font-weight: 600;
    }

    .info {
      flex: 1
    }
  }

  .doctor-footer {
    margin-top:0.10rem;
    .btn {
      /* Rectangle 515 */
      width: 1.12rem;
      height: 0.34rem;
      background: rgb(0, 188, 197);
      border-radius: 4px;
      color: #fff;
      font-size: 0.12rem;
      text-align: center;
      line-height: 0.34rem;
    }
    .exRoom{
      color: rgb(0, 188, 197);
      width: 100px;
    }
    .intro{
      color: #989898;
      width: 150px;
    }
  }
}

// .doctor-card {
//   /* margin-top: 0.28rem; */
//   position: relative;
//   padding: 0 0.16rem;
//   background: #fff;

//   &.shadow {
//     box-shadow: 0px 0.04rem 0.12rem 0px rgba(76, 135, 249, 0.05);
//     border-radius: 0.08rem;
//   }
//   .my-docyor-tag {
//     position: absolute;
//     width: 0.66rem;
//     height: 0.2rem;
//     padding-right: 0.05rem;
//     left: 0;
//     top: -0.05rem;
//     font-size: 0.1rem;
//     color: #fff;
//     background: url("../assets/img/my-doctor.png") no-repeat center center /
//       100% 100%;
//   }
//   .main {
//     height: 0.9rem;
//     .portrait {
//       /* display: flex; */
//       /* width: 0.48rem;
//       height: 0.48rem;
//       border-radius: 50%; */
//       /* border: 1px solid red; */
//       img {
//         display: block;
//         width: 0.48rem;
//         height: 0.48rem;
//         border-radius: 50%;
//       }
//     }
//     .info {
//       width: 0;
//       flex: 1;
//       margin: 0 0.14rem;
//       .top {
//         color: $color4;
//         font-weight: 500;
//         align-items: flex-end;
//         .name {
//           margin-right: 0.08rem;
//           font-size: 0.18rem;
//         }
//         .title-box {
//           width: 100%;
//           .title {
//             width: 0;
//             flex: 1;
//             font-size: 0.12rem;
//           }
//         }

//         .time {
//           font-size: 0.11rem;
//           color: #999999;
//         }
//       }
//       .tag {
//         margin-right: 0.04rem;
//         height: 0.16rem;
//         padding: 0 0.04rem;
//         line-height: 0.16rem;
//         font-size: 0.09rem;
//         color: #fff;
//         background: $color1;
//         border-radius: 0.03rem;
//       }
//       .hospital {
//         margin-top: 0.08rem;
//         font-size: 0.12rem;
//         color: $color6;
//       }
//     }
//     .intro {
//       margin-top: 0.02rem;
//       font-size: 0.11rem;
//       color: $color5;
//     }
//     .ask {
//       img {
//         width: 0.22rem;
//       }
//       .label {
//         margin-top: 0.07rem;
//         font-size: 0.12rem;
//         color: $color5;
//       }
//     }
//   }
//   .intro-box {
//     &.unfold {
//       p {
//         height: 0.2rem;
//         overflow: hidden;
//       }
//     }
//     p {
//       width: 100%;
//       line-height: 0.2rem;
//     }
//     .toggle {
//       margin: 0.08rem 0;
//       width: 0.12rem;
//     }
//   }
//   .reply {
//     padding: 0.1rem 0;
//     border-top: 1px solid $border;
//     font-size: 0.11rem;
//     .label {
//       margin-right: 4px;
//       color: $color1;
//     }
//     .value {
//       width: 0;
//       flex: 1;
//       color: $color5;
//     }
//   }
//   .price {
//     position: absolute;
//     top: 0.2rem;
//     right: 0;
//     font-size: 0.14rem;
//     font-weight: bold;
//     color: $color1;
//   }
// }
</style>
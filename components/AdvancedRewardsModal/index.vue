<template>
  <div v-if="visible" class="advanced-rewards-wodal align">
    <div @click.stop class="modal-content flex-column align">
      <div class="bg flex-column center">
        <div class="content flex-column center">
          <img src="./assets/bg1.png" alt="" class="money" />
          <p class="title">{{ info.title }}</p>
          <p @click="goCard" class="subtitle" v-html="info.subtitle"></p>
          <div class="card flex-column center">
            <p class="name">进阶福利</p>
            <div class="info flex-row center">
              <img src="./assets/icon.png" alt="" class="icon" />
              <p class="text">{{ info.text }}</p>
            </div>
          </div>
          <button @click="go" class="submit">{{ info.btn }}</button>
        </div>
      </div>
      <img @click="hide" src="./assets/close.png" alt="" class="close" />
    </div>
  </div>
</template>
<script>
import { UID, router } from "@/utils";
import { get } from "@/api/http";
const API = {
  CAN() {
    return get("/Api/getUserIsTest_api.php");
  },
};
export default {
  name: "AdvancedRewardsModal",
  data() {
    return {
      can: false,
      // canShow
    };
  },
  computed: {
    visible() {
      const { visible } = this.$store.state.advancedRewardsModal;
      return visible;
    },
    info() {
      const { can } = this;
      const { type } = this.$store.state.advancedRewardsModal;
      if (type === "") {
        return {
          title: "优惠津贴已到账",
          subtitle:
            "<p><i>活动津贴已放入您的账户中，请点击</i>优惠券<i>查看</i></p>",
          text: can
            ? "完成测试可免费获得一份量身定制助孕方案"
            : "您已完成测试客服稍后会联系你为您量身定制助孕方案",
          btn: can ? "马上领取" : "我知道了",
        };
      } else {
        return {
          title: "助孕测试",
          subtitle: "请务必真实填写你的信息",
          text: can
            ? "完成测试可获得定制助孕 方案，和价值500元的助 孕津贴"
            : "价值500元的助 孕津贴",
          btn: "马上领取",
        };
      }
    },
  },
  watch: {
    visible() {
      this.updateCan();
    },
  },
  methods: {
    updateCan() {
      return API.CAN().then((res) => {
        this.can = +res.isTest !== 1;
        return this.can;
      });
    },
    hide() {
      this.$store.commit("hideAdvancedRewardsModal");
    },
    go() {
      const { can } = this;
      const { type } = this.$store.state.advancedRewardsModal;
      if (type === "" && !can) {
        this.$store.commit("hideAdvancedRewardsModal");
        router.replace({
          path: "/",
        });
      } else {
        this.$store.commit("hideAdvancedRewardsModal");
        router.push({
          path: "/propaganda/answers",
        });
      }
    },
    goCard() {
      if (UID.GET()) {
        this.$store.commit("hideAdvancedRewardsModal");
        router.replace({
          path: "/card-package",
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.advanced-rewards-wodal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9900;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  .modal-content {
    position: relative;
    .bg {
      position: relative;
      width: 3.14rem;
      height: 3.45rem;
      .close {
        position: absolute;
        right: 0.25rem;
        top: 0.16rem;
        width: 0.2rem;
        z-index: 99;
      }
      .content {
        margin-left: -0.15rem;
        padding-left: 0.3rem;
        width: 3.1rem;
        height: 3.43rem;
        background: url("./assets/bg.png") no-repeat center center / 100% auto;
        .money {
          position: absolute;
          top: 1rem;
          right: -0.48rem;
          z-index: 9;
          width: 0.81rem;
        }
        .title {
          margin-top: 0.64rem;
          font-size: 0.17rem;
          /* font-family: Source Han Sans CN; */
          font-weight: bold;
          color: #ffffff;
          /* line-height: 72px; */
          text-shadow: 1px 2px 4px #467aea;
        }
        .subtitle {
          margin-top: 0.05rem;
          margin-bottom: 0.1rem;
          font-size: 0.13rem;
          /* font-family: Source Han Sans CN; */
          font-weight: 400;
          color: #fabb4e;
          text-shadow: 0px 1px 2px #467aea;
          i {
            color: #fff;
          }
        }
        .card {
          width: 2.6rem;
          height: 1.54rem;
          background: url("./assets/bg2.png") no-repeat center top / 100% auto;
          .name {
            margin-top: 0.14rem;
            margin-bottom: 0.06rem;
            font-size: 31px;
            font-weight: 400;
            color: #467aea;
            -webkit-text-stroke: 1px #a86500;
            text-stroke: 1px #a86500;
          }
          .info {
            padding: 0 0.38rem;
            padding-top: 0.12rem;
            .icon {
              margin-right: 0.13rem;
              width: 0.41rem;
            }
            .text {
              font-size: 0.12rem;
              /* font-family: Source Han Sans CN; */
              font-weight: bold;
              color: #467aea;
            }
          }
        }
        .submit {
          width: 1.49rem;
          height: 0.31rem;
          background: linear-gradient(0deg, #cbdbff, #6695fc);
          box-shadow: 1px 4px 5px 0px rgba(80, 53, 12, 0.13);
          border-radius: 0.15rem;
        }
      }

      .submit {
        margin-top: 0.2rem;
        width: 2.46rem;
        height: 0.41rem;
        font-size: 0.16rem;
        color: #fff;
        background: linear-gradient(85deg, #cbdcff, #4579ea);
        border-radius: 0.21rem;
      }
    }
    .close {
      margin-top: 0.17rem;
      width: 0.28rem;
    }
  }
}
</style>
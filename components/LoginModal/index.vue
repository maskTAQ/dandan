<template>
  <div v-if="visible" @click="hide" class="attention-modal align">
    <div @click.stop class="modal-content flex-column align">
      <div class="bg flex-column center">
        <img src="./assets/close.png" alt="" class="close" @click="hide" />
        <div class="content flex-column center">
          <p class="text">新人有好礼</p>
          <p class="text">注册领神券</p>
          <div class="card"></div>
          <div class="line-box flex-row center">
            <span class="line"></span>
            <span class="value">三次免费问诊机会</span>
            <span class="line"></span>
          </div>
          <div class="list flex-row">
            <template v-for="(item, index) in list">
              <span
                v-if="item.type === 'line'"
                :key="index"
                :class="['line', `line-${index}`]"
              ></span>
              <div v-else :key="item.label" class="item flex-column center">
                <div class="icon-box align">
                  <img :src="item.icon" class="icon" alt="" srcset="" />
                </div>
                <i class="label">{{ item.label }}</i>
              </div>
            </template>
          </div>
          <button @click="goLogin" class="confirm"></button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    @click="goLogin"
    :class="['invite-register', { show: !uid && !forceClose }]"
  >
    <img
      @click.stop="forceClose = true"
      src="./assets/close-2.png"
      class="close"
      alt=""
      srcset=""
    />
  </div>
</template>
<script>
import { get } from "@/api/http";
import { UID } from "@/utils";
import { router } from "../../utils";
const API = {
  AUTH(redirect_uri) {
    return get("/Api/getWxSQ_api.php", { redirect_uri });
  },
  DEDAIL() {
    return get("/Api/getWxFollow_api.php",{},{showError:false});
  },
};
const list = [
  {
    label: "名医诊断",
    icon: require("./assets/doctor.png"),
  },
  {
    type: "line",
  },
  {
    label: "秒级响应",
    icon: require("./assets/light.png"),
  },
  {
    type: "line",
  },
  {
    label: "1V1在线服务",
    icon: require("./assets/people.png"),
  },
];
export default {
  name: "Modal",
  data() {
    return {
      disabledPrompt: false,
      userInfo: {},
      data: null,
      visible: false,
      list,
      uid: UID.GET(),
      forceClose: false,
    };
  },
  created() {
    this.timeout = setTimeout(this.requestShow);
  },
  destroyed() {
    clearTimeout(this.timeout);
  },
  methods: {
    requestShow() {
      if (!UID.GET()) {
        this.visible = true;
      }
    },
    hide() {
      this.visible = false;
    },
    goLogin() {
      router.push({
        path: "/login",
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.attention-modal {
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
      width: 2.56rem;
      height: 3.16rem;
      background: url("./assets/bg-2.png") no-repeat top center / 100% auto,
        url("./assets/bg.png") no-repeat top center/90% 100%;
      /* background-size: 100% 100%; */
      .close {
        position: absolute;
        right: 0.25rem;
        top: 0.16rem;
        width: 0.2rem;
        z-index: 99;
      }

      .content {
        width: 2.25rem;
        position: relative;
        left: -0.03rem;
        padding: 0 0.2rem;
        padding-top: 0.2rem;
      }
      .text {
        font-size: 0.2rem;
        font-weight: bold;
        color: #4579ea;
      }
      .card {
        margin-top: 0.06rem;
        margin-bottom: 0.1rem;
        width: 1.83rem;
        height: 0.64rem;
        background: url("./assets/card.png") no-repeat top center / 100% 100%;
      }
      .line-box {
        width: 100%;
        margin-bottom: 0.2rem;
        .line {
          width: 0.26rem;
          height: 1px;
          background: #9abbfc;
        }
        .value {
          flex: 1;
          font-size: 0.14rem;
          font-weight: bold;
          text-align: center;
          color: #4579ea;
        }
      }
      .list {
        position: relative;
        width: 110%;
        .line {
          position: absolute;
          width: 0.26rem;
          height: 1px;
          background: #9abbfc;
          &.line-1 {
            top: 0.12rem;
            left: 0.54rem;
          }
          &.line-3 {
            top: 0.12rem;
            left: 1.22rem;
          }
        }
        .item {
          flex: 1;
        }
        .icon-box {
          margin-bottom: 0.09rem;
          width: 0.26rem;
          height: 0.26rem;
          background: #5889f2;
          border-radius: 50%;
        }
        .icon {
          width: 0.18rem;
        }
        .label {
          font-size: 0.09rem;
          white-space: nowrap;
          color: #4579ea;
        }
      }
      .confirm {
        margin-top: 0.18rem;
        width: 0.91rem;
        height: 0.26rem;
        background: url("./assets/submit.png") no-repeat top center / 100% 100%;
      }
    }
  }
}
.invite-register {
  position: relative;
  display: none;
  position: fixed;
  bottom: 2.2rem;
  right: 0;
  width: 0.8rem;
  height: 0.74rem;
  z-index: 999;
  background: url("./assets/register.png") no-repeat center center / cover;
  &.show {
    display: block;
  }
  .close {
    position: absolute;
    top: -0.2rem;
    right: 0;
    width: 0.2rem;
  }
}
</style>
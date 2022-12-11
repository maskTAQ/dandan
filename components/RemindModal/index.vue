<template>
  <div v-if="visible" @click="hide" class="remind-modal align">
    <div @click.stop class="modal-content flex-column align">
      <div :class="['bg flex-column center', type]">
        <div v-if="type === 'error'" class="msg-box flex-column align">
          <p class="title">确定取消消息推送</p>
          <p class="text">取消后您可能会错过重要的信息通知建议您保留推送</p>
          <div class="btn-group flex-row center">
            <button class="cancel align" @click="cancel">确定取消</button>
            <button class="confirm align" @click="hide">继续推送</button>
          </div>
        </div>
        <div v-if="type === 'success'" class="msg-box flex-column align">
          <p class="title">消息推送设置成功</p>
          <p class="text">
            我们将通过短信和微信公众号“旦旦医学”为您推送重要的信息通知
          </p>
          <div class="btn-group flex-row center">
            <button class="ok align" @click="hide">我知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get } from "@/api/http";
const API = {
  AUTH(redirect_uri) {
    return get("/Api/getWxSQ_api.php", { redirect_uri });
  },
  DEDAIL() {
    return get("/Api/getWxFollow_api.php",{},{showError:false});
  },
};

export default {
  name: "Modal",
  data() {
    return {
      type: "",
      visible: false,
    };
  },

  methods: {
    show(type) {
      this.type = type;
      this.visible = true;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    hide() {
      this.visible = false;
    },
    requestWXAuth() {
      const { origin, pathname } = location;
      API.AUTH(origin + pathname).then((res) => {
        ///Api/getWxSQ_api.php
        window.location.href = res.rUrl;
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.remind-modal {
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
      width: 2.55rem;
      height: 3.8rem;
      background-size: 100% 100%;
      &.success {
        background: url("./assets/success.png") no-repeat;
        background-size: 100% 100%;
      }
      &.error {
        background: url("./assets/error.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .msg-box {
      padding: 0 0.15rem;
      .title {
        margin-top: 2rem;
        font-size: 0.18rem;
        font-weight: bold;
        color: #4d4d4d;
      }
      .text {
        margin-top: 0.12rem;
        margin-bottom: 0.47rem;
        font-size: 0.14rem;
        color: #7b7b7b;
      }
      .btn-group {
        width: 100%;
        button {
          
          font-size: 0.14rem;
          font-weight: bold;
          height: 0.32rem;
          &.cancel {
            flex: 1;
            margin-right: 0.1rem;
            color: #fd9453;
            border: 1px solid #fd9453;
            border-radius: 0.04rem;
          }
          &.confirm {
            flex: 1;
            color: #fff;
            background: #fd9453;
            border-radius: 0.08rem;
          }
          &.ok {
            margin: 0 auto;
            width: 1rem;
            color: #fff;
            background: #fd9453;
            border-radius: 0.08rem;
          }
        }
      }
    }
  }
}
</style>
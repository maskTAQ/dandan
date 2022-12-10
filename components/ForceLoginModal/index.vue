<template>
  <div v-if="visible" class="force-login-modal align">
    <div @click.stop class="modal-content flex-column align">
      <div class="bg flex-column center">
        <div class="content flex-column center">
          <div class="key" />
          <p class="hint">小主且慢，新权限尚未开放</p>
          <span class="line"></span>
          <div class="info flex-row">
            <img src="./assets/package.png" alt="" class="package" />
            <p class="text">
              立即注册，解锁更多新权限。完成进阶任务可免费获取量身定制备孕调理方案！
            </p>
          </div>
          <button @click="goLogin" class="submit align">立即注册</button>
        </div>
      </div>
      <img @click="hide" src="./assets/close.png" alt="" class="close" />
    </div>
  </div>
</template>
<script>
import { UID } from "@/utils";
import { router } from "../../utils";

export default {
  name: "Modal",
  props: ["visible"],
  methods: {
    hide() {
      this.$store.commit("toggleForceLoginModalVisible", false);
    },
    goLogin() {
      router.login();
      this.$store.commit("toggleForceLoginModalVisible", false);
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.force-login-modal {
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
      background: url("./assets/bg.png") no-repeat top center/ 90% auto;
      .close {
        position: absolute;
        right: 0.25rem;
        top: 0.16rem;
        width: 0.2rem;
        z-index: 99;
      }
      .content {
        width: 2.84rem;
        height: 3rem;
      }
      .key {
        width: 1.8rem;
        height: 1rem;
        margin-top: 0.11rem;
        margin-left: 0.076rem;
        flex-shrink: 0;
        background: url("./assets/key.png") no-repeat top center / cover;
      }
      .hint {
        margin-top: 0.1rem;
        margin-bottom: 0.2rem;
        font-size: 0.19rem;
        color: #333333;
      }
      .line {
        /* margin: 0 1.24rem; */
        margin-bottom: 0.15rem;
        width: 2.5rem;
        border-bottom: 1px dashed #c7c7c7;
      }
      .info {
        /* padding: 0 0.24rem; */
        padding-right: 0.2rem;
        width: 100%;
        height: 0.52rem;
        img {
          display: block;
          height: 100%;
        }
        .text {
          width: 0;
          flex: 1;
          margin-left: 0.11rem;
          font-size: 0.12rem;
          color: #467aea;
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
      width: 0.28rem;
    }
  }
}
</style>
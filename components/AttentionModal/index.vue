<template>
  <div v-if="data && visible" @click="hide" class="attention-modal align">
    <div @click.stop class="modal-content flex-column align">
      <div class="bg flex-column center">
        <div class="top align">
          <i>请完成以下操作</i>
          <img @click="hide" src="./assets/close.png" alt="" class="close" />
        </div>
        <div class="step-list">
          <div class="step flex-row">
            <img src="./assets/1.png" alt="" class="sort" />
            <div class="step-content">
              <div class="step-header flex-row center">
                <p class="step-title">微信关联登录</p>
                <i
                  v-if="data"
                  :class="['step-status', { ok: data.IsBind === 1 }]"
                  >{{ +data.IsBind === 1 ? "已完成" : "未完成" }}</i
                >
              </div>
              <p class="step-subtitle">便捷进入 一键登录</p>
              <van-button
                @click="requestWXAuth"
                :loading="loading"
                v-if="data && +data.IsBind !== 1"
                class="btn"
              ></van-button>
            </div>
          </div>
          <div class="mt step flex-row">
            <img src="./assets/2.png" alt="" class="sort" />
            <div class="step-content">
              <div class="step-header flex-row center">
                <p class="step-title">关注公众号</p>
                <i
                  v-if="data"
                  :class="['step-status', { ok: data.IsFollow === 1 }]"
                  >{{ +data.IsFollow === 1 ? "已完成" : "未完成" }}</i
                >
              </div>
              <p class="step-subtitle">长按识别 或搜索“新生优孕”</p>
              <img src="./assets/code.png" alt="" class="code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get } from "@/api/http";
import { UID, Tip, LoadingControl } from "@/utils";
///Api/userBindWx_api.php
const API = {
  AUTH(redirect_uri) {
    return get("/Api/getWxSQ_api.php", { redirect_uri });
  },
  DEDAIL() {
    return get("/Api/getWxFollow_api.php", {}, { showError: false });
  },
  BIND(params) {
    return get("/Api/userBindWx_api.php", params);
  },
  REMAID(bid) {
    return get("/Api/setLiveGZ_api.php", { bid, flag: 1 });
  },
};

export default {
  name: "Modal",
  model: {
    prop: "visible",
    event: "onVisibleChange",
  },
  props: ["visible"],
  data() {
    return {
      disabledPrompt: false,
      userInfo: {},
      data: null,
      loading: false,
    };
  },
  created() {
    const { code } = this.query;
    if (code) {
      this.$emit("change", true);
      this.bind(code).then((res) => {
        this.getData();
      });
    } else {
      this.getData();
    }
  },
  watch: {
    query(v) {
      const { code } = v;
      if (code) {
        this.bind(code);
      }
    },
  },
  computed: {
    query() {
      return this.$route.query;
    },
    id() {
      return this.$route.query.id;
    },
  },
  // watch: {
  //   visible(v) {
  //     if (v) {
  //       this.getData();
  //     }
  //   },
  // },
  methods: {
    getData() {
      if (UID.GET()) {
        return API.DEDAIL().then((res) => {
          const { IsBind, IsFollow } = res;
          if (+IsBind !== 1 || +IsFollow !== 1) {
            this.data = res;
          }
        });
      }
    },
    hide() {
      this.$emit("change", false);
    },
    requestWXAuth() {
      const { origin, pathname } = location;
      LoadingControl({
        call: API.AUTH,
        params: location.href, // origin + pathname,
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        window.location.href = res.rUrl;
      });
    },
    bind(code) {
      return LoadingControl({
        call: () => {
          return API.BIND({
            code,
          }).then(() => {
            return API.REMAID(this.id);
          });
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        Tip.success("绑定成功");
        const query = { ...app.$route.query };
        delete query.code;
        this.$emit("change", false);
        location.href = app.$router.resolve({
          path: app.$route.path,
          query,
        }).href;
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
      width: 2.55rem;
      /* height: 3.87rem; */
      /* background: url("./assets/bg.png") no-repeat;
      background-size: 100% 100%; */
      background: #fff;
      .top {
        position: relative;
        width: 100%;
        height: 0.4rem;
        font-size: 0.14rem;
        color: #fff;
        background: #5a91f2;
      }
      .close {
        position: absolute;
        right: 0.1rem;
        top: 0.1rem;
        width: 0.2rem;
      }
      .icon {
        position: absolute;
        right: 0.3rem;
        top: -0.64rem;
        width: 1.6rem;
      }
    }
    .step-list {
      margin-top: 0.4rem;
      padding: 0 0.2rem;
      padding-bottom: 0.2rem;
      width: 100%;
      .step.mt {
        margin-top: 0.2rem;
      }
      .sort {
        margin-right: 0.1rem;
        width: 0.3rem;
        height: 0.3rem;
      }
      .step-content {
        flex: 1;
        overflow: hidden;
        .step-header {
          margin-bottom: 0.05rem;
        }
        .step-title {
          font-size: 0.16rem;
          font-weight: bold;
          color: #000;
        }
        .step-status {
          margin-left: 0.1rem;
          font-size: 0.14rem;
          font-weight: bold;
          color: #ff0000;
          &.ok {
            color: #ff944a;
          }
        }
        .step-subtitle,
        .hint {
          font-size: 0.12rem;
          color: #000;
        }
        button {
          margin-top: 0.15rem;
          width: 0.8rem;
          height: 0.32rem;
          background: url("./assets/btn.png") no-repeat;
          background-size: 100% 100%;
        }
        .code {
          display: block;
          margin: 0.1rem 0;
          width: 0.9rem;
        }
      }
    }
  }
}
</style>
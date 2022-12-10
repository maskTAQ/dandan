<template>
  <div class="tool-bar flex-row center">
    <!-- <img
      v-if="scan && !search"
      @click="tryScan"
      :src="icons.scan"
      alt=""
      class="scan"
    /> -->
    <!-- <span class="city">深圳</span> -->
    <div @click="go" :class="['search flex-row center', theme]">
      <img :src="icons.search" alt="" class="search-icon" />
      <input
        v-if="search"
        :value="value"
        @input="change"
        :placeholder="placeholder"
        type="text"
        class="input"
      />
      <i v-else class="placeholder">{{ placeholder }}</i>
      <button v-if="value" class="confirm" @click="handleSearch">确定</button>
    </div>
    <img
      @click="handleClickRightIcon"
      v-if="kf"
      :src="icons[rightIconName]"
      alt=""
      class="feedback"
    />
    <!-- <img @click="goMsg" :src="icons.msgDot" alt="" class="msg" /> -->
  </div>
</template>
<script>
import { icons } from "@/assets";
import { wxApi, Tip, router, UID } from "@/utils";
import { get } from "@/api/http";

const API = {
  BIND(params) {
    return get("/Api/QRBind_api.php", params);
  },
};
export default {
  name: "ToolBar",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    theme: {
      type: String,
      default: "normal",
    },
    rightIconName: {
      type: String,
      default: "kf",
    },
    scan: {
      type: Boolean,
      default: true,
    },
    kf: {
      type: Boolean,
      default: true,
    },
    search: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
  },
  data() {
    return {
      icons,
    };
  },
  methods: {
    change(e) {
      this.$emit("change", e.target.value);
    },
    tryScan() {
      const uid = UID.GET();
      if (!uid) {
        return Tip.error("请先登录");
      }
      wxApi
        .scanQRCode()
        .then((res) => {
          const { resultStr } = res;
          const match = /^TAG{([A-z0-9]+)}TAG$/gim.exec(resultStr);
          if (match && match[1]) {
            API.BIND({
              tag: match[1],
            }).then((res) => {
              Tip.success("绑定成功");
            });
          } else {
            Tip.error("非法的二维码");
          }
          console.log(res, "res");
        })
        .catch((e) => {
          console.log(e);
          e && Tip.error(e);
        });
    },
    go() {
      if (!this.search) {
        router.push({
          path: "/search",
        });
      }
    },
    goMsg() {
      router.push({
        path: "/messages",
      });
    },
    handleSearch() {
      this.$emit("search", this.value);
      this.$emit("change", "");
    },
    handleClickRightIcon() {
      this.$emit("clickRightIcon", "");
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.tool-bar {
  /* padding: 0.06rem 0; */
  .city {
    margin-right: 0.1rem;
    font-size: 0.16rem;
    color: #fff;
  }
  .scan {
    margin-right: $padding;
    width: 0.17rem;
  }
  .search {
    width: 0;
    flex: 1;
    height: 0.34rem;
    padding: 0;
    padding-left: $padding;
    border-radius: 0.18rem;
    background: #fff;
    input::placeholder {
      font-size: 0.15rem;
    }
    &.dark {
      background: #F7F8FA;
    }
    .search-icon {
      width: 0.15rem;
    }
    input,
    .placeholder {
      flex: 1;
      font-size: 0.14rem;
      color: #B6B6B6;
      text-indent: 0.08rem;
    }
    .confirm {
      width: 0.55rem;
      height: 0.32rem;
      text-align: center;
      font-size: 0.12rem;
      color: #fff;
      background: $color1;
      border-radius: 0.16rem;
    }
  }
  .feedback,
  .msg {
    width: 0.2rem;
    margin-left: $padding;
  }
  .msg {
    margin-left: $padding;
  }
}
</style>
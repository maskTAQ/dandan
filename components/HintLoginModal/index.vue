<template>
  <div v-if="visible && !isLogin" @click="hide" class="remind-modal align">
    <div @click.stop class="modal-content no-login flex-column align">
      <img @click="hide" src="./assets/close.png" alt="" class="close" />
      <div class="bg flex-column align">
        <p class="title">尝新福利</p>
        <p class="subtitle">628限时优惠等你来拿</p>
        <ul class="ticket-list flex-row">
          <li
            v-for="(ticket, index) in TICKET_LIST"
            :key="index"
            class="ticket"
            @click="goLogin"
          >
            <img :src="ticket.img" alt="" srcset="" />
          </li>
        </ul>
      </div>
      <img @click="login" class="btn" src="./assets/btn.png" alt="" srcset="" />
      <button class="go" @click="goDetail">查看详情>></button>
    </div>
  </div>
  <div v-else-if="visible && isLogin" @click="hide" class="remind-modal align">
    <div @click.stop class="modal-content has-login flex-column align">
      <div class="content flex-column center">
        <img @click="hide" src="./assets/close.png" alt="" class="close" />
        <div class="header align">领取成功</div>
        <p class="subtitle">圆梦628 领券更幸孕</p>
        <ul class="ticket-list">
          <li
            v-for="(ticket, index) in TICKET_LIST_1"
            :key="index"
            class="ticket"
            @click="go"
          >
            <img :src="ticket.img" alt="" srcset="" />
          </li>
        </ul>
        <p class="hint">已存入<我的>卡包</p>
      </div>
    </div>
  </div>
</template>
<script>
import { get } from "@/api/http";
import { UID, router } from "@/utils";
const API = {
  DEDAIL() {
    return get("/Api/setAdvCardToUser_api.php", {}, { showError: false });
  },
};

const TICKET_LIST = [
  {
    img: require("./assets/499.png"),
  },
  {
    img: require("./assets/50.png"),
  },
  {
    img: require("./assets/100.png"),
  },
  {
    img: require("./assets/80.png"),
  },
];
const TICKET_LIST_1 = [
  {
    img: require("./assets/50-1.png"),
  },
  {
    img: require("./assets/499-1.png"),
  },
  {
    img: require("./assets/100-1.png"),
  },
  {
    img: require("./assets/50-2.png"),
  },
];
export default {
  name: "HintLoginModal",
  data() {
    return {
      isLogin: false,
      visible: false,
      TICKET_LIST,
      TICKET_LIST_1,
    };
  },

  methods: {
    login() {
      this.visible = false;
      router.push({
        path: "/login",
      });
    },
    hide() {
      this.visible = false;
    },
    go() {
      this.visible = false;
      this.$router.push({
        path: "/card-package",
      });
    },
    goDetail() {
      this.visible = false;
      this.$router.push({
        path: "/propaganda/628",
      });
    },
    goLogin() {
      this.visible = false;
      this.$router.push({
        path: "/login",
      });
    },
    requestShow628Modal() {
      this.isLogin = !!UID.GET();
      if (
        !this.$route.path.includes("order-confirm") &&
        day("2021/07/31").diff(day()) > 0
      ) {
        if (this.isLogin) {
          API.DEDAIL().then((res) => {
            // console.log(res, "res");
            this.visible = true;
          });
        } else {
          this.visible = true;
        }
      }
    },
  },
  created() {
    this.$root.$on("requestShow628Modal", this.requestShow628Modal);
  },
  mounted() {
    this.requestShow628Modal();
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
  background-color: #000000b3;
  .modal-content {
    position: relative;
  }
  .go {
    font-size: 0.14rem;
    color: #eeeeee;
  }
  .no-login {
    .close {
      width: 0.31rem;
      position: absolute;
      top: -0.5rem;
      right: 0;
    }
    .bg {
      width: 2.48rem;
      height: 2.83rem;
      background: url("./assets/bg.png") no-repeat center center / cover;
      background-size: 100% 100%;
    }
    .title {
      font-size: 0.28rem;
      color: #4080fb;
    }
    .subtitle {
      font-size: 0.14rem;
      color: #75a6fc;
    }
    .ticket-list {
      width: 90%;
      padding: 0.04rem;
      flex-wrap: wrap;
      background: #fff;
      .ticket {
        width: calc(50% - 0.05rem);
        margin-bottom: 0.1rem;
        &:nth-child(odd) {
          margin-right: 0.1rem;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .btn {
      width: 2.76rem;
      position: relative;
      top: -0.16rem;
    }
  }
  .has-login {
    position: relative;
    top: 0.2rem;
    padding: 0.2rem;
    padding-bottom: 0.4rem;
    background: url("./assets/b.png") no-repeat 0 0.3rem /100% auto,
      url("./assets/rect.png") no-repeat 0.2rem 0.2rem / 2.83rem 5rem;
    /* background-size: 100% 100%; */

    .content {
      width: 2.83rem;
      height: 5rem;
      /* background: #d5e4fe; */
      border-radius: 4px;
      div.header {
        position: relative;
        top: -0.1rem;
        width: 1.8rem;
        height: 0.65rem;
        background: url("./assets/title.png") no-repeat center;
        background-size: 100% 100%;
        font-size: 0.23rem;
        color: #fff;
      }
      .subtitle {
        margin-bottom: 0.1rem;
        font-size: 0.14rem;
        color: #75a6fc;
      }
      .ticket-list {
        width: 2.4rem;
        .ticket {
          margin-bottom: 0.1rem;
        }
        img {
          display: block;
          width: 100%;
        }
      }
      .hint {
        margin-top: 0.2rem;
        font-style: 0.12rem;
        color: #75a6fc;
      }
    }
    .close {
      width: 0.31rem;
      position: absolute;
      top: -0.25rem;
      right: 0.05rem;
    }
  }
}
</style>
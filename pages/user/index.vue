<template>
  <div class="user-page page-tab">
    <StatusHandle :get="getUserInfo" class="user-info">
      <div class="user-info">
        <Header />
        <div
          @click="go({ path: '/setting' })"
          class="top flex-row main-between center"
        >
          <div class="flex-row center">
            <CoverImage
              :url="userInfo.UserPhoto"
              size="0.5rem"
              circle
              class="portrait"
            />
            <div class="info">
              <p class="name">{{ userInfo.NickName || "--" }}</p>
              <p class="slogan">
                {{ userInfo.UserRemarks || "新生优孕 一站式备孕服务平台" }}
              </p>
            </div>
          </div>
          <!-- <img :src="icons.right" alt="" class="more" /> -->
        </div>
        <div class="menus flex-row center">
          <template v-for="(menu, index) in menus">
            <div
              :key="menu.label"
              @click="go(menu)"
              class="menu flex-column align"
            >
              <p class="value">{{ menu.value }}</p>
              <p class="label">{{ menu.label }}</p>
            </div>
            <span
              v-if="index !== menus.length - 1"
              :key="index"
              class="split"
            />
          </template>
        </div>
      </div>
    </StatusHandle>
    <div class="content">
      <div class="order-card card">
        <div class="header flex-row main-between center">
          <p class="title">我的订单</p>
          <div
            class="more flex-row center"
            @click="go({ path: '/order-list' })"
          >
            <i class="label">全部订单</i>
            <!-- <img :src="icons.right" alt="" class="icon" /> -->
          </div>
        </div>
        <div class="order-list card flex-row center">
          <div
            v-for="order in orders"
            :key="order.label"
            class="order flex-column align"
            @click="go(order)"
          >
            <div class="icon-box align">
              <img :src="order.icon" alt="" class="icon" />
            </div>
            <p class="label">{{ order.label }}</p>
          </div>
        </div>
      </div>
      <StatusHandle :get="getUserInfo" class="kf-card">
        <div v-if="userInfo.AdminId" class="kf-card card flex-row main-between center">
          <div class="badge align">专属客服</div>
          <div class="flex-row center">
            <CoverImage
              :url="userInfo.AdminPhoto"
              size="0.5rem"
              circle
              class="cover"
            />
            <div class="info">
              <div class="flex-row center">
                <p class="name">{{userInfo.AdminName}}</p>
                <!-- <p class="title">国家生殖咨询管理师</p> -->
              </div>
              <p class="position">-</p>
            </div>
          </div>
          <!-- <button class="contact align">联系客服</button> -->
        </div>
      </StatusHandle>
      <div class="setting-card card">
        <div class="header flex-row main-between center">
          <p class="title">更多设置</p>
        </div>
        <ul class="list">
          <li
            class="item flex-row main-between center"
            v-for="item in others"
            :key="item.label"
            @click="go(item)"
          >
            <div class="flex-row center">
              <img :src="item.icon" alt="" class="icon" />
              <span class="label">{{ item.label }}</span>
            </div>
            <img :src="icons.right" alt="" class="right" />
          </li>
        </ul>
      </div>
    </div>
    <TabBar />
  </div>
</template>
<script>
import { mapState } from "vuex";
import day from "dayjs";
import Task from "@/components/Task.vue";
import Header from "@/components/Header.vue";
import { user, icons } from "@/assets";
import { get } from "@/api/http";
import { router, goKf } from "@/utils";

const API = {
  DEDAIL() {
    return get("/Api/getUserInfo_api.php");
  },
  STATUS() {
    return get("/Api/getUserIsClock_api.php", {}, { showError: false });
  },
  TASKS() {
    return get("/Api/getUserClockList_api.php", {
      cday: day(day().format("YYYY/MM/DD")).unix(),
    });
  },
};
export default {
  name: "User",
  head() {
    return {
      title: "个人中心",
    };
  },
  data() {
    return {
      user,
      icons,
      userInfo: {},
      tabs: [
        // {
        //   label: "购物车",
        //   icon: user.shopcar,
        //   path: "/shopping-cart",
        // },
        {
          label: "收货地址",
          icon: user.addr,
          path: "/address",
        },
        {
          label: "发票信息",
          icon: user.invoice,
          path: "/invoice",
        },
        {
          label: "我的客服",
          icon: user.kf,
          onClick() {
            goKf("platform");
          },
        },
      ],
      orders: [
        {
          label: "待付款",
          icon: user.pay,
          path: "/order-list",
          query: {
            status: "1",
          },
        },
        {
          label: "待服务",
          icon: user.send,
          path: "/order-list",
          query: {
            status: "2",
          },
        },
        {
          label: "服务中",
          icon: user.receive,
          path: "/order-list",
          query: {
            status: "3",
          },
        },
        {
          label: "已完成",
          icon: user.shouhou,
          path: "/order-list",
          query: {
            status: "4",
          },
        },
      ],

      task: null,
    };
  },
  computed: {
    ...mapState(["myDoctor"]),
    menus() {
      const { OrderNum, CardNum, MessageNum } = this.userInfo;
      return [
        {
          label: "我的订单",
          value: OrderNum,
          path: "/order-list",
        },
        {
          label: "我的优惠券",
          value: CardNum,
          path: "/card-package",
        },
        {
          label: "我的积分",
          value: CardNum,
          path: "/integral",
        },
      ];
    },
    others() {
      return [
        {
          label: "我的地址",
          icon: user.addr,
          path: "/address",
        },
        {
          label: "发票信息",
          icon: user.invoice,
          path: "/invoice",
        },
        {
          label: "好孕笔记",
          icon: user.notes,
          path: "/notes",
        },
        {
          label: "微信订阅",
          icon: user.wechat,
          onClick: () => {
            // IsDY 1已订阅
          },
        },
        {
          label: "关于我们",
          icon: user.about,
          path: "/about",
        },
        {
          label: "用户反馈",
          icon: user.feedback,
          path: "/feedback",
        },
        {
          label: "安全管理",
          icon: user.safe,
          path: "/password",
        },
        !!+this.userInfo.isZY && {
          label: "新生大使",
          icon: user.agent,
          path: "/agent",
        },
      ].filter((n) => !!n);
    },
  },
  methods: {
    getUserInfo() {
      return API.DEDAIL().then((res) => {
        this.userInfo = res;
      });
    },
    go({ path, query, onClick }) {
      if (onClick) {
        onClick();
      } else {
        router.push({
          path,
          query,
        });
      }
    },
  },
  components: {
    Task,
    Header,
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
.user-page {
  background: #f3f6f9;
  .user-info {
    display: flex;
    height: 2.57rem;
    flex-direction: column;
    padding: 0.17rem 0.15rem 0 0.15rem;
    background: url("./imgs/bg.png") no-repeat center center / 100% 100%;

    .top {
      margin: 0.21rem 0;
      width: 100%;
      .portrait {
        margin-right: 0.15rem;
        width: 0.58rem;
        height: 0.58rem;
        border: 3px solid #fff;
      }
      .name {
        font-size: 0.18rem;
        font-weight: bolds;
        color: #fff;
      }
      .slogan {
        margin-top: 0.05rem;
        font-size: 0.13rem;
        color: rgba($color: #fff, $alpha: 0.62);
      }
      .more {
        width: 0.16rem;
      }
    }
    .menus {
      /* margin-top: 0.12rem; */
      width: 100%;
      height: 0.6rem;
      .menu {
        flex: 1;
        .value {
          margin-bottom: 0.05rem;
          font-size: 0.19rem;
          color: #fff;
        }
        .label {
          font-size: 0.11rem;
          color: rgba($color: #fff, $alpha: 0.71);
        }
      }
      .split {
        width: 1px;
        height: 0.26rem;
        background: #ffffff;
        opacity: 0.2;
        filter: blur(2px);
      }
    }
  }
  .content {
    padding: 0.1rem 0.16rem;
    padding-top: 0;
  }

  .card {
    box-shadow: 0px 2px 6px 0px rgba(139, 156, 164, 0.17);
    border-radius: 0.1rem;
    background: #fff;
    .header {
      margin: 0 0.2rem;
      height: 0.5rem;
      border-bottom: 1px solid $border;
      .title {
        font-size: 0.16rem;
        font-weight: bold;
        color: #2a2a2a;
      }
      .label {
        font-size: 0.13rem;
        color: #999999;
      }
      .icon {
        margin-left: 2px;
        width: 0.1rem;
      }
    }
  }
  .tabs {
    margin: 0.16rem 0;
    height: 0.88rem;
    padding: 0.2rem 0;

    .tab {
      flex: 1;
      .icon {
        margin-bottom: 0.09rem;
        width: 0.28rem;
      }
      .label {
        font-size: 0.11rem;
        color: #333;
      }
    }
  }
  .order-card {
    margin-top: -0.5rem;
    .order-list {
      padding: 0.2rem 0;
      .order {
        flex: 1;
        .icon-box {
          /* width: 0.3rem;
          height: 0.3rem; */
        }
        .icon {
          width: 0.21rem;
        }
        .label {
          margin-top: 0.1rem;
          font-size: 0.13rem;
          color: #909399;
        }
      }
    }
  }
  .kf-card {
    margin-top: 0.2rem;
    height: 1rem;
    position: relative;
    padding: 0 0.15rem;
    .badge {
      position: absolute;
      top: -0.05rem;
      left: 0;
      width: 0.68rem;
      height: 0.21rem;

      font-size: 0.11rem;
      color: #ffffff;
      background: url("../../assets/user/badge.png") no-repeat center center /
        100% 100%;
    }
    .cover {
      margin-right: 0.09rem;
      width: 0.58rem;
      height: 0.58rem;
      border-radius: 0.1rem;
      background-color: #e6edf3;
    }
    .name {
      margin-right: 6px;
      font-size: 0.16rem;
      font-weight: bold;
      color: #000000;
    }
    .title {
      font-size: 0.12rem;
      color: #2d4ef5;
    }
    .position {
      margin-top: 0.06rem;
      font-size: 0.13rem;
      color: #999999;
    }
    .contact {
      /* width: 0.58rem; */
      height: 0.28rem;
      padding: 0 0.1rem;
      background: url("../../assets/user/contact.png") no-repeat center center /
        100% 100%;
      font-size: 0.11rem;
      color: #fff;
    }
  }
  .setting-card {
    margin-top: 0.15rem;
    margin-bottom: 0.25rem;
    .list {
      padding: 0.2rem 0.32rem;
      .item {
        height: 0.5rem;
        .icon {
          margin-right: 0.12rem;
          height: 0.16rem;
        }
        .label {
          font-size: 0.15rem;
          color: #2a2a2a;
        }
        .right {
          width: 0.06rem;
        }
      }
    }
  }
}
</style>
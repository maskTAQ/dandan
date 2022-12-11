<template>
  <Page title="圆梦628 好孕嘉年华" @scroll="handleScroll" ref="page" fixed>
    <div class="_628 flex-column align">
      <div
        v-if="y > root * 0.5"
        :class="['tabs flex-row center', { wechat: OS.isWechat }]"
      >
        <div
          v-for="tab in TABS"
          :key="tab.label"
          :class="['tab align', { active: tab.active(root, y) }]"
          @click="scroll(tab)"
        >
          <p class="text">{{ tab.label }}</p>
        </div>
      </div>
      <img class="full" src="./imgs/bg1.jpg" alt="" srcset="" />
      <button @click="visible = true" class="rule"></button>
      <Box title="三大权益 GO惊喜">
        <div class="tab-list flex-row align">
          <div class="tab flex-column align">
            <img src="./imgs/矢量智能对象@3x.png" alt="" srcset="" />
            <p class="label">助孕保障</p>
            <p class="price">低至1元</p>
          </div>
          <div class="tab m flex-column align">
            <img src="./imgs/矢量智能对象3@3x.png" alt="" srcset="" />
            <p class="label">健康商场</p>
            <p class="price">限时优惠</p>
          </div>
          <div class="tab flex-column align">
            <img src="./imgs/矢量智能对象2@3x.png" alt="" srcset="" />
            <p class="label">医生问诊</p>
            <p class="price">专家咨询</p>
          </div>
        </div>
      </Box>
      <Box title="三笙资讯 GO头条" sort="1">
        <div class="top">
          <img @click="link" src="./imgs/w.png" alt="" />
          <p class="top-label">
            《旦旦医学正式上线，为医患打造一站式管理服务平台》
          </p>
        </div>
      </Box>
      <Box title="高额赔付 GO贴心" sort="2">
        <ul class="goods-list flex-row center">
          <div
            v-for="goods in GOOGS_LIST"
            @click="getTicket(goods)"
            :key="goods.title"
            class="goods"
          >
            <img class="get" src="./imgs/get.png" alt="" srcset="" />
            <img :src="goods.img" alt="" class="goods-img" />
            <div class="info-box">
              <p class="title">{{ goods.title }}</p>
              <p class="subtitle">{{ goods.subtitle }}</p>
              <div class="price-box flex-row center">
                <i class="old">{{ goods.old }}元</i>
                <div class="flex-row center now">
                  <i class="label">券后</i>
                  <i class="value">{{ goods.now }}元</i>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </Box>
      <Box title="在线问诊 GO便捷" sort="3">
        <div class="online">
          <img src="./imgs/组 49@3x.png" alt="" />
          <ul class="online-list flex-row center">
            <li
              v-for="item in ONLINE"
              :key="item.title"
              class="online-item flex-column align"
              :style="item.style"
            >
              <div class="circle align" v-html="item.title"></div>
              <p class="label">{{ item.subtitle }}</p>
            </li>
          </ul>
        </div>
      </Box>
      <Box class="coupon-box" title="三笙推荐 GO优惠" sort="4">
        <ul class="coupon-list flex-row center">
          <img
            v-for="(coupon, index) in COUPON_LIST"
            :key="index"
            class="coupon"
            :src="coupon.img"
            @click="go"
            alt=""
          />
        </ul>
        <List
          :request="request"
          columnNum="2"
          :renderItem="renderItem"
          :customControl="true"
          :pageSize="100"
          class="list"
          ref="list"
        />
      </Box>
    </div>
    <div v-if="visible" @click="close" class="_628-modal align">
      <div class="modal-content">
        <img
          @click.stop
          class="layer"
          src="./imgs/layer.png"
          alt=""
          srcset=""
        />
        <img @click="close" src="./imgs/close.png" alt="" class="close" />
      </div>
    </div>
  </Page>
</template>
<script>
import { get } from "@/api/http";
import Box from "./box.vue";
import GoodsCard from "@/components/GoodsCard";
import { getRoot, router, OS, checkLogin, Tip } from "@/utils";

const API = {
  LIST(params) {
    return get("/Api/getAdvGoodsList_api.php", params);
  },
};
const GOOGS_LIST = [
  {
    img: require("./imgs/组 44@3x.png"),
    title: "取卵保障",
    subtitle: "无可用卵子报销手术费用",
    old: "500",
    now: 1,
    id: 147,
  },
  {
    img: require("./imgs/组 45@3x.png"),
    title: "冻精保障",
    subtitle: "精子复苏独家保障计划",
    old: "500",
    now: 1,
    id: 148,
  },
  {
    img: require("./imgs/组 43@3x.png"),
    title: "胚胎解冻保障",
    subtitle: "无胚胎复苏领全额津贴",
    old: "500",
    now: 1,
    id: 150,
  },
  {
    img: require("./imgs/组 47@3x.png"),
    title: "重度卵巢保障",
    subtitle: "试管常见并发症风险保障",
    old: "500",
    now: 1,
    id: 151,
  },
];
const ONLINE = [
  {
    title: "12小时</br>候诊",
    subtitle: "随时咨询",
  },
  {
    title: "10分钟就</br>医响应 ",
    subtitle: "免去排队烦恼",
    style: {
      flex: 1,
    },
  },
  {
    title: "2000+专</br>科专家",
    subtitle: "专业诊疗意见",
  },
];
const COUPON_LIST = [
  {
    img: require("./imgs/组 50@3x.png"),
    title: "取卵保障",
    subtitle: "无可用卵子报销手术费用",
    old: "500",
    now: 1,
  },
  {
    img: require("./imgs/组 52@3x.png"),
    title: "冻精保障",
    subtitle: "精子复苏独家保障计划",
    old: "500",
    now: 1,
  },
  {
    img: require("./imgs/组 53@3x.png"),
    title: "胚胎解冻保障",
    subtitle: "无胚胎复苏领全额津贴",
    old: "500",
    now: 1,
  },
];
const TABS = [
  {
    label: "权益",
    active(root, y) {
      return y > root / 2 && y / root < 6.2;
    },
    y: 0,
  },
  {
    label: "咨询",
    active(root, y) {
      return y / root >= 6.2 && y / root < 9.2;
    },
    y: 6.2,
  },
  {
    label: "保障",
    active(root, y) {
      return y / root >= 9.2 && y / root < 14.2;
    },
    y: 9.2,
  },
  {
    label: "问诊",
    active(root, y) {
      return y / root >= 14.2 && y / root < 17.7;
    },
    y: 14.2,
  },
  {
    label: "推荐",
    active(root, y) {
      return y / root >= 17.7;
    },
    y: 17.7,
  },
];
export default {
  name: "628",
  head() {
    return {
      title: "圆梦628 好孕嘉年华",
    };
  },
  data() {
    return {
      GOOGS_LIST,
      ONLINE,
      COUPON_LIST,
      TABS,
      y: 0,
      root: 0,
      visible: false,
      OS,
    };
  },
  mounted() {
    this.root = getRoot();
  },
  methods: {
    request(params) {
      return API.LIST(params);
    },
    renderItem(item, i, instance) {
      return (
        <GoodsCard
          onBuy={() => {
            router.push({
              path: "/goods-detail",
              query: {
                id: item.gid,
              },
            });
          }}
          onClick={() => {
            router.push({
              path: "/goods-detail",
              query: {
                id: item.gid,
              },
            });
          }}
          class="goods"
          data={item}
        />
      );
    },
    handleScroll(e, y) {
      this.y = y;
    },
    close() {
      this.visible = false;
    },
    go() {
      router.push({
        path: "/card-package",
      });
    },
    link() {
      router.push({
        path: "/class-detail",
        query: {
          type: "百科",
          id: 304,
        },
      });
    },
    getTicket(goods) {
      // if (checkLogin(false)) {
      //   Tip.success("您有拥有此优惠券");
      // }
      router.push({
        path: "/goods-detail",
        query: {
          id: goods.id,
        },
      });
    },
    scroll(tab) {
      const y = tab.y * this.root;
      this.y = y;
      this.$refs.page.getContainer().scrollTo(0, y);
    },
  },
  components: {
    Box,
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";
._628 {
  position: relative;
  background: #6dc7c6;
  .tabs {
    position: fixed;
    top: 0.5rem;
    left: 0;
    right: 0;
    height: 0.33rem;
    background: #fff;
    z-index: 99;
    .tab {
      flex: 1;
      font-size: 0.18rem;
      color: #000000;
      .text {
        border-bottom: 2px solid transparent;
      }
      &.active {
        color: #6dc7c6;
        .text {
          border-bottom: 2px solid #6dc7c6;
        }
      }
    }
    &.wechat {
      top: 0;
    }
  }
  .rule {
    position: absolute;
    top: 2.94rem;
    right: 0;
    width: 0.84rem;
    height: 0.32rem;
  }
  .full {
    display: block;
    width: 100%;
  }
  .tab-list {
    padding: 0.2rem 0;
    .m {
      margin: 0 0.4rem;
    }
    img {
      width: 0.69rem;
    }
    .label {
      font-size: 0.16rem;
      color: #333333;
    }
    .price {
      font-size: 0.12rem;
      color: #999999;
    }
  }
  .top {
    img {
      display: block;
      width: 100%;
      height: 1.44rem;
    }
    .top-label {
      margin: 0.1rem 0;
      font-size: 0.14rem;
      color: #000000;
    }
  }
  .goods-list {
    flex-wrap: wrap;
    .goods {
      position: relative;
      width: 50%;
      .get {
        position: absolute;
        top: 0.05rem;
        right: 0.06rem;
        width: 0.48rem;
        z-index: 9;
      }
      .goods-img {
        display: block;
        width: 100%;
      }
      .info-box {
        padding: 0 0.1rem;
      }
      .title {
        font-size: 0.13rem;
        color: #333333;
      }
      .subtitle {
        font-size: 0.12rem;
        color: #999999;
      }
      .price-box {
        margin: 0.1rem 0;
        /* padding-right: 0.1rem; */
        font-size: 0.12rem;
        color: #999999;
        .now {
          font-size: 0.1rem;
          font-weight: bold;
          color: #f88f1a;
          .value {
            font-size: 0.18rem;
          }
        }
      }
    }
  }
  .online {
    img {
      display: block;
      width: 100%;
      /* height: 1.44rem; */
    }
    .online-list {
      padding: 0.1rem 0;
      .circle {
        width: 0.7rem;
        height: 0.7rem;
        font-size: 0.14rem;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        border-radius: 50%;
        background: #69b0fc;
      }
      .label {
        margin-top: 0.06rem;
        font-size: 0.14rem;
        color: #999999;
      }
    }
  }
  .coupon-box {
    .coupon-list {
      margin-bottom: 0.2rem;
      img {
        width: 33.3333%;
      }
    }
    .column-0 {
      margin-right: 0.2rem;
    }
  }
}
._628-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9900;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  .modal-content {
    position: relative;
    .layer {
      display: block;
      width: 3.3rem;
    }
    .close {
      width: 0.31rem;
      position: absolute;
      top: -0.2rem;
      right: 0.22rem;
    }
  }
}
</style>
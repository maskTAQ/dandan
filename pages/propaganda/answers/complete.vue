<template>
  <div class="answer-complete h-100">
    <img @click="back" src="./imgs/back.png" alt="" class="back" />
    <div class="banner">
      <img src="./imgs/tride.png" alt="" class="stripe" />
      <div class="card">
        <p class="align title">恭喜完成测试</p>
        <p class="content">
          您的信息已提交，定制助孕方案和津贴将于1-2个工作日由专人向您发放，请耐心等待。
          如有任何疑问请联系三笙客服。
        </p>
      </div>
    </div>
    <div class="chunk gap">
      <p class="title">孕产百科</p>
      <div class="tab-list flex-row">
        <div
          v-for="tab in TAB_LIST"
          :key="tab.label"
          class="tab flex-column align"
          @click="goHome(tab)"
        >
          <img :src="tab.icon" class="icon" alt="" srcset="" />
          <p class="label">{{ tab.label }}</p>
        </div>
      </div>
    </div>
    <div class="chunk gap">
      <p class="title">优选服务</p>

      <StatusHandle :get="get">
        <div class="service-list">
          <div
            v-for="item in serviceList"
            :key="item.gid"
            class="item flex-row"
            @click="goGoods(item.gid)"
          >
            <CoverImage :url="item.firstImg" class="cover" />
            <div class="info flex-column main-between">
              <div>
                <p class="name">{{ item.gName }}-{{ item.gTital }}</p>
                <TagList v-if="item.Tag" :data="item.Tag" />
              </div>
              <div class="bottom flex-row main-between center">
                <i class="price">￥{{ item.price }}</i>
                <i class="num">销量{{ item.SalesNum }}次</i>
              </div>
            </div>
          </div>
        </div>
      </StatusHandle>

      <button @click="go" class="more">查看更多</button>
    </div>
    <div class="chunk">
      <p class="title">关注我们</p>
      <div class="code-box flex-column align">
        <img src="./imgs/code.png" alt="" class="code" />
        <p class="text">新生优孕</p>
      </div>
    </div>
  </div>
</template>
<script>
import { router } from "@/utils";
import { get } from "@/api/http";

const API = {
  LIST() {
    return get("/Api/getBxGoodsList_api.php", { pageIndex: 1, pageNum: 2 });
  },
};
const TAB_LIST = [
  {
    label: "备孕课堂",
    icon: require("./imgs/1.png"),
    value: "84",
  },
  {
    label: "辅助生殖",
    icon: require("./imgs/2.png"),
    value: "93",
  },
  {
    label: "孕产课堂",
    icon: require("./imgs/3.png"),
    value: "101",
  },
  {
    label: "新生儿护理",
    icon: require("./imgs/4.png"),
    value: "111",
  },
  {
    label: "其他科普",
    icon: require("./imgs/5.png"),
    value: "117",
  },
];
export default {
  name: "answer-complete",
  data() {
    return {
      TAB_LIST,
      serviceList: [],
    };
  },
  methods: {
    back() {
      router.back();
    },
    get() {
      return API.LIST().then((res) => {
        this.serviceList = res;
      });
    },
    goHome(tab) {
      router.replace({
        path: "/",
        query: {
          tab: tab.value,
        },
      });
    },
    go() {
      router.push({
        path: "/mall",
      });
    },
    goGoods(id) {
      router.push({
        path: "/goods-detail",
        query: { id },
      });
    },
  },
};
</script>
<style lang="scss">
.answer-complete {
  position: relative;
  height: 100%;
  background: #fff;
  overflow: auto;
  .back {
    position: absolute;
    top: 0.13rem;
    left: 0.13rem;
    width: 0.13rem;
    z-index: 99;
  }
  .banner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 3.32rem;
    background: url("./imgs/banner.png") no-repeat center top / 100% auto;
    .stripe {
      position: absolute;
      top: 1.14rem;
      /* left: 0.25rem/2; */
      width: 3.5rem;
      z-index: 9;
    }
    .card {
      margin-bottom: 0.2rem;
      width: 3.5rem;
      height: 1.58rem;
      box-shadow: 0px 1px 5px 0px rgba(61, 101, 250, 0.61);
      border-radius: 0.1rem;
      background: #fff;
      overflow: hidden;
      .title {
        height: 0.44rem;
        font-size: 0.16rem;
        color: #fff;
        background: #ff7fb6;
      }
      .content {
        padding: 0.13rem;
        font-size: 0.14rem;
        font-weight: 400;
        color: #3f3f3f;
        line-height: 0.31rem;
      }
    }
  }
  .chunk {
    padding: 0.21rem 0.13rem;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid #8cbdfa;
    &.gap {
      border-bottom: 0.2rem solid #8cbdfa;
    }
    .title {
      margin-bottom: 0.15rem;
      font-size: 0.16rem;
      font-weight: bold;
      color: #3f3f3f;
    }
    .tab-list {
      justify-content: space-between;
      .tab {
        /* flex: 1; */
        .icon {
          width: 0.5rem;
        }
        .label {
          margin-top: 0.1rem;
          font-size: 0.12rem;
          color: #3f3f3f;
        }
      }
    }
    .more {
      margin: 0 auto;
      display: block;
      text-align: center;
      font-size: 0.14rem;
      font-weight: bold;
      color: #2D4EF5;
    }
    .code-box {
      display: block;
      width: 0.71rem;
      margin: 0 auto;
      img {
        display: block;
        width: 0.71rem;
      }
      .text {
        margin-top: 0.06rem;
        font-size: 0.12rem;
        text-align: center;
        color: #3f3f3f;
      }
    }
  }
  .service-list {
    .item {
      margin-bottom: 0.15rem;
      height: 0.8rem;
    }
    .cover {
      margin-right: 0.13rem;
      width: 0.8rem;
      height: 0.8rem;
    }
    .info {
      flex: 1;
    }
    .name {
      margin-bottom: 0.04rem;
      font-size: 0.14rem;
      color: #3f3f3f;
    }
    .price {
      font-size: 0.16rem;
      color: #c61616;
    }
    .num {
      font-size: 0.12rem;
      color: #999999;
    }
  }
}
</style>
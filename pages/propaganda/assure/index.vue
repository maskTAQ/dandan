<template>
  <div class="answer-complete h-100">
    <img @click="back" src="./imgs/back.png" alt="" class="back" />
    <div class="banner" />
    <div class="content">
      <ScrollView>
        <div class="tab-list flex-row">
          <div
            v-for="tab in TAB_LIST"
            :key="tab.label"
            :class="['tab align', { selected: selected === tab.value }]"
            @click="select(tab.value)"
          >
            {{ tab.label }}
          </div>
        </div>
      </ScrollView>
      <StatusHandle :get="get" ref="list">
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
                <p class="name">{{ item.gName }}</p>
                <p class="intro">{{ item.gTital }}</p>
              </div>
              <div class="bottom flex-row main-between center">
                <div class="price-box flex-row center">
                  <i class="old-price">原价{{ item.price }}</i>
                  <i class="price">￥{{ item.price }}</i>
                </div>
                <i class="num ellipsis">/{{ item.Tag }}</i>
              </div>
            </div>
          </div>
        </div>
      </StatusHandle>
      <button @click="go" class="ask flex-row align">咨询客服</button>
    </div>
  </div>
</template>
<script>
import { router, goKf } from "@/utils";
import { get } from "@/api/http";

const API = {
  LIST(root) {
    return get("/Api/getBxGoodsList_api.php", {
      pageIndex: 1,
      pageNum: 10,
      root,
    });
  },
};
const TAB_LIST = [
  {
    label: "全部",
    value: "",
  },
  ...["取卵", "并发症", "解冻", "移植", "孕期", "分娩"].map((v) => {
    return {
      label: v,
      value: v,
    };
  }),
];
export default {
  name: "assure",
  data() {
    return {
      TAB_LIST,
      selected: "",
      serviceList: [],
    };
  },
  methods: {
    back() {
      router.back();
    },
    select(v) {
      this.selected = v;
      this.$refs.list && this.$refs.list.refresh();
    },
    get() {
      return API.LIST(this.selected).then((res) => {
        this.serviceList = res;
      });
    },
    go() {
      goKf("home");
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
  background: #fdfdfd;
  overflow: auto;
  .back {
    position: absolute;
    top: 0.13rem;
    left: 0.13rem;
    width: 0.11rem;
    z-index: 99;
  }
  .banner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 2.16rem;
    background: url("./imgs/banner.png") no-repeat center top / 100% auto;
  }
  .content {
    padding: 0.15rem;
  }
  .tab-list {
    .tab {
      margin-right: 0.1rem;
      height: 0.3rem;
      padding: 0 0.17rem;
      font-size: 0.14rem;
      color: #666666;
      background: #eeeeee;
      border-radius: 5px;
      &.selected {
        background: #fcac09;
        color: #fff;
      }
    }
  }
  .service-list {
    .item {
      /* margin-bottom: 0.15rem; */
      padding: 0.15rem 0;
      /* height: 0.8rem; */
      border-bottom: 1px solid #a0a0a0;
      &:last-child {
        border-bottom: none;
      }
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
      font-size: 0.16rem;
      font-weight: bold;
      color: #383838;
    }
    .intro {
      margin-top: 0.1rem;
      margin-bottom: 0.1rem;
      font-size: 0.12rem;
      color: #383838;
    }
    .price-box {
    }
    .old-price {
      text-decoration: line-through;
    }
    .price {
      margin: 0 0.1rem;
      font-size: 0.2rem;
      color: #fcac09;
    }
    .num {
      width: 0;
      flex: 1;
      font-size: 0.12rem;
      color: #7c7c7c;
    }
  }
  .ask {
    margin: 0.25rem auto;
    width: 2.55rem;
    height: 0.37rem;
    background: #ffffff;
    font-size: 0.13rem;
    font-weight: 400;
    color: #efa637;
    border: 1px solid #efa537;
    border-radius: 0.19rem;
  }
}
</style>
<template>
  <Page title="搜索结果">
    <div class="search-result flex-column page-full">
      <div class="search-tool flex-row center">
        <div class="search flex-row center">
          <img :src="icons.search" alt="" class="icon" />
          <input
            v-model="search"
            placeholder="试管婴儿"
            type="text"
            class="input"
          />
        </div>
        <button @click="back" class="cancel">取消</button>
      </div>
      <div class="tabs flex-row center">
        <div
          v-for="tab in tabs"
          :key="tab.type"
          :class="[
            'tab flex-column align',
            { selected: selected === tab.type },
          ]"
          @click="select(tab)"
        >
          {{ tab.label }}
          <span v-if="selected === tab.type" class="border"></span>
        </div>
      </div>
      <List
        :request="request"
        :pageSize="20"
        :resetDatasource="true"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import { LoadingControl, formatTime, size, router } from "@/utils";
import { get, mock } from "@/api/http";
import { icons, img } from "@/assets";
import { LIVE_STATUS } from "@/constant";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultGroupCard from "@/components/SearchResultGroupCard";
const API = {
  LIST(params) {
    return get("/Api/getOrderList_api.php", params);
  },
  SEARCH(params) {
    return get("/Api/Seach_api.php", params);
  },
  SEARCH_SINGLE(params) {
    return get("/Api/SeachByType_api.php", params);
  },
};

const COLOR = {
  WAIT_PAY: "#FF6C5E",
  COMPLETE: "#2D4EF5",
};
const STATUS = {
  1: "待付款",
  2: "待服务",
  3: "服务中",
  4: "已完成",
};
const TYPE = {
  HOSPITAL: "Hospital",
  SERVER: "Service",
  GOODS: "Goods",
  WIKI: "Content",
};
export default {
  name: "search-result",
  head() {
    return {
      title: "搜索结果",
    };
  },
  data() {
    return {
      icons,
      search: "",
      tabs: [
        {
          label: "全部",
          type: "",
        },
        // {
        //   label: "医生",
        //   type: TYPE.DOCTOR,
        // },
        {
          label: "医院",
          type: TYPE.HOSPITAL,
        },
        {
          label: "服务",
          type: TYPE.SERVER,
        },
        {
          label: "内容",
          type: TYPE.WIKI,
        },
        {
          label: "商品",
          type: TYPE.GOODS,
        },
      ],
      data: {
        BK: [],
        Doctor: [],
        Goods: [],
        JT: [],
      },
      selected: "",
    };
  },
  created() {
    this.search = this.$route.query.search || "";
  },
  watch: {
    selected() {
      this.refresh();
    },
    search() {
      this.refresh();
    },
  },
  methods: {
    back() {
      router.back();
    },
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    select(tab) {
      this.selected = tab.type;
    },
    request(params) {
      const { selected } = this;
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      if (selected) {
        return API.SEARCH_SINGLE({
          seachValue: this.search,
          theType: this.selected,
          ...params,
        });
      } else {
        return API.SEARCH({
          seachValue: this.search,
          top: 2,
          // isSZ: "1", //1是松子 2 是试管
        }).then((res) => {
          const { Service, Hospital, Content, Goods} = res;
          const hasChild =
            Hospital.length || Service.length || Content.length || Goods.length;
          return hasChild
            ? [
                {
                  type: TYPE.HOSPITAL,
                  children: Hospital,
                  title: "医院",
                },
                {
                  type: TYPE.SERVER,
                  children: Service,
                  title: "服务",
                },
                {
                  type: TYPE.WIKI,
                  children: Content,
                  title: "内容",
                },
                {
                  type: TYPE.GOODS,
                  children: Goods,
                  title: "商品",
                },
              ]
            : [];
        });
      }
    },
    renderItem(item) {
      const { tabs, selected } = this;
      const match = tabs.find((tab) => tab.type === selected);
      if (selected) {
        return (
          <div class="card-box">
            <SearchResultCard type={match.type} data={item} />
          </div>
        );
      } else {
        const { title, type, children } = item;

        const tab = match ? match.label : "";
        return (
          <SearchResultGroupCard
            id={item.title}
            tab={tab}
            type={type}
            title={item.title}
            list={item.children}
            onMore={(type) => {
              this.selected = type;
            }}
          />
        );
      }
    },
  },
};
</script>
<style lang="scss">
.search-result .card-box {
  padding: 0 0.14rem;
  background: #fff;
}
</style>
<style lang="scss" scoped>
@import "../assets/theme.scss";

.search-result {
  position: relative;
  background: #faf9f9;
  .search-tool {
    padding: 0.09rem 0.15rem;
    background: #fff;
    .search {
      width: 0;
      flex: 1;
      height: 0.35rem;
      padding: 0 $padding;
      border-radius: 0.18rem;
      background: $color9;
      input::placeholder {
        font-size: 0.15rem;
      }
      .icon {
        width: 0.12rem;
      }
      input {
        flex: 1;
        font-size: 0.14rem;
        color: $color6;
        text-indent: 0.08rem;
      }
    }
    .cancel {
      margin-left: 0.12rem;
      font-size: 0.14rem;
      color: $color1;
    }
  }
  .tabs {
    height: 0.52rem;
    justify-content: space-around;
    background: #ffffff;
    /* box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05); */
    .tab {
      position: relative;
      line-height: 0.52rem;
      font-size: 0.16rem;
      color: $color6;
      &.selected {
        font-weight: bold;
        color: $color1;
      }
      .border {
        position: absolute;
        bottom: 0.05rem;
        width: 0.16rem;
        height: 4px;
        background: $color1;
        box-shadow: 0px 2px 10px 0px rgba(251, 103, 153, 0.23);
        border-radius: 3px;
      }
    }
  }
  .list {
    flex: 1;
    height: 0;
    padding-top: 0.06rem;

    .item {
      margin-bottom: 0.14rem;
      padding: 0.13rem 0.15rem;
      background: #ffffff;
      border-radius: 8px;
      .top {
        margin-bottom: 0.1rem;
      }
      .status {
        font-size: 0.14rem;
      }
      .img {
        margin-right: 0.06rem;
        width: 1.2rem;
        height: 0.8rem;
      }
      .text-1 {
        font-size: 0.12rem;
        color: $color4;
      }
      .title {
        font-size: 0.16rem;
        color: $color4;
        font-weight: bold;
      }
      .subtitle {
        margin: 0.02rem 0;
        font-size: 0.12rem;
        color: $color15;
      }

      .tag-list {
        .tag {
          margin-top: 0.04rem;
          margin-right: 0.04rem;
          padding: 0 0.06rem;
          height: 0.18rem;
          line-height: 0.18rem;
          background: rgba($color: $color1, $alpha: 0.08);
          font-size: 0.09rem;
          color: $color1;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .line {
        padding: 0.1rem 0;
        font-size: 0.14rem;
        .label {
          color: $color16;
        }
        .value {
          color: $color17;
        }
        .status {
          margin: 0 0.07rem;
        }
        .icon {
          width: 0.1rem;
        }
      }
      .hint {
        padding: 0.07rem 0.11rem;
        font-size: 0.12rem;
        color: $color19;
        background: $color18;
      }
      .bottom {
        margin-top: 0.07rem;
        .cancel {
          font-size: 0.12rem;
          color: $color20;
        }
        .pay {
          height: 0.3rem;
          padding: 0 0.23rem;
          line-height: 0.3rem;
          font-size: 0.12rem;
          color: #ffffff;
          background: $color1;
          border-radius: 0.17rem;
        }
      }
    }
  }
}
</style>
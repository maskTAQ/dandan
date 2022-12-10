<template>
  <div class="search-page page-full">
    <div class="page-header flex-row center">
      <van-icon @click="back" name="arrow-left" color="#333333" size=".22rem" />
      <ToolBar
        class="toolbar"
        v-model="search"
        placeholder="搜索医院/服务/笔记等内容"
        theme="dark"
        search
        :kf="false"
        @search="handleSearch"
      />
    </div>
    <div class="localHistory chunk">
      <div class="header flex-row main-between ceneter">
        <i class="label">历史记录</i>
        <img
          v-if="localHistory.length"
          @click="clear"
          :src="icons.delete"
          alt=""
          class="icon"
        />
      </div>
      <div v-if="localHistory.length" class="list flex-row">
        <div class="list flex-row">
          <div
            v-for="item in localHistory"
            :key="item"
            @click="go(item)"
            class="item flex-row center"
          >
            <i class="text">{{ item }}</i>
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无历史记录" />
    </div>
    <StatusHandle :get="getHotList">
      <div v-if="hot.length" class="hot chunk">
        <div class="header flex-row ceneter">
          <i class="label">热门搜索</i>
        </div>
        <div class="list">
          <div
            v-for="(item, index) in hot"
            :key="item.hid"
            class="hot-item flex-row center"
            @click="go(item.keyValue)"
          >
            <CoverImage
              class="sort align"
              :url="index < 3 ? icons[`sort${index + 1}`] : icons.sortOther"
            >
              {{ index + 1 }}
            </CoverImage>
            <i class="text">{{ item.keyValue }}</i>
            <img
                v-if="item.isHot === '1'"
                :src="icons.hot_red"
                alt=""
                class="icon"
              />
          </div>
        </div>
      </div>
    </StatusHandle>
  </div>
</template>
<script>
import { icons } from "@/assets";
import { router } from "@/utils";
import { get } from "@/api/http";

const API = {
  HOT_LIST(params) {
    return get("/Api2/getBannerHotList_api.php", params);
  },
};
//
export default {
  name: "search",
  head() {
    return {
      title: "搜索",
    };
  },
  data() {
    return {
      icons,
      search: "",
      localHistory: [],
      hot: [],
    };
  },
  mounted() {
    if (process.browser) {
      try {
        const localHistory = JSON.parse(localStorage.getItem("search") || "[]");
        this.localHistory = localHistory;
      } catch (e) {
        console.log(e, "e");
      }
    }
  },
  methods: {
    back() {
      return router.back();
    },
    getHotList() {
      return API.HOT_LIST().then((res) => {
        this.hot = res;
      });
    },
    handleSearch(value) {
      if (!this.localHistory.includes(value)) {
        this.localHistory.push(value);
        localStorage.setItem("search", JSON.stringify(this.localHistory));
      }
      // window.location.href =
      //   window.location.href.replace("search", "search-result") +
      //   `?search=${value}`;
      this.go(value);
    },
    go(search) {
      router.push({
        path: "/search-result",
        query: {
          search,
        },
      });
    },
    clear() {
      this.localHistory = [];
      localStorage.setItem("search", JSON.stringify(this.localHistory));
    },
  },
};
</script>
<style lang="scss">
.search-page {
  /* padding: 0.12rem; */
  background: #f3f5f9;
  .page-header {
    padding: 0.26rem 0.15rem 0.04rem 0.15rem;
    background: #fff;
    .toolbar {
      margin-left: 0.05rem;
      width: 0;
      flex: 1;
    }
  }
  .chunk {
    margin-top: 0.16rem;
    padding: 0.12rem;
    background: #fff;
    .header {
      height: 0.24rem;
      .label {
        font-size: 0.16rem;
        font-weight: bold;
        columns: #333333;
      }
      .icon {
        width: 0.24rem;
        height: 0.24rem;
      }
    }
    .list {
      flex-wrap: wrap;
      margin-right: -0.12rem;
      .item {
        margin-top: 0.12rem;
        margin-right: 0.12rem;
        padding: 0 0.13rem;
        height: 0.31rem;

        background: #f3f5f9;
        border-radius: 0.16rem;
        .icon {
          margin-right: 0.1rem;
          width: 0.24rem;
          /* height: 0.24rem; */
        }
        .text {
          font-size: 0.14rem;
          color: #757785;
        }
        .sort {
        }
      }
      .hot-item {
        height: 0.54rem;
        padding: 0 3px;
        border-bottom: 1px solid #eeeeee;
        &:last-child{
          border-bottom: none;
        }
        .sort {
          margin-right: 0.08rem;
          width: 0.18rem;
          height: 0.18rem;
          font-size: 0.14rem;
          font-family: Arial-BoldMT, Arial;
          color: #ffffff;
        }
        .text {
          font-size: 0.14rem;
          color: #757785;
        }
        .icon {
          margin-left: 0.1rem;
          width: 0.24rem;
          /* height: 0.24rem; */
        }
      }
    }
  }
  .hot {
    margin-top: 0.1rem;
  }
}
</style>
<template>
  <Page title="评论和赞">
    <div class="messsage-comments-page">
      <Tabs :value="selected" @change="select" :data="tabs" />
      <List
        :request="request"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import { LoadingControl, formatTime, size, Tip, router } from "@/utils";
import { get, mock } from "@/api/http";
import { icons, img } from "@/assets";
import CommentsCard from "./components/CommentsCard";
const API = {
  SEND_LIST(params) {
    return get("/Api/getMySendPL_api.php", params);
  },
  RECEIVE_LIST(params) {
    return get("/Api/getMyGetPL_api.php", params);
  },
};

export default {
  name: "messages-comments",
  head() {
    return {
      title: "评论和赞",
    };
  },
  data() {
    return {
      tabs: [
        {
          label: "我发出的",
          value: "send",
        },
        {
          label: "我收到的",
          value: "recevie",
        },
      ],
    };
  },
  computed: {
    selected() {
      return this.$route.query.status || "";
    },
  },
  watch: {
    selected() {
      this.refresh();
    },
  },
  methods: {
    select(tab) {
      router.replace({
        query: {
          status: tab,
        },
      });
    },
    request(params) {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      if (this.selected === "send") {
        return API.SEND_LIST(params);
      } else {
        return API.RECEIVE_LIST(params);
      }
    },
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    renderItem(item) {
      return <CommentsCard class="item" data={item} onRefresh={this.refresh} />;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/theme.scss";

.messsage-comments-page {
  position: relative;
  background: $color8;
  height: 100%;
  background: #f2f3f8;
  .tabs {
    background: #ffffff;
  }
  .list {
    height: calc(100% - 0.6rem);
    padding: 0.1rem;
    /* padding-bottom: .3rem; */
    /* overflow: auto; */
    .item {
      /* margin-bottom: 0.1rem; */
    }
  }
}
</style>
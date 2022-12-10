<template>
  <Page title="合伙人咨询">
    <StatusHandle :get="this.getData">
      <div class="article page-full">
        <p class="title ellipsis line-2">{{ data.Tital }}</p>
        <p class="time">{{ formatTime(data.CreateTime) }}</p>
        <div></div>
        <div class="html" v-html="html"></div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { get } from "@/api/http";
import { formatTime } from "@/utils";

const API = {
  DETAIL(params) {
    return get("/Api/xcx/getZXInfo_api.php", params);
  },
};
export default {
  name: "article",
  head() {
    return {
      title: "合伙人咨询",
    };
  },
  data() {
    return {
      data: {},
    };
  },
  computed: {
    html() {
      return (this.data.RoomJS || "").replace(
        /style="width:&quot;"/gim,
        'style="max-width:100%;display:block"'
      );
    },
  },
  methods: {
    formatTime,
    getData() {
      const { id } = this.$route.query;
      return API.DETAIL({ bid: id }).then((data) => {
        this.data = data;
      });
    },
  },
};
</script>
<style lang="scss">
.article {
  padding: 0.12rem 0.1rem;
  background: #fff;

  .title {
    font-size: 0.18rem;
    color: #2d2d2d;
  }

  .time {
    display: block;
    margin-top: 0.1rem;
    margin-bottom: 0.15rem;
    font-size: 0.12rem;
    color: #848484;
  }
}
</style>
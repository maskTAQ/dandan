<template>
  <Page :title="title">
    <StatusHandle :get="getDetail">
      <div class="html-container">
        <div v-html="HTML"></div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { get } from "@/api/http";
import { icons, img } from "@/assets";
import { router } from "@/utils";

const API = {
  DETAIL(params) {
    return get("/Api2/getPageInfo_api.php", params);
  },
};
export default {
  name: "address",
  head() {
    return {
      title: "关于我们",
    };
  },
  data() {
    return {
      img,
      list: [],
      HTML: "",
    };
  },
  computed: {
    title() {
      const title = this.$route.query.title;

      if (process.browser) {
        window.document.title = title;
      }
      return title;
    },
  },
  methods: {
    getDetail() {
      return API.DETAIL(this.$route.query).then((res) => {
        console.log(res, "res");
        this.HTML = res.Content;
      });
    },
  },
};
</script>
<style lang="scss">
.html-container {
  height: 100%;
  padding: 0.1rem;
  background: #fff;
}
</style>
<template>
  <Page title="免疫力调节" fixed>
    <div class="propaganda">
      <img src="./imgs/myldj-1.png" alt="" srcset="" />
      <img src="./imgs/myldj-2.png" alt="" srcset="" />
      <img src="./imgs/myldj-3.png" alt="" srcset="" />
      <img src="./imgs/myldj-4.png" alt="" srcset="" />
      <Bar />
    </div>
  </Page>
</template>
<script>
import { router, URL, UID } from "@/utils";
import { get } from "@/api/http";
import Bar from './components/Bar.vue';
import Page from './components/Page.vue';
const API = {
  GET() {
    return get("/Api/getZyCard_api.php", {}, { showError: false });
  },
};
export default {
  name: "propaganda",
  head: {
    title: "免疫力调节",
  },
  methods: {
    show() {
      if (UID.GET()) {
        API.GET().finally((res) => {
          this.$store.commit("showAdvancedRewardsModal", "");
        });
      } else {
        router.replace({
          path: "/login",
          query: {
            redirect: URL.decode(app.$route.fullPath),
          },
        });
      }
    },
  },
  components:{
    Bar,
    Page
  }
};
</script>
<style lang="scss">
.propaganda {
  position: relative;
  /* height: 100%;
  overflow: auto; */
  padding-bottom: 0.56rem;
  img {
    display: block;
    width: 100%;
  }
  .bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
  }
}
</style>
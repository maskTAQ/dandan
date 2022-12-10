<template>
  <Page title="30万助孕津贴" fixed>
    <div class="_929">
      <img src="./imgs/1.png" alt="" srcset="" />
      <img src="./imgs/2.png" alt="" srcset="" />
      <img @click="show" class="bar" src="./imgs/3.png" alt="" srcset="" />
    </div>
  </Page>
</template>
<script>
import { router, URL, UID } from "@/utils";
import { get } from "@/api/http";
const API = {
  GET() {
    return get("/Api/getZyCard_api.php", {}, { showError: false });
  },
};
export default {
  name: "_929",
  head: {
    title: "30万助孕津贴",
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
};
</script>
<style lang="scss">
._929 {
  position: relative;
  /* height: 100%;
  overflow: auto; */
  padding-bottom: 0.4rem;
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
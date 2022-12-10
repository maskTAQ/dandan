<template>
  <Page title="生殖保险" fixed>
    <div class="propaganda">
      <img src="./imgs/szbx-1.png" alt="" srcset="" />
      <img src="./imgs/szbx-2.png" alt="" srcset="" />
      <button @click="goKf" class="bar zx align">
        <img src="./imgs/kf-white.png" alt="" class="kf" />
        <span class="label">在线咨询</span>
      </button>
    </div>
  </Page>
</template>
<script>
import { goKf, router, URL, UID } from "@/utils";
import { get } from "@/api/http";
import Bar from "./components/Bar.vue";
import Page from "./components/Page.vue";
const API = {
  GET() {
    return get("/Api/getZyCard_api.php", {}, { showError: false });
  },
};
export default {
  name: "propaganda",
  head: {
    title: "生殖保险",
  },
  methods: {
    goKf() {
      goKf("home");
    },
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
  components: {
    Bar,
    Page,
  },
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
    height: 0.42rem;
    background: #ebb177;
    border-radius: 0.21rem;
    margin: 0.15rem;
    .kf {
      width: 0.2rem;
      margin-right: 0.1rem;
    }
    .label {
      font-size: 0.16rem;
      color: #fff;
    }
  }
}
</style>
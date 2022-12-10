<template>
  <Page title="全周期管理方案" fixed>
    <div class="img-activity">
      <img src="./imgs/1.png" alt="" srcset="" />
      <img src="./imgs/2.png" alt="" srcset="" />
      <img src="./imgs/3.png" alt="" srcset="" />
      <img src="./imgs/4.png" alt="" srcset="" />
    </div>
  </Page>
</template>
<script>
// import { router, URL, UID } from "@/utils";
// import { get } from "@/api/http";
// const API = {
//   GET() {
//     return get("/Api/getZyCard_api.php", {}, { showError: false });
//   },
// };
export default {
  name: "full-cycle-manage-plan",
  head: {
    title: "全周期管理方案",
  },
  methods: {},
};
</script>
<style lang="scss">
.img-activity {
  position: relative;
  /* height: 100%;
  overflow: auto; */
  /* padding-bottom: 0.4rem; */
  img {
    display: block;
    width: 100%;
  }
}
</style>
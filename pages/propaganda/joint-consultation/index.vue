<template>
  <Page title="多学科联合会诊" fixed>
    <div class="img-activity">
      <img src="./imgs/1.png" alt="" srcset="" />
      <img src="./imgs/2.png" alt="" srcset="" />
      <img src="./imgs/3.png" alt="" srcset="" />
      <img src="./imgs/4.png" alt="" srcset="" />
      <img src="./imgs/5.png" alt="" srcset="" />
      <img src="./imgs/6.png" alt="" srcset="" />
      <img src="./imgs/7.png" alt="" srcset="" />
      <img src="./imgs/8.png" alt="" srcset="" />
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
  name: "joint-consultation",
  head: {
    title: "多学科联合会诊",
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
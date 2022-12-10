<template>
  <Page title="问诊列表">
    <div class="inquiry-list">
      <img
        v-for="(item, index) in list"
        :key="index"
        :src="item.img"
        alt=""
        srcset=""
        class="img"
        @click="go"
      />
    </div>
  </Page>
</template>
<script>
import { router } from "@/utils";
const list = [
  {
    img: require("../assets/inquiry-list/1.png"),
    path: "",
  },
  {
    img: require("../assets/inquiry-list/2.png"),
    path: "",
  },
  {
    img: require("../assets/inquiry-list/3.png"),
    path: "",
  },
];
export default {
  name: "inquiry-list",
  data() {
    return {
      list,
    };
  },
  methods: {
    go() {
      router.push({
        path: "/goods-detail",
        query: {
          id: 201,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.inquiry-list {
  height: 100%;
  padding: 0.1rem;
  overflow: auto;
  background: #f1f5fb;
  .img {
    display: block;
    width: 100%;
    margin-bottom: 0.1rem;
  }
}
</style>
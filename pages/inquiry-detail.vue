<template>
  <Page title="问诊详情">
    <div class="inquiry-list">
      <img
        v-for="(item, index) in list"
        :key="index"
        :src="item.img"
        alt=""
        srcset=""
        class="img"
      />
    </div>
  </Page>
</template>
<script>
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
};
</script>
<style lang="scss">
.inquiry-list {
  height: 100%;
  padding: .1rem;
  overflow: auto;
  background: #f1f5fb;
  .img{
      display: block;
      width: 100%;
      margin-bottom: .1rem;
  }
}
</style>
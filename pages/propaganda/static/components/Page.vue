<template>
  <div class="propaganda-common-page">
    <!-- <button @click="goHome" class="back flex-row center">
      <img class="icon" src="./left.png" alt="" srcset="" />
      <span class="label">首页</span>
    </button> -->
    <Header />
    <slot></slot>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
  name: "propaganda-common-page",
  methods: {
    goHome() {
      this.$router.replace({
        path: "/",
      });
    },
  },
  components:{
    Header
  }
};
</script>
<style lang="scss">
.propaganda-common-page {
  position: relative;
  height: 100%;
  padding-top: .6rem;
  background: #fff;
  overflow: auto;
  .back {
    position: fixed;
    top: 0.1rem;
    right: 0.1rem;
    padding: 0 0.08rem;
    height: 0.3rem;
    background: #ebb177;
    border-radius: 10px;
    z-index: 99;
    .icon {
      width: 0.14rem;
    }
    .label {
      margin-left: 4px;
      font-size: 0.12rem;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>
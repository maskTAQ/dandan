<template>
  <div class="number-card">
    <p class="label">您的账户积分为</p>
    <div class="info flex-row main-between center">
      <ul class="number-list flex-row center">
        <li v-for="(v, index) in valueList" :key="index" class="number align">
          {{ v }}
        </li>
      </ul>
      <button class="view" @click="go">查看攻略</button>
    </div>
  </div>
</template>
<script>
import { router } from "../../utils";
export default {
  name: "number-card",
  props: ["value"],
  computed: {
    valueList() {
      return String(typeof this.value === "undefined" ? "" : this.value).split(
        ""
      );
    },
  },
  methods: {
    go() {
      router.push({
        path: "/landing-page?id=8&title=积分规则",
      });
    },
  },
};
</script>
<style lang="scss">
.number-card {
  padding: 0 0.22rem;
  height: 1.47rem;
  background: url("./imgs/bg.png") no-repeat center center / 100% 100%;
  overflow: hidden;
  .label {
    margin-top: 0.5rem;
    margin-bottom: 0.16rem;
    font-size: 0.18rem;
    color: #fff;
  }
  .number-list {
    .number {
      margin-right: 0.06rem;
      width: 0.23rem;
      height: 0.35rem;
      font-size: 0.18rem;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(180deg, #a6b6ff 0%, #1ebcc4 100%);
      border-radius: 0.05rem;
      border: 1px solid rgba(255, 255, 255, 0.65);
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .view {
    padding: 0 0.1rem;
    height: 0.3rem;
    font-size: 0.13rem;
    font-weight: 400;
    color: #333333;
    background: #ffffff;
    border-radius: 0.15rem;
  }
}
</style>
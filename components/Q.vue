<template>
  <div class="q">
    <div
      @click="visible = !visible"
      class="header flex-row main-between center"
    >
      <div class="flex-row center">
        <div class="portrait"></div>
        <i class="name">患者名称</i>
        <i class="time">07-31 21:30</i>
      </div>
      <img :src="icons.bottom" class="icon" />
    </div>
    <div v-if="visible" class="desc flex-row">
      <i class="label">症状描述</i>
      <p class="value ellipsis line-2">今天总是流鼻涕是怎么回事呢，还总觉得口渴口干舌燥的想睡觉 …
      </p>
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
export default {
  name: "q",
  data() {
    return {
      icons,
      visible: true,
    };
  },
};
</script>
<style lang="scss">
.q {
  padding: 0 0.11rem;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px 0px rgba(211, 211, 211, 0.5);
  border-radius: 4px;
  .header {
    padding: 0.16rem 0;

    .portrait {
      width: 0.38rem;
      height: 0.38rem;
      border-radius: 50%;
      /* border: 1px solid red; */
    }
    .name {
      margin: 0 0.09rem;
      font-size: 0.16rem;
      color: #333333;
    }
    .time {
      font-size: 0.14rem;
      color: #818181;
    }
    .icon {
      width: 0.1rem;
    }
  }
  .desc {
    border-top: 1px solid #EFEFEF;
    padding: 0.16rem 0;
    .label {
      margin-right: 0.08rem;
      font-size: 0.16rem;
      color: #333333;
    }
    .value {
      width: 0;
      flex: 1;
      font-size: 0.16rem;
      color: #AAAAAA;
    }
  }
}
</style>
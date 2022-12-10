<template>
  <div class="tabs flex-row center">
    <div
      v-for="tab in data"
      :key="tab.value"
      :class="['tab', { selected: value === tab.value }]"
      @click="change(tab.value)"
    >
      {{ tab.label }}
      <img :src="icons.tabSelected" v-if="value === tab.value" class="border" />
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
export default {
  name: "tabs",
  props: {
    data: Array,
    value: [String, Number],
  },
  data() {
    return {
      icons,
    };
  },
  methods: {
    change(v) {
      console.log({v})
      this.$emit("change", v);
    },
  },
  // render() {
  //   const { data = [], value } = this;
  //   return (
  //     <div class="tabs flex-row center">
  //       {data.map((tab, index) => {
  //         return (
  //           <div
  //             key={tab.value}
  //             onClick={() => this.change(tab.value)}
  //             class={"item align" + (tab.value === value ? " selected" : "")}
  //           >
  //             <p class="label">{tab.label}</p>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.tabs {
  height: 0.5rem;
  justify-content: space-around;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  .tab {
    position: relative;
    line-height: 0.5rem;
    font-size: 0.15rem;
    color: #666666;
    &.selected {
      font-size: 0.17rem;
      font-weight: bold;
      color: #2a2a2a;
    }
    .border {
      position: absolute;
      left: 50%;
      bottom: -0.07rem;
      width: 0.26rem;
      height: auto;
      margin-left: -0.13rem;
    }
  }
}
</style>
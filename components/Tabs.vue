<template>
  <div class="tabs flex-row center">
    <div
      v-for="tab in data"
      :key="tab.value"
      :class="['tab align', { selected: value === tab.value }]"
      @click="change(tab.value)"
    >
      {{ tab.label }}
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
  padding: 0.22rem 0;
  .tab {
    margin-right: 0.2rem;
    flex: 1;
    height: 0.3rem;
    font-size: 0.14rem;
    color: rgb(51, 51, 51);
    background: rgb(232, 243, 241);
    border-radius: 0.05rem;
    &.selected {
      font-weight: 500;
      color: #fff;
      background: rgb(0, 188, 197);
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
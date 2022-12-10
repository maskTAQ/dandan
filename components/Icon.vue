<template>
  <div
    :style="wrapperStyle"
    :class="['icon-box align', { animate }]"
    @click="trigger"
  >
    <div v-if="isSvg" v-html="src" class="icon icon-svg align" alt />
    <img v-else :src="src" class="icon" alt />
  </div>
</template>
<script>
import { icons } from "@/assets";
export default {
  name: "Icon",
  props: {
    type: {
      type: [String, Number],
    },
    size: {
      type: [String, Number],
      default: 25,
    },
    iconStyle: {
      type: Object,
    },
    fill: {
      type: String,
      default: "#000",
    },
    animate: {
      type: Boolean,
      default: false,
    },
    rotate: {
      type: [Boolean, Number],
      default: false,
    },
  },
  computed: {
    isSvg() {
      return !!icons[this.type];
    },
    src() {
      const { type, size, isSvg, fill } = this;
      if (isSvg) {
        return icons[type]({ size, fill });
      }
      return require(`~/assets/icon/${this.type}.png`);
    },
    wrapperStyle() {
      const { iconStyle = {}, size, rotate } = this;
      return Object.assign(
        {
          width: size / 100 + "rem",
          height: size / 100 + "rem",
          transform: `rotate(${
            rotate ? (typeof rotate === "number" ? rotate : 180) : 0
          }deg)`,
        },
        iconStyle
      );
    },
  },
  methods: {
    trigger() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss">
.icon-box {
  .icon {
    //display: block;
    width: 100%;
    height: auto;
  }
  .icon-svg {
    height: 100%;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  &.animate {
    transition: all 0.3s;
  }
}
</style>
<template>
  <div class="triangle" :style="style"></div>
</template>
<script>
export default {
  name: "Triangle",
  props: {
    direction: {
      type: String,
      default: "",
    },
    size: {
      type: [String, Number],
      default: 5,
    },
    color: {
      type: String,
      default: "",
    },
  },
  computed: {
    style() {
      //https://www.cnblogs.com/chengxs/p/11406278.html
      const { direction, size, color } = this;
      switch (direction) {
        case "top": {
          return {
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size /2}px solid ${color}`,
          };
        }
        case "bottom": {
          return {
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderTop: `${size /2}px solid ${color}`,
          };
        }
        case "right": {
          return {
            borderTop: `${size / 2}px solid transparent`,
            borderLeft: `${size}px solid ${color}`,
            borderBottom: `${size / 2}px solid transparent`,
          };
        }
        case "topLeft": {
          return {
            borderTop: `${size}px solid ${color}`,
            borderRight: `${size}px solid transparent`,
          };
        }
        case "bottomRight": {
          return {
            borderBottom: `${size}px solid ${color}`,
            borderLeft: `${size}px solid transparent`,
          };
        }
        default: {
          return {};
        }
      }
    },
  },
};
</script>
<style lang="scss">
.triangle {
  width: 0;
  height: 0;
  &.right {
  }
}
</style>
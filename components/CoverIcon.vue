<template>
  <div
    :style="{
      width: size,
      height: size,
      backgroundImage: `url('${url}')`,
    }"
    :class="['cover-icon', { circle }]"
  />
</template>
<script>
export default {
  name: "CoverIcon",
  props: {
    url: String,
    size: String,
    circle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss">
.cover-icon {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  &.circle {
    border-radius: 50%;
  }
}
</style>
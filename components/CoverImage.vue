<template>
  <div
    :style="{
      backgroundImage: `url('${Array.isArray(url) ? url[0] : url}')`,
    }"
    :class="['cover-icon', { circle }]"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "CoverImage",
  props: {
    url: String,
    size: String,
    circle: {
      type: Boolean,
      default: false,
    },
  },
  methods:{
    handleClick(){
      this.$emit('click')
    }
  }
};
</script>
<style lang="scss">
.cover-icon {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  flex-shrink:0;
  &.circle {
    border-radius: 50%;
  }
}
</style>
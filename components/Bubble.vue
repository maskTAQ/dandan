<template>
  <div class="bubble">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "bubble",
};
</script>
<style lang="scss">
.bubble {
  padding: 0.15rem 0.2rem;
  border-radius: 0.06rem;
  background: #2d4ef5;
}
</style>
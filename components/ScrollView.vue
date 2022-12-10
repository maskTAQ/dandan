<template>
  <div ref="container" class="scroll-view scroll-wrapper">
    <div :class="['scroll-content',direction]">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  name: "ScrollView",
  props: {
    direction: {
      type: String,
      default: "x",
    },
  },
  mounted() {
    // setTimeout(() => this.init(), 1000);
      this.init();
  },
  methods: {
    init() {
      const { direction } = this;
      if (direction === "x") {
        this.scroll = new BScroll(this.$refs.container, {
          scrollX: true,
          scrollY: false,
          click: true,
          eventPassthrough:'vertical'
        });
      } else {
        this.scroll = new BScroll(this.$refs.container, {
          scrollX: false,
          scrollY: true,
          click: true,
          eventPassthrough:'horizontal'
        });
      }
      return;
    },
    refresh(){
        if(this.scroll){
            this.scroll.refresh();
        }
    }
  },
};
</script>
<style lang="scss">
.scroll-view {
  overflow: hidden;
  .scroll-content {
    &.x {
      white-space: nowrap;
      display: inline-block;
    }
  }
}
</style>
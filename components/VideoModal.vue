<template>
  <div v-if="visible" @click="close" class="code-modal flex-row align">
    <div @click.stop class="modal flex-column align">
      <img @click="close" :src="icons.close" alt="" class="close" />
      <Player :src="data" />
    </div>
  </div>
</template>
<script>
import Player from "./Player";
import { icons } from "@/assets";
export default {
  name: "VideoModal",
  model: {
    prop: "visible",
    event: "onVisibleChange",
  },
  data() {
    return {
      icons,
    };
  },
  props: ["visible", "data"],
  methods: {
    close() {
      this.$emit("close");
    },
  },
  components: {
    Player,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.code-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba($color: #000000, $alpha: 0.5);
  .modal {
    margin: 0 auto;
    width: 94%;
    display: block;
    position: relative;
    padding: 0.15rem;
    background: #fff;
    border-radius: 8px;
    .close {
      position: absolute;
      width: 0.3rem;
      top: 0.15rem;
      right: .15rem;
      z-index: 999;
    }
    .video-js{
      width: 100%;
    }
  }
}
</style>
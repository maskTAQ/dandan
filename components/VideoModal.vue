<template>
  <div v-if="visible" @click="close" class="video-modal flex-row align">
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
.video-modal {
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
      top: 0.25rem;
      right: 0.25rem;
      z-index: 999;
    }
    .video-js {
      width: 100%;
    }
    .vjs-big-play-button {
      top: 50%;
      margin-top: -0.8em;
      left: 50%;
      margin-left: -1.5em;
    }
  }
}
</style>
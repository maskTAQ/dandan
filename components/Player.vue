<template>
  <div class="player video-js" ref="player">
    <video
      v-if="!live"
      ref="player"
      preload="metadata"
      class="video-js"
      webkit-playsinline="true"
      playsinline=""
      x5-playsinline="true"
      x-webkit-airplay="true"
      :style="{ width: '100%', height: size(211) + 'px' }"
    />
    <slot></slot>
  </div>
</template>
<script>
import { size, onReady } from "@/utils";
export default {
  name: "Player",
  props: ["poster", "src", "live"],
  data() {
    return {
      size,
    };
  },
  mounted() {
    if (!process.browser) {
      return;
    }
    onReady(() => this.init());
  },
  methods: {
    init() {
      const { poster, src, live } = this;
      console.log(poster,'poster')
      if (live) {
        // if (!livePlayer) {
        const livePlayer = (this.player = new TXLivePlayer());
        // livePlayer.setPlayListener({
        //   onPlayEvent: onPlayEvent,
        //   onPlayStats: onPlayStats,
        // });
        // console.log(src,'src')
        livePlayer.setPlayerView(this.$refs.player);
        // }
        // const playUrl = 'webrtc://5664.liveplay.myqcloud.com/live/5664_harchar1?txSecret=f22a813b284137ed10d3259a7b5c224b&txTime=6403f7bb'
        livePlayer.startPlay(src);

        livePlayer.setMute(false);
        // livePlayer.playerView.onload = alert
        // window.livePlayer = livePlayer;
        setTimeout(() => {
          try {
            livePlayer.playerView.play();
          } catch (e) {
            // alert(1)
          }
        });
        // livePlayer.play()
        // var volumeValue = $("#volume").val();
        // livePlayer.setVolume(parseInt(volumeValue, 10));
      } else {
        this.player = videojs(
          this.$refs.player,
          {
            autoplay: false,
            controls: true,
            // preload: "auto",
            poster,
            width: document.body.clientWidth,
            height: size(211),
          },
          () => {
            this.player.loadMedia({
              src,
              // type: ``,
              poster,
              // type: "application/x-mpegURL",
            });
          }
        );
      }
      window.player = this.player;
    },
  },
  destroyed() {
    if (this.player) {
      this.player.dispose && this.player.dispose();
    }
  },
};
</script>
<style lang="scss">
/* .player,
.video-js {
  position: relative;
  height: 2.11rem;
  video {
    width: 100%;
    height: 100%;
  }
} */
</style>
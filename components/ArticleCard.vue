<template>
  <div class="article-card flex-column" @click="handleClick">
    <img class="cover" :src="src" alt="" @load="onLoad" />
    <!-- icons.play -->
    <div class="info">
      <div class="header">
        <span v-if="+data.isBJ === 1" class="tag">好孕日记</span>
        <span class="name">{{ data.Tital }}</span>
      </div>
      <div class="user-info flex-row main-between center">
        <div class="left flex-row center">
          <div
            v-if="data.writerImg && data.writerImg !== 'null'"
            class="portrait"
            :style="{
              background: `url('${data.writerImg}') no-repeat left center / 100%`,
            }"
          />
          <i v-if="data.writer && data.writer !== 'null'" class="user-name">{{
            data.writer
          }}</i>
        </div>
        <div class="read-num flex-row center">
          <span>{{ data.HotNum }}</span>
          <img :src="icons.like1" class="icon" alt="" srcset="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
export default {
  name: "ArticleCard",
  props: ["imgH", "data"],
  data() {
    return {
      icons,
    };
  },
  computed: {
    src() {
      const { PageImg, cover } = this.data;
      return PageImg && PageImg[0] ? PageImg : cover;
    },
  },
  methods: {
    handleClick() {
      this.$emit("click", this.data);
    },
    onLoad(e){
      this.$emit("coverLoad");
    }
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.article-card {
  border-radius: 0.08rem;
  overflow: hidden;
  .cover {
    width: 100%;
    height: auto;
    border: none;
    outline: none;
    border-image-width: 0;
  }

  .info {
    padding: 0.12rem 0.08rem;
    font-size: 0.1rem;
    color: $color5;
    background: #fff;
    .header {
      margin-bottom: 0.08rem;
      font-size: 0.14rem;
      .tag {
        height: 0.26rem;
        background: #a593d8;
        color: #fff;
        font-size: 0.12rem;
        padding: 0 5px;
        border-radius: 4px;
      }
      .name {
        color: $color4;
      }
    }

    .portrait {
      display: block;
      margin-right: 0.04rem;
      width: 0.2rem;
      height: 0.2rem;
      border-radius: 50%;
    }
    .icon {
      margin-left: 4px;
      width: 0.14rem;
    }
  }
}
</style>
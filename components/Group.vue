<template>
  <div class="group">
    <div :class="['group-title flex-row main-between center', { border }]">
      <div class="left flex-row center">
        <img v-if="icon" :src="icon" alt="" class="icon" />
        <i class="label">{{ title }}</i>
      </div>
      <slot name="headright" v-if="$slots.headright"></slot>
      <template v-else>
        <img v-if="link" :src="icons.right" alt="" class="right" />
        <div v-if="more" @click="clickMore" class="more flex-row center">
          <i class="label">{{ moreText || "更多" }}</i>
          <img :src="rightIcon" alt="" class="right-icon" />
        </div>
      </template>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
export default {
  name: "Group",
  props: {
    icon: {
      type: String,
      default: icons.groupIcon,
    },
    title: String,
    link: String,
    more: Boolean,
    moreText: String,
    card: Boolean,
    size: String,
    rightIcon: {
      type: String,
      default: icons.right,
    },
    border: Boolean,
  },
  data() {
    return {
      icons,
    };
  },
  created() {
    console.log(this, "group");
  },
  methods: {
    clickMore() {
      this.$emit("more");
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.group {
  .group-title {
    height: 0.53rem;
    /* margin: 0.08rem 0; */
    &.border {
      border-bottom: 1px solid #eeeeee;
    }
    .icon {
      margin-right: 0.06rem;
      width: 0.22rem;
    }
    .label {
      font-size: 0.16rem;
      font-weight: 500;
      color: $color4;
    }
    .right {
      width: 0.07rem;
    }
    .more {
      /* margin-right: 0.16rem; */
      .label {
        font-size: 0.13rem;
        color: #989898;
      }
      .right-icon {
        margin-left: 0.04rem;
        display: block;
        width: 0.07rem;
        height: auto;
      }
    }
  }
}
</style>
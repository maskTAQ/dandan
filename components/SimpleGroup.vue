<template>
  <div :class="['simple-group', { 'has-border': border }]">
    <div :class="['title flex-row main-between center']">
      <div class="left flex-row center">
        <i class="label" :style="titleStyle">{{ title }}</i>
      </div>
      <slot name="headright" v-if="$slots.headright"></slot>
      <div class="flex-row" @click="clickMore" v-else>
        <img v-if="link" :src="icons.right" alt="" class="right" />
        <div v-if="more" class="more flex-row center">
          <i class="label">{{ moreText || "更多" }}</i>
          <!-- <img :src="rightIcon" alt="" class="right-icon" /> -->
        </div>
      </div>
    </div>
    <div :class="['content', { padding }]">
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
    link: Boolean,
    more: Boolean,
    moreText: String,
    card: Boolean,
    size: String,
    titleColor: String,
    rightIcon: {
      type: String,
      default: icons.right,
    },
    border: Boolean,
    padding: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      icons,
    };
  },
  created() {
    console.log(this, "simple-group");
  },
  computed: {
    titleStyle() {
      const { titleColor } = this;
      if (titleColor) {
        return {
          color: titleColor,
        };
      } else {
        return {};
      }
    },
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
.simple-group {
  &.has-border {
    border-top: 1px solid #eeeeee;
  }
  .title {
    height: 0.53rem;
    /* margin: 0.08rem 0; */

    .icon {
      margin-right: 0.06rem;
      width: 0.22rem;
    }
    .label {
      font-size: 0.16rem;
      font-weight: 500;
      color: rgb(16, 22, 35);
    }
    .right {
      width: 0.2rem;
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
        width: 0.15rem;
        height: auto;
      }
    }
  }
  .content {
    &.padding {
      padding-bottom: 0.15rem;
    }
  }
}
</style>
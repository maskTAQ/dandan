<template>
  <div class="show-more">
    <div class="content" :style="style">
      <slot></slot>
    </div>
    <div class="toggle flex-row align" @click="visible = !visible">
      <i class="label">{{ visible ? "收起" : "展开" }}更多</i>
      <van-icon
        color="#666"
        :name="visible ? 'arrow-up' : 'arrow-down'"
        size="8"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "ShowMore",
  props: {
    min: {
      type: String,
      default: ".48rem",
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    style() {
      if (this.visible) {
        return {
          height: "auto",
        };
      } else {
        return {
          maxHeight: this.min,
        };
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.show-more {
  .content {
    overflow: hidden;
  }
  .toggle {
    padding: 0.1rem 0;
    font-size: 0.12rem;
    color: $color5;
    .label {
      margin-right: 0.05rem;
    }
    .icon-box {
      width: 0.12rem;
      height: 0.12rem;
      border-radius: 50%;
      border: 1px solid $color5;
    }
  }
}
</style>

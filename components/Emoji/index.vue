<template>
  <div class="emoji">
    <ul class="emoji-controller flex-row center">
      <li
        v-for="(pannel, index) in pannels"
        :key="pannel"
        @click="changeActive(index)"
        :class="{ active: index === activeIndex }"
      >
        {{ pannel }}
      </li>
    </ul>
    <ul class="emoji-container">
      <li
        v-for="(emojiGroup, index) in emojis"
        style="padding: 0"
        :key="index"
        v-if="index === activeIndex"
      >
        <a
          href="javascript:;"
          v-for="(emoji, index) in emojiGroup"
          :key="index"
          @click="selectItem(emoji)"
        >
          <span
            class="emoji-item"
            :title="emoji"
            :class="'sprite-' + getPureName(emoji)"
          ></span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import data from "./data";

export default {
  name: "emoji",
  data() {
    return {
      emojiData: data,
      pannels: ["表情", "自然", "物品", "地点", "符号"],
      activeIndex: 0,
    };
  },
  methods: {
    changeActive(index) {
      this.activeIndex = index;
    },
    getPureName(name) {
      return name.replace(/\[|\]/g, "");
    },
    selectItem(emoji) {
      console.log(emoji, "emoji");
      this.$emit("input", emoji);
    },
  },
  computed: {
    emojis() {
      return this.pannels.map((item) => {
        return Object.keys(this.emojiData[item]);
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./emoji-sprite.scss";

.emoji {
  /* width: 380px; */
  height: 1.86rem;
  background: #fff;
  padding: 0 0.1rem;
  .emoji-controller {
    height: 0.3rem;
    overflow: hidden;
    margin-bottom: 0;
    li {
      width: 0.5rem;
      height: 100%;
      font-size: 0.12rem;
      cursor: pointer;
      text-align: center;
      position: relative;
      &.active::after {
        position: absolute;
        left: 50%;
        margin-left: -30%;
        bottom: 4px;
        content: "";
        width: 60%;
        height: 2px;
        border-radius: 2px;
        background: #0689dd;
      }
    }
  }
  .emoji-container {
    height: 140px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    li {
      font-size: 0;
      padding: 5px;

      a {
        float: left;
        overflow: hidden;
        height: 35px;
        transition: all ease-out 0.2s;
        border-radius: 4px;
        &:hover {
          background-color: #d8d8d8;
          border-color: #d8d8d8;
        }
        span {
          width: 25px;
          height: 25px;
          display: inline-block;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

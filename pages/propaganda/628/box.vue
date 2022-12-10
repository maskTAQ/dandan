<template>
  <div class="box">
    <div class="header flex-row align">
      <img class="arrow" src="./imgs/left.png" alt="" srcset="" />
      <p class="title flex-row center">
        <i class="text">{{ t[0] }}</i>
        <i class="important">{{ t[1] }}</i>
        <i class="text">{{ t[2] }}</i>
      </p>
      <img class="arrow" src="./imgs/right.png" alt="" srcset="" />
      <img class="sort" :src="sortImg" alt="" />
    </div>
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
const img = {
  1: require("./imgs/1.png"),
  2: require("./imgs/2.png"),
  3: require("./imgs/3.png"),
  4: require("./imgs/4.png"),
};
export default {
  name: "box",
  props: ["title", "sort"],
  computed: {
    t() {
      const { title } = this;
      return [title.substr(0, 2), title.substr(2, 3), title.substring(4)];
    },
    sortImg() {
      return img[this.sort];
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 3.38rem;
  padding: 0.1rem;
  background: #ffffff;
  box-shadow: 0px 6px 6px rgba(84, 66, 253, 0.16);
  opacity: 1;
  border-radius: 6px;
  margin-bottom: 0.3rem;
  .header {
    position: relative;
    margin-bottom: 0.2rem;
    .sort {
      position: absolute;
      top: -0.1rem;
      left: 0.02rem;
      width: 0.38rem;
    }
    .arrow {
      width: 0.4rem;
    }
    .title {
      margin: 0 0.09rem;
      font-size: 0.18rem;
      color: #333333;
      .important {
        margin-right: 0.05rem;
        color: #3c8aff;
      }
    }
  }
  .box-content {
    background: #fff;
  }
}
</style>
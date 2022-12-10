<template>
  <div v-if="visible" @click="hide" class="code-modal align">
    <div @click.stop class="modal flex-column align">
      <img :src="data.code" alt="" class="code" />
      <p class="title">联系了解详情</p>
      <p class="hint">{{ data.title }}</p>
      <template v-if="Array.isArray(data.subtitle)">
        <p v-for="item in data.subtitle" :key="item" class="hint">{{ item }}</p>
      </template>

      <p v-else class="hint">{{ data.subtitle }}</p>
      <button class="confirm" @click="hide">确定</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "CodeModal",
  model: {
    prop: "visible",
    event: "onVisibleChange",
  },
  props: ["visible", "data"],
  methods: {
    hide() {
      this.$emit("onVisibleChange", false);
    },
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
    width: 2.42rem;
    height: 2.78rem;
    background: #fff;
    border-radius: 8px;
    background: #fff url("../assets/img/modal-bg.png") no-repeat top 0.2rem
      center / 90% auto;
  }
  .code {
    width: 1.3rem;
    height: 1.3rem;
  }
  .title {
    margin: 0.05rem 0;
    font-size: 0.14rem;
    columns: $color4;
  }
  .hint {
    font-size: 0.12rem;
    color: $color5;
  }
  .confirm {
    margin-top: 0.08rem;
    width: 1.8rem;
    height: 0.36rem;
    font-size: 0.16rem;
    color: #fff;
    border-radius: 0.24rem;
    background: $color1;
  }
}
</style>
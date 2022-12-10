<template>
  <div class="verify-code">
    <van-password-input
      length="4"
      :value="value"
      :mask="false"
      :focused="handleFocusChange"
      gutter=".24rem"
      @focus="handleFocusChange"
    />
    <van-number-keyboard
      v-model="value"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
  </div>
</template>
<script>
export default {
  name: "InputVerifyCode",
  props: {
    num: {
      type: [Number, String],
      default: 4,
    },
  },
  data() {
    return {
      value: "",
      showKeyboard: false,
    };
  },
  watch: {
    value(now, old) {
      console.log({now,old})
      if (now.length === 4) {
        this.$emit("complete", now);
        this.showKeyboard = false;
      }
    },
  },
  created(){
    // this.$emit('focus')
  },
  methods: {
    handleFocusChange(){
      this.$emit('focus')
      this.showKeyboard = true;
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.verify-code {
  /* height: 20px; */
  /* border: 1px solid red; */
  .van-password-input {
    margin: 0;
    ul {
      &::after {
        border: none;
      }
    }
    li {
      border-bottom: 1px solid $border;
      &::after {
        border: none;
      }
    }
    .van-password-input__security {
      height: 0.46rem;
    }
    .van-password-input__item {
      background: #e8ecfa;
      border-radius: 3px;
      opacity: 0.62;
    }
  }

  .input-group {
    input {
      margin-right: 0.24rem;
      height: 40px;
      width: 0;
      flex: 1;
      font-size: 0.24rem;
      color: $color4;
      text-align: center;
      border-bottom: 1px solid $border;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
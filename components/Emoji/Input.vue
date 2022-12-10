<template>
  <input
    class="emoji-input"
    key="emoji-input"
    :value="inner"
    @input="onChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>
<script>
export default {
  name: "Input",
  props: ["value"],
  computed: {
    inner() {
      const { value } = this;
      return value;
    },
  },
  methods: {
    handleFocus(){
      this.$emit('focus');
    },
    handleBlur(){
      this.$emit('blur');
    },
    onChange(e) {
      const now = e.target.value || "";
      const old = this.value || "";
      let next = e.target.value;
      //获取改动的下标
      const diff = this.getDiff(old, now);
      //删除操作 只从最后删除一位字符时
      if (now.length <= now.length && diff === old.length - 1) {
        //获取被删除emoji的区间
        const emojiRange = this.getEmojiRange(old, diff);
        if (emojiRange.result) {
          //将区间内的emoji清除
          const v = this.intercept(next, emojiRange.range);
          next = v;
        }
      }
      //删除原生emoji表情符号
      next = next.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      this.$emit("input", next);
    },

    getDiff(source = "", target = "") {
      // const
      let start = -1;
      const l = Math.max(source.length, target.length);
      for (let i = 0; i <= l; i++) {
        if (source[i] !== target[i]) {
          start = i;
          break;
        }
      }
      return start;
    },
    getEmojiRange(msg = "", index) {
      const before = msg.substr(0, index).lastIndexOf("[");
      const after = msg.substr(index, msg.length).indexOf("]");
      if (before === -1 || after === -1) {
        return {
          result: false,
        };
      }
      const range = [before, index + 1 + after + 1];
      const likeEmoji = msg.substring(range[0], range[1]);

      if (/^\[[a-z_]+\]$/.test(likeEmoji)) {
        return {
          result: true,
          range,
          emoji: likeEmoji,
        };
      } else {
        return {
          result: false,
        };
      }
    },
    getMsgEmojiRangeList(msg = "") {
      const result = [];
      msg.replace(/\[[a-z_]+\]/gim, (emoji, start) => {
        result.push({
          emoji,
          rang: [start, start + emoji.length],
        });
        return "";
      });
      return result;
    },
    intercept(msg = "", range) {
      return msg.substring(0, range[0]) + msg.substring(range[1], msg.length);
    },
  },
};
</script>
<template>
  <div class="tag-list flex-row center">
    <div v-for="item in tagList" :key="item" class="tag">
      {{ item }}
    </div>
  </div>
</template>
<script>
import { toArray } from "@/utils";
export default {
  name: "TagList",
  props: {
    data: [Array, String],
    max: Number,
  },
  computed: {
    tagList() {
      const string = this.data || "";
      let result;
      if (typeof string === "string") {
        result = string.split(";");
      } else {
        result = toArray(string);
      }
      if (this.max && result.length > this.max) {
        result.length = this.max;
        result.push("...");
      }
      return result;
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.tag-list {
  flex-wrap: wrap;
  .tag {
    /* margin-top: 0.04rem; */
    flex-shrink: 0;
    margin-right: 0.04rem;
    margin-bottom: 4px;
    padding: 0 0.06rem;
    height: 0.18rem;
    line-height: 0.18rem;
    background: #ecf0ff;
    font-size: 0.09rem;
    color: #1ebcc4;
    border-radius: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
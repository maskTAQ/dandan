<template>
  <div v-if="list && list.length" class="search-result-group-card">
    <p class="title">{{ title }}</p>
    <div v-for="item in list" :key="item.id" class="list">
      <SearchResultCard :type="type" :data="item" />
    </div>
    <button @click="goMore" class="show-more align">查看更多结果</button>
  </div>
</template>
<script>
import SearchResultCard from "./SearchResultCard";

export default {
  name: "search-result-group-card",
  props: ["title", "list", "type", "tab"],
  methods:{
    goMore(){
      this.$emit('more',this.type);
    }
  },
  components: {
    SearchResultCard,
  },
};
</script>
<style lang="scss">
.search-result-group-card {
  background: #fff;
  margin-bottom: 0.06rem;
  .title {
    padding-left: 0.14rem;
    height: 0.43rem;
    line-height: 0.43rem;
    font-size: 0.13rem;
    color: #8C8C95;
    border-bottom: 1px solid #EFEFEF;
  }
  .list {
    padding: 0 0.14rem;
  }
  .show-more {
    width: 100%;
    height: 0.4rem;
    font-size: 0.12rem;
    color: #6dc7c6;
  }
}
</style>
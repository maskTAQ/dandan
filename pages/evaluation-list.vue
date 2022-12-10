<template>
  <Page title="评价列表">
    <div class="evaluation-list page-full">
      <List
        :request="request"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import { get, post } from "@/api/http";
import { Tip, router } from "@/utils";
import EvaluateInfo from "@/components/EvaluateInfo";
const API = {
  LIST(params) {
    return get("/Api/getPJList_api.php", params);
  },
};
export default {
  name: "evaluation-list",
  head() {
    return {
      title: "评价列表",
    };
  },
  data() {
    return {};
  },
  computed: {
    gid() {
      return this.$route.query.gid;
    },
  },
  methods: {
    request(params) {
      return API.LIST({ ...params, gid: this.gid });
    },
    renderItem(item, index, that) {
      return <EvaluateInfo class="item" data={item} />;
    },
  },
};
</script>
<style lang="scss">
.evaluation-list {
  background: #ededed;
  .list {
    height: 100%;
  }
  .list {
    height: 100%;
    .item {
      margin-bottom: 0.1rem;
      padding: 0.14rem 0.12rem;
      background: #fff;
      border-radius: 0.08rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
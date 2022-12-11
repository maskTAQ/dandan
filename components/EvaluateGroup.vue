<template>
  <SimpleGroup
    title="客户评价"
    class="evaluation-group area radius"
  >
    <StatusHandle ref="statusHandle" key="statusHandle" :get="getList">
      <ShowMore min="2.2rem">
        <EvaluateInfo v-for="item in list" :key="item.pjid" :data="item" />
      </ShowMore>
    </StatusHandle>
  </SimpleGroup>
</template>

<script>
import { icons } from "@/assets";
import { get } from "@/api/http";
import EvaluateInfo from "./EvaluateInfo";
const API = {
  LIST(params) {
    return get("/Api/getPJList_api.php", params, { full: true });
  },
};

export default {
  name: "EvaluateGroup",
  props: ["goods"],
  data() {
    return {
      icons,
      list: [],
      total: "",
    };
  },
  computed: {
    gid() {
      return this.goods.gid;
    },
  },
  methods: {
    getList() {
      return API.LIST({ pageIndex: 1, pageNum: 2, gid: this.gid }).then(
        (res) => {
          console.log(res, "res");
          const { count, data } = res;
          this.list = data;
          this.total = count;
        }
      );
    },
    refresh() {
      if (this.$refs.statusHandle) {
        this.$refs.statusHandle.refresh();
      }
    },
    go() {
      this.$router.push({ path: "/evaluation-list", query: { gid: this.gid } });
    },
  },
  components: {
    EvaluateInfo,
  },
};
</script>
<style lang="scss">
.evaluation-group {
  /* margin-top: 0.12rem; */
  background: #fff;
  /* border-radius: 0.12rem; */
  .title {
    margin: 0 !important;
    margin-bottom: 0.2rem !important;
  }
  .title .icon {
    margin-right: 0.08rem;
  }
  .mt {
    margin-top: 0.15rem;
  }
}
</style>
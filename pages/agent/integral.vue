<script>
import { get } from "@/api/http";
import List from "@/components/List";
import Tabs from "@/components/Tabs";
import Item from "./components/integralItem.vue";
import Page from "@/components/Page";

const API = {
  LIST(params) {
    return get("/Api/xcx/getUserNumList_api.php", params);
  },
};
export default {
  name: "integral",
  head() {
    return {
      title: "积分明细",
    };
  },
  data() {
    return {
      tabs: [
        { label: "全部", value: "" },
        { label: "未进行", value: "2" },
        { label: "已付款", value: "3" },
        { label: "已完成", value: "6" },
      ],
      tab: "",
    };
  },
  methods: {
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    request(params) {
      return this.$store.dispatch("getAgentUserInfo").then((userInfo) => {
        return API.LIST({
          ...params,
          Flag: this.tab,
          uid: (userInfo || {}).uid,
        });
      });
    },
    renderItem(item) {
      return <Item data={item} />;
    },
  },
  render() {
    const { tab } = this;
    return (
      <Page title="积分明细">
        <div class="integral includes-tabs-list page-full">
          <Tabs
            value={tab}
            onChange={(tab) => {
              this.tab = tab;
              this.$nextTick(this.refresh);
            }}
            data={this.tabs}
          />
          <List
            class="list"
            request={this.request}
            ref="list"
            renderItem={this.renderItem}
          />
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
.integral {
  background: #f5f6fa;
  .list {
    height: calc(100% - 0.32rem);
    padding:0.15rem;
  }
}
</style>
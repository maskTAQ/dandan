<script>
import day from "dayjs";
import { get } from "@/api/http";
import Page from "@/components/Page";
import Tabs from "@/components/Tabs";
import List from "@/components/List";

const API = {
  LIST(params) {
    return get("/Api/xcx/getExChangeList_api.php", params);
  },
};
const STATUS = {
  1: "待审核",
  2: "兑换中",
  3: "已兑换",
  4: "失效",
};
const TABS = [
  { label: "全部", value: "" },
  { label: "待审核", value: "1" },
  { label: "兑换中", value: "2" },
  { label: "已兑换", value: "3" },
  { label: "失效", value: "4" },
];
export default {
  name: "exchange",
  head() {
    return {
      title: "兑换管理",
    };
  },
  data() {
    return {
      tab: "",
      current: "",
    };
  },
  methods: {
    renderItem({ exAmt, exTime, Flag }, index) {
      return (
        <div key={index} class="item flex-row main-between center">
          <div class="flex-column">
            <div class="flex-row center">
              <p class="label">兑换：</p>
              <p class="price">{exAmt}</p>
            </div>
            <p class="time">
              {day(exTime * 1000).format("YYYY/MM/DD HH:mm:ss")}
            </p>
          </div>
          <p class="status">{STATUS[Flag]}</p>
        </div>
      );
    },
    request(params) {
      return API.LIST({
        Flag: this.tab,
        ...params,
      });
    },
  },
  watch: {
    current() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
  },
  render() {
    return (
      <Page title="兑换管理">
        <div class="exchange includes-tabs-list page-full">
          <Tabs
            value={this.current}
            onChange={(current) => {
              console.log(current, "current");
              this.current = current;
            }}
            data={TABS}
            class="tabs"
          />
          <List
            class="list"
            request={this.request}
            renderItem={this.renderItem}
            ref="list"
          />
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.exchange {
  background: #f5f6fa;
  .tabs {
    background: #fff;
  }
  .list {
    height: calc(100% - 0.32rem);
    padding: 10px 12px;

    .item {
      margin-bottom: 10px;
      height: 80px;
      padding: 0 0.16rem;
      font-size: 14px;
      border-radius: 8px;
      background: #fff;
    }

    .label {
      margin: 0;
      color: $color2;
    }

    .price {
      font-size: 0.16rem;
      color: #ff944a;
    }

    .time {
      margin-top: 6px;
      color: $color2;
    }

    .status {
      color: #6dc7c6;
    }
  }
}
</style>
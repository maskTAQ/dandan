<script>
import List from "@/components/List";
import StatusHandle from "@/components/StatusHandle";
import NumberCard from "@/components/NumberCard";

import Page from "@/components/Page";
import { Tip, router, LoadingControl } from "@/utils";
import { icons } from "@/assets";
import { get, post } from "@/api/http";
import { formatTime } from "../utils";

const API = {
  LIST(params) {
    return get("/Api/getUserTallyList_api.php", params);
  },
  SUBMIT(params) {
    return post("/Api/xcx/saveExChangeInfo_api.php", params, { json: false });
  },
  GET_BANK_CARD_INFO(params) {
    return get("/Api/xcx/getUserBankInfo_api.php", params);
  },
};

const TABS = [
  {
    label: "全部",
    value: "",
  },
  {
    label: "收益",
    value: "1",
  },
  {
    label: "消费",
    value: "2",
  },
];
export default {
  name: "integral-2",
  head() {
    return {
      title: "积分兑换",
    };
  },
  data() {
    return {
      selectedTab: "",
    };
  },
  methods: {
    getUserInfo() {
      return this.$store.dispatch("getUserInfo");
    },
    request(params) {
      return API.LIST({...params,flag:this.selectedTab});
    },
    renderItem(item) {
      const { tName, ctime, theNum } = item;
      return (
        <div class="item flex-row main-between center">
          <div>
            <p class="name">{tName}</p>
            <p class="time">{formatTime(ctime)}</p>
          </div>
          <span class={["value", theNum < 0 ? "minus" : "add"]}>
            {theNum < 0 ? theNum : `+${theNum}`}
          </span>
        </div>
      );
    },
    refresh() {
      this.$refs.list && this.$refs.list.refresh();
    },
  },
  render() {
    const { selectedTab } = this;
    const userInfo = this.$store.state.userInfo.data || {};
    return (
      <Page title="积分兑换">
        <StatusHandle get={this.getUserInfo}>
          <div class="integral-2 page-full">
            <NumberCard value={userInfo.CountNum || 0} />
            <ul class="tabs flex-row">
              {TABS.map((tab) => {
                return (
                  <li
                    class={[
                      "tab align",
                      { selected: selectedTab === tab.value },
                    ]}
                    key={tab.label}
                    onClick={() => {
                      this.selectedTab = tab.value;
                      this.refresh();
                    }}
                  >
                    {tab.label}
                  </li>
                );
              })}
            </ul>
            <List
              request={this.request}
              pageSize={20}
              renderItem={this.renderItem}
              class="list"
              ref="list"
            />
          </div>
        </StatusHandle>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.integral-2 {
  padding: 0.15rem 0.23rem;
  padding-bottom: 1rem;
  background: $bg;

  .tabs {
    margin: 0.2rem 0;
    height: 0.5rem;
    border-radius: 0.1rem;
    background: #fff;
    .tab {
      flex: 1;
      height: 100%;
      font-size: 0.14rem;
      font-weight: bold;
      color: #333333;
      &.selected {
        background: #5d7dfc;
        color: #fff;
        border-radius: 0.1rem;
      }
    }
  }
  .list {
    height: calc(100% - 1.38rem);
  }
  .item {
    /* height: .77rem; */
    margin-bottom: 0.15rem;
    padding: 0.17rem;
    background: #ffffff;
    border-radius: 0.1rem;
    .name {
      font-size: 0.15rem;
      font-weight: 400;
      color: #333333;
    }
    .time {
      margin-top: 2px;
      font-size: 0.14rem;
      font-weight: 400;
      color: #a3a3a3;
    }
    .value {
      font-size: 0.16rem;
      font-weight: bold;
      &.add {
        color: #f96a08;
      }
      &.minus {
        color: #13a44f;
      }
    }
  }
}
</style>
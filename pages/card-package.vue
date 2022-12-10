<template>
  <Page title="卡包">
    <div class="card-package flex-column page-full">
      <div class="tabs flex-row center">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab', { selected: selected === tab.value }]"
          @click="selected = tab.value"
        >
          {{ tab.label }}
          <img :src="icons.tabSelected" v-if="selected === tab.value" class="border"></img>
        </div>
      </div>
      <List
        :request="request"
        :pageSize="20"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import { LoadingControl, formatTime, size } from "@/utils";
import { get, mock } from "@/api/http";
import { icons } from "@/assets";
import Coupon from "@/components/Coupon";
const API = {
  LIST(params) {
    return get("/Api/getCardList_api.php", params);
  },
  MODIFY(params) {
    console.log(params, "params");
    return get("/Api/setShopCats_api.php", params);
  },
};
export const TYPE = {
  ORDER: "order",
};
export default {
  name: "card-package",
  head() {
    return {
      title: "卡包",
    };
  },
  data() {
    return {
      icons,
      selected: "1",
      tabs: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "未使用",
          value: "1",
        },
        // {
        //   label: "已使用",
        //   value: "2",
        // },
        {
          label: "已过期",
          value: "-1",
        },
      ],
    };
  },
  watch: {
    selected() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
  },
  methods: {
    request(params) {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      return API.LIST({
        ...params,
        isUse: this.selected,
      });
    },
    renderItem(item) {
      const { gid, gbid, gName, gImg, bName, theNum, thePrice } = item;
      const key = `${gid}-${gbid}`;
      return <Coupon class="item" key={key} data={item} type={this.selected} />;
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.card-package {
  position: relative;
  background: $color8;
  /* padding-bottom: 0.5rem; */
  .tabs {
    height: 0.5rem;
    justify-content: space-around;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    .tab {
      position: relative;
      line-height: 0.5rem;
      font-size: 0.15rem;
      color: $color6;
      &.selected {
        font-size: 0.17rem;
        font-weight: bold;
        color: #2a2a2a;
      }
      .border {
        position: absolute;
        left: 50%;
        bottom: -0.07rem;
        width: 0.26rem;
        height: auto;
        margin-left: -0.13rem;
      }
    }
  }
  .list {
    flex: 1;
    padding: 0.15rem;
    .item {
      margin-bottom: 0.15rem;
    }
  }
}
</style>
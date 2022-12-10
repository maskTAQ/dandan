<template>
  <Page title="购物车">
    <div class="shopping-cart page-full">
      <van-button
        type="primary"
        size="mini"
        @click="isView = !isView"
        class="operation"
        >{{ isView ? "管理" : "完成" }}</van-button
      >
      <List
        :request="request"
        :pageSize="20"
        :renderItem="renderItem"
        class="list"
        ref="list"
        @change="handleListChange"
      />
      <van-submit-bar
        v-if="isView"
        :price="price"
        button-text="提交订单"
        @submit="onSubmit"
      >
        <van-checkbox
          :value="isAllChecked"
          @click="hanldeAllCheckedChange"
          checked-color="#4d6eff"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <div v-else class="edit-bar flex-row main-between center">
        <van-checkbox
          :value="isAllChecked"
          @click="hanldeAllCheckedChange"
          checked-color="#4d6eff"
          >全选</van-checkbox
        >
        <van-button
          :loading="loading.delete"
          @click="batchDelete"
          class="delete"
          >删除</van-button
        >
      </div>
    </div>
  </Page>
</template>
<script>
import { LoadingControl, formatTime, size, Tip } from "@/utils";
import { get, mock } from "@/api/http";
const API = {
  LIST(params) {
    return get("/Api/getShopCatsList_api.php", params);
  },
  MODIFY(params) {
    console.log(params, "params");
    return get("/Api/setShopCats_api.php", params);
  },
  BATCH_DEELTE(params) {
    return get("/Api/delShopCats_api.php", params);
  },
};
function sum(arr) {
  let len = arr.length;
  if (len == 0) {
    return 0;
  } else if (len == 1) {
    return arr[0];
  } else {
    return arr[0] + sum(arr.slice(1));
  }
}
export default {
  name: "shopping-cart",
  head() {
    return {
      title: "购物车",
    };
  },
  data() {
    return {
      loading: {},
      checkedList: [],
      list: [],
      isView: true, //edit
    };
  },
  computed: {
    isAllChecked() {
      console.log(this.list, "this.list");
      return this.list.every((item) => this.checkedList.includes(item.sid));
    },
    price() {
      console.log(this.list, "this.list");
      const goodsPriceList = this.list
        .filter((item) => this.checkedList.includes(item.sid))
        .map(({ thePrice, theNum }) => theNum * thePrice * 100 || 0);
      return sum(goodsPriceList);
    },
  },
  methods: {
    request(params) {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      return API.LIST(params);
    },
    renderItem(item) {
      const { sid, gName, gImg, bName, theNum, thePrice } = item;
      const key = sid;
      return (
        <div key={key} class="item flex-row center">
          <van-checkbox
            checked-color="#FF4938"
            value={this.checkedList.includes(key)}
            onClick={() => {
              const index = this.checkedList.indexOf(key);
              if (index > -1) {
                this.checkedList.splice(index, 1);
              } else {
                this.checkedList.push(key);
              }
            }}
          />
          <div class="right flex-row">
            <div
              class="img"
              style={{ background: `url('${gImg}') no-repeat center / cover` }}
            />
            <div class="full flex-column main-between">
              <div class="info">
                <p class="name">{gName}</p>
                <i class="type">{bName}</i>
              </div>
              <div class="bottom flex-row main-between center">
                <div class="price">
                  <i class="unit">￥</i>
                  <i class="value">{thePrice}</i>
                </div>
                {this.loading[key] ? (
                  <van-loading size="small" />
                ) : (
                  <van-stepper
                    value={theNum}
                    async-change
                    min="0"
                    onChange={(v) => {
                      LoadingControl({
                        call: API.MODIFY,
                        params: { ...item, theNum: v },
                        change: ({ loading }) => {
                          this.$set(this.loading, key, loading);
                        },
                      }).then((res) => {
                        item.theNum = v;
                        if (+v === 0) {
                          this.$refs.list.refresh();
                        }
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    handleListChange(v) {
      console.log(v, "v");
      this.list = v;
    },
    hanldeAllCheckedChange() {
      if (this.isAllChecked) {
        this.checkedList = [];
      } else {
        this.checkedList = this.list.map((item) => item.sid);
      }
    },
    batchDelete() {
      console.log(this.checkedList);
      LoadingControl({
        call: API.BATCH_DEELTE,
        params: {
          sidList: this.checkedList.join(","),
        },
        change: ({ loading }) => {
          this.$set(this.loading, "delete", loading);
        },
      }).then((res) => {
        Tip.success("删除成功");
        this.isView = true;
        this.$refs.list.refresh();
      });
    },
    onSubmit() {
      //
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.shopping-cart {
  position: relative;
  background: $color8;
  padding-bottom: 0.5rem;
  .operation {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    z-index: 999;
  }
  .list {
    height: 100%;
    padding: 0.16rem 0.12rem;
  }
  .item {
    margin-bottom: 0.12rem;
    padding: 0.16rem 0.12rem;
    background: #fff;
    border-radius: 4px;
    .right {
      flex: 1;
    }
    .img {
      margin: 0 0.12rem;
      width: 0.8rem;
      height: 0.8rem;
      border: 1px solid red;
    }
    .full {
      flex: 1;
    }
    .name {
      font-size: 0.16rem;
      color: $color4;
    }
    .type {
      margin-top: 0.06rem;
      height: 0.22rem;
      line-height: 0.22rem;
      padding: 0 0.13rem;
      font-size: 0.12rem;
      color: $color6;
      background: rgba($color: $color6, $alpha: 0.08);
    }
    .bottom {
      margin-top: 0.2rem;
      width: 100%;
    }
    .price {
      color: $color3;
      font-weight: bold;
      .unit {
        font-size: 0.12rem;
      }
      .value {
        font-size: 0.14rem;
      }
    }
  }
  .edit-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.5rem;
    padding: 0 0.16rem;
    background: #fff;
    .van-checkbox__label {
      font-size: 0.14rem;
    }
    .delete {
      height: 0.32rem;
      padding: 0 0.2rem;
      font-size: 0.14rem;
      color: $color1;
      border: 1px solid $color1;
      border-radius: 0.2rem;
    }
  }
}
</style>
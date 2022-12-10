<template>
  <Page title="订单列表">
    <div class="order-list flex-column page-full">
      <Tabs :value="selected" @change="select" :data="tabs" />

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
import { LoadingControl, formatTime, size, Tip, router } from "@/utils";
import { get, mock } from "@/api/http";
import { icons, img } from "@/assets";
import { LIVE_STATUS } from "@/constant";
const API = {
  LIST(params) {
    return get("/Api/getOrderList_api.php", params);
  },
  CONFIRM(params) {
    return get("/Api/toOrder_api.php", params);
  },
  CANCEL(params) {
    return get("/Api/setOrderFlag_api.php", params);
  },
  REQUEST_PAY(params) {
    return get("/Api/MeterRecharge_api.php", params);
  },
};

const COLOR = {
  WAIT_PAY: "#FF6C5E",
  COMPLETE: "#ECB172",
};
const STATUS = {
  1: "待处理",
  2: "待付款",
  3: "进行中",
  4: "退款",
  5: "已失效",
  6: "已完成",
  CANCEL: "5",
};
//已失效 删除待付款文字和箭头
const CHILD_ORDER_STATUS = {
  1: "待付款",
  2: "已付款待确认",
  //   3: "待服务",
  4: "服务中",
  5: "退款申请中",
  6: "退款中",
  7: "已退款",
  9: "完成",
  WAIT_PAY: "1",
  PAID_WAIT_CONFIRM: "2",
  WAIT_SERVICE: "3",
  SERVING: "4",
  APPLY_REFOUND: "5",
  REFOUNDING: "6",
  REFOUNDED: "7",
  COMPLETE: "9",
};
export default {
  name: "order-list",
  head() {
    return {
      title: "订单列表",
    };
  },
  data() {
    return {
      tabs: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "待付款",
          value: "2",
        },
        {
          label: "待服务",
          value: "1",
        },
        {
          label: "服务中",
          value: "3",
        },
        {
          label: "已完成",
          value: "6",
        },
      ],
      fields: [
        {
          label: "移植前期",
          key: "",
        },
        {
          label: "移植期",
          key: "",
        },
        {
          label: "促排前期",
          key: "",
        },
        {
          label: "促排期",
          key: "",
        },
        {
          label: "尾款",
          key: "",
        },
      ],
      loading: {
        // [key]:value
      },
    };
  },
  created() {
    if (process.browser) {
      const { code } = this.$route.query;
      if (code) {
        this.requestPay(code);
      }
    }
  },
  watch: {
    selected() {
      this.refresh();
    },
  },
  computed: {
    selected() {
      return this.$route.query.status || "";
    },
  },
  methods: {
    requestPay(code) {
      const { href, search } = location;
      API.REQUEST_PAY({
        code,
        notifyUrl: href.replace(search, ""),
        oid: Date.now(),
      })
        .then(onBridgeReady)
        .then((res) => {
          Tip.success("支付成功");
          router.push({
            path: "/order-list",
            query: {
              status: "success",
            },
          });
        })
        .catch((e) => {
          Tip.success("支付失败");
          router.push({
            path: "/order-list",
            query: {
              status: "error",
            },
          });
        });
    },
    select(tab) {
      router.replace({
        query: {
          status: tab,
        },
      });
    },
    request(params) {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      return API.LIST({ ...params, Flag: this.selected });
    },
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    cancel(params) {
      LoadingControl({
        call: API.CANCEL,
        params: {
          ...params,
          Flag: STATUS.CANCEL,
        },
        change: ({ loading }) => {
          // this.loading = loading;
          this.$set(this.loading, `${params.oid}-cancel`, loading);
        },
      })
        .then((res) => {
          Tip.success("取消成功");
          this.refresh();
        })
        .catch((e) => {
          console.log(e, "e");
        });
    },
    pay(params) {
      const {
        gid,
        gbid,
        buyNum: theNum,
        iid,
        aid,
        cid,
        cid2,
        orderNo,
      } = params;
      const { origin, pathname } = window.location;
      LoadingControl({
        call: API.CONFIRM,
        params: {
          gid,
          gbid,
          theNum,
          iid,
          aid,
          cid,
          cid2,
          orderNo,
          redirect_uri: origin + pathname,
        },
        change: ({ loading }) => {
          // this.loading = loading;
          this.$set(this.loading, `${params.oid}-pay`, loading);
        },
      }).then((res) => {
        const { oid, rUrl } = res;
        window.location.href = res.rUrl;
      });
    },
    goOrderDetail(query) {
      localStorage.setItem("order.detail.query", JSON.stringify(query));
      router.push({
        path: "/order-detail",
      });
    },
    renderItem(item) {
      const {
        oid,
        gid,
        gbid,
        gName,
        gImg,
        gTag = "",
        theNum,
        thePrice,
        orderTime,
        orderNo,
        Flag,
        goodsName,
        bName,
        OrderAmt,
        itemData,
      } = item;
      const [firstOrder = {}, ...orderList] = itemData || [{}];
      return (
        <div key={oid} class="item">
          <div class="top flex-row main-between center">
            <i class="time text-1">
              {orderTime} 订单号 {orderNo}
            </i>
            <i class="status" style={{ color: COLOR.WAIT_PAY }}>
              {STATUS[Flag]}
            </i>
          </div>
          <div class="flex-row">
            <div
              class="img"
              style={{ background: `url('${gImg}') no-repeat center / cover` }}
            />
            <div>
              <p class="title">{goodsName}</p>
              <p class="subtitle">{bName}</p>
              <div class="tag-list flex-row center">
                {gTag.split(";").map((tag) => {
                  return (
                    <div key={tag} class="tag">
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              this.goOrderDetail({
                oid,
                id: firstOrder.oiid,
              });
            }}
            class="line flex-row main-between center"
          >
            <i class="label">{firstOrder.itemName}</i>
            <div class="flex-row center">
              <i class="value">￥{firstOrder.itemAmt}</i>
              <i class="status" style={{ color: COLOR.COMPLETE }}>
                {+Flag === 5 ? "" : CHILD_ORDER_STATUS[firstOrder.itemFlag]}
              </i>
              <img src={icons.right} class="icon" />
            </div>
          </div>

          {firstOrder.Remark && <div class="hint">{firstOrder.Remark}</div>}
          {(orderList || []).map(
            ({ oiid, itemid, itemName, itemAmt, itemFlag, Remark }) => {
              return (
                <div>
                  <div
                    onClick={() => {
                      this.goOrderDetail({
                        oid,
                        id: oiid,
                      });
                    }}
                    key={itemid}
                    class="line flex-row main-between center"
                  >
                    <i class="label">{itemName}</i>
                    <div class="flex-row center">
                      <i class="value">（{itemAmt})</i>
                      <i class="status" style={{ color: COLOR.COMPLETE }}>
                        {+Flag === 5 ? "" : CHILD_ORDER_STATUS[itemFlag]}
                      </i>
                      <img src={icons.right} class="icon" />
                    </div>
                  </div>
                  {Remark && <div class="hint">{Remark}</div>}
                </div>
              );
            }
          )}
          {+Flag === 2 && (
            <div class="bottom flex-row center">
              <van-button
                loading={this.loading[`${oid}-cancel`]}
                onClick={() => this.cancel(item)}
                class="cancel"
              >
                取消订单
              </van-button>
            </div>
          )}
        </div>
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/theme.scss";

.order-list {
  position: relative;
  background: $color8;
  background: #f2f3f8;
  .tabs {
     background: #ffffff;
  }
  .list {
    flex: 1;
    height: 0;
    padding: 0.16rem 0.12rem;
    .item {
      margin-bottom: 0.14rem;
      padding: 0.13rem 0.15rem;
      background: #ffffff;
      border-radius: 8px;
      .top {
        margin-bottom: 0.1rem;
      }
      .status {
        font-size: 0.14rem;
      }
      .img {
        margin-right: 0.06rem;
        width: 1.2rem;
        height: 0.8rem;
      }
      .text-1 {
        font-size: 0.12rem;
        color: $color4;
      }
      .title {
        font-size: 0.16rem;
        color: $color4;
        font-weight: bold;
      }
      .subtitle {
        margin: 0.02rem 0;
        font-size: 0.12rem;
        color: $color15;
      }

      .tag-list {
        flex-wrap: wrap;
        .tag {
          margin-top: 0.04rem;
          margin-right: 0.04rem;
          padding: 0 0.06rem;
          height: 0.18rem;
          line-height: 0.18rem;
          background: rgba($color: $color1, $alpha: 0.08);
          font-size: 0.09rem;
          color: $color1;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .line {
        padding: 0.1rem 0;
        font-size: 0.14rem;
        .label {
          color: $color16;
        }
        .value {
          color: $color17;
        }
        .status {
          margin: 0 0.07rem;
        }
        .icon {
          width: 0.1rem;
        }
      }
      .hint {
        padding: 0.07rem 0.11rem;
        font-size: 0.12rem;
        color: $color19;
        background: $color18;
      }
      .bottom {
        margin-top: 0.07rem;
        justify-content: flex-end;
        .cancel {
          font-size: 0.12rem;
          color: $color20;
          border: none;
          padding: 0;
        }
        .pay {
          height: 0.3rem;
          padding: 0 0.23rem;
          line-height: 0.3rem;
          font-size: 0.12rem;
          color: #ffffff;
          background: $color1;
          border-radius: 0.17rem;
        }
      }
    }
  }
}
</style>
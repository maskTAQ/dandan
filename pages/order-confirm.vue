<template>
  <Page title="订单确认">
    <div class="order-confirm-box page-full">
      <StatusHandle :get="getPreData">
        <div class="order-confirm page-full">
          <p class="no">订单号： {{ data.orderNo }}</p>
          <div class="goods-card card">
            <CoverImage :url="cover" class="cover" />
            <div class="card-info flex-column main-between">
              <div>
                <p class="name">{{ data.goodsName }}</p>
                <p class="type-name">{{ data.bName }}</p>
              </div>
              <div class="flex-row">
                <span class="label">优惠</span>
                <span class="value">优惠</span>
                <span class="label">总计</span>
                <span class="price">￥{{ data.cardAmt }}</span>
              </div>
            </div>
          </div>
          <SimpleGroup title="价格明细" titleColor="rgba(0, 188, 197, 0.8)">
            {{ steps.others }}
          </SimpleGroup>
          <SimpleGroup title="积分钱包" titleColor="rgba(0, 188, 197, 0.8)">
            <div class="jf-box flex-row main-between">
              <div>
                <p class="label">积分（12321分）</p>
                <p class="remark">提交订单后积分值自动扣除</p>
              </div>
              <p class="value">-20</p>
            </div>
          </SimpleGroup>
          <SimpleGroup
            title="选择优惠"
            titleColor="rgba(0, 188, 197, 0.8)"
            more
            @more="goCardPackage"
          >
            <div class="jf-box flex-row main-between">
              <div>
                <p class="label">优惠券</p>
                <p class="remark">优惠券的描述新客户专用</p>
              </div>
              <p class="value">-￥{{ data.cardValue }}</p>
            </div>
          </SimpleGroup>
          <SimpleGroup
            title="开具发票"
            titleColor="rgba(0, 188, 197, 0.8)"
            more
          >
            <!-- v-if="!!+data.isInv" -->
            <div class="invoice-card card">
              <div class="flex-row main-between center">
                <i class="label">开具发票</i>
                <van-checkbox
                  v-model="params.invoice"
                  checked-color="#1ebcc4"
                  shape="square"
                />
              </div>
              <div v-if="params.invoice" class="address">
                <div
                  v-if="invoice"
                  @click="selectedInvoice"
                  class="info flex-row center"
                >
                  <img :src="icons.invoice" alt="" class="icon" />
                  <div class="full flex-row main-between center">
                    <div>
                      <div class="flex-row center">
                        <i class="name" style="width: 0.8rem">发票抬头</i>
                        <i class="mobile"> {{ invoice.invName }}</i>
                      </div>
                      <div class="flex-row center">
                        <i class="name" style="width: 0.8rem">税号</i>
                        <i class="mobile"> {{ invoice.invBankNo }}</i>
                      </div>
                    </div>
                    <img :src="icons.right" alt="" class="right" />
                  </div>
                </div>
                <div v-else class="no-selected" @click="selectedInvoice">
                  <p class="label">暂无开票信息 请添加开票信息</p>
                  <img :src="icons.right" alt="" class="icon" />
                </div>
              </div>
            </div>
          </SimpleGroup>

          <div v-if="false" class="goods-card card">
            <p class="title" style="margin-bottom: 0.13rem">买赠活动</p>
            <div class="flex-row">
              <div
                class="img"
                :style="{
                  background: `url('${cover}') no-repeat center / cover`,
                }"
              />
              <div>
                <p class="title">{{ data.goodsName }}</p>
                <p class="subtitle">{{ data.bName }}</p>
                <div class="text flex-row main-between center">
                  <i>首笔定金</i>
                  <i>¥2555.20</i>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!!+data.buycid" class="gift-coupon-card card">
            <p class="title">买赠活动</p>
            <Coupon
              :data="{
                cardName: data.cardName2,
                cardValue: data.cardValue2,
                overTime: data.overTime2,
              }"
              :use="false"
            />
          </div>
          <div v-if="isNeedAddress" class="address card">
            <p class="title">收货地址 <i class="required">*</i></p>
            <div
              v-if="address"
              @click="selectedAddress"
              class="info flex-row center"
            >
              <img :src="icons.address" alt="" class="icon" />
              <div class="full flex-row main-between center">
                <div>
                  <div class="flex-row center">
                    <i class="name">{{ address.mailPeople }}</i>
                    <i class="mobile"> {{ address.mailTel }}</i>
                  </div>
                  <p class="value">{{ address.mailAdd }}</p>
                </div>
                <img :src="icons.right" alt="" class="right" />
              </div>
            </div>
            <div v-else class="no-selected" @click="selectedAddress">
              <p class="label">暂无地址 请添加收货地址</p>
              <img :src="icons.right" alt="" class="icon" />
            </div>
          </div>

          <OrderForm v-model="data.otherForm" :handleSubmit="saveForm" />
          <div class="pay-method card">
            <p class="title">支付方式</p>
            <div class="flex-row main-between center">
              <div class="flex-row">
                <img :src="icons.wepay" alt="" class="icon" />
                <i class="label">微信支付</i>
              </div>
              <van-checkbox
                value="true"
                checked-color="#1ebcc4"
                shape="square"
              />
            </div>
          </div>
          <div class="pay-bar flex-row main-between center">
            <div class="flex-row center">
              <div @click="call('13715054911')" class="btn flex-column align">
                <img class="icon" :src="icons.mobile" alt="" />
                <i class="label">电话咨询</i>
              </div>
              <div class="btn flex-column align">
                <img class="icon" :src="icons.kf2" alt="" />
                <i @click="goKf('goods')" class="label">客服</i>
              </div>
            </div>
            <div class="right flex-row center">
              <i class="label">合计:</i>
              <div class="price flex-row center">
                <i class="unit">￥</i>
                <i class="value">{{ data.cardAmt }}</i>
              </div>
              <van-button :loading="loading" @click="confirm" class="confirm"
                >支付金额</van-button
              >
            </div>
          </div>
        </div>
      </StatusHandle>
    </div>
  </Page>
</template>
<script>
import { mapState } from "vuex";
import day from "dayjs";
import { mock, get, post } from "@/api/http";
import GoodsCard from "@/components/GoodsCard";
import OrderForm from "@/components/OrderForm";
import { icons } from "@/assets";
import {
  LoadingControl,
  Tip,
  onBridgeReady,
  router,
  call,
  goKf,
} from "@/utils";
import { TYPE } from "./card-package";
const API = {
  PRE_DATA(params) {
    return get("/Api/getNoOrderInfo_api.php", params);
  },
  CONFIRM(params) {
    return get("/Api/toOrder_api.php", params);
  },
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  REQUEST_PAY(params) {
    return get("/Api/MeterRecharge_api.php", params);
  },
  SAVE_FORM(params) {
    return post("/Api/saveOther_api.php", params, { json: false });
  },
};
export default {
  name: "order-confirm",
  head() {
    return {
      title: "订单确认",
    };
  },
  data() {
    return {
      icons,
      data: {},
      loading: false,
      params: {
        invoice: false,
        name: "",
        fullAddr: "",
        date: null,
        time: "",
        fileList: [],
      },
      picker: {
        visible: false,
        value: null,
        title: "",
      },
    };
  },
  created() {
    if (process.browser) {
      if (!this.goods) {
        router.replace({
          path: "/mall",
        });
      } else {
        const { code } = this.query;
        if (code) {
          this.requestPay(code);
        }
        this.$store.dispatch("getAddressList");
        this.$store.dispatch("getInvoiceList");
        if (this.selected.invoice) {
          this.params.invoice = true;
        }
      }
    }
  },
  computed: {
    ...mapState(["addressList", "invoiceList", "selected"]),
    query() {
      return this.$route.query;
    },
    cover() {
      const { gImg } = this.data;
      return Array.isArray(gImg) ? gImg[0] : gImg;
    },
    goods() {
      return process.browser ? JSON.parse(localStorage.getItem("goods")) : null;
    },
    time() {
      const { orderTime } = this.data;
      return orderTime
        ? day(orderTime * 1000).format("YYYY/MM/DD HH:mm:ss")
        : "";
    },
    selectedDate() {
      const { date } = this.params;
      return date ? day(date).format("YYYY/MM/DD") : "回访日期";
    },
    isNeedAddress() {
      return this.data.isMail === "1";
    },
    addressId() {
      const { address } = this.selected;
      return address ? address.aid : this.data.aid;
    },
    address() {
      const {
        addressList: { data },
        addressId,
      } = this;
      return (data || []).find((item) => item.aid === addressId);
    },
    invoiceId() {
      const { invoice } = this.selected;
      return invoice ? invoice.iid : this.data.iid;
    },
    invoice() {
      const {
        invoiceList: { data },
        invoiceId,
      } = this;
      return (data || []).find((item) => item.iid === invoiceId);
    },
    steps() {
      const itemData = [...(this.data.itemData || [])];
      const first = itemData.shift();
      return {
        first,
        others: itemData,
      };
    },
    itemName() {
      try {
        return this.data.itemData[0].itemName;
      } catch {
        return "";
      }
    },
  },
  methods: {
    call,
    goKf,
    requestPay(code) {
      const { href, search } = location;
      API.REQUEST_PAY({
        code,
        notifyUrl: href
          .replace(search, "")
          .replace("order-confirm", "order-list"),
        oid: localStorage.getItem("oid"),
      })
        .then(onBridgeReady)
        .then((res) => {
          Tip.success("支付成功");
          router.replace({
            path: "/order-list",
            query: {
              status: "success",
            },
          });
        })
        .catch((e) => {
          console.log(e, "e");
          Tip.success("支付失败");
          router.replace({
            path: "/order-list",
          });
        })
        .finally(() => {
          localStorage.setItem("oid", "");
        });
    },
    saveForm() {
      const { orderNo, gbid, otherForm } = this.data;
      return API.SAVE_FORM({
        orderNo,
        gbid,
        OtherJson: otherForm,
      });
    },
    confirm() {
      const {
        isNeedAddress,
        address,
        invoice,
        params,
        data: {
          gid,
          gbid,
          buyNum: theNum,
          orderNo,
          cardid: cid,
          cardid2: cid2,
        },
        params: { name, fullAddr, fileList, date, time },
      } = this;
      if (isNeedAddress && !address) {
        return Tip.error("请选择地址");
      }
      if (params.invoice && !invoice) {
        return Tip.error("请选择开票信息");
      }

      const { origin, pathname } = window.location;

      LoadingControl({
        call: API.CONFIRM,
        params: {
          gid,
          gbid,
          theNum,
          iid: params.invoice ? invoice.iid : "",
          aid: isNeedAddress ? address.aid : "",
          cid,
          cid2,
          orderNo,
          redirect_uri: `${origin}${pathname}`,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        const { oid, rUrl } = res;
        if (rUrl) {
          this.saveOrderInfo(oid);
          window.location.href = `${res.rUrl}`;
        } else {
          router.replace({
            path: "/order-list",
          });
        }
      });
    },
    saveOrderInfo(oid) {
      localStorage.setItem("oid", oid);
      localStorage.setItem("order.data", JSON.stringify(this.data));
      localStorage.setItem("order.params", JSON.stringify(this.params));
      localStorage.setItem("order.selected", JSON.stringify(this.selected));
    },
    getPreData() {
      if (!this.goods) {
        return Promise.resolve({});
      }
      return API.PRE_DATA(this.goods).then((res) => {
        //如果是微信支付重定向来的
        if (this.query.code) {
          const data = localStorage.getItem("order.data");
          const params = localStorage.getItem("order.params");
          const selected = localStorage.getItem("order.selected");
          console.log("从本地取参数");
          try {
            this.data = { ...res, ...JSON.parse(data) };
            this.params = JSON.parse(params);
            this.$store.commit("setSelected", JSON.parse(selected));
          } catch (e) {
            this.data = res;
          }
        } else {
          this.data = res;
        }
        return res;
      });
    },
    goCardPackage() {
      router.push({
        path: "/card-package",
        query: {
          from: TYPE.ORDER,
        },
      });
    },
    selectedAddress() {
      router.push({
        path: "/address",
        query: {
          from: "order",
        },
      });
    },
    selectedInvoice() {
      router.push({
        path: "/invoice",
        query: {
          from: "order",
        },
      });
    },
  },
  components: {
    OrderForm,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.order-confirm-box {
  padding-bottom: 0.45rem;
  background: #fff;
  .order-confirm {
    padding: 0.12rem;
  }
  .card {
    padding: 0.13rem 0.15rem;
    background: #ffffff;
    border-radius: 8px;
    .title {
      width: 100%;
      font-size: 0.15rem;
      font-weight: bold;
      color: #5d5d5d;
      .required {
        color: #d81e06;
      }
    }
  }

  .goods-card {
    height: 1.22rem;
    .cover{
      width: 1.22rem;
      height: 1.22rem;
    }
  }
  .jf-box {
    .label {
      font-size: 0.16rem;
      font-weight: 500;
      color: rgb(85, 85, 85);
    }
    .remark {
      margin-top: 0.05rem;
      font-size: 0.12rem;
      font-weight: 500;
      color: rgba(126, 126, 126, 0.5);
    }
    .value {
      font-size: 0.14rem;
      color: rgb(85, 85, 85);
    }
  }
  .use-coupon {
    margin-bottom: 0.13rem;
    padding: 0.15rem 0.12rem;
    .label {
      font-size: 0.15rem;
      color: #5d5d5d;
    }
    .price {
      .value {
        font-size: 0.15rem;
        font-weight: bold;
        color: #ff4938;
      }
      .icon {
        margin-left: 0.08rem;
        width: 0.12rem;
        height: auto;
      }
    }
  }
  .gift-coupon-card {
    margin: 0.13rem 0;
    .title {
      margin-bottom: 0.02rem;
    }
  }
  .address {
    .info {
      padding-top: 0.14rem;
      .icon {
        margin-right: 0.13rem;
        width: 0.22rem;
      }
      .full {
        width: 0;
        flex: 1;
        .name {
          font-size: 0.15rem;
          font-weight: bold;
          color: #292828;
        }
        .mobile {
          font-size: 0.13rem;
          color: #292828;
        }
        .value {
          margin-top: 0.09rem;
          font-size: 0.13rem;
          color: #565656;
        }
        .right {
          width: 0.13rem;
        }
      }
    }
    .no-selected {
      margin-top: 0.17rem;
      position: relative;
      .label {
        font-size: 0.15rem;
        line-height: 0.3rem;
        color: #b6b6b6;
        text-align: center;
      }
      .icon {
        position: absolute;
        top: 0.08rem;
        right: 0.13rem;
        width: 0.13rem;
      }
    }
  }
  .invoice-card {
    margin: 0.13rem 0;
    .label {
      font-size: 0.15rem;
      color: #5d5d5d;
    }
  }

  .pay-method {
    margin-top: 0.13rem;
    .title {
      margin-bottom: 0.17rem;
    }
    .icon {
      margin-right: 0.09rem;
      width: 0.22rem;
      height: 0.22rem;
    }
    .label {
      font-size: 0.15rem;
      color: #5d5d5d;
    }
  }
  .pay-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.45rem;
    padding: 0 0.12rem;
    background: #fff;
    box-shadow: 0px -1px 12px 0px rgba(76, 135, 249, 0.05);
    .btn {
      &:first-child {
        margin-right: 0.1rem;
      }
      .icon {
        margin-bottom: 3px;
        width: 0.18rem;
      }
      .label {
        font-size: 0.12rem;
        color: $color6;
      }
    }
    .right {
      font-size: 0.13rem;
      color: #545454;
    }
    .price {
      color: #ff4938;
      .unit {
        font-size: 0.13rem;
      }
      .value {
        font-size: 0.17rem;
      }
    }
    .confirm {
      margin-left: 0.13rem;
      height: 0.33rem;
      padding: 0 0.2rem;
      font-size: 0.15rem;
      color: #fff;
      border-radius: 0.17rem;
      background: $color1;
    }
  }
}
</style>
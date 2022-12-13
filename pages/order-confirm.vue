<template>
  <Page title="订单确认">
    <div class="order-confirm-box page-full">
      <StatusHandle :get="getPreData">
        <div class="order-confirm page-full">
          <div class="flex-row main-between center">
            <span class="no">订单号： {{ data.orderNo }}</span>
          </div>

          <div class="goods-card flex-row">
            <CoverImage :url="cover" class="cover" />
            <div class="goods-info flex-column main-between">
              <div>
                <p class="name">{{ data.goodsName }}</p>
                <p class="type-name">{{ data.bName }}</p>
              </div>
              <div class="flex-row text">
                <span class="label">优惠</span>
                <span class="value">优惠</span>
                <span class="label">总计</span>
                <span class="price">￥{{ data.cardAmt }}</span>
              </div>
            </div>
          </div>
          <SimpleGroup
            title="价格明细"
            titleColor="rgba(0, 188, 197, 0.8)"
          >
            <ul class="goods-item-list">
              <li
                class="goods-item flex-row main-between"
                v-for="item in data.itemData"
                :key="item.itemid"
              >
                <div>
                  <p class="name">{{ item.itemName }}</p>
                  <p class="remark">{{ item.Remark }}</p>
                </div>
                <div>
                  <p class="price">￥{{ item.itemPrice }}</p>
                  <p class="status">{{ ORDER_STATUS[item.Flag] }}</p>
                </div>
              </li>
            </ul>
          </SimpleGroup>
          <SimpleGroup
            title="积分钱包"
            titleColor="rgba(0, 188, 197, 0.8)"
            link
            border
            @more="go({ path: '/integral' })"
          >
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
            link
            border
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
            border
          >
            <van-checkbox
              slot="headright"
              v-model="params.invoice"
              checked-color="rgba(0, 188, 197, 0.8)"
              icon-size=".16rem"
              shape="round"
            />
            <!-- v-if="!!+data.isInv" -->
            <div v-if="params.invoice" class="invoice-card">
              <div
                v-if="invoice"
                @click="selectedInvoice"
                class="invoice-card flex-row main-between center"
              >
                <div>
                  <p class="name">
                    {{ invoice.invType === "1" ? "个人发票" : "企业发票" }}
                  </p>
                  <p class="value">{{ invoice.invName }}</p>
                  <p class="mobile">{{ invoice.invBankNo }}</p>
                </div>
                <img :src="icons.right" alt="" class="right" />
              </div>
              <div v-else class="align" @click="selectedInvoice">
                <van-empty description="暂无开票信息 请添加开票信息" />
              </div>
            </div>
          </SimpleGroup>
          <SimpleGroup
            v-if="isNeedAddress"
            title="地址选择"
            titleColor="rgba(0, 188, 197, 0.8)"
            border
          >
            <div
              v-if="address"
              @click="selectedAddress"
              class="address-card flex-row main-between center"
            >
              <div>
                <p class="name">{{ address.mailPeople }}</p>
                <p class="value">{{ address.mailAdd }}</p>
                <p class="mobile">{{ address.mailTel }}</p>
              </div>
              <img :src="icons.right" alt="" class="right" />
            </div>
            <div v-else class="align" @click="selectedAddress">
              <van-empty description="暂无地址 请添加收货地址" />
            </div>
          </SimpleGroup>

          <OrderForm v-model="data.otherForm" :handleSubmit="saveForm" />
          <SimpleGroup
            title="支付方式"
            titleColor="rgba(0, 188, 197, 0.8)"
            border
          >
            <ul class="pay-method-list">
              <li class="pay-method-item flex-row main-between center">
                <div class="flex-row">
                  <img :src="icons.wepay" alt="" class="icon" />
                  <i class="label">微信支付</i>
                </div>
                <van-checkbox
                  icon-size="0.14rem"
                  value="true"
                  checked-color="rgba(0, 188, 197, 0.8)"
                />
              </li>
            </ul>
          </SimpleGroup>

          <div class="pay-bar flex-row main-between center">
            <div>
              <p class="label">当前支付</p>
              <p class="price">￥{{ data.cardAmt }}</p>
            </div>
            <van-button
              :loading="loading"
              @click="confirm"
              class="confirm algin"
              >支付金额</van-button
            >
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
import { ORDER_STATUS } from "@/constant";
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
      ORDER_STATUS,
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
    go(params) {
      router.push(params);
    },
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
@import "@/assets/theme.scss";
.order-confirm-box {
  padding-bottom: 0.8rem;
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
  .no {
    font-size: 0.14rem;
    color: rgb(85, 85, 85);
  }
  .goods-card {
    margin-top: 0.27rem;
    height: 1.22rem;
    border: 1px solid rgb(232, 243, 241);
    border-radius: 0.11rem;
    overflow: hidden;
    .cover {
      width: 1.22rem;
      height: 1.22rem;
    }
    .goods-info {
      padding-left: 0.1rem;
      padding-top: 0.1rem;
      .text {
        position: relative;
        top: 0.1rem;
      }
      .name {
        font-size: 0.18rem;
        font-weight: 600;
        line-height: 0.22rem;
        color: rgb(16, 22, 35);
      }
      .type-name {
        margin-top: 0.1rem;
        font-size: 0.12rem;
        font-weight: 500;
        color: rgb(173, 173, 173);
      }
      .label {
        font-size: 0.12rem;
        color: rgba(51, 51, 51, 0.51);
      }
      .value {
        font-size: 0.12rem;
        font-weight: 600;
        color: rgb(85, 85, 85);
      }
      .price {
        position: relative;
        top: -0.1rem;
        font-size: 0.22rem;
        font-weight: 600;
        color: rgb(16, 22, 35);
      }
    }
  }
  .goods-item-list {
    .name {
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
    .price {
      font-size: 0.14rem;
      color: rgb(85, 85, 85);
    }
    .status {
      margin-top: 0.05rem;
      font-size: 0.14rem;
      font-weight: 600;
      color: rgba(51, 51, 51, 0.51);
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
  .invoice-card,
  .address-card {
    align-items: flex-end;
    .name {
      font-size: 0.14rem;
      color: rgb(85, 85, 85);
    }
    .value {
      margin: 0.05rme;
    }
    .value,
    .mobile {
      font-size: 0.14rem;
      color: rgb(85, 85, 85);
    }
    .right {
      width: 0.2rem;
    }
  }
  .invoice-card {
    margin: 0.13rem 0;
    .label {
      font-size: 0.15rem;
      color: #5d5d5d;
    }
  }

  .pay-method-list {
    .pay-method-item {
      height: 0.5rem;
      padding: 0 0.12rem;
      border: 1px solid rgb(232, 243, 241);
      border-radius: 0.11rem;
      .icon {
        margin-right: 0.08rem;
        width: 0.2rem;
      }
      .label {
        font-size: 0.12rem;
        color: rgb(173, 173, 173);
      }
    }
  }
  .pay-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.2rem;
    padding-top: 0.1rem;
    align-items: flex-end;
    background: #fff;
    .label {
      font-size: 0.14rem;
      font-weight: 500;
      color: rgb(173, 173, 173);
    }
    .price {
      font-size: 0.18rem;
      font-weight: 600;
      color: rgb(16, 22, 35);
    }
    .confirm {
      width: 1.92rem;
      height: 0.5rem;
      font-size: 0.14rem;
      font-weight: 500;
      color: #fff;
      border-radius: 0.32rem;
      background: rgb(0, 188, 197);
    }
  }
}
</style>
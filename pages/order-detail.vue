<template>
  <Page title="订单详情">
    <div
      :class="[
        'order-confirm-box page-full',
        { full: data.Flag === STATUS.CANCEL },
      ]"
    >
      <StatusHandle :get="getData" ref="statusHandle">
        <div class="order-confirm page-full">
          <div class="goods-card card">
            <p class="time">{{ time }} 订单号 {{ data.oid }}</p>
            <div class="flex-row">
              <div
                class="img"
                :style="{
                  background: `url('${data.gImg}') no-repeat center / cover`,
                }"
              />
              <div>
                <p class="title">{{ data.goodsName }}</p>
                <p class="subtitle">{{ data.bName }}</p>
                <div v-if="data.gTag" class="tag-list flex-row center">
                  <div class="tag">{{ data.gTag }}</div>
                </div>
              </div>
            </div>
            <div class="line flex-row main-between center">
              <i class="label">{{ data.itemName }}</i>
              <i class="value">￥{{ data.buyPrice }}</i>
            </div>
            <div class="hint">
              {{ data.theTitle }}
            </div>
          </div>
          <div
            v-if="![STATUS.CANCEL, STATUS.WAIT_PAY].includes(data.Flag)"
            class="order-info card"
          >
            <div class="header flex-row main-between center">
              <i class="label">订单信息</i>
              <i class="status">{{ STATUS[data.Flag] }}</i>
            </div>
            <div class="list">
              <div
                v-for="item in infoList"
                :key="item.key"
                class="item flex-row main-between"
              >
                <i class="label">{{ item.label }}</i>
                <i class="value">{{ item.value || data[item.key] }}</i>
              </div>
            </div>
          </div>
          <div
            @click="goCardPackage"
            class="use-coupon card flex-row main-between center"
            v-if="false"
          >
            <i class="label">优惠券</i>
            <div class="price flex-row center">
              <i class="value">￥{{ data.cardValue }}</i>
              <img :src="icons.right" alt="" class="icon" />
            </div>
          </div>
          <div v-if="false" class="goods-card card">
            <p class="title" style="margin-bottom: 0.13rem">买赠活动</p>
            <div class="flex-row">
              <div
                class="img"
                :style="{
                  background: `url('${data.gImg}') no-repeat center / cover`,
                }"
              />
              <div>
                <p class="title">{{ data.goodsName }}</p>
                <p class="subtitle">{{ data.bName }}</p>
                <!-- <div class="text flex-row main-between center">
                <i>首笔定金</i>
                <i>¥2555.20</i>
              </div> -->
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
                <img v-if="isWaitPay" :src="icons.right" alt="" class="right" />
              </div>
            </div>
            <div v-else class="no-selected" @click="selectedAddress">
              <p class="label">暂无地址 请添加收货地址</p>
              <img :src="icons.right" alt="" class="icon" />
            </div>
          </div>
          <!-- 如果是等待支付状态或者已选择开票信息 才会显示这个div -->
          <div v-if="isWaitPay || !!invoiceId" class="invoice-card card">
            <div class="flex-row main-between center">
              <i class="label">开具发票</i>
              <van-checkbox
                v-if="isWaitPay"
                v-model="params.invoice"
                checked-color="#4d6eff"
                shape="square"
              />
              <van-checkbox
                v-else
                :value="!!invoiceId"
                checked-color="#4d6eff"
                shape="square"
              />
            </div>
            <div v-if="params.invoice || invoiceId" class="address">
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
                  <img
                    v-if="isWaitPay"
                    :src="icons.right"
                    alt=""
                    class="right"
                  />
                </div>
              </div>
              <div v-else class="no-selected" @click="selectedInvoice">
                <p class="label">
                  {{ isWaitPay ? "暂无开票信息 请添加开票信息" : "未开票" }}
                </p>
                <img :src="icons.right" alt="" class="icon" />
              </div>
            </div>
          </div>
          <OrderForm
            :readonly="data.Flag === STATUS.COMPLETE"
            v-model="data.OtherJson"
            :handleSubmit="saveForm"
          />
          <div class="pay-method card">
            <p class="title">支付方式</p>
            <div class="flex-row main-between center">
              <div class="flex-row">
                <img :src="icons.wepay" alt="" class="icon" />
                <i class="label">微信支付</i>
              </div>
              <van-checkbox
                value="true"
                checked-color="#4d6eff"
                shape="square"
              />
            </div>
          </div>
          <div v-if="isWaitPay" class="pay-bar flex-row main-between center">
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
              <van-button @click="confirm" class="confirm">支付金额</van-button>
            </div>
          </div>
          <div
            v-if="![STATUS.CANCEL, STATUS.WAIT_PAY].includes(data.Flag)"
            class="pay-bar flex-row main-between center"
          >
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
            <van-button @click="evaluation" class="confirm">{{
              +data.isPj === 1 ? "已评价" : "评价"
            }}</van-button>
          </div>
        </div>
      </StatusHandle>
      <DatetimePicker
        :title="picker.title"
        :type="picker.type"
        :visible="picker.visible"
        :value="picker.value"
        @change="change"
        @visible-change="hide"
      />
    </div>
  </Page>
</template>
<script>
import { mapState } from "vuex";
import day from "dayjs";
import { mock, get, post } from "@/api/http";
import GoodsCard from "@/components/GoodsCard";
import { icons } from "@/assets";
import {
  LoadingControl,
  Tip,
  onBridgeReady,
  router,
  UID,
  call,
  goKf,
} from "@/utils";
import { TYPE } from "./card-package";
const API = {
  DETAIL(params) {
    return get("/Api/getOrderInfoByItem_api.php", params);
  },
  PRE_DATA(params) {
    return get("/Api/getNoOrderInfo_api.php", params);
  },
  CONFIRM(params) {
    return get("/Api/toOrder2_api.php", params);
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
  QUERY_ORDER_STATUS(params) {
    return get("/Api/getWxPayState_api.php", params);
  },
};
// const STATUS = {
//   0: "已取消",
//   1: "待付款",
//   2: "待服务",
//   3: "服务中",
//   4: "已完成",
//   CANCEL: "0",
//   WAIT_PAY: "1",
// };
const STATUS = {
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
  name: "order-detail",
  head() {
    return {
      title: "订单详情",
    };
  },
  data() {
    return {
      STATUS,
      icons,
      data: {},
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
      this.$store.dispatch("getAddressList");
      this.$store.dispatch("getInvoiceList");
      const { code } = this.query;
      if (code) {
        this.requestPay(code);
      }
    }
  },
  computed: {
    ...mapState(["addressList", "invoiceList", "selected"]),
    type() {
      return this.data.Flag === STATUS.COMPLETE ? "text" : "input";
    },
    isWaitPay() {
      return String(this.data.Flag) === STATUS.WAIT_PAY;
    },
    query() {
      return this.$route.query;
    },
    infoList() {
      return [
        {
          label: "订单编号",
          key: "oid",
        },
        {
          label: "付款时间",
          value: this.time,
        },
        {
          label: "支付方式",
          value: "微信支付",
        },
      ];
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
    addressId() {
      const { address } = this.selected;
      return address ? address.aid : this.data.aid;
    },
    isNeedAddress() {
      return this.data.isMail === "1";
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
  },
  methods: {
    call,
    goKf,
    getParams() {
      try {
        const params = JSON.parse(localStorage.getItem("order.detail.query"));
        return params;
      } catch (e) {
        return false;
      }
    },
    getData() {
      const params = this.getParams();
      if (params) {
        const { oid, id } = params;
        return API.DETAIL({
          oid,
          oiid: id,
        }).then((res) => {
          // res.Flag = STATUS.COMPLETE;
          this.data = res;
          // this.params = this.formatFormData(res);
          this.params = res;
          return res;
        });
      } else {
        router.replace({ path: "/" });
        return Promise.reject();
      }
    },
    saveForm() {
      const { orderNo, gbid, OtherJson } = this.data;
      return API.SAVE_FORM({
        orderNo,
        gbid,
        OtherJson,
      });
    },
    formatFormData(data) {
      const params = {};
      const map = {
        随同人员姓名: "name",
        详情地址: "fullAddr",
        图片: "fileList",
        回访日期: "date",
        回访时间: "time",
      };
      data.OtherJson.forEach((item) => {
        const { theTitle, theValue } = item;
        if (theTitle === "图片") {
          try {
            params[map[theTitle]] = JSON.parse(theValue).map((url) => {
              return {
                url,
                status: "success",
              };
            });
          } catch (e) {
            params[map[theTitle]] = [];
          }
        } else {
          params[map[theTitle]] = theValue;
        }
      });
      return params;
    },
    requestPay(code) {
      const params = this.getParams();
      const { oid, oiid } = this.data;
      if (params) {
        const { href, search } = location;
        API.REQUEST_PAY({
          code,
          notifyUrl: href
            .replace(search, "")
            .replace("order-confirm", "order-list"),
          oid: params.oid,
          oiid: params.id,
        })
          .then(onBridgeReady)
          .then((res) => {
            //等待1s后
            return mock({ data: res, timeout: 1000 });
          })
          .then((res) => {
            return API.QUERY_ORDER_STATUS({ oid, oiid });
          })
          .then((res) => {
            Tip.success("支付成功");
            this.$refs.statusHandle.refresh();
          })
          .catch((e) => {
            Tip.success("支付失败");
          });
      }
    },
    confirm() {
      const {
        isNeedAddress,
        address,
        invoice,
        params,
        data: {
          oid,
          gid,
          gbid,
          buyNum: theNum,
          orderNo,
          cardid: cid,
          cardid2: cid2,
        },
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
          oid,
          oiid: this.getParams().id,
          gid,
          gbid,
          theNum,
          iid: params.invoice ? invoice.iid : "",
          aid: isNeedAddress ? address.aid : "",
          cid,
          cid2,
          orderNo,
          redirect_uri: origin + pathname,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        const { oid, rUrl } = res;
        window.location.href = res.rUrl;

        // Tip.success("创建成功");
        // router.push({
        //   path: "/order-list",
        // });
      });
    },
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      const form = new FormData(); // FormData 对象
      form.append("file", file.file); // 文件对象
      form.append("uid", UID.GET());

      API.UPLOAD_FILE(form)
        .then((res) => {
          file.status = "done";
          file.message = "上传成功";
          file.source = res.src;
          // this.fileList.push({
          //   url:res.url,
          //   status:'success'
          // })
          return res;
        })
        .catch((e) => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    hide() {
      this.picker.visible = false;
    },
    showPicker(type) {
      this.picker = {
        type,
        visible: true,
        value: this.params[type],
        title: type === "date" ? "回访日期" : "回访时间",
      };
    },
    change(v) {
      this.params[this.picker.type] = v;
    },
    goCardPackage() {
      // router.push({
      //   path: "/card-package",
      //   query: {
      //     from: TYPE.ORDER,
      //   },
      // });
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
    evaluation() {
      if (+this.data.isPj !== 1) {
        const { oid, id } = this.getParams();
        router.push({
          path: "/evaluation",
          query: {
            oid,
            oiid: id,
          },
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.order-confirm-box {
  padding-bottom: 0.45rem;
  background: #fff;
  &.full {
    padding-bottom: 0;
  }
  .order-confirm {
    padding: 0.12rem;
    background: #f0f0f0;
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
    margin-bottom: 0.13rem;
    .time {
      margin-bottom: 0.11rem;
      font-size: 0.12rem;
      color: $color4;
    }
    .title {
      margin-bottom: 0.02rem;
    }
    .img {
      margin-right: 0.06rem;
      width: 1.2rem;
      height: 0.8rem;
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
      .tag {
        margin-top: 0.04rem;
        margin-right: 0.04rem;
        padding: 0 0.06rem;
        height: 0.18rem;
        line-height: 0.18rem;
        background: rgba($color: $color21, $alpha: 0.08);
        font-size: 0.09rem;
        color: $color21;
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
    }
    .hint {
      /* padding: 0.07rem 0.11rem; */
      font-size: 0.12rem;
      color: $color19;
    }
    .text {
      font-size: 0.13rem;
      color: #7e7e7e;
    }
  }
  .order-info {
    margin-bottom: 0.13rem;
    .header {
      margin-bottom: 0.08rem;
      .label {
        font-size: 0.16rem;
        color: #5d5d5d;
      }
      .status {
        font-size: 0.14rem;
        color: #6dc7c6;
      }
    }
    .item {
      margin-top: 0.12rem;
      .label,
      .value {
        font-size: 0.14rem;
        color: #6f6f6f;
      }
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
          margin-right: 0.04rem;
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
  .input-card {
    margin-top: 0.13rem;
    .title,
    .fields {
      width: 100%;
    }

    .field {
      .label {
        padding-top: 0.14rem;
        padding-bottom: 0.09rem;
        font-size: 0.13rem;
        color: #828282;
      }
      .text {
        padding-left: 0.16rem;
        font-size: 0.14rem;
        color: #363636;
      }
      .img-list {
        flex-wrap: wrap;
        padding-left: 0.16rem;
        .img {
          margin-right: 0.1rem;
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 5px;
        }
      }
      .input {
        width: 100%;
        height: 0.32rem;
        line-height: 0.32rem;
        padding: 0;
        padding-left: 0.07rem;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #bcbcbc;
      }
      .textarea {
        /* width: 100%; */
        padding: 0;
        padding-left: 0.07rem;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #bcbcbc;
      }
      .van-image,
      .upload-hint {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 5px;
        border: 1px solid #bcbcbc;
        overflow: hidden;
      }
      .date {
        width: 100%;
        height: 0.32rem;
        line-height: 0.32rem;
        padding: 0 0.07rem;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #bcbcbc;
        .date-label {
          font-size: 0.12rem;
          color: #cacaca;
        }
        .icon {
          width: 0.12rem;
        }
      }
    }
    .confirm {
      margin-top: 0.37rem;
      height: 0.33rem;
      padding: 0 0.2rem;
      border-radius: 0.17rem;
      font-size: 0.15rem;
      color: #fff;
      background: #508af6;
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
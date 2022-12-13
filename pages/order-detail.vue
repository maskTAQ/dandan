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
          <div class="order-info flex-row main-between center">
            <span class="no">订单号： {{ data.orderNo }}</span>
            <span class="status">{{ STATUS[data.Flag] }}</span>
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
            v-if="data.itemData && data.itemData.length"
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
          <div v-if="false">
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
          </div>
          <!-- <div v-if="isNeedAddress" class="address card">
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
          </div> -->
          <!-- 如果是等待支付状态或者已选择开票信息 才会显示这个div -->
          <SimpleGroup
            v-if="isWaitPay || !!invoiceId"
            title="开具发票"
            titleColor="rgba(0, 188, 197, 0.8)"
            more
            :border="data.itemData && data.itemData.length"
          >
            <template slot="headright">
              <van-checkbox
                v-if="isWaitPay"
                v-model="params.invoice"
                checked-color="rgba(0, 188, 197, 0.8)"
                icon-size=".16rem"
                shape="round"
              />
              <van-checkbox
                v-else
                :value="!!invoiceId"
                checked-color="rgba(0, 188, 197, 0.8)"
                icon-size=".16rem"
                shape="round"
              />
            </template>
            <div v-if="params.invoice || invoiceId" class="invoice-card">
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
                <img v-if="isWaitPay" :src="icons.right" alt="" class="right" />
              </div>
              <div v-else class="align" @click="selectedInvoice">
                <van-empty
                  :description="
                    isWaitPay ? '暂无开票信息 请添加开票信息' : '未开票'
                  "
                />
              </div>
            </div>
          </SimpleGroup>
          <SimpleGroup
            title="物流信息"
            titleColor="rgba(0, 188, 197, 0.8)"
            link
            border
          >
            <div class="wl-card flex-row main-between">
              <div class="left">
                <p class="name">韵达快递</p>
                <div class="flex-row center">
                  <span class="status">运输中</span>
                  <span class="date">11/12 09:01</span>
                </div>
              </div>
              <div>
                <p class="no">123123123</p>
                <p class="addr">快递交给盖碗,正在运往生..</p>
              </div>
            </div>
          </SimpleGroup>
          <OrderForm
            :readonly="data.Flag === STATUS.COMPLETE"
            v-model="data.OtherJson"
            :handleSubmit="saveForm"
          />
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
              v-if="isWaitPay"
              :loading="loading"
              @click="confirm"
              class="confirm algin"
              >支付</van-button
            >
            <van-button
              v-if="![STATUS.CANCEL, STATUS.WAIT_PAY].includes(data.Flag)"
              :loading="loading"
              @click="confirm"
              :disabled="+data.isPj === 1"
              class="confirm algin"
              >{{ +data.isPj === 1 ? "已评价" : "评价" }}</van-button
            >
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
    cover() {
      const { gImg } = this.data;
      return Array.isArray(gImg) ? gImg[0] : gImg;
    },
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
  .order-info {
    .no {
      font-size: 0.14rem;
      color: rgb(85, 85, 85);
    }
    .status {
      font-size: 0.14rem;
      font-weight: 600;
      color: rgb(25, 154, 142);
    }
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

  .wl-card {
    .left {
      flex-shrink: 0;
    }
    .name {
      margin-bottom: .04rem;
      font-size: 0.16rem;
      font-weight: 500;
      color: rgb(85, 85, 85);
    }
    .status {
      font-size: 0.14rem;
      font-weight: 600;
      color: rgb(25, 154, 142);
    }
    .date {
      margin-left: .1rem;
      font-size: 0.12rem;
      font-weight: 600;
      color: rgb(25, 154, 142);
    }
    .no {
      margin-bottom: .08rem;
      font-size: 0.14rem;
    }
    .addr {
      font-size: 0.12rem;
      font-weight: 500;
      color: rgba(126, 126, 126, 0.5);
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
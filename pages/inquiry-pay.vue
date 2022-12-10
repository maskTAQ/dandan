<template>
  <Page title="问诊支付">
    <StatusHandle :get="getPreData">
      <div class="inquiry-pay page-full">
        <div
          v-for="(field, index) in inquiry.theValueJson"
          :key="index"
          class="input-box flex-row center"
        >
          <p class="title">{{ field.theTitle || "咨询问题" }}：</p>
          <div class="value">
            {{ field.theValue }}
          </div>
        </div>
        <div class="img-list flex-row center">
          <CoverImage
            v-for="src in inquiry.theImgs"
            :key="src"
            :url="src"
            class="img"
          />
        </div>
        <DoctorCard
          class="doctor-card"
          :ask="false"
          :data="myDoctor.data || {}"
          :shadow="false"
        />
        <div class="row flex-row main-between center">
          <i class="label">优惠方式</i>
          <div class="right flex-row center">
            <i class="value">{{ data.cardName }}</i>
            <img :src="icons.right" alt="" class="icon" />
          </div>
        </div>
        <div class="row flex-row main-between center">
          <i class="label">包含服务</i>
          <i class="value">{{ data.gTital }}</i>
        </div>
        <van-checkbox class="agree" v-model="agree" shape="square">
          <div class="agree-label flex-row center">
            <i class="label">同意</i>
            <i class="value">问诊协议</i>
          </div>
        </van-checkbox>
        <div class="operation flex-row main-between center">
          <div class="flex-row center">
            <i class="label">合计:</i>
            <i class="value">￥{{ data.payAmt }}</i>
          </div>
          <van-button
            :disabled="!agree"
            :loading="loading"
            @click="confirm"
            class="confirm"
            >提交问诊</van-button
          >
        </div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { mapState } from "vuex";

import { icons } from "@/assets";
import { router, LoadingControl, onBridgeReady, Tip } from "@/utils";
import { mock, get, post } from "@/api/http";
const API = {
  PRE_DATA(params) {
    return get("/Api/getInquiryGoodsInfo_api.php", params);
  },
  ORDER(params) {
    return get("/Api/toOrder_api.php", params);
  },
  SUBMIT(params) {
    return post("/Api/sendInquiry_api.php", params, { json: false });
  },
  REQUEST_PAY(params) {
    return get("/Api/MeterRecharge_api.php", params);
  },
  QUERY_ORDER_STATUS(params) {
    return get("/Api/getWxPayState_api.php", params);
  },
};

const OID_KEY = "inquiry.oid";
export default {
  name: "inquiry-pay",
  head() {
    return {
      title: "问诊支付",
    };
  },
  data() {
    return {
      icons,
      data: {},
      params: {
        a: "",
        b: "",
      },
      agree: true,
      loading: false,
    };
  },
  created() {
    this.getMyDoctor();
    if (process.browser && this.inquiry && this.query.code) {
      this.requestPay(this.query.code);
    }
  },
  computed: {
    ...mapState(["myDoctor"]),
    query() {
      return this.$route.query;
    },
    inquiry() {
      if (!process.browser) {
        return {};
      }
      try {
        const data = localStorage.getItem("inquiry");
        //cid did, theValueJson, theImgs
        return JSON.parse(data);
      } catch (e) {
        console.log(e, "e");
        router.replace({
          path: "/",
        });
        return {};
      }
    },
  },
  methods: {
    getMyDoctor() {
      this.$store.dispatch("getMyDoctor");
    },
    getPreData() {
      if (!this.inquiry) {
        return Promise.resolve({});
      }
      return API.PRE_DATA().then((res) => {
        console.log(res, "data");
        this.data = res;
        return res;
      });
    },
    requestPay(code) {
      const { href, search } = location;
      const oid = localStorage.getItem(OID_KEY) || '';
      if(!oid){
        return 
      }
      LoadingControl({
        call: () => {
          //获取下单用的支付参数
          return API.REQUEST_PAY({
            code,
            notifyUrl: href,
            oid,
          })
            .then(onBridgeReady)
            .then((res) => {
              //等待1s后
              return mock({ data: res, timeout: 1000 });
            })
            .then((res) => {
              return API.QUERY_ORDER_STATUS({ oid });
            })
            .then(() => {
              Tip.success("支付成功,正在发起询问");
              return this.send();
            });
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      })
        .catch((e) => {
          console.log(e, "e");
          Tip.error(e);
        })
        .finally(() => {
          localStorage.removeItem(OID_KEY, "");
        });
    },

    confirm() {
      const { origin, pathname } = window.location;

      LoadingControl({
        call: (params) => {
          //下单
          return API.ORDER(params).then((res) => {
            const { oid, rUrl } = res;
            //需要支付时 重定向获取code
            if (rUrl) {
              localStorage.setItem(OID_KEY, oid);
              window.location.href = `${res.rUrl}`;
              return Promise.resolve();
            } else {
              //不需要支付 直接发送问诊消息
              return this.send();
            }
          });
        },
        params: {
          ...this.data,
          theNum: 1,
          redirect_uri: `${origin}${pathname}`,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      });
    },
    send() {
      return API.SUBMIT(this.inquiry).then((res) => {
        Tip.success("提交成功");
        localStorage.setItem("inquiry", "");
        router.replace({
          path: "/card-list",
          query: {
            id: res.cid,
          },
        });
        // router.back();
        //
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.inquiry-pay {
  padding: 0.18rem 0.12rem;
  padding-bottom: 0.6rem;
  background: #fff;
  .input-box {
    margin-bottom: 0.2rem;
    font-size: 0.16rem;
    .title {
      width: 0.6rem;
      font-size: 0.12rem;
      color: $color4;
    }
    .value {
      width: 0;
      flex: 1;
      font-size: 0.12rem;
      color: $color4;
    }
  }
  .img-list {
    .img {
      margin-right: 0.1rem;
      width: 0.8rem;
      height: 0.8rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .hint {
    margin: 0.1rem 0;
    font-size: 0.12rem;
    color: $color6;
  }
  .doctor-card {
    margin-top: 0.16rem;
    border-top: 1px solid $border;
    border-bottom: 1px solid $border;
  }
  .row {
    height: 0.54rem;
    font-size: 0.14rem;
    border-bottom: 1px solid $border;
    .label {
      color: $color4;
    }
    .value {
      color: $color6;
    }
    .icon {
      margin-left: 0.02rem;
      width: 0.12rem;
    }
  }
  .agree {
    margin-top: 0.2rem;
  }
  .agree-label {
    font-size: 0.11rem;
    .label {
      color: $color6;
    }
    .value {
      margin-left: 0.04rem;
      color: $color1;
    }
  }
  .operation {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.6rem;
    padding: 0 0.14rem;
    border-top: 1px solid $border;
    .label {
      font-size: 0.12rem;
      color: $color4;
    }
    .value {
      font-size: 0.18rem;
      color: $color1;
    }
    .confirm {
      width: 2rem;
      height: 0.42rem;
      line-break: 0.42rem;
      font-size: 0.16rem;
      color: #fff;
      border-radius: 0.21rem;
      background: $color1;
    }
  }
}
</style>
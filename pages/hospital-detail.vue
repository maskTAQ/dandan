<template>
  <Page
    :title="title"
    fixed
    ref="scroll"
    @scroll="onScrollToToggleScrollTopBtn"
  >
    <StatusHandle :get="getData" ref="statusHandle">
      <div v-if="data" class="hospital-detail">
        <button v-if="sticky" class="scroll-to-top align" @click="scrollToTop">
          <img src="../assets/img/scroll-top.png" alt="" />
        </button>
        <div
          @click="go({ path: '/gallery', query: { id: data.gid } })"
          ref="swiper"
          class="swiper-container"
        >
          <div class="swiper-wrapper">
            <CoverImage
              class="swiper-slide"
              v-for="item in data.gImg"
              :url="item"
              :key="item"
            />
          </div>
          <div class="btn-group flex-row align">
            <button
              @click="go({ path: '/gallery', query: { id: data.gid } })"
              class="btn selected"
            >
              图片
            </button>
            <button
              @click="go({ path: '/gallery', query: { id: data.gid } })"
              class="btn"
            >
              视频
            </button>
          </div>
          <div class="paging flex-row center">
            <div class="num flex-row center">
              <i class="text">{{ current }}/{{ (data.gImg || []).length }}</i>
            </div>
          </div>
        </div>
        <div class="padding-box">
          <GoodsTitle :data="data" />
          <div class="fq flex-row main-between center">
            <div class="flex-row center">
              <span class="label">旦旦医疗费用</span>
              <span class="value">6分期</span>
              <span class="label">更轻松每月1342.2</span>
            </div>
            <img class="icon" :src="icons.right" alt="" />
          </div>
          <SimpleGroup
            :icon="icons.user_title"
            size="mini"
            title="简介"
            class="intro-card card"
            border
          >
            <p class="intro">{{ data.Smple }}</p>
          </SimpleGroup>
          <SimpleGroup title="服务内容" border>
            <div class="service-list">
              <div
                class="item flex-row main-between"
                v-for="item in serviceList"
                :key="item.label"
              >
                <span class="label">{{ item.label }}</span>
                <span class="value">{{ item.label }}</span>
              </div>
            </div>
          </SimpleGroup>
          <SimpleGroup
            v-if="doctorList.length"
            title="医院专家"
            class="doctor-card card"
            border
          >
            <div>
              <ScrollView>
                <div class="doctor-list flex-row center">
                  <div
                    v-for="(item, index) in doctorList"
                    :class="[
                      'portrait-box',
                      { selected: selectedDoctorIndex === index },
                    ]"
                    :key="item.exid"
                    @click="selectedDoctorIndex = index"
                  >
                    <CoverImage :url="item.exPhoto" class="portrait" />
                    <!-- <img
                    v-if="selectedDoctorIndex === index"
                    :src="icons.doctorIntrolBottom"
                    alt=""
                    class="icon"
                  /> -->
                  </div>
                </div>
              </ScrollView>
              <div class="doctor-introl">
                <p class="name">{{ doctorList[selectedDoctorIndex].exName }}</p>
                <div class="flelds">
                  <div class="field">
                    <span class="label">擅长领域</span>
                    <span class="value">{{
                      doctorList[selectedDoctorIndex].exCan
                    }}</span>
                  </div>
                  <div class="field">
                    <span class="label">专家履历</span>
                    <span
                      class="value"
                      v-html="
                        getHtmlStr(doctorList[selectedDoctorIndex].Resume)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </SimpleGroup>
        </div>
        <div class="html-content" v-html="data.goodValue" />
        <div class="padding-box">
          <SimpleGroup title="支付说明">
            <div class="pay-desc">
              <div class="item">
                <i class="label">支付流程:</i>
                <i class="value">{{ data.PayFlow }}</i>
              </div>
              <div class="item">
                <i class="label">退款流程:</i>
                <i class="value" v-html="newline(data.ReturnFlow)"></i>
              </div>
            </div>
          </SimpleGroup>
          <EvaluateGroup :goods="data" />
          <div class="type-chunk" v-if="false">
            <StatusHandle :get="getSku">
              <ScrollView>
                <div class="type-list flex-row center">
                  <div v-for="index of 7" :key="index" class="item">
                    规格{{ index }}
                  </div>
                </div>
              </ScrollView>
            </StatusHandle>

            <div class="type-content card flex-row">
              <i class="label">优势</i>
              <div class="value">
                <p>
                  遗传疾病 染色体异常 输卵管堵塞 弱精 少精 反复流产 子宫内膜息肉
                </p>
                <p>
                  基因测序（NGS） 睾丸穿刺I胚胎培养 宫腔镜 聚合酶 反应（PCR）
                  基因诊断（PGD）
                </p>
              </div>
            </div>
          </div>
          <SimpleGroup
            size="mini"
            title="相关推荐"
            class="hospital-list-card card"
          >
            <div>
              <List
                customControl
                :request="getOtherHospitalList"
                :renderItem="renderHospitalItem"
                class="list"
                ref="list"
              />
            </div>
          </SimpleGroup>
        </div>

        <van-sku
          v-model="sku.visible"
          :sku="goodsModel.sku"
          :goods="goodsModel.goods"
          :goods-id="goodsModel.goodsId"
          :show-add-cart-btn="false"
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
        >
          <template #sku-header-price="props">
            <div class="van-sku__goods-price flex-row center">
              <span class="van-sku__price-symbol">￥</span>
              <span class="van-sku__price-num">{{ props.price }}</span>
            </div>
          </template>
        </van-sku>
        <div class="pay-bar flex-row main-between center">
          <div class="flex-row center">
            <div @click="consulting" class="btn flex-column align">
              <img class="icon" :src="icons.kf" alt="" />
            </div>
            <a :href="`tel:4000913522`" class="btn flex-column align">
              <img class="icon" :src="icons.mobile" alt="" />
            </a>
          </div>
          <van-button :loading="loading.sku" class="ask" @click="showSKU"
            >服务预约</van-button
          >
        </div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import Swiper from "swiper";
import "swiper/swiper-bundle.css";

import { mock } from "@/api";
import { icons } from "@/assets";
import {
  wxApi,
  LoadingControl,
  router,
  checkLogin,
  newline,
  KF_URL,
} from "@/utils";
import EvaluateInfo from "@/components/EvaluateInfo";
import ShowMore from "@/components/ShowMore";
import QA from "@/components/Q";
import EvaluateGroup from "@/components/EvaluateGroup";
import HospitalCard from "./hospital/HospitalCard.vue";
import { get } from "@/api/http";
import scroll from "@/mixins/scroll";

const API = {
  LIST(params) {
    return get("/Api/getGoodsList_api.php", params);
  },
  DETAIL(params) {
    return get("/Api/getGoodsInfo_api.php", params);
  },
  SKU(gid) {
    return get("/Api/getGoodsSpec_api.php", { gid });
  },
  ADD_SHOPCAR(params) {
    return get("/Api/setShopCats_api.php", params);
  },
  HOSPITAL_LIST(params) {
    return get("/Api/getGoodsList_api.php", params);
  },
};
export default {
  name: "hospital-detail",
  data() {
    return {
      title: "泰国DHC",
      icons,
      current: "1",
      selectedDoctorIndex: 0,
      data: null,
      sku: {
        datasource: [],
        visible: false,
      },
      loading: {
        sku: false,
      },
    };
  },
  mixins: [scroll],
  computed: {
    id() {
      return this.$route.query.id;
    },
    goodsModel() {
      const { sku } = this;
      const v = {
        sku: {
          tree: [
            {
              k: "规格",
              k_s: "root",
              k_id: "root",
              v: sku.datasource.map(({ gbid, bName }) => {
                return {
                  id: gbid,
                  name: bName,
                };
              }),
            },
          ],
          list: sku.datasource.map(({ bName, gbid, price, bNum }) => {
            return {
              id: gbid,
              root: gbid,
              price: price * 100,
              stock_num: +bNum,
            };
          }),
          price: Math.min.apply(
            Math,
            sku.datasource.map((item) => +item.price)
          ), // 默认价格（单位元）
          stock_num: Math.min.apply(
            Math,
            sku.datasource.map((item) => +item.bNum)
          ), //
        },
        goodsId: this.id,
        properties: [],
        goods: {
          // 默认商品 sku 缩略图
          picture: Array.isArray(this.data.gImg) ? this.data.gImg[0] : "",
        },
      };
      return v;
    },
    doctorList() {
      const { DoctorJson } = this.data;
      return DoctorJson || [];
    },
    isRed() {
      return parseInt(this.data.SuccessRate) > 90;
    },
    serviceList() {
      return [
        {
          label: "优质蛋白质",
          value: "含有丰富的矿物质以及微量元素等",
        },
        {
          label: "优质蛋白质",
          value: "含有丰富的矿物质以及微量元素等",
        },
        {
          label: "优质蛋白质",
          value: "含有丰富的矿物质以及微量元素等",
        },
      ];
    },
  },
  methods: {
    getHtmlStr(str) {
      return (str || "").replace(/\n+/gim, "<br/>");
    },
    getOtherHospitalList(params) {
      return API.HOSPITAL_LIST({
        ...params,
        gid: this.data.gid,
        pageIndex: 1,
        pageNum: 6,
      });
    },
    renderHospitalItem(item, i, instance) {
      return (
        <HospitalCard
          onBuy={() => {
            router.replace({
              path: "/hospital-detail",
              query: {
                id: item.gid,
              },
            });
          }}
          onClick={() => {
            router.replace({
              path: "/hospital-detail",
              query: {
                id: item.gid,
              },
            });
          }}
          class="goods"
          data={item}
        />
      );
    },

    newline,
    consulting() {
      window.location.href = KF_URL.hospital;
    },
    init() {
      const that = this;
      this.mySwiper = new Swiper(".swiper-container", {
        // Optional parameters
        // direction: "vertical",
        loop: true,
        on: {
          slideChangeTransitionStart() {
            console.log(this.realIndex, "this.realIndex");
            that.current = this.realIndex + 1;
          },
        },
      });
    },
    getData() {
      return API.DETAIL({ gid: this.id }).then((res) => {
        const { gName: title } = res;
        this.title = title;
        document.title = title;
        this.data = res;
        const cover = res.gImg[0];
        const subtitle = String(res.Tag || "").replace(/;/gim, " ");
        wxApi.onMenuShareAppMessage({
          desc: subtitle,
          title: res.gName || "泰国DHC生殖医院", // 分享标题
          // desc: desc, // 分享描述
          link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: cover || "https://m.dhcivf.com/depu/favicon.ico", // 分享图标
        });
        wxApi.updateTimelineShareData({
          desc: subtitle,
          title: res.gName || "泰国DHC生殖医院", // 分享标题
          link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: cover || "https://m.dhcivf.com/depu/favicon.ico",
        });
        this.$nextTick(() => {
          setTimeout(() => {
            this.init();
          }, 1000);
        });
      });
    },
    goMap() {
      const { Lat, Lng, Address } = this.data;
      this.$router.push({
        path: "/map",
        query: {
          lat: Lat,
          lng: Lng,
          text: Address,
        },
      });
    },
    goDoctorDetail() {
      const { doctorList, selectedDoctorIndex } = this;
      this.$router.push({
        path: "/doctor-detail",
        query: {
          id: doctorList[selectedDoctorIndex].exid,
        },
      });
    },
    showSKU() {
      if (!checkLogin()) {
        return;
      }
      LoadingControl({
        call: API.SKU,
        params: this.id,
        change: ({ loading }) => {
          this.loading.sku = loading;
        },
      }).then((res) => {
        this.sku.datasource = res;
        this.sku.visible = true;
      });
    },
    getSku() {
      return API.SKU(this.id).then((res) => {
        this.sku = res;
      });
    },
    onBuyClicked(goods) {
      const {
        selectedSkuComb: { id: gbid },
        selectedNum,
      } = goods;

      localStorage.setItem(
        "goods",
        JSON.stringify({
          gid: this.id,
          gbid,
          theNum: selectedNum,
        })
      );
      router.push({
        path: "/order-confirm",
      });
      // console.log(goods, "goods");
    },
    onAddCartClicked(goods) {
      const {
        selectedSkuComb: { id: gbid },
        selectedNum,
      } = goods;
      return API.ADD_SHOPCAR({
        gid: this.id,
        gbid,
        theNum: selectedNum,
      })
        .then((res) => {
          Tip.success("已加入购物车");
          router.push({
            path: "/shopping-cart",
          });
        })
        .catch((e) => {
          Tip.error(e.message);
        });
    },
    go({ path, query }) {
      router.push({
        path,
        query,
      });
    },
  },
  components: {
    EvaluateInfo,
    ShowMore,
    QA,
    EvaluateGroup,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
$margin: 0.12rem;
.hospital-detail {
  background: #fff;
  padding-bottom: 0.8rem;
  .html-content {
    * {
      /* display: block; */
      max-width: 100%;
    }
  }
  .card {
    /* border-radius: 0.12rem; */
  }
  .swiper-container {
    position: relative;
    .swiper-slide {
      height: 2.22rem;
    }
    .btn-group {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.37rem;
      z-index: 9;
      .btn {
        height: 0.22rem;
        padding: 0 0.22rem;
        font-size: 0.12rem;
        color: rgb(51, 51, 51);
        background: rgba(255, 255, 255, 0.85);
        border-radius: 0.11rem;
        &.selected {
          margin-right: 0.4rem;
          background: rgb(105, 199, 199);
          color: #fff;
        }
      }
    }
    .paging {
      position: absolute;
      right: 0.24rem;
      bottom: 0.2rem;
      height: 0.24rem;
      line-height: 0.24rem;
      padding: 0 0.12rem;
      z-index: 99;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0.12rem;
      .icon {
        margin-right: 0.06rem;
        width: 0.12rem;
      }
      .text {
        font-size: 0.12rem;
        color: #fff;
      }
      .split {
        margin: 0 0.06rem;
        width: 1px;
        height: 6px;
        background: #fff;
      }
    }
  }
  .padding-box {
    padding: 0.2rem;
  }

  .service-list {
    font-size: 0.12rem;
    font-weight: bold;
    .item {
      min-height: 0.3rem;
    }
    .label {
      color: rgb(0, 188, 197);
    }
    .value {
      color: rgb(173, 173, 173);
    }
  }
  .fq {
    padding: 0.13rem 0;
    font-size: 0.14rem;
    font-weight: bold;
    border-top: 1px solid #eeeeee;
    .label {
      color: rgba(82, 82, 82, 0.8);
    }
    .value {
      color: rgba(0, 188, 197, 0.8);
    }
    .icon {
      width: 0.15rem;
    }
  }
  .intro-card {
    .intro {
      font-size: 0.14rem;
      /* font-weight: bold; */
      color: rgb(173, 173, 173);
    }
  }
  .discount {
    margin: $margin 0;
    padding-bottom: 0.1rem;
    .title {
      margin-right: 0.06rem;
      font-size: 0.12rem;
      color: #999999;
    }
    .discount-list {
      width: 0;
      flex: 1;
      .item {
        margin-bottom: 0.06rem;
      }
      .tag {
        height: 0.24rem;
        padding: 0 0.06rem;
        font-size: 0.12rem;
        color: #1ebcc4;
        border-radius: 3px;
        border: 1px solid #1ebcc4;
      }
      .label {
        margin-left: 0.06rem;
        font-size: 0.12rem;
        color: #333333;
      }
    }
  }
  .doctor-card {
    margin-bottom: $margin;
    /* padding-left: 0; */
    .scroll-view {
      height: 0.9rem;
    }
    .doctor-list {
      /* padding-left: 0.16rem; */
    }
    .portrait-box {
      position: relative;
      margin-right: 0.15rem;
      padding-bottom: 0.15rem;
      .icon {
        position: absolute;
        width: 0.12rem;
        margin-left: 50%;
        left: -0.06rem;
        bottom: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      &.selected .portrait {
        border-color: rgb(0, 188, 197);
      }
    }
    .portrait {
      width: 0.75rem;
      height: 0.75rem;
      border: 1px solid transparent;
      border-radius: 50%;
    }
    .doctor-introl {
      position: relative;
      /* margin-top: 0.15rem; */
      /* padding: 0.16rem; */
      /* background: #eef0fe; */
      border-radius: 10px;

      .name {
        margin-bottom: 0.1rem;
        font-size: 0.16rem;
        font-weight: 500;
        color: rgb(59, 67, 83);
      }
      .field {
        margin-top: 0.05rem;
        position: relative;
        font-size: 0.14rem;
        font-weight: bold;
        color: rgb(173, 173, 173);
        /* .label {
          position: absolute;
          top: 0.02rem;
          left: 0;
          color: #6dc7c6;
        }
        .value {
          display: block;
          line-height: 0.24rem;
          text-indent: 0.8rem;
          color: #666666;
        } */
      }
    }
    .show-doctor-detail {
      display: block;
      margin: 0 auto;
      margin-top: 0.16rem;
      height: 0.3rem;
      padding: 0 0.3rem;
      background: #1ebcc4;
      font-size: 0.12rem;
      color: #fff;
      border-radius: 0.13rem;
    }
  }
  .subscribe-card {
    .subscribe-list {
      .item {
        height: 0.6rem;
        .dot {
          margin-right: 0.07rem;
          width: 0.03rem;
          height: 0.03rem;
          background: #7087f8;
        }
        .value {
          font-size: 0.14rem;
          font-weight: 400;
          color: #666666;
        }
      }
    }
  }
  .type-chunk {
    margin-bottom: $margin;
    .type-list {
      .item {
        margin-right: 0.12rem;
        padding: 0 0.16rem;
        height: 0.34rem;
        line-height: 0.34rem;
        font-size: 0.14rem;
        color: #fff;
        background: #1ebcc4;
        border-radius: 0.19rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .type-content {
      margin-top: 0.12rem;
      .label {
        margin-right: 0.12rem;
        font-size: 0.12rem;
        color: #999999;
      }
      .value {
        width: 0;
        flex: 1;
        p {
          margin-bottom: 0.12rem;
          font-size: 0.12rem;
          color: #333333;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .hospital-intro {
    height: 1rem;
  }
  .pay-desc {
    padding: 0.1rem;
    background: rgba(105, 199, 199, 0.1);
    border-radius: 0.04rem;
    .item {
      font-size: 0.14rem;
      color: rgb(173, 173, 173);
    }
  }
  .pay-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.8rem;
    padding: 0 0.15rem;
    background: #fff;
    /* box-shadow: 0px 0px 3px 0px rgba(181, 181, 196, 0.5); */
    .btn {
      margin-right: 0.13rem;
      width: 0.44rem;
      height: 0.44rem;
      background: rgba(0, 188, 197, 0.1);
      border-radius: 0.08rem;
      .icon {
        width: 0.3rem;
      }
      &:first-child {
      }
    }
    .ask {
      width: 0;
      flex: 1;
      height: 0.39rem;
      font-size: 0.16rem;
      font-weight: 600;
      color: #fff;
      background: #1ebcc4;
      border-radius: 0.23rem;
      border: none;
    }
  }
}
</style>
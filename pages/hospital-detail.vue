<template>
  <Page :title="title" fixed>
    <StatusHandle :get="getData" ref="statusHandle">
      <div v-if="data" class="hospital-detail">
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
          <div class="paging flex-row center">
            <div class="num flex-row center">
              <i class="text">{{ current }}/{{ (data.gImg || []).length }}</i>
            </div>
          </div>
        </div>

        <div class="hospital-info">
          <div class="hospital-name">
            <span class="tag align">{{ data.fTypeName }}</span>
            <p class="label ellipsis line-2">{{ data.gName }}</p>
          </div>
          <div class="flex-row main-between center">
            <span class="yy">{{ data.SalesNum }}人预约</span>
            <div
              v-if="data.SuccessRate"
              :class="['cgl-box flex-row', { red: isRed }]"
            >
              <span class="value align">{{ data.SuccessRate }}%</span>
              <span class="label align">成功率</span>
            </div>
          </div>
          <div class="price-box flex-row center">
            <span class="label">试管费用：</span>
            <span class="unit">￥</span>
            <span class="value">{{ data.ThePrice }}</span>
            <span class="label">起</span>
          </div>
          <!-- <div class="tag-list flex-row center">
            <div v-for="item in data.Tag.split(';')" :key="item" class="tag">
              {{ item }}
            </div>
          </div> -->
        </div>
        <div class="alert" v-if="data.Tag && data.Tag.length">
          {{ getAlert(data.Tag) }}
        </div>
        <Group
          :icon="icons.user_title"
          size="mini"
          title="简介"
          class="intro-card card"
          border
        >
          <ShowMore min="1rem">
            <p class="intro">{{ data.Smple }}</p>
          </ShowMore>
        </Group>
        <Group
          v-if="doctorList.length"
          :icon="icons.user_title"
          size="mini"
          title="医院专家"
          class="doctor-card card"
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
                  <img
                    v-if="selectedDoctorIndex === index"
                    :src="icons.doctorIntrolBottom"
                    alt=""
                    class="icon"
                  />
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
                  <span class="value">{{
                    doctorList[selectedDoctorIndex].Resume || "-"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </Group>
        <Group size="mini" title="医院详情" class="hospital-detail-card card">
          <div class="html-content" v-html="data.goodValue" />
        </Group>
        <Group
          :icon="icons.user_title"
          size="mini"
          title="预约须知"
          class="subscribe-card card"
          border
        >
          <ul class="subscribe-list">
            <li class="item flex-row center">
              <span class="dot"></span>
              <span class="value">{{ data.PayFlow }}</span>
            </li>
          </ul>
        </Group>
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
        <Group
          size="mini"
          title="其他医院"
          class="hospital-list-card card"
          border
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
        </Group>
        <Group v-if="false" size="mini" title="支付说明" class="pay-desc card">
          <div>
            <div class="item">
              <i class="label">支付流程:</i>
              <i class="value">{{ data.PayFlow }}</i>
            </div>
            <div class="item">
              <i class="label">退款流程:</i>
              <i class="value" v-html="newline(data.ReturnFlow)"></i>
            </div>
          </div>
        </Group>

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
              <i class="label">在线客服</i>
            </div>
            <a :href="`tel:4000913522`" class="btn flex-column align">
              <img class="icon" :src="icons.mobile" alt="" />
              <i class="label">电话咨询</i>
            </a>
          </div>
          <van-button :loading="loading.sku" class="ask" @click="showSKU"
            >立即预约</van-button
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
  },
  methods: {
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
    getAlert(s) {
      return String(s || "").replace(/;/gim, " · ");
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
  background: $color8;
  padding-bottom: 0.55rem;
  .html-content {
    * {
      display: block;
      max-width: 100%;
    }
  }
  .card {
    padding: 0.15rem;
    padding-top: 0;
    background: #fff;
    /* border-radius: 0.12rem; */
  }
  .hospital-detail-card {
    margin-bottom: 0.1rem;
  }
  .swiper-container {
    position: relative;
    .swiper-slide {
      height: 2.22rem;
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
    padding: 0.12rem;
    background: #f3f5f7;
  }
  .hospital-info {
    margin-bottom: $margin;
    /* padding-bottom: 0.06rem; */
    padding: 0.15rem;
    background: #fff;
    .hospital-name {
      margin-bottom: 0.08rem;
      position: relative;
      .tag {
        position: absolute;
        top: 0;
        left: 0;
        width: 0.58rem;
        height: 0.21rem;
        background: linear-gradient(90deg, #ff894c 0%, #fe5337 100%);
        border-radius: 4px;
        font-size: 0.12rem;
        font-weight: 400;
        color: #ffffff;
      }
      p {
        text-indent: 0.7rem;
        font-size: 0.16rem;
        font-weight: 600;
        color: #040a2d;
      }
    }
    .yy {
      font-size: 0.14rem;
      color: #2d4ef5;
    }
    .cgl-box {
      /* height: 0.23rem; */
      border-radius: 4px;
      border: 1px solid #33ca57;
      overflow: hidden;
      .value {
        min-width: 0.41rem;
        padding: 0 0.04rem;
        font-size: 0.14rem;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(90deg, #76d77f 0%, #2ec954 100%);
      }
      .label {
        min-width: 0.42rem;
        font-size: 0.14rem;
        color: #33ca57;
      }
      &.red {
        border: 1px solid #ff7f48;
        .value {
          background: linear-gradient(90deg, #ff894c 0%, #fe5337 100%);
        }
        .label {
          color: #fe5839;
        }
      }
    }
    .price-box {
      margin-top: 0.11rem;
      .label {
        font-size: 0.14rem;
        color: #777a78;
      }
      .unit {
        font-size: 0.13rem;
        font-weight: bold;
        color: #f91e00;
      }
      .value {
        position: relative;
        top: -0.02rem;
        font-size: 0.24rem;
        font-weight: bold;
        color: #f91e00;
      }
    }

    .tag-list {
      flex-wrap: wrap;
      .tag {
        margin-right: 0.08rem;
        margin-bottom: 4px;
        height: 0.18rem;
        padding: 0 0.04rem;
        line-height: 0.18rem;
        font-size: 0.1rem;
        color: $color14;
        background: rgba($color: $color14, $alpha: 0.08);
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .alert {
    margin-bottom: 0.1rem;
    min-height: 0.5rem;
    /* padding-left: 0.15rem; */
    padding: 0.06rem 0.1rem;
    line-height: 0.2rem;
    font-size: 0.14rem;
    color: #ffa83e;
    background: #fff;
  }
  .intro-card {
    margin-bottom: 0.1rem;
    .intro {
      font-size: 0.14rem;
      color: #666666;
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
        color: #4d6eff;
        border-radius: 3px;
        border: 1px solid #4d6eff;
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
        border-color: #3155f1;
      }
    }
    .portrait {
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid transparent;
      border-radius: 4px;
    }
    .doctor-introl {
      position: relative;
      /* margin-top: 0.15rem; */
      padding: 0.16rem;
      background: #eef0fe;
      border-radius: 10px;

      .name {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
      }
      .field {
        margin-top: 0.15rem;
        position: relative;
        font-size: 0.14rem;
        .label {
          position: absolute;
          top: 0.02rem;
          left: 0;
          color: #2d4ef5;
        }
        .value {
          display: block;
          line-height: 0.24rem;
          text-indent: 0.8rem;
          color: #666666;
        }
      }
    }
    .show-doctor-detail {
      display: block;
      margin: 0 auto;
      margin-top: 0.16rem;
      height: 0.3rem;
      padding: 0 0.3rem;
      background: #4d6eff;
      font-size: 0.12rem;
      color: #fff;
      border-radius: 0.13rem;
    }
  }
  .subscribe-card {
    margin-bottom: 0.1rem;
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
        background: #4d6eff;
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
    margin-top: $margin;
    .title {
      font-size: 0.14rem;
      color: $color6;
    }
    .item {
      margin-top: 0.12rem;
      font-size: 0.12rem;
      .label {
        color: $color4;
      }
      .value {
        color: $color6;
      }
    }
  }
  .pay-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.55rem;
    padding: 0 0.15rem;
    background: #fff;
    box-shadow: 0px 0px 3px 0px rgba(181, 181, 196, 0.5);
    .btn {
      &:first-child {
        margin-right: 0.18rem;
      }
      .icon {
        margin-bottom: 4px;
        width: 0.22rem;
      }
      .label {
        font-size: 0.12rem;
        color: #999999;
      }
    }
    .ask {
      width: 1.79rem;
      height: 0.39rem;
      font-size: 0.16rem;
      font-weight: 600;
      color: #fff;
      background: #4d6eff;
      border-radius: 0.23rem;
      border: none;
    }
  }
}
</style>
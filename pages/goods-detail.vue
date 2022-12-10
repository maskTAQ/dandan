<template>
  <Page :title="title">
    <StatusHandle :get="getData" ref="statusHandle">
      <div class="goods-detail page-full" @scroll="onScroll">
        <div class="area radiu-b">
          <ToolBar
            :scan="false"
            rightIconName="share"
            class="tool-bar"
            placeholder="这里有您需要的药品"
            @clickRightIcon="share"
          />
          <Banner
            style="margin-top:.1rem"
            @click="go({ path: '/gallery', query: { id: data.gid } })"
            class="banner"
            :data="banner"
          />
          <div class="price flex-row">
            <i class="unit">￥</i>
            <i class="value">{{ data.price }}</i>
          </div>
          <p class="goods-name">{{ data.gName }} {{ data.gTital }}</p>
          <div class="tag-list flex-row center">
            <div
              v-for="tag in (data.Tag || '').split(';')"
              :key="tag"
              class="tag flex-row center"
            >
              <i class="point"></i>
              <i class="label">{{ tag }}</i>
            </div>
          </div>
        </div>
        <div class="postage flex-row main-between center area radiu">
          <i class="label"
            >快递：{{ data.isMail == "1" ? "包邮" : "不包邮" }}</i
          >
          <i class="value">销量：{{ data.SalesNum }}</i>
        </div>
        <div
          v-if="discountList && discountList.length"
          class="discount flex-row area radiu"
        >
          <i class="title">优惠</i>
          <div class="discount-list">
            <div v-for="item in discountList" :key="item.label" class="item">
              <span class="tag">{{ item.cardType }}</span>
              <i class="label">{{ item.cardTitle }}</i>
            </div>
          </div>
        </div>
        <div v-if="data.goodValue" class="intro" v-html="data.goodValue"></div>
        <div class="pay-desc area radiu-b">
          <p class="title">支付说明</p>
          <div class="item">
            <i class="label">支付流程:</i>
            <i class="value" v-html="getHtmlStr(data.PayFlow)"></i>
          </div>
          <div class="item">
            <i class="label">退款流程:</i>
            <i class="value" v-html="getHtmlStr(data.ReturnFlow)"></i>
          </div>
        </div>

        <EvaluateGroup :goods="data" />
        <div class="recommend">
          <div class="flex-row center">
            <div class="title flex-row center">
              <img :src="icons.shopping" alt="" class="icon" />
              <i class="label">猜你喜欢</i>
            </div>
          </div>
          <div class="goods-list">
            <List
              :request="request"
              columnNum="2"
              :renderItem="renderItem"
              class="list"
              ref="list"
              eventPassthrough
            />
          </div>
        </div>
        <van-sku
          v-model="sku.visible"
          :sku="goodsModel.sku"
          :goods="goodsModel.goods"
          :goods-id="goodsModel.goodsId"
          @buy-clicked="onBuyClicked"
          :show-add-cart-btn="false"
          @add-cart="onAddCartClicked"
        />
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
          <div class="btn-group flex-row center">
            <!-- <van-button
              @click="showSKU('addShopCar')"
              :loading="loading.sku && loading.skuTrigger === 'addShopCar'"
              class="add-shopcar"
              >加入购物车</van-button
            > -->
            <van-button
              @click="showSKU('buy')"
              :loading="loading.sku && loading.skuTrigger === 'buy'"
              class="pay"
              >{{ buyLabel }}</van-button
            >
          </div>
        </div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import Swiper from "swiper";
// import Swiper styles
import "swiper/swiper-bundle.css";

import { icons } from "@/assets";
import {
  LoadingControl,
  Tip,
  router,
  checkLogin,
  goKf,
  call,
  wxApi,
} from "@/utils";
import Banner from "@/components/Banner";
import EvaluateInfo from "@/components/EvaluateInfo";
import ShowMore from "@/components/ShowMore";
import GoodsCard from "@/components/GoodsCard";
import EvaluateGroup from "@/components/EvaluateGroup";
import { get } from "@/api/http";
import { toArray } from "../utils";

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
};
const DISCOUNT_TYPE = {
  JIFEN: {
    label: "积分",
    style: {
      background: "rgba(255, 148, 74,.2)",
      color: "#FF944A",
    },
  },
  ZENGPING: {
    label: "赠品",
    style: {
      background: "rgba(255, 73, 56,.2)",
      color: "#FF4938",
    },
  },
  YOUHUI: {
    label: "优惠",
    style: {
      background: "rgba(255, 73, 56,.2)",
      color: "#FF4938",
    },
  },
};
export default {
  name: "goods-detail",
  head() {
    return {
      title: "商品详情",
    };
  },
  data() {
    return {
      title: "新生优孕",
      icons,
      data: {},
      search: "",
      current: "",
      loading: {
        sku: false,
      },
      sku: {
        visible: false,
        datasource: [],
        root: null,
        children: [],
      },
      discountList: [],
      isMounted: false,
    };
  },
  watch: {
    id(v) {
      if (v && this.$refs.statusHandle) {
        console.log(v, "call refresh");
        this.$refs.statusHandle.refresh();
      }
    },
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    banner() {
      const { gImg } = this.data;
      return Array.isArray(gImg) ? gImg : [];
    },
    payDescList() {
      return [
        {
          label: "画线价格",
          value:
            "指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考",
        },
        {
          label: "其他说明",
          value: "补充其他支付说明",
        },
        {
          label: "其他说明",
          value: "补充其他支付说明",
        },
        {
          label: "其他说明",
          value: "补充其他支付说明",
        },
      ];
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
          picture: toArray(this.data.gImg, "||")[0],
        },
      };
      return v;
    },
    isInsurance() {
      const { fTypeName } = this.data;
      return ["试管保险", "助孕保障"].includes(String(fTypeName || ""));
    },
    buyLabel() {
      return this.isInsurance ? "立即咨询" : "立即购买";
    },
  },
  methods: {
    call,
    goKf,
    go({ path, query }) {
      router.push({
        path,
        query,
      });
    },
    share() {
      const share = document.getElementById("share");
      console.log(share,'share');
      if (share) {
        share.click();
      }
    },
    getHtmlStr(str) {
      return (str || "").replace(/\n/gim, "<br/>");
    },
    showSKU(trigger) {
      if (this.isInsurance) {
        return goKf("baoxian1");
      }
      if (!checkLogin()) {
        return;
      }
      this.loading.skuTrigger = trigger;
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
    getData() {
      return API.DETAIL({ gid: this.id }).then((res) => {
        const { gName: title } = res;
        this.title = title;
        document.title = title;
        this.data = res;
        this.discountList = res.CardJson;
        this.$nextTick(this.init);
        wxApi.onMenuShareAppMessage({
          // desc: res.Tital2, // 描述
          title: title, // 分享标题
          // desc: desc, // 分享描述
          link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "https://sanshengzhiyun.com/h5/_nuxt/assets/icon/logo.png", // 分享图标
        });
        wxApi.updateTimelineShareData({
          // desc: res.Tital2,
          title: title, // 分享标题
          link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "https://sanshengzhiyun.com/h5/_nuxt/assets/icon/logo.png",
        });
      });
    },
    init() {
      return;
      console.log([this.isMounted, this.banner.length]);
      if (this.isMounted && this.banner.length <= 1) {
        return;
      }
      setTimeout(() => {
        const that = this;
        console.log(document.querySelector(".swiper-container"));
        this.mySwiper = new Swiper(".swiper-container", {
          // Optional parameters
          // direction: "vertical",
          loop: true,
          on: {
            slideChangeTransitionStart() {
              that.current = this.activeIndex > 3 ? 1 : this.activeIndex;
            },
          },
        });
        window.a = this.mySwiper;
      }, 1000);
    },
    request(params) {
      return API.LIST(params);
    },
    renderItem(item, i, instance) {
      return (
        <GoodsCard
          onClick={() => {
            router.replace({
              path: "/goods-detail",
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
    onScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      // let offsetHeight = Math.ceil(e.target.getBoundingClientRect().height);
      const currentHeight = scrollTop + offsetHeight;
      if (currentHeight >= scrollHeight) {
        this.$refs.list.loadmore();
      }
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
  },
  mounted() {
    this.isMounted = true;
    this.init();
  },
  components: {
    Banner,
    EvaluateInfo,
    ShowMore,
    EvaluateGroup,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.goods-detail {
  background: $color8;
  padding-bottom: 0.6rem;
  overflow: auto;
  .banner {
    height: 3.5rem;
    .swiper-slide {
      height: 3.5rem;
    }
  }
  .area {
    padding: 0.16rem 0.12rem;
    background: #fff;
    &.radiu {
      border-radius: 8px;
    }
    &.radiu-b {
      border-radius: 0px 0px 8px 8px;
    }
    &.radiu-t {
      border-radius: 8px 8px 0px 0px;
    }
  }
  .tool-bar {
    .search {
      background: $color9;
    }
  }
  .swiper-container {
    /* margin-top: 0.1rem; */
    position: relative;
    height: 3.5rem;
    .paging {
      position: absolute;
      right: 0.24rem;
      bottom: 0.2rem;
      height: 0.24rem;
      line-height: 0.24rem;
      padding: 0 0.12rem;
      font-size: 0.14rem;
      color: #fff;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.12rem;
    }
  }
  .price {
    margin: 0.1rem 0;
    color: $color2;
    align-items: flex-end;
    font-weight: bold;
    .unit {
      margin-bottom: 0.04rem;
      font-size: 0.16rem;
    }
    .value {
      font-size: 0.24rem;
    }
  }
  .goods-name {
    margin: 0.08rem 0;
    font-size: 0.16rem;
    color: $color4;
  }
  .tag-list {
    flex-wrap: wrap;
    .tag {
      margin-right: 0.2rem;
      margin-bottom: 4px;
      padding: 0 4px;
      background: #f2f5ff;
      &:last-child {
        margin-right: 0;
      }
    }
    .point {
      width: 4px;
      height: 4px;
      background: $color5;
      border-radius: 50%;
    }
    .label {
      margin-left: 0.08rem;
      font-size: 0.14rem;
      color: $color5;
    }
  }

  .postage {
    margin: 0.12rem 0;
    font-size: 0.14rem;
    .label {
      color: $color5;
    }
    .value {
      color: $color6;
    }
  }
  .discount {
    margin-bottom: 0.12rem;
    .title {
      margin-right: 0.16rem;
      font-size: 0.14rem;
      color: $color6;
    }
    .item {
      margin-bottom: 0.12rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .tag {
      margin-right: 0.08rem;
      height: 0.16rem;
      padding: 0 0.04rem;
      font-size: 0.1rem;
      line-height: 0.16rem;
      border-radius: 2px;
    }
    .label {
      font-size: 0.14rem;
      color: $color4;
    }
  }
  .intro {
    margin-bottom: 0.12rem;
    padding: 0.16rem 0.12rem;
    /* height: 1rem; */
    background: #fff;
    img {
      display: block;
      max-width: 100%;
    }
  }
  .pay-desc {
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
  .evaluation-group {
    margin-top: 0.12rem;
    margin-bottom: 0.24rem;
    .title .icon {
      margin-right: 0.08rem;
    }
  }

  .recommend {
    .title {
      margin: 0 auto;
      margin-bottom: 0.16rem;
      .icon {
        margin-right: 0.08rem;
        width: 0.13rem;
      }
      .label {
        font-size: 0.16rem;
        color: $color4;
      }
    }
    .goods-list {
      padding: 0 0.12rem;
      .column-0 {
        margin-right: 0.13rem;
      }
      .goods {
        margin-bottom: 0.12rem;
        padding: 0.12rem;
        background: #fff;
        border-radius: 8px;
      }
    }
  }
  .pay-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.6rem;
    padding: 0 0.12rem;
    background: #fff;
    box-shadow: 0px -1px 12px 0px rgba(76, 135, 249, 0.05);
    .btn {
      &:first-child {
        margin-right: 0.24rem;
      }
      .icon {
        margin-bottom: 3px;
        width: 0.22rem;
      }
      .label {
        font-size: 0.12rem;
        color: $color6;
      }
    }
    .btn-group {
      border-radius: 1rem;
      overflow: hidden;
      button {
        height: 0.4rem;
        padding: 0 0.15rem;
        line-height: 0.4rem;
        font-size: 0.14rem;
        color: #fff;
        border: none;
        border-radius: 0;
        &.add-shopcar {
          background: linear-gradient(90deg, #74a1f9, #84acfb);
        }
        &.pay {
          background: linear-gradient(270deg, #2d4ef5, #2d4ef5);
        }
      }
    }
  }
}
</style>
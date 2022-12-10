<template>
  <div ref="slide" class="_819 swiper-container engine layout flex-column">
    <template v-if="index">
      <img
        src="./imgs/43e77a26838c4d2fe3462efe02ef4e53.png"
        data-node-type="image"
        class="nc-2e78_14747"
        @click="back"
      />
      <img
        v-if="index !== 6"
        src="./imgs/574d0f9ab79df66d475bda0222d0c08e.png"
        data-node-type="image"
        class="nc-2f47_22130"
      />
    </template>
    <img
      v-show="index"
      src="./imgs/3c007da5187116131b26be83e895ca3c.png"
      data-node-type="image"
      class="nc-815c_83799"
      id="nc-815c_83799"
      @click="like"
    />
    <div v-if="newest" class="tip">
      <img :src="newest.wxphoto" alt="" class="portrait" />
      <div class="info">
        <p class="name">{{ newest.nickname }}</p>
        <p class="text">送出一朵小花花</p>
      </div>
      <img src="./imgs/flower.png" alt="" class="icon" />
    </div>
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div data-node-type="view" class="nc-440e_72979 column-start-center">
            <img
              src="./imgs/5cfc4cc9385cbef5a2d887f3b03a3aeb.png"
              data-node-type="image"
              class="nc-3b47_01449"
            />
            <img
              src="./imgs/d95a0d74dc590cb6f235fc401655faa6.png"
              data-node-type="image"
              class="nc-7723_72204"
            />
            <img
              src="./imgs/73be12843922a9355f0bee6c015e19e9.png"
              data-node-type="image"
              class="nc-3211_75212"
            />
            <img
              src="./imgs/09678ef85c1bb50ed1f61d7fa04726ca.png"
              data-node-type="image"
              class="nc-5f44_04562"
            />
            <img
              src="./imgs/02a8eb87c9b35e3944b775c34f583328.png"
              data-node-type="image"
              class="nc-3c64_94923"
            />
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div
            data-node-type="scroll-view"
            class="nc-413a_13599 column-center-center"
          >
            <div data-node-type="view" class="nc-4c7c_25204">
              <Player
                src="https://vdo.vmweimei.cn/dr819.m4v"
                :poster="poster"
                class="player"
              >
              </Player>
            </div>
            <div class="pp">
              <img
                src="./imgs/e569d48414e25334f7290b5059e26e47.png"
                data-node-type="image"
                class="nc-8a00_74339"
              />
              <img
                src="./imgs/876785752f8ca8c9a1906edcac7866ef.png"
                data-node-type="image"
                class="nc-1495_93418"
              />
            </div>
            <img
              src="./imgs/1ae2aa1d026baa857df0b681b7175e5b.png"
              data-node-type="image"
              class="nc-5544_35799"
            />
            <img
              src="./imgs/ce1eb641c0e7f0ab6329a012e2fcdbef.png"
              data-node-type="image"
              class="nc-9540_70037"
            />
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div data-node-type="view" class="nc-497c_22455 column-center-center">
            <div
              data-node-type="scroll-view"
              class="nc-2c55_58849 column-center-center"
            >
              <div data-node-type="view" class="nc-25c5_15115 row-center-start">
                <img
                  src="./imgs/4fc910f96b85e3b34b095734278b9c43.png"
                  data-node-type="image"
                  class="nc-5be9_10826"
                />
                <img
                  src="./imgs/f5f499683c60d4707101e46f0ed0f184.png"
                  data-node-type="image"
                  class="nc-119e_97602"
                />
                <img
                  src="./imgs/0b6734067eb15061aeaf18a90166610e.png"
                  data-node-type="image"
                  class="nc-289b_58219"
                />
              </div>

              <img
                src="./imgs/d35dd482e4cf4c31cf1bbadebe789dd1.png"
                data-node-type="image"
                class="nc-4531_73186"
              />
              <img
                src="./imgs/ef5125d6dcfeeaaf1482d66e913b8b20.png"
                data-node-type="image"
                class="nc-540b_46872"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div
            data-node-type="scroll-view"
            class="nc-6333_01801 column-center-center"
          >
            <img
              src="./imgs/0f168aea959914ac32ccf2a81bb524a3.png"
              data-node-type="image"
              class="nc-73b2_94249"
            />
            <img
              src="./imgs/e3235f1ea7a9a628978da065b6085779.png"
              data-node-type="image"
              class="nc-850c_79368"
            />
            <img
              src="./imgs/a5ec814293b36de6cd5fae9c2270c039.png"
              data-node-type="image"
              class="nc-1ebf_07142"
            />
            <img
              src="./imgs/6197db7ad356ee1e69a0b97b93a994f7.png"
              data-node-type="image"
              class="nc-4930_39710"
            />
            <img
              src="./imgs/a616066dc90eb8660eddfcb50d3b70ea.png"
              data-node-type="image"
              class="nc-2cf6_96911"
            />
            <img
              src="./imgs/b27aa3db4acd7d148600c339db0c19d0.png"
              data-node-type="image"
              class="nc-6473_69110"
            />
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div
            data-node-type="scroll-view"
            class="nc-2b87_62818 column-center-center"
          >
            <div data-node-type="view" class="nc-2c4b_89494 row-center-start">
              <img
                src="./imgs/b5d561a51fba54b070c809ca0a08070a.png"
                data-node-type="image"
                class="nc-6c49_36555"
              />
              <img
                src="./imgs/df2cd4f9b0e4800ff7104dce1269715b.png"
                data-node-type="image"
                class="nc-4afc_59037"
              />
              <img
                src="./imgs/b7a3962137b3c3df6b185b40006bf19d.png"
                data-node-type="image"
                class="nc-12a4_84032"
              />
            </div>

            <img
              src="./imgs/219e2c3f981953d519ee16c344898f1c.png"
              data-node-type="image"
              class="nc-6d90_64137"
            />
            <img
              src="./imgs/6c05ba23054a473768adcb01c249e299.png"
              data-node-type="image"
              class="nc-45af_60099"
            />
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div
            data-node-type="scroll-view"
            class="nc-2e03_57356 column-center-center"
          >
            <div data-node-type="view" class="nc-254d_59521">
              <img
                src="./imgs/de9f991515524fef8815856482af5050.png"
                data-node-type="image"
                class="nc-49a9_08809"
              />
              <img
                src="./imgs/0972934957a32ae322438a8e019e1955.png"
                data-node-type="image"
                class="nc-8fd6_26688"
              />
              <img
                src="./imgs/19e06af7e892be48c2aaa07c343569ee.png"
                data-node-type="image"
                class="nc-8277_35607"
              />
              <img
                src="./imgs/2de03dcb9758eb0d12868b6943fadd06.png"
                data-node-type="image"
                class="nc-1fcc_81275"
              />
            </div>

            <img
              src="./imgs/cdc583d4cf70b8fb42cc0d9fce7101f4.png"
              data-node-type="image"
              class="nc-5416_50680"
            />
            <img
              src="./imgs/687d8d73f11c2d8c65482b47a642864a.png"
              data-node-type="image"
              class="nc-74ad_31743"
            />
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="engine layout flex-column">
          <div
            data-node-type="scroll-view"
            class="nc-3f1a_61267 column-center-center"
          >
            <img
              src="./imgs/5c96ae6dc303e98e832a232393578984.png"
              data-node-type="image"
              class="nc-69b3_06591"
            />
            <img
              src="./imgs/e70711c73108ab49dd234acdfb64c785.png"
              data-node-type="image"
              class="nc-54ce_92633"
            />
            <img
              src="./imgs/a587504c38c9b505852bfa0fb55eece0.png"
              data-node-type="image"
              class="nc-2d4c_74686"
            />
            <img
              src="./imgs/5d8b84b3679be77bac4b8685572cd410.png"
              data-node-type="image"
              class="nc-8243_27990"
            />

            <div
              data-node-type="view"
              class="nc-6ffe_30054 column-start-center"
            >
              <div data-node-type="view" class="nc-5131_39552 row-start-start">
                <img
                  :src="portrait.wxphoto"
                  :key="index"
                  data-node-type="image"
                  class="nc-8900_31409"
                  v-for="(portrait, index) in list"
                  v-if="index < 10"
                />
              </div>
              <div class="nc-11fe_51929 number-box">
                <img src="./imgs/n.png" data-node-type="image" />
                <ul>
                  <li v-for="(item, index) in count" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Swiper from "swiper";
// import Swiper styles
import "swiper/swiper-bundle.css";

import Player from "@/components/Player";
import { get } from "@/api/http";
import { router, wxApi } from "@/utils";
import injectLikeEffect from "@/utils/flowers";
///Api/userBindWx_api.php
const API = {
  AUTH(redirect_uri) {
    return get("/Api/getWxSQ_api.php", { redirect_uri });
  },
  USER_INFO(code) {
    return get("/Api/getWxInfo_api.php", { code });
  },

  LIKE(params) {
    return get("/Api/sendFlower_api.php", params);
  },
  LIST() {
    return get("/Api/getFlowerList_api.php");
  },
};
//获得角度
function getAngle(angx, angy) {
  return (Math.atan2(angy, angx) * 180) / Math.PI;
}

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;

  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }

  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if (
    (angle >= 135 && angle <= 180) ||
    (angle >= -180 && angle < -135)
  ) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }

  return result;
}
const poster = require("./poster.jpeg");

export default {
  name: "_819",
  head() {
    return {
      title: "医师节生殖医生专访",
      // script: [{ src: "./jquery.js" }],
    };
  },
  data() {
    return {
      step: 0,
      index: NaN,
      poster,
      list: [],
      config: null,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    query() {
      return this.$route.query;
    },
    newest() {
      const { list } = this;
      if (list.length) {
        return list[0];
      } else {
        return null;
      }
    },
    count() {
      const { list } = this;
      const r = String(list.length).split("");
      while (r.length < 6) {
        r.unshift("0");
      }
      return r;
    },
  },
  created() {
    if (process.browser) {
      const { code } = this.query;
      if (code) {
        return this.bind(code);
      }
      if (!this.code) {
        this.config = {};
        this.next();
        // return this.getUserInfo();
      }
    }
  },
  mounted() {
    const config = {
      desc: "819医师节生殖医生专访", // 描述
      title: "致敬生命创造者致敬中国医师节", // 分享标题
    };
    wxApi.onMenuShareAppMessage({
      ...config,
      // desc: desc, // 分享描述
      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "https://www.drsongzi.com/819.png", // 分享图标
    });
    wxApi.updateTimelineShareData({
      ...config,
      link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "https://www.drsongzi.com/819.png", // 分享图标
    });
    document.body.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      },
      { passive: false }
    );
  },
  watch: {
    query(v) {
      const { code } = v;
      if (code) {
        this.bind(code);
      }
    },
  },
  methods: {
    back() {
      return router.back();
    },
    next() {
      this.step = 1;
      this.$nextTick(() => {
        this.initSwiper();
        setTimeout(() => {
          this.injectLikeEffect({
            className:'_819-flowers'
          });
        }, 1000);
      });
    },
    getUserInfo() {
      //   this.step = 1;
      //   this.$nextTick(this.initSwiper);
      //   return;
      API.AUTH(location.href).then((res) => {
        window.location.href = res.rUrl;
      });
    },
    bind(code) {
      API.USER_INFO(code).then((res) => {
        this.config = res;
        this.next();
      });
    },
    initSwiper() {
      const that = this;
      this.index = 0;
      const swiper = new Swiper(this.$refs.slide, {
        direction: "vertical",
        on: {
          slideChangeTransitionStart() {
            that.index = this.activeIndex;
          },
        },
      });
      this.getCurrentLike();
      return;
      let startx, starty;
      window.swiper = swiper;
      const selections = [
        ...document.querySelectorAll(".swiper-slide .engine"),
      ].map((dom) => dom.firstChild);
      selections.map((container) => {
        container.addEventListener(
          "touchmove",
          (e) => {
            e.stopPropagation();
          },
          false
        );
      });
      window.addEventListener(
        "touchstart",
        (e) => {
          startx = e.touches[0].pageX;
          starty = e.touches[0].pageY;
        },
        false
      );
      window.addEventListener("touchmove", (e) => {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        console.log(direction, "direction");
        e.stopPropagation();
        const index = swiper.activeIndex;
        const container = selections[index];
        if (
          direction === 1 &&
          index < 6 &&
          container.offsetHeight <= container.scrollHeight - container.scrollTop
        ) {
          swiper.slideNext();
        }
        if (direction === 2 && index && !container.scrollTop) {
          swiper.slidePrev();
        }
      });

      window.addEventListener("touchend", (e) => {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        e.stopPropagation();
        const index = swiper.activeIndex;
        const container = selections[index];
        if (
          direction === 1 &&
          index < 6 &&
          container.offsetHeight <= container.scrollHeight - container.scrollTop
        ) {
          swiper.slideNext();
        }
        if (direction === 2 && index && !container.scrollTop) {
          swiper.slidePrev();
        }
      });
    },
    getCurrentLike() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        API.LIST().then((res) => {
          this.list = res;
          this.getCurrentLike();
        });
      }, 1000);
    },
    like() {
      API.LIKE(this.config);
    },
    injectLikeEffect: injectLikeEffect,
  },
  components: {
    Player,
  },
};
</script>
<style lang="scss">
@import "./engine.scss";
canvas._819-flowers {
    position: absolute;
    z-index: 999;
    right: 0vw;
    bottom: 11vw;
}
.engine {
  .tip {
    position: absolute;
    z-index: 9;
    top: 9vw;
    right: 6vw;
    /* width: 35vw; */
    height: 10vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 2vw;
    background: url("./imgs/bg.png") no-repeat center center / 100% 100%;
    .portrait {
      width: 8vw;
      height: 8vw;
      border-radius: 50%;
    }
    .info {
      margin: 0 2vw;
      font-size: 11px;
      font-weight: bold;
      color: #fff;
      .name {
        font-size: 12px;
        margin-bottom: 2px;
      }
    }
    .icon {
      width: 5vw;
      height: 5vw;
    }
  }
  .number-box {
    position: relative;
    img {
      display: block;
      width: 100%;
    }
    ul {
      position: absolute;
      right: 31.4vw;
      bottom: 0vw;
      display: flex;
      flex-direction: row;
      align-self: center;
      li {
        margin-left: 0.8vw;
        width: 2.8vw;
        height: 4.8vw;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        background: #4483f5;
      }
    }
  }
  .vjs-big-play-button {
    top: 50%;
    margin-top: -0.8em;
    margin-left: -1.5em;
    left: 50%;
  }
  .nc-3b47_01449 {
    position: absolute;
    z-index: 1;
    right: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
  }

  .nc-7723_72204 {
    margin-top: 5vw;
    margin-bottom: 5vw;
    width: 19vw;
  }

  .nc-3211_75212 {
    width: 59vw;
  }

  .nc-5f44_04562 {
    width: 69vw;
  }

  .nc-3c64_94923 {
    position: absolute;
    z-index: 1;
    right: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
  }

  .nc-440e_72979 {
    background: url("./imgs/77db8030771742a0743b5e6a8f3ff48e.png") bottom center /
        contain no-repeat,
      url("./imgs/8b1d18472c9b1827436506b2fda28819.png") center center / cover
        repeat;
    position: relative;
    z-index: 1;
    width: 100%;
    flex: 1;
  }
  //1
  .pp {
    position: relative;
    width: 100%;
    margin: 6vw 0;
  }
  .nc-8a00_74339 {
    position: absolute;
    z-index: 1;
    // top: 88vw;
    left: 10vw;
    width: 20vw;
  }

  .nc-1495_93418 {
    position: absolute;
    z-index: 1;
    // top: 91vw;
    right: 10vw;
    width: 20vw;
  }

  .nc-4c7c_25204 {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 2px;
    background: rgba(255, 255, 255, 1);
    // margin-top: 13vw;
    // margin-bottom: 15vw;
    width: 97vw;
    height: 57vw;
  }

  .nc-5544_35799 {
    width: 38vw;
  }

  .nc-9540_70037 {
    // margin-top: -10vw;
    width: 53vw;
  }

  .nc-413a_13599 {
    background: url("./imgs/12591a55648d6bbcabbd71ca58e0af4e.png") bottom center /
      cover repeat;
    position: relative;
    z-index: 1;
    width: 100%;
    flex: 1;
  }
  //1

  //2
  .nc-2e78_14747 {
    position: absolute;
    z-index: 4;
    top: 4vw;
    left: 4vw;
    width: 3vw;
  }

  .nc-5be9_10826 {
    margin-right: 3vw;
    margin-left: 4vw;
    width: 9vw;
  }

  .nc-119e_97602 {
    margin-top: 7vw;
    margin-right: 23vw;
    width: 9vw;
  }

  .nc-289b_58219 {
    margin-top: 18vw;
    width: 24vw;
  }

  .nc-25c5_15115 {
    margin-top: 5vw;
  }

  .nc-4531_73186 {
    margin-top: 3vw;
    margin-bottom: 10vw;
    width: 48vw;
  }

  .nc-540b_46872 {
    // margin-bottom: 34vw;
    width: 73vw;
  }

  .nc-2c55_58849 {
    background: url("./imgs/12591a55648d6bbcabbd71ca58e0af4e.png") bottom center /
      cover repeat;
    position: relative;
    z-index: 1;
    width: 100%;
    flex: 1;
  }

  .nc-2f47_22130 {
    position: absolute;
    z-index: 3;
    bottom: 6vw;
    margin-left: -3.5vw;
    left: 50%;
    width: 7vw;
  }

  .nc-815c_83799 {
    position: absolute;
    z-index: 9;
    right: 6vw;
    bottom: 6vw;
    width: 11vw;
  }

  .nc-497c_22455 {
    width: 100%;
    flex: 1;
  }
  //2

  //3
  .nc-73b2_94249 {
    position: absolute;
    z-index: 1;
    top: 46vw;
    right: 7vw;
    width: 3.4vw;
  }

  .nc-850c_79368 {
    position: absolute;
    z-index: 1;
    top: 31vw;
    left: 7vw;
    width: 3vw;
  }

  .nc-1ebf_07142 {
    margin-top: 4vw;
    width: 67vw;
  }

  .nc-4930_39710 {
    margin-top: 6vw;
    margin-bottom: 6vw;
    width: 57vw;
  }

  .nc-2cf6_96911 {
    width: 57vw;
  }

  .nc-6473_69110 {
    margin-top: 4vw;
    /* margin-bottom: 20vw; */
    width: 57vw;
  }

  .nc-6333_01801 {
    background: url("./imgs/12591a55648d6bbcabbd71ca58e0af4e.png") bottom center /
      cover repeat;
    position: relative;
    z-index: 1;
    width: 100%;
    flex: 1;
  }
  //3

  //4
  .nc-6c49_36555 {
    margin-left: 4vw;
    width: 9vw;
  }

  .nc-4afc_59037 {
    margin-right: 31vw;
    margin-left: 3vw;
    width: 9vw;
  }

  .nc-12a4_84032 {
    width: 15vw;
    position: relative;
    top: 14vw;
  }

  .nc-2c4b_89494 {
    margin-top: 8vw;
    // margin-bottom: 2vw;
  }

  .nc-6d90_64137 {
    width: 62vw;
  }

  .nc-45af_60099 {
    margin-top: 5vw;
    // margin-bottom: 23vw;
    width: 56vw;
  }

  .nc-2b87_62818 {
    position: relative;
    z-index: 1;
    background: url("./imgs/12591a55648d6bbcabbd71ca58e0af4e.png") center center /
      cover repeat;
    width: 100%;
    flex: 1;
  }
  //4

  //5
  .nc-49a9_08809 {
    position: absolute;
    z-index: 1;
    top: 17vw;
    right: 3vw;
    width: 16vw;
  }

  .nc-8fd6_26688 {
    margin-bottom: 2vw;
    margin-left: 15vw;
    width: 16vw;
  }

  .nc-8277_35607 {
    margin-bottom: 6vw;
    width: 49vw;
  }

  .nc-1fcc_81275 {
    margin-left: 32vw;
    width: 49vw;
  }

  .nc-254d_59521 {
    position: relative;
    z-index: 1;
    width: 81vw;
  }

  .nc-5416_50680 {
    margin-top: 2vw;
    margin-bottom: 5vw;
    width: 67vw;
  }

  .nc-74ad_31743 {
    // margin-bottom: 27vw;
    width: 46vw;
  }

  .nc-2e03_57356 {
    position: relative;
    z-index: 1;
    background: url("./imgs/12591a55648d6bbcabbd71ca58e0af4e.png") bottom center /
      cover repeat;
    width: 100%;
    flex: 1;
  }
  //5

  //6
  .nc-69b3_06591 {
    margin-top: 5vw;
    /* margin-bottom: 3vw; */
    width: 61vw;
  }

  .nc-54ce_92633 {
    width: 45vw;
  }

  .nc-2d4c_74686 {
    margin-bottom: -10vw;
    width: 69vw;
    margin-top: -14vw;
  }

  .nc-8243_27990 {
    margin-bottom: 7vw;
    width: 64vw;
  }

  .nc-8900_31409 {
    margin-right: 2vw;
    width: 11vw;
    height: 11vw;
    border-radius: 50%;
  }

  .nc-5131_39552 {
    height: 100%;
    flex: 1;
    flex-wrap: wrap;
    padding-top: 6vw;
    padding-left: 4vw;
  }

  .nc-11fe_51929 {
    width: 63vw;
  }

  .nc-6ffe_30054 {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 9px;
    background: rgba(255, 255, 255, 1);
    /* margin-bottom: 25vw; */
    padding-bottom: 6vw;
    width: 87vw;
    min-height: 53vw;
  }

  .nc-3f1a_61267 {
    background: url("./imgs/12591a55648d6bbcabbd71ca58e0af4e.png") bottom center /
      cover repeat;
    width: 100%;
    flex: 1;
  }
  //6
}
</style>
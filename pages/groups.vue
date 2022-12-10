<template>
  <Page title="好孕社群">
    <div class="groups-page page-full">
      <List
        :request="request"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
      <div v-if="layer.visible" class="layer flex-column align" @click="layer.visible = false">
        <div class="inner flex-column center">
          <p class="label">识别二维码</p>
          <p class="name">添加好孕社区</p>
          <CoverImage class="code" :url="layer.data.qQR" />
          <p class="hint">长按识别二维码</p>
        </div>
        <img :src="icons.close1" alt="" class="close" />
      </div>
    </div>
  </Page>
</template>
<script>
import day from "dayjs";

import { get, post } from "@/api/http";
import { Tip, router } from "@/utils";
import { icons } from "@/assets";
import CoverImage from "@/components/CoverImage";
import { toArray } from '../utils';
const API = {
  LIST(params) {
    return get("/Api/getQQAllList_api.php", params);
  },
  SEND(params) {
    return post("/Api/sendInquiry_api.php", params, { json: false });
  },
  QUERY_NUM() {
    return get("/Api/getUserSendNum_api.php");
  },
};

export default {
  name: "notes",
  head() {
    return {
      title: "好孕社群",
    };
  },
  data() {
    return {
      icons,
      layer: {
        data:null,
        visible:false
      },
    };
  },
  methods: {
   
    request() {
      return API.LIST();
      // return API.LIST();
    },
    refresh() {
      this.$refs.list && this.$refs.list.refresh();
    },
    format(item) {
      // console.log(item, "item");
      const { SendDate, redate, ...o } = item;
      const d = day((SendDate || redate) * 1000);
      return {
        ...o,
        day: d.format("MM/DD"),
        time: d.format("HH:mm"),
        isChild: !!redate,
      };
    },
    renderItem(item) {
      const {qName,qRemarks,qNum,qImg} = item;
      return (
        <div class="item flex-row">
          <CoverImage class="cover" url={toArray(qImg)[0]}/>
          <div class="item-right flex-row center">
            <div class="info">
              <p class="name">{qName}</p>
              <p class="desc">{qRemarks || '暂无介绍'}</p>
              <div class="count-box flex-row align">
                <img src={icons.people} class="icon" />
                <span class="label">{qNum}人</span>
              </div>
            </div>
            <button onClick={()=>{
              this.layer={
        data:item,
        visible:true
      }
            }} class="join">加入</button>
          </div>
        </div>
      );
    },
    handleMenuClick(menu) {
      router.push({
        path: "/notes/publish",
        query: {
          // type: menu.query,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.groups-page {
  /* padding: 0.1rem 0.12rem; */
  position: relative;
  background: #f3f5f9;
  .list {
    /* height: calc(100% - 0.3rem); */
    height: 100%;
    .item {
      margin-top: 0.1rem;
      height: 1rem;
      padding: 0.15rem;
      background: #fff;
      .cover {
        margin-right: 0.09rem;
        width: 0.69rem;
        height: 0.69rem;
      }
      .item-right {
        flex: 1;
      }
      .name {
        font-size: 0.16rem;
        font-weight: 500;
        color: #000;
      }
      .desc {
        margin-bottom: 0.08rem;
        font-size: 0.12rem;
        color: #999999;
      }
      .count-box {
        display: inline-block;
        height: 0.16rem;
        padding: 0 0.05rem;
        background: rgba($color: #4c87f9, $alpha: 0.1);
        border-radius: 3px;
        .icon {
          margin-right: 2px;
          width: 0.11rem;
        }
        .label {
          font-size: 0.1rem;
          color: #4c87f9;
          font-weight: 500;
        }
      }
      .info {
        width: 0;
        flex: 1;
      }
      .join {
        width: 0.58rem;
        height: 0.26rem;
        font-size: 0.14rem;
        color: #ffffff;
        background: linear-gradient(160deg, #fea845 0%, #fe6a22 100%);
        border-radius: 0.13rem;
      }
    }
  }
  .layer {
    position: absolute;
    top: 0;
    right: 0;
    /* bottom: 0; */
    left: 0;
    background: rgba($color: #000000, $alpha: .7);
    .inner {
      width: 3.75rem;
      height: 6.5rem;
      background: url("../assets/img/code-model-bg.png") no-repeat center center /
        100% 100%;
      .label {
        margin-top: 1.2rem;
        font-size: 0.22rem;
        font-family: FZZZHONGJW--GB1-0, FZZZHONGJW--GB1;
        font-weight: normal;
        color: #000000;
        letter-spacing: 2px;
        background: linear-gradient(198deg, #ffedd4 0%, #ffddba 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .name {
        font-size: 0.33rem;
        font-family: FZZZHONGJW--GB1-0, FZZZHONGJW--GB1;
        font-weight: normal;
        color: #000000;
        letter-spacing: 4px;
        background: linear-gradient(198deg, #ffedd4 0%, #ffddba 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .code {
        margin-top: 0.8rem;
        width: 1.54rem;
        height: 1.54rem;
      }
      .hint {
        margin-top: 0.4rem;
        font-size: 0.14rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #575773;
      }
    }
    .close {
      margin: 0.5rem 0 ;
      width: 0.3rem;
    }
  }
}
</style>
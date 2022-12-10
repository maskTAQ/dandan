<template>
  <Page title="好孕嘉年华" fixed>
    <StatusHandle :get="getData">
      <div class="insurance">
        <img class="bg" src="./imgs/banner@2x.png" alt="" srcset="" />
        <div class="content">
          <img class="plan" src="./imgs/计划@2x.png" alt="" srcset="" />
          <div class="card card-1">
            <p class="title">保障计划</p>
            <p class="subtitle">瑞孕试管婴儿手术保险主险保障内容</p>
            <p class="intro">（A/B/C保障方案的投保条件不同，详情请咨询专员）</p>
            <img src="./imgs/表格@2x.png" alt="" srcset="" />
            <div class="list">
              <div
                v-for="item in list"
                :key="item.label"
                class="item flex-row main-between center"
              >
                <i class="label">{{ item.label }}</i>
                <i class="value">{{ item.value }}</i>
              </div>
            </div>
            <img src="./imgs/表格备份@2x.png" alt="" srcset="" />
          </div>
          <div class="card card-2">
            <p class="title">理赔无忧</p>
            <div class="ensure flex-row center">
              <div
                v-for="item in ensure"
                :key="item"
                class="item flex-row center"
              >
                <span class="circle"></span>
                <i class="label">{{ item }}</i>
              </div>
            </div>
            <div class="tag">
              <div
                v-for="item in tag"
                :key="item.company"
                class="item flex-row center"
              >
                <img src="./imgs/logo.png" alt="" class="icon" />
                <i class="company">{{ item.company }}</i>
                <i class="service">{{ item.service }}</i>
              </div>
            </div>
          </div>
        </div>
        <div class="fixed-bar flex-row main-between center">
          <div class="btn-gorup flex-row center">
            <a :href="`tel:13715054911`" class="btn flex-column align">
              <img class="icon" src="./imgs/mobile.png" alt="" />
              <i class="label">电话咨询</i>
            </a>
            <div @click="goKf('baoxian')" class="btn flex-column align">
              <img class="icon" src="./imgs/service.png" alt="" />
              <i class="label">客服</i>
            </div>
          </div>
          <button @click="showModel" class="confirm">立即投保</button>
        </div>
        <CodeModal v-model="model.visible" :data="model.data" />
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { icons } from "@/assets";
import { get } from "@/api/http";
import { goKf } from "@/utils";

const code = require("./imgs/code.png");
const API = {
  INSURANCE_INFO() {
    return get("/Api/getBxInfo_api.php");
  },
};
export default {
  name: "insurance",
  head() {
    return {
      title: "好孕嘉年华",
    };
  },
  data() {
    return {
      icons,
      data: {},
      list: [
        {
          label: "方案A保障金额",
          value: "70000元",
        },
        {
          label: "方案B保障金额",
          value: "50000元",
        },
        {
          label: "方案C保障金额",
          value: "35000元",
        },
      ],
      ensure: ["闪电理赔，一般案件7个工作日完成", "支持在线电话自助"],
      tag: [
        {
          company: "中国人保",
          service: "专业理赔团队服务",
        },
        {
          company: "瑞孕",
          service: "全程监督理赔速度和质量",
        },
      ],
      model: {
        visible: false,
        data: {},
      },
    };
  },
  methods: {
    goKf,
    getData() {
      return API.INSURANCE_INFO().then((res) => {
        this.data = res;
      });
    },
    showModel(data) {
      this.model = {
        visible: true,
        data: {
          code,
          title: "长按识别添加专员",
          subtitle: "免费获得多项助孕服务",
        },
      };
    },
  },
};
</script>
<style lang="scss">
@import "../../assets/theme.scss";
.insurance {
  background: #f5f7f9;
  padding-bottom: 0.6rem;
  img {
    display: block;
    width: 100%;
  }
  .content {
    position: relative;
    top: -0.4rem;
    padding: 0 0.12rem;
  }
  .card {
    padding: 0.16rem 0.12rem;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(76, 135, 249, 0.05);
    border-radius: 8px;
    .title {
      font-size: 0.14rem;
      font-weight: bold;
      color: $color4;
    }
    .subtitle,
    .intro {
      font-size: 0.12rem;
      color: $color4;
    }
    .subtitle {
      margin-top: 0.06rem;
      margin-bottom: 0.02rem;
    }
    .intro {
      margin-bottom: 0.1rem;
    }
    .list {
      margin-bottom: 0.12rem;
      padding: 0.12rem 0;
      border-bottom: 1px solid $border;
      .item {
        line-height: 0.24rem;
      }
      .label,
      .value {
        font-size: 0.12rem;
        color: $color4;
      }
      .label {
        font-weight: bold;
      }
    }
    .ensure {
      margin-top: 0.06rem;
      margin-bottom: 0.1rem;
      .item {
        margin-right: 0.12rem;
        &:last-child {
          margin-right: 0;
        }
      }
      .circle {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba($color: $color1, $alpha: 0.3);
      }
      .label {
        margin-left: 3px;
        font-size: 0.12rem;
        color: $color6;
      }
    }
    .tag {
      .item {
        margin-bottom: 0.08rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .icon {
        width: 0.16rem;
      }
      .company {
        margin-left: 0.12rem;
        margin-right: 0.04rem;
        font-size: 0.14rem;
        font-weight: bold;
        color: $color4;
      }
      .service {
        font-size: 0.14rem;
        color: $color4;
      }
    }
  }
  .card-1 {
    margin: 0.1rem 0;
  }
  .fixed-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.6rem;
    padding: 0 0.12rem;
    background: #fff;
    box-shadow: 0px -1px 12px 0px rgba(76, 135, 249, 0.05);

    .btn-gorup {
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
    }
    .confirm {
      height: 0.42rem;
      padding: 0 0.44rem;
      line-height: 0.42rem;
      font-size: 0.16rem;
      color: #fff;
      background: $color1;
      border-radius: 0.21rem;
    }
  }
}
</style>
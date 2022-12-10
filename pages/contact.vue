<template>
  <Page title="联系我们">
    <div class="contact page-full">
      <div class="card top">
        <div
          v-for="item in list.top"
          :key="item.label"
          class="item flex-column main-center"
        >
          <p class="label">{{ item.label }}</p>
          <p class="value">{{ params[item.key] }}</p>
        </div>
      </div>
      <div class="card bottom">
        <div
          v-for="item in list.bottom"
          :key="item.label"
          class="item flex-row main-between center"
        >
          <i class="label">{{ item.label }}</i>
          <i class="value">{{ params[item.key] }}</i>
        </div>
      </div>
    </div>
  </Page>
</template>
<script>
import { get, mock } from "@/api/http";

const API = {
  DETAIL(params) {
    return get("/Api/aboutUs_api.php", params);
  },
};
const data = {
  theUrl: "网站",
  bsEmail: "邮箱",
  address: "地址",
  code: "code",
  bei: "备案编号",
  cert: "非经营性",
  icp: "ICP备",
};
export default {
  name: "contact",
  head() {
    return {
      title: "联系我们",
    };
  },
  data() {
    return {
      list: {
        top: [
          {
            label: "统一社会信用代码",
            key: "code",
          },
          {
            label: "深圳市仅销售预包装食品单位备案凭证",
            key: "bei",
          },
          {
            label: "互联网药品信息服务资格证书",
            key: "cert",
          },
          {
            label: "网站备案",
            key: "icp",
          },
        ],
        bottom: [
          {
            label: "网址",
            key: "theUrl",
          },
          {
            label: "商务合作",
            key: "bsEmail",
          },
          {
            label: "地址",
            key: "address",
          },
          {
            label: "招聘简历",
            key: "bsEmail",
          },
        ],
      },
      // params: {
      //   // a: "www.vmweimei.com",
      //   // b: "1156343306@qq.com",
      //   // c: "内容名称",
      //   // d: "154521@cru.com",
      // },
      params: data,
    };
  },
  methods: {
    getData() {
      return API.DETAIL().then((res) => {
        this.params = res;
      });
    },
  },
};
</script>
<style lang="scss">
.contact {
  padding: 0.15rem 0.13rem;
  background: #f5f7f9;
  .card {
    background: #fff;
    border-radius: 4px;
    padding: 0 0.11rem;
    &.top {
      margin-bottom: 0.15rem;
    }
    .item {
      height: 0.55rem;
      border-bottom: 1px solid #efefef;
      &:last-child {
        border-bottom: none;
      }
      .icon {
        margin-right: 0.08rem;
        width: 0.12rem;
      }
      .label {
        font-size: 0.14rem;
        color: #313131;
      }
      .value {
        font-size: 0.14rem;
        color: #aaaaaa;
      }
      .right {
        font-size: 0.14rem;
        color: #aaaaaa;
      }
      .right-icon {
        width: 0.06rem;
      }
    }
  }
}
</style>
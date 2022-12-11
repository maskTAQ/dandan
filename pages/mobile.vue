<template>
  <Page title="更换绑定">
    <StatusHandle :get="getUserInfo">
      <div class="mobile-page page-full">
        <div v-if="step === 0" class="card">
          <p class="title">为保护你的账号安全，请先验证手机号码</p>
          <p class="mobile">
            <i class="code">+86</i>
            <i class="value">{{ mobile }}</i>
          </p>
          <InputVerifyCode @complete="handleCodeChange" />
          <div class="btn-box flex-row">
            <van-button @click="getCode" :loading="loading.code" class="get"
              >获取验证码</van-button
            >
          </div>
        </div>
        <div v-else class="card">
          <p class="title">请重新输入您更换的账号密码</p>
          <div class="field">
            <p class="label">手机号码</p>
            <Input
              v-model="params.mobile"
              class="mt-24"
              type="code"
              placeholder="请输入手机号"
              :request="getCode"
            />
          </div>
          <div class="field">
            <p class="label">验证码</p>
            <Input
              v-model="params.code"
              class="mt-24"
              placeholder="请输入验证码"
            />
            <p v-if="false" class="hint">
              密码长度6 -32位,包含数字、字母、符号至少2种
            </p>
          </div>
        </div>

        <van-button :loading="loading.submit" @click="submit" class="submit"
          >{{ step ? "确认修改" : "下一步" }}
        </van-button>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { encodeMobile, LoadingControl, Tip, router } from "@/utils";
import { get, mock } from "@/api/http";
import { icons } from "@/assets";

const API = {
  DEDAIL() {
    return get("/Api/getUserInfo_api.php");
  },
  GET_CODE(tel) {
    return get("/Api/sendTelCode_api.php", { tel });
  },
  VERIFY_CODE(params) {
    return get("/Api/ExTelCode_api.php", params);
  },
  BIND_MOBILE(params) {
    return get("/Api/bindUserTel_api.php", params);
  },
};
export default {
  name: "mobile",
  head() {
    return {
      title: "更换绑定",
    };
  },
  data() {
    return {
      step: 0,
      userInfo: {},
      loading: {
        code: false,
        submit: false,
      },
      params: {
        mobile: "",
        code: "",
      },
    };
  },
  computed: {
    mobile() {
      return encodeMobile(this.userInfo.UserName);
    },
  },
  methods: {
    getUserInfo() {
      return API.DEDAIL().then((res) => {
        this.userInfo = res;
      });
    },
    getCode() {
      const { mobile } = this.params;
      const value = this.step === 0 ? this.userInfo.UserName : mobile;
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
        Tip.error("请输入正确的手机号");
        return Promise.reject();
      }
      return LoadingControl({
        call: API.GET_CODE,
        params: value,
        change: ({ loading }) => {
          this.loading.code = loading;
        },
      }).then((res) => {
        Tip.success("发送成功,请注意查收!");
      });
    },
    handleCodeChange(v) {
      this.params.code = v;
    },
    submit() {
      const {
        step,
        params: { mobile, code },
      } = this;
      if (step === 0) {
        if (code.length !== 4) {
          return Tip.error("请输入验证码");
        }
        LoadingControl({
          call: API.VERIFY_CODE,
          params: {
            tel: this.userInfo.UserName,
            code,
          },
          change: ({ loading }) => {
            this.loading.submit = loading;
          },
        }).then((res) => {
          this.params.code = "";
          this.step = 1;
        });
      } else {
        LoadingControl({
          call: API.BIND_MOBILE,
          params: {
            tel: mobile,
            code: code,
          },
          change: ({ loading }) => {
            this.loading.submit = loading;
          },
        }).then((res) => {
          Tip.success("修改成功");
          setTimeout(() => router.back(), 2000);
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.mobile-page {
  padding: 0.15rem 0.13rem;
  background: $color8;
  .card {
    padding: 0 0.15rem;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .title {
      padding: 0.35rem 0;
      font-size: 0.14rem;
      color: #333333;
    }
    .mobile {
      margin-bottom: 0.2rem;
      font-size: 0.22rem;
      font-weight: bold;
      color: #333333;
      .code {
        margin-right: 0.1rem;
      }
    }
    .field {
      margin-bottom: 0.2rem;
      font-size: 0.14rem;
      color: #333333;
      .input-box input {
        font-size: 0.14rem;
        color: #c6c6c6;
      }
      .hint {
        margin-top: 0.1rem;
        font-size: 0.12rem;
        color: #aaaaaa;
      }
    }
    .btn-box {
      justify-content: flex-end;
      .get {
        margin-top: 0.2rem;
        margin-bottom: 0.38rem;
        font-size: 0.12rem;
        color: #6dc7c6;
        background: none;
        border: none;
        padding: 0;
      }
    }
  }
  .submit {
    margin: 0 auto;
    display: block;
    margin-top: 0.46rem;
    width: 1.38rem;
    height: 0.34rem;
    font-size: 0.14rem;
    color: #fff;
    background: $color1;
    border-radius: 0.16rem;
  }
}
</style>
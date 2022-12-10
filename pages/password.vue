<template>
  <Page title="重置密码">
    <StatusHandle :get="getUserInfo">
      <div class="password page-full">
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
            <p class="label">密码</p>
            <Input
              v-model="params.password"
              class="mt-24"
              type="password"
              placeholder="请输入新密码"
            />
          </div>
          <div class="field">
            <p class="label">确认密码</p>
            <Input
              v-model="params.passwordT"
              type="password"
              class="mt-24"
              placeholder="请确认密码"
            />
            <p v-if="false" class="hint">
              密码长度6 -32位,包含数字、字母、符号至少2种
            </p>
          </div>
        </div>
        <button @click="submit" class="submit">
          {{ step ? "修改" : "下一步" }}
        </button>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { encodeMobile, LoadingControl, Tip, router } from "@/utils";
import { mock } from "../api";
import { get } from "@/api/http";
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
  SET_PASSWORD(params) {
    return get("/Api/bindUserPwd_api.php", params);
  },
};
export default {
  name: "password",
  head() {
    return {
      title: "重置密码",
    };
  },
  data() {
    return {
      icons,
      step: 0,
      userInfo: {},
      loading: {
        code: false,
        submit: false,
      },
      params: {
        password: "",
        passwordT: "",
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
        params: { password, passwordT, code },
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
        if (!password) {
          return Tip.error("请输入密码");
        }
        if (password !== passwordT) {
          return Tip.error("俩次输入的密码不一致");
        }
        LoadingControl({
          call: API.SET_PASSWORD,
          params: {
            pwd: password,
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
.password {
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
        color: #2D4EF5;
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
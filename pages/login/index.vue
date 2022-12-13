<template>
  <div :class="['login page-full', currentType]" ref="container">
    <client-only>
      <div :class="['login-inner', currentType]" v-if="currentType === TYPE.LOGIN_BY_CODE">
        <img :src="icons.back1" alt="" class="icon-back1" @click="toggle(TYPE.LOGIN_BY_PASSWORD)">
        <div class="logo-box flex-column center">
          <img :src="icons.logoText" alt="" class="logo"  />
          <p class="logo-text">旦旦医学</p>
        </div>
        <div class="field-header">
          <div class="text">手机号/账号</div>
          <Input v-model="params.mobile" class="input-mobile-get-code" type="mobile" placeholder="请输入您的手机号"
            :request="getCode" :icon="icons.bottomWhite" @areaCodeChange="handleAreaCodeChange" />
        </div>
        <div class="agreen-box">
          <van-checkbox class="agree" v-model="agree" checked-color="#fff" shape="square">
            <template #icon="props">
              <img class="icon" :src="props.checked ? icons.checked : icons.unchecked" />
            </template>
            <div class="flex-row center">
              <i>我已经阅读并同意</i>
              <i @click.stop="goProtocol" class="protocol">《用户隐私协议》</i>
            </div>
          </van-checkbox>
        </div>
        <div class="flex-row center main-center">
          <van-button @click="confirm" class="confirm yzm-btn" :loading="loading" :disabled="disabled">
            {{ confirmBtnLabel }}
          </van-button>
        </div>
        <div class="line-qt flex-row center flex-column main-center">
          <span class="line-names">其他方式登录</span>
        </div>
        <div class="other-login-ways flex-row align">
          <button @click="requestWXAuth" class="login-way flex-column align">
            <img :src="icons.wechat1" alt="" class="icon" />
            <!-- <span class="label">微信登录</span> -->
          </button>
          <button @click="toggle(TYPE.LOGIN_BY_PASSWORD)" class="login-way flex-column align">
            <img :src="icons.mm" alt="" class="icon" />
            <!-- <span class="label">密码登录</span> -->
          </button>
        </div>

      </div>
      <div :class="['login-inner', currentType]" v-if="currentType === TYPE.INPUT_CODE">
        <!-- <div class="back-box" @click="toggle(TYPE.LOGIN_BY_CODE)"> -->
        <img :src="icons.back1" alt="" class="icon-back1" @click="toggle(TYPE.LOGIN_BY_CODE)">
        <!-- </div> -->
        <p class="timedown" v-if="timeDown">
          00:{{ String(timeDown).length === 1 ? `0${timeDown}` : timeDown }}
        </p>
        <!-- <div class="login-mobile flex-row center">
          <span class="text">登录:</span>
          <span class="value">{{ encodeMobile(params.mobile) }}</span>
        </div> -->
        <p class="hint">
          请接收以上短信验证码 将用作您的旦旦医学绑定
          账号后期服务更新等资讯将同步到对应手机短信中
        </p>
        <!-- <div class="img-box align">
          <img :src="icons.inputCode" alt="" class="img" />
        </div> -->
        <InputVerifyCode @focus="handleFocus" @complete="handleCodeChange" />
        <van-button v-if="!timeDown" class="send-code" @click="requestSendCode">重新发送</van-button>

        <van-button @click="confirm" class="confirm" :loading="loading" :disabled="disabled">
          {{ confirmBtnLabel }}
        </van-button>

      </div>
      <div :class="['login-inner', currentType]" v-if="currentType === TYPE.LOGIN_BY_PASSWORD">

        <div class="logo-box flex-column center">
          <img :src="icons.logoText1" alt="" class="logo" />
          <p class="logo-text">旦旦医学</p>
        </div>
        <div class="field-box">
          <div class="field-header flex-row center">
            <!-- <img :src="icons.user" alt="" class="icon" /> -->
            <span class="text">手机号/账号</span>
          </div>
          <div class="field-input-box">
            <input type="text" v-model="params.mobile" placeholder="请输入您的账号" />
          </div>
        </div>
        <div class="field-box">
          <div class="field-header flex-row center">
            <!-- <img :src="icons.pwd" alt="" class="icon" /> -->
            <span class="text">账号密码</span>
          </div>
          <div class="field-input-box flex-row center main-between">
            <!-- {{openPassword}} -->
            <input :type="openPassword ? 'password' : ''" v-model="params.password" placeholder="请输入您的密码" />
            <img v-if="openPassword" :src="icons.openEye" alt="" class="icon-eye" @click="openPassword = false" />
            <img v-else :src="icons.closeEye" alt="" class="icon-eye" @click="openPassword = true" />
          </div>
        </div>
        <div class="agreen-box">
          <van-checkbox class="agree" v-model="agree" checked-color="#fff" shape="square">
            <template #icon="props">
              <img class="icon" :src="props.checked ? icons.checked : icons.unchecked" />
            </template>
            <div class="flex-row center">
              <i>我已经阅读并同意</i>
              <i @click.stop="goProtocol" class="protocol">《用户隐私协议》</i>
            </div>
          </van-checkbox>
          <div class="no-pass" @click="toggle(TYPE.SET_PASSWORD)">忘记密码？</div>
        </div>
        <van-button @click="confirm" class="confirm" :loading="loading" :disabled="disabled">
          {{ confirmBtnLabel }}
        </van-button>
        <div class="line-qt flex-row center flex-column main-center">
          <span class="line-names">其他方式登录</span>
        </div>
        <div class="other-login-ways flex-row align">
          <button @click="requestWXAuth" class="login-way flex-column align">
            <img :src="icons.wechat1" alt="" class="icon" />
            <!-- <span class="label">微信登录</span> -->
          </button>
          <button @click="toggle(TYPE.LOGIN_BY_CODE)" class="login-way flex-column align">
            <img :src="icons.password1" alt="" class="icon" />
            <!-- <span class="label">验证登录</span> -->
          </button>
        </div>

      </div>
      <div :class="['login-inner', currentType]" v-if="currentType === TYPE.SET_PASSWORD">
        <!-- <div class="back-box" @click="toggle(TYPE.LOGIN_BY_CODE)">
          <img :src="icons.back" alt="" class="icon" />
        </div> -->
        <div class="login-mobile flex-row center">
          <span class="text">设置密码</span>
        </div>
        <p class="hint">
          密码的长度为8-32位，含数字、字母、符号至少两个或2种元素以上
        </p>
        <!-- <div class="img-box align">
          <img :src="icons.setPassword" alt="" class="img" />
        </div> -->
        <div class="field-box">
          <div class="field-header flex-row center">
            <span class="text">请输入密码</span>
          </div>
          <div class="field-input-box">
            <input type="password" v-model="params.password" placeholder="请输入密码" />
          </div>
        </div>
        <div class="field-box">
          <div class="field-header flex-row center">
            <span class="text">请再次输入密码</span>
          </div>
          <div class="field-input-box">
            <input type="password" v-model="params.passwordT" placeholder="请再次输入密码" />
          </div>
        </div>
        <van-button @click="confirm" class="confirm" :loading="loading" :disabled="disabled">
          {{ confirmBtnLabel }}
        </van-button>
      </div>
      <div :class="['login-inner', currentType]" v-if="currentType === TYPE.BIND_MOBILE">
        <!-- <div class="back-box" @click="toggle(TYPE.LOGIN_BY_CODE)">
          <img :src="icons.back" alt="" class="icon" />
        </div> -->
        <div class="login-mobile flex-row center">
          <span class="text">验证手机</span>
        </div>
        <p class="hint">为确定您不错过重要的资讯内容 请您验证手机号码</p>
        <div class="field-box">
          <div class="field-header flex-row center">
            <span class="text">请输入手机号</span>
          </div>
          <Input v-model="params.mobile" class="mt-25" type="mobile" placeholder="请输入您的手机号" :request="getCode"
            @areaCodeChange="handleAreaCodeChange" />
        </div>
        <div class="field-box">
          <div class="field-header flex-row center">
            <span class="text">验证码</span>
          </div>
          <Input v-model="params.code" class="mt-25" type="code" placeholder="请输入验证码" :request="getCode"
            maxlength="4" />
        </div>
        <van-button @click="confirm" class="confirm" :loading="loading" :disabled="disabled">
          {{ confirmBtnLabel }}
        </van-button>
      </div>
      <div v-if="currentType === TYPE.LOGIN_BY_WX" class="in-login flex-column align">
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
        <p class="label">微信登录中</p>
      </div>
    </client-only>
  </div>
</template>
<script>
import { LoadingControl, router, Tip, PARENT, isMobile } from "@/utils";
import { get } from "@/api/http";
import { icons } from "@/assets";

const API = {
  AUTH(redirect_uri) {
    return get("/Api/getWxSQ_api.php", { redirect_uri });
  },
  WX_LOGIN(code) {
    return get("/Api/wxlogin_api.php", { code });
  },
  GET_CODE(params) {
    // return Promise.resolve();
    return get("/Api/sendTelCode_api.php", params);
  },
  //
  LOGIN_WITH_CODE(params) {
    return get("/Api/telLogin_api.php", params);
  },
  LOGIN_BY_PASSWORD(params) {
    return get("/Api/userLogin_api.php", params);
  },
  BIND_MOBILE(params) {
    return get("/Api/bindUserTel_api.php", params);
  },
  SET_PASSWORD(params) {
    return get("/Api/bindUserPwd_api.php", params);
  },
  CHOOSE_ROLE(params) {
    return get("/Api/saveUserState_api.php", params);
  },
};
const TYPE = {
  LOGIN_BY_CODE: "login-by-code",
  LOGIN_BY_PASSWORD: "login-by-password",
  INPUT_CODE: "input-code",
  SET_PASSWORD: "set-password",
  LOGIN_BY_WX: "5",
  BIND_MOBILE: "bind-mobile",
  CHOOSE_ROLE: "7",
};
icons.wechat = require("./imgs/wechat.png");
icons.password = require("./imgs/password.png");
icons.wechat1 = require("./imgs/wechat1.png");
icons.mm = require("./imgs/mm.png");
icons.password1 = require("./imgs/password1.png");
icons.checked = require("./imgs/checked.png");
icons.unchecked = require("./imgs/unchecked.png");
icons.back = require("./imgs/back.png");
icons.user = require("./imgs/user.png");
icons.pwd = require("./imgs/pwd.png");
icons.inputCode = require("./imgs/input-code.png");
icons.logoText1 = require("./imgs/login-text.png");
icons.setPassword = require("./imgs/set-password.png");
icons.openEye = require("./imgs/open-eye.png");
icons.closeEye = require("./imgs/close-eye.png");
icons.back1 = require("./imgs/back1.png");

export default {
  name: "Login",
  data() {
    return {
      icons,
      TYPE: TYPE,
      currentType: TYPE.LOGIN_BY_PASSWORD,
      loading: false,
      agree: false,
      openPassword: true,
      params: {
        mobile: "",
        password: "",
        passwordT: "",
        code: "",
      },
      timeDown: 0,
      loginRes: {},
      isPregnant: true,
      by: "",
      areaCode: "",
      usedCode: "",
    };
  },
  computed: {
    query() {
      return this.$route.query;
    },
    disabled() {
      const { currentType, params } = this;
      switch (currentType) {
        case TYPE.LOGIN_BY_CODE: {
          return !params.mobile.length;
        }
        case TYPE.INPUT_CODE: {
          return params.code.length !== 4;
        }
        default: {
          return false;
        }
      }
    },
    confirmBtnLabel() {
      const { currentType } = this;
      switch (currentType) {
        case TYPE.LOGIN_BY_CODE: {
          return "获取验证码";
        }
        case TYPE.LOGIN_BY_PASSWORD: {
          return "登录";
        }
        case TYPE.INPUT_CODE: {
          return "进     入";
        }
        default: {
          return "确定";
        }
      }
    },
    pregnantInfo() {
      const { isPregnant } = this;
      if (isPregnant) {
        return {
          title: "我已经怀孕",
          subtitle: "闻君喜得贵子 甚是欢喜",
          img: require("@/assets/img/pregnant-yes.png"),
        };
      } else {
        return {
          title: "我正在备孕",
          subtitle: "祝你喜得千金贵子，升级做妈妈",
          img: require("@/assets/img/pregnant-no.png"),
        };
      }
    },
  },
  created() {
    const { code } = this.query;
    if (code) {
      this.autoLogin(code);
    }
  },
  watch: {
    query(v) {
      const { code } = v;
      if (code) {
        this.autoLogin(code);
      }
    },
  },
  methods: {

    handleFocus() {
      setTimeout(() => {
        const container = this.$refs.container;
        if (container) {
          const diff = container.scrollHeight - container.clientHeight;
          if (diff > 0) {
            container.scrollTop = diff;
          }
        }
      });
    },
    handleAreaCodeChange(v) {
      this.areaCode = v;
    },
    goProtocol() {
      router.push({
        path: "/protocol",
      });
    },
    toggle(type) {
      console.log({ type });
      this.currentType = type;
    },
    encodeMobile(mobile) {
      return mobile.slice(0, 3) + "****" + mobile.slice(mobile.length - 4);
    },
    verify(fields) {
      const result = fields.map((field) => {
        const value = this.params[field];
        switch (field) {
          case "mobile":
            return {
              result: isMobile(value),
              message: "请输入正确的手机号",
            };
          case "code": {
            return {
              result: value.length === 4,
              message: "请输入四位验证码",
            };
          }
          case "password": {
            if (!value) {
              return {
                result: false,
                message: "请输入密码",
              };
            }
            if (
              this.currentType === TYPE.SET_PASSWORD &&
              value !== this.params.passwordT
            ) {
              return {
                result: false,
                message: "俩次密码不一致",
              };
            }
            return {
              result: true,
              message: "",
            };
          }
        }
      });
      const i = result.findIndex((item) => !item.result);
      if (i > -1) {
        return result[i];
      } else {
        return { result: true };
      }
    },
    confirm() {
      const {
        currentType,
        params,
        params: { mobile, password, code },
        agree,
        loginRes,
      } = this;
      if (currentType !== TYPE.SET_PASSWORD && !agree) {
        return Tip.success("请先阅读并同意《用户协议》");
      }
      switch (currentType) {
        case TYPE.LOGIN_BY_CODE: {
          if (!isMobile(mobile)) {
            return Tip.error("请输入正确的手机号");
          }
          const { result, message } = this.verify(["mobile"]);
          if (!result) {
            return Tip.error(message);
          }
          LoadingControl({
            call: API.GET_CODE,
            params: {
              mobile,
              AreaCode: this.areaCode,
            },
            change: ({ loading }) => {
              this.loading = loading;
            },
          }).then((res) => {
            Tip.success("验证码发送成功!");
            this.startTimeDown();
            this.toggle(TYPE.INPUT_CODE);
          });
          break;
        }
        case TYPE.INPUT_CODE: {
          const { result, message } = this.verify(["mobile", "code"]);
          if (!result) {
            return Tip.error(message);
          }
          //请求登录
          LoadingControl({
            call: API.LOGIN_WITH_CODE,
            params: {
              AreaCode: this.areaCode,
              tel: mobile,
              code,
            },
            change: ({ loading }) => {
              this.loading = loading;
            },
          }).then((res) => {
            this.handleStep(res);
          });
          break;
        }
        case TYPE.LOGIN_BY_PASSWORD: {
          const { result, message } = this.verify(["mobile", "password"]);
          if (!result) {
            return Tip.error(message);
          }
          //请求登录
          LoadingControl({
            call: API.LOGIN_BY_PASSWORD,
            params: {
              tel: mobile,
              pwd: password,
            },
            change: ({ loading }) => {
              this.loading = loading;
            },
          }).then((res) => {
            this.handleStep(res);
          });
          break;
        }
        case TYPE.BIND_MOBILE: {
          const { result, message } = this.verify(["mobile", "code"]);
          if (!result) {
            return Tip.error(message);
          }
          //绑定手机号
          LoadingControl({
            call: API.BIND_MOBILE,
            params: {
              tel: mobile,
              code,
              uid: loginRes.uid,
            },
            change: ({ loading }) => {
              this.loading = loading;
            },
          }).then(({ uid }) => {
            if (this.loginRes) {
              this.loginRes.uid = uid;
              this.$store.dispatch("login", this.loginRes);
            }

            // this.toggle(TYPE.SET_PASSWORD);
          });
          break;
        }
        case TYPE.SET_PASSWORD: {
          const { result, message } = this.verify(["password"]);
          if (!result) {
            return Tip.error(message);
          }
          LoadingControl({
            call: API.SET_PASSWORD,
            params: {
              pwd: password,
              uid: loginRes.uid,
            },
            change: ({ loading }) => {
              this.loading = loading;
            },
          }).then((res) => {
            this.$store.dispatch("login", this.loginRes);
          });
        }
      }
    },
    requestSendCode() {
      if (+this.timeDown === 0) {
        LoadingControl({
          call: API.GET_CODE,
          params: { mobile: this.params.mobile, AreaCode: this.areaCode },
          change: ({ loading }) => {
            this.loading = loading;
          },
        }).then((res) => {
          Tip.success("验证码发送成功!");
          this.startTimeDown();
        });
      }
    },
    startTimeDown(v = 60) {
      this.timeDown = v;
      if (+v > 0) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.startTimeDown, 1000, v - 1);
      }
    },
    handleCodeChange(v) {
      this.params.code = v;
    },
    requestWXAuth() {
      const { origin, pathname, search } = location;
      API.AUTH(origin + pathname + search).then((res) => {
        ///Api/getWxSQ_api.php
        window.location.href = res.rUrl;
      });
    },
    autoLogin(value) {
      if (!process.browser) return;
      if (this.usedCode === value) {
        return;
      }
      this.usedCode = value;
      this.toggle(TYPE.LOGIN_BY_WX);
      LoadingControl({
        call: API.WX_LOGIN,
        params: value,
        change: ({ loading }) => {
          this.loading = loading;
        },
      })
        .then((res) => {
          this.by = "form-wx-login";
          this.handleStep(res, "form-wx-login");
        })
        .catch((e) => {
          Tip.error(e.message);
          this.toggle(TYPE.LOGIN_BY_CODE);
        });
    },
    handleStep(data, by) {
      const { code = "", ParentId, ...userInfo } = data;
      this.loginRes = data;
      if (!ParentId) {
        PARENT.BIND(data.uid);
      }
      switch (String(code)) {
        case "":
        case "1": {
          this.$store.dispatch("login", userInfo);
          break;
        }
        case "2":
        case "4": {
          if (by === "form-wx-login") {
            Tip.success("微信登录成功，请绑定手机号!");
          }
          this.toggle(TYPE.BIND_MOBILE);
          break;
        }
        // case "3": {
        //   this.toggle(TYPE.SET_PASSWORD);
        //   break;
        // }
        case "5": {
          // this.toggle(TYPE.CHOOSE_ROLE);
          this.$store.dispatch("login", userInfo);
          break;
        }
      }
    },
    getCode() {
      return API.GET_CODE({
        mobile: this.params.mobile,
        AreaCode: this.areaCode,
      });
    },
    chooseRole() {
      const { loginRes, isPregnant } = this;
      LoadingControl({
        call: API.CHOOSE_ROLE,
        params: {
          state: isPregnant ? "已经怀孕" : "正在备孕",
          uid: loginRes.uid,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then(() => {
        this.$store.dispatch("login", this.loginRes);
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";

.login {
  position: relative;
  overflow: auto;

  .icon-back1 {
    position: absolute;
    left: 16px;
    top: 22px;
    height: 31px;
  }

  .line-qt {
    margin-top: 0.38rem;
    background: rgb(217, 217, 217);
    height: 1px;
    width: 100%;

    .line-names {
      color: #909090;
      padding: 0px 0.1rem;
      background: #fff;
    }
  }

  .login-inner {
    width: 100%;
    overflow: auto;

    &.input-code {
      height: 100%;
      background: #fff;
      padding: 0 0.3rem;
      padding-bottom: 0.97rem;

      .back-box {
        position: absolute;
        top: 0.17rem;
        left: 0.15rem;

        .icon {
          width: 0.1rem;
        }
      }

      .login-mobile {
        margin-top: 0.7rem;
        margin-bottom: 0.3rem;
        font-size: 0.17rem;
        font-weight: bold;

        .text {
          color: #000000;
        }

        .value {
          margin-left: 0.1rem;
          color: #6dc7c6;
        }
      }

      .hint {
        font-size: 0.15rem;
        font-weight: 400;
        color: #777777;
        line-height: 0.25rem;
        width: 75%;
        line-height: 0.25rem;
        margin: 0 auto;
        text-align: center;
        margin-bottom: 0.31rem;
      }

      .img-box {
        margin-top: 0.36rem;
        margin-bottom: 0.49rem;

        img {
          display: block;
          height: 1.7rem;
        }
      }

      .confirm,
      .confirm.van-button--disabled {
        background: #1ebcc4;
        color: #fff;
      }
    }
  }

  .timedown {
    margin-top: 1.19rem;
    margin-bottom: 0.23rem;
    font-size: 0.3rem;
    color: rgb(0, 0, 0);
    // font-weight: bold;
    // color: #ffa638;
    text-align: center;
  }

  .send-code {
    display: block;
    margin-top: 0.42rem;
    font-weight: 700;
    height: auto;
    width: 100%;
    text-align: center;
    font-size: 0.16rem;
    color: #1ebcc4;
    border: none;
    background: none;
  }

  .hint {
    margin-top: 0.16rem;
    font-size: 0.12rem;
    color: $color6;

  }

  .confirm {
    margin-top: 0.55rem;
    width: 100%;
    height: 0.48rem;
    font-size: 0.16rem;
    font-weight: bold;
    border-radius: 0.25rem;
    background: #fff;
    color: #6dc7c6;

    &.van-button--disabled {
      color: #6dc7c6;
      opacity: 1;
      background: #fff;
    }
  }

  .toggle-login-type {
    margin-top: 0.24rem;
    font-size: 0.16rem;
    color: $color1;
    font-weight: 500;
  }

  .other-login-ways {
    margin-top: 0.26rem;

    .login-way {
      .icon {
        margin-bottom: 0.19rem;
        width: 0.64rem;
      }

      .label {
        font-size: 0.13rem;
        color: rgba($color: #fff, $alpha: 0.8);
      }

      &:first-child {
        margin-right: 0.74rem;
      }
    }
  }

  .in-login {
    margin-top: 0.4rem;

    .label {
      margin-top: 0.2rem;
      font-size: 0.14rem;
      color: $color4;
    }
  }

  .mt-25 {
    margin-top: 0.25rem;
    height: 58px;
    box-sizing: border-box;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(217, 217, 217);
    border-radius: 15px;
    padding-right: 0;
  }

  // 验证码登录
  &.login-by-code {
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
    height: 100%;
    background: #ffffff;
    // background: #3155f1 url("./imgs/bg.png") no-repeat left top / 100% auto;

    .login-inner {
      padding: 0 0.3rem;
      padding-top: 0.9rem;
      padding-bottom: 1rem;
      position: relative;

      .logo-text {
        color: rgb(105, 199, 199);
        font-size: 0.24rem;
        font-weight: 500;
        padding: 0.1rem 0px;
        text-align: center;
      }
    }

    .logo-box {
      // position: absolute;
      // top: 1.15rem;
      // left: 0.42rem;

      .logo {
        width: 0.82rem;
      }


    }

    .input-mobile-get-code {
      height: 0.45rem;
      padding: 0 0.33rem;
      margin-top: 0.35rem;
      background: rgb(255, 255, 255);
      border: 1px solid rgb(217, 217, 217);
      border-radius: 0.15rem;

      .area-code,
      .input-box {
        background: none;
      }

      .area-code {
        width: auto;
        color: rgb(17, 16, 16);
      }

      input {
        color: rgb(15, 14, 14);
      }
    }

    .confirm {
      margin-top: 0.30rem;
    }

    .field-header {
      position: relative;

      .text {
        position: absolute;
        top: -10px;
        left: 24px;
        font-size: 0.13rem;
        background: #fff;
        padding: 0px 0.1rem;
        color: #0b0b0b;
      }
    }

    .yzm-btn {
      height: 0.6rem;
      font-size: 0.2rem;
      line-height: 60px;
      background: linear-gradient(rgba(105, 215, 196, 1) 0%, rgba(105, 199, 199, 1) 100%);
      box-shadow: 0px 10px 40px rgba(54, 166, 147, 0.2);
      ;
      border-radius: 28.5px;
      color: #fff;
      width: 80%;
    }

    .agreen-box {
      // position: absolute;
      // left: 0;
      // right: 0;
      // bottom: 0.44rem;
      margin: 0.15rem 0.05rem;
      position: relative;
      font-size: 0.13rem;

      .agree {
        .van-checkbox__icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon {
          width: 0.1rem;
          border: 1px solid #1ebcc4;
          border-radius: 2px;
        }

        i {
          font-size: 0.13rem;
          color: rgba($color: #191b1c, $alpha: 0.8);
        }

        .protocol {
          color: #1ebcc4;
        }
      }
    }
  }

  //  账号密码
  &.login-by-password {
    height: 100%;

    .login-inner {
      position: relative;
      padding: 0 0.3rem;
      padding-bottom: 0.8rem;
      min-height: 100%;
      background: #fff;
      // background: #fff url("./imgs/password-bg.png") no-repeat left top / 100%
      //   auto;
    }

    .logo-box {
      margin-top: 0.85rem;
      margin-bottom: 0.39rem;

      .logo {
        height: 0.9rem;
      }

      .logo-text {
        color: rgb(105, 199, 199);
        font-size: 0.24rem;
        font-weight: 500;
        padding: 0.1rem 0px;
        text-align: center;
      }
    }

    .icon-eye {
      height: 0.2rem;
      width: 0.2rem;
    }

    .field-box {
      margin-top: 0.25rem;
      position: relative;

      .field-header {
        // padding-left: 0.13rem;
        margin-bottom: 0.14rem;
        position: absolute;
        background: #fff;
        left: 10px;
        top: -21px;
        margin: 0.1rem;

        .icon {
          margin-right: 0.06rem;
          width: 0.13rem;
        }

        .text {
          font-size: 0.13rem;
          background: #fff;
          padding: 0px 0.1rem;
          color: #0b0b0b;
        }
      }

      .field-input-box {
        height: 0.45rem;
        padding: 0 0.33rem;
        // background: #f5f6fa;
        // border-radius: 0.23rem;
        background: rgb(255, 255, 255);
        border: 1px solid rgb(217, 217, 217);
        border-radius: 0.15rem;

        input {
          height: 100%;
          font-size: 0.14rem;
          color: #000;

          &::placeholder {
            color: #909090;
          }
        }
      }
    }

    .confirm {
      margin-top: 0.15rem;
      text-align: center;
      margin: 0 auto;
      width: 77%;
      justify-content: center;
      display: flex;
    }

    .confirm,
    .confirm.van-button--disabled {
      height: 0.6rem;
      font-size: 0.2rem;
      line-height: 60px;
      background: linear-gradient(rgba(105, 215, 196, 1) 0%, rgba(105, 199, 199, 1) 100%);
      box-shadow: 0px 10px 40px rgba(54, 166, 147, 0.2);
      ;
      border-radius: 28.5px;
      color: #fff;
    }



    .other-login-ways {
      margin-top: 0.38rem;

    }

    .login-way {
      .label {
        color: #999999;
      }
    }

    .agreen-box {
      margin: 0.15rem 0.05rem;
      position: relative;
      font-size: 0.13rem;

      // left: 0;
      // right: 0;
      // bottom: 0.44rem;
      .no-pass {
        position: absolute;
        right: -9px;
        bottom: 2px;
        color: rgb(0, 188, 197);
      }

      .agree {
        .van-checkbox__icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon {
          width: 0.1rem;
          border: 1px solid #1ebcc4;
          border-radius: 2px;
        }

        i {
          font-size: 0.13rem;
          color: rgba($color: #0f1010, $alpha: 0.8);
        }

        .protocol {
          color: #1ebcc4;
        }
      }
    }
  }

  &.set-password {
    position: relative;
    height: 100%;
    background: #fff;
    overflow: auto;

    .login-inner {
      // padding: 0 0.3rem;
      padding-bottom: 0.8rem;
      height: 100%;
    }



    .back-box {
      position: absolute;
      top: 0.17rem;
      left: 0.15rem;

      .icon {
        width: 0.1rem;
      }
    }

    .login-mobile {
      font-size: 0.18rem;
      font-weight: 100;
      margin-bottom: 0.45rem;
      text-align: center;
      height: 100px;
      background: rgb(255, 255, 255);
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
      ;
      background: rgb(255, 255, 255);
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
      ;

      .text {
        color: #000000;
        text-align: center;
        width: 100%;
      }

      .value {
        margin-left: 0.1rem;
        color: #6dc7c6;
      }
    }

    .hint {
      font-size: 0.14rem;
      font-weight: 400;
      color:rgb(66, 64, 90);
      line-height: 0.25rem;
      /* width: 75%; */
      margin: 0 auto;
      text-align: center;
      margin-bottom: 0.55rem;

    }

    .img-box {
      margin-top: 0.36rem;
      margin-bottom: 0.49rem;
      padding: 0 0.3rem;

      img {
        display: block;
        height: 1.7rem;
      }
    }

    .confirm,
    .confirm.van-button--disabled {
      background: #1ebcc4;
      color: #fff;
    }

    .field-box {
      margin-top: 0.25rem;
      padding: 0 0.3rem;
      position: relative;

      .field-header {
        padding-left: 0.13rem;
        margin-bottom: 0.14rem;

        .icon {
          margin-right: 0.06rem;
          width: 0.13rem;
        }

        .text {
          position: absolute;
          top: 4px;
          left: 50px;
          background: #fff;
          padding: 0px 0.1rem;
          font-size: 12px;
        }
      }

      .field-input-box {
        height: 0.45rem;
        padding: 0 0.33rem;
        // background: #f5f6fa;
        // border-radius: 0.23rem;
        background: rgb(255, 255, 255);
        border: 1px solid rgb(217, 217, 217);
        border-radius: 0.15rem;

        input {
          height: 100%;
          font-size: 0.15rem;
          color: #000;

          &::placeholder {
            color: #909090;
          }
        }
      }
    }

    .confirm {
      text-align: center;
      margin: 0 auto;
      width: 65%;
      justify-content: center;
      display: flex;
      margin-top: 0.35rem;

    }

    .confirm,
    .confirm.van-button--disabled {
      height: 0.6rem;
      font-size: 0.2rem;
      line-height: 60px;
      background: linear-gradient(rgba(105, 215, 196, 1) 0%, rgba(105, 199, 199, 1) 100%);
      box-shadow: 0px 10px 40px rgba(54, 166, 147, 0.2);
      ;
      border-radius: 28.5px;
      color: #fff;
    }

    .login-way {
      .label {
        color: #999999;
      }
    }

    .agreen-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.44rem;

      .agree {
        .van-checkbox__icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon {
          width: 0.1rem;
        }

        i {
          font-size: 0.13rem;
          color: rgba($color: #1ebcc4, $alpha: 0.8);
        }

        .protocol {
          color: #1ebcc4;
        }
      }
    }
  }

  &.bind-mobile {
    position: relative;
    height: 100%;
    background: #fff;
    overflow: auto;
    .request-code {
    font-size: 0.14rem;
    font-weight: 400;
    color: #fff;
    white-space: nowrap;
    display: inline-block;
    background: #1ebcc4;
    height: 55px;
    line-height: 55px;
    border-radius: 15px;
    padding: 0px 0.1rem;
    /* width: 94px; */
}
    .input-box {
          height: 100%;
          border-bottom: none;
          background: #fff !important;
        }
        .area-code{
          font-size: 0.14rem;
          font-weight: 400;
          background: #fff !important;

        }
    .login-inner {
      // padding: 0 0.3rem;
      padding-bottom: 0.8rem;
      height: 100%;
    }

    .back-box {
      position: absolute;
      top: 0.17rem;
      left: 0.15rem;

      .icon {
        width: 0.1rem;
      }
    }

    .login-mobile {
      font-size: 0.18rem;
      font-weight: 100;
      margin-bottom: 0.45rem;
      text-align: center;
      height: 100px;
      background: rgb(255, 255, 255);
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
      ;
      background: rgb(255, 255, 255);
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
      ;

      .text {
        color: #000000;
        text-align: center;
        width: 100%;
      }

      .value {
        margin-left: 0.1rem;
        color: #6dc7c6;
      }
    }

    .hint {
      font-size: 0.14rem;
      font-weight: 400;
      color: #777777;
      line-height: 0.25rem;
      width: 75%;
      margin: 0 auto;
      text-align: center;
      margin-bottom: 0.55rem;

    }

    .confirm,
    .confirm.van-button--disabled {
      background: #1ebcc4;
      color: #fff;
    }
  
    .field-box {
      margin-top: 0.25rem;
      padding: 0 0.3rem;
      position: relative;
      background: #fff ;

      .field-header {
        padding-left: 0.13rem;
        margin-bottom: 0.14rem;

        .icon {
          margin-right: 0.06rem;
          width: 0.13rem;
        }

        .text {
          position: absolute;
          top: 17px;
          left: 50px;
          background: #fff;
          padding: 0px 0.1rem;
          font-size:0.12rem;
        }
      }
    
      .field-input-box {
        height: 0.45rem;
        padding: 0 0.33rem;
        // background: #f5f6fa;
        border-radius: 0.23rem;

        input {
          height: 100%;
          font-size: 0.15rem;
          color: #000;

          &::placeholder {
            color: #909090;
          }
        }

       
      }
    }

    .confirm {
      text-align: center;
      margin: 0 auto;
      width: 65%;
      justify-content: center;
      display: flex;
      margin-top: 0.35rem;

    }

    .confirm,
    .confirm.van-button--disabled {
      height: 0.6rem;
      font-size: 0.2rem;
      line-height: 60px;
      background: linear-gradient(rgba(105, 215, 196, 1) 0%, rgba(105, 199, 199, 1) 100%);
      box-shadow: 0px 10px 40px rgba(54, 166, 147, 0.2);
      ;
      border-radius: 28.5px;
      color: #fff;
    }

    .login-way {
      .label {
        color: #999999;
      }
    }

    .agreen-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.44rem;

      .agree {
        .van-checkbox__icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon {
          width: 0.1rem;
        }

        i {
          font-size: 0.13rem;
          color: rgba($color: #1ebcc4, $alpha: 0.8);
        }

        .protocol {
          color: #1ebcc4;
        }
      }
    }
  }
}

.spinner {
  /* margin: 100px auto; */
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 10px;

  &>div {
    background-color: $color1;
    height: 100%;
    width: 6px;
    display: inline-block;

    -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
    animation: stretchdelay 1.2s infinite ease-in-out;
  }

  .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }
}

@-webkit-keyframes stretchdelay {

  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes stretchdelay {

  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
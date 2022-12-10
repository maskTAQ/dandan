<template>
  <Page title="直播信息登记">
    <StatusHandle :get="getData">
      <div class="live-info-record" ref="container">
        <div v-if="data" class="html" v-html="data.RoomJS"></div>
        <div class="input-area">
          <div class="field">
            <div class="header flex-row center">
              <span class="split"></span>
              <p class="label">姓名</p>
            </div>

            <div class="field-content">
              <input
                v-model="params.name"
                type="text"
                placeholder="请输入你的姓名"
              />
            </div>
          </div>
          <div class="field">
            <div class="header flex-row center">
              <span class="split"></span>
              <p class="label">手机号码</p>
            </div>

            <div class="field-content">
              <input
                type="text"
                v-model="params.phone"
                placeholder="请输入你的手机号"
              />
            </div>
            <div class="field-content flex-row center">
              <input
                class="code-input"
                type="text"
                placeholder="请输入验证码"
                v-model="params.code"
              />
              <van-button
                :disabled="!!timedown"
                @click="getCode"
                :loading="loading.code"
                class="code"
                >{{
                  timedown ? `${timedown}s后重发` : "获取验证码"
                }}</van-button
              >
            </div>
          </div>
          <div class="field">
            <div class="header flex-row center">
              <span class="split"></span>
              <p class="label">省份</p>
            </div>

            <div
              @click="showPicker"
              class="field-content flex-row main-between center"
            >
              <p :class="{ placeholder: !province }">
                {{ province || "请选择省份" }}
              </p>
              <van-icon name="arrow-down" />
            </div>
          </div>
          <div class="field">
            <div class="header flex-row center">
              <span class="split"></span>
              <p class="label">医院</p>
            </div>

            <div class="field-content">
              <input
                v-model="params.hospital"
                type="text"
                placeholder="请输入医院名称"
              />
            </div>
          </div>
          <van-button
            @click="submit"
            :loading="loading.submit"
            class="submit"
          ></van-button>
        </div>
        <AreaPicker
          :visible="picker.visible"
          :title="picker.title"
          :value="params.province.map((item) => item.code).join(',')"
          @change="change"
          @visible-change="hide"
          columnsNum="1"
        />
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import AreaPicker from "@/components/AreaPicker";
import { Timing } from "@/utils";
import { get, post } from "@/api/http";
import { LoadingControl, router, Tip, UID } from "../utils";

const API = {
  DETAIL(params) {
    return get("/Api/getRoomInfo_api.php", params, { showError: false });
  },
  CODE(tel) {
    return get("/Api/sendTelCode_api.php", { tel });
  },
  SUBMIT(params) {
    return post("/Api/LiveSgin_api.php", params, { json: false });
  },
};
export default {
  name: "live-info-record",
  head() {
    return {
      title: "直播信息登记",
    };
  },
  data() {
    return {
      picker: {
        visible: false,
        value: null,
        title: "",
      },
      params: {
        phone: "",
        code: "",
        name: "",
        province: [],
        hospital: "",
      },
      loading: {
        code: false,
        submit: false,
      },
      timedown: 0,
      data: {},
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    province() {
      return this.params.province.map((item) => item.name).join(",");
    },
  },
  created() {
    this.timing = new Timing(60, ({ type, value }) => {
      this.timedown = value;
    });
  },
  methods: {
    showPicker() {
      this.picker = {
        visible: true,
        value: "",
      };
    },
    getCode() {
      const { phone } = this.params;
      if (!phone) {
        return Tip.error("请输入手机号");
      }
      LoadingControl({
        call: API.CODE,
        params: phone,
        change: ({ loading }) => {
          this.loading.code = loading;
        },
      }).then((res) => {
        Tip.success("验证码发送成功!");
        // this.startTimeDown();
        this.timing.start();
      });
    },
    hide() {
      this.picker.visible = false;
    },
    change(v) {
      this.params.province = v;
    },
    getData() {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      return API.DETAIL({ bid: this.id })
        .then((res) => {
          this.data = res;
          if (!!res.LiveUrl && !!res.isSgin) {
            router.replace({
              path: "/class-detail",
              query: {
                id: this.id,
              },
            });
          }
        })
        .catch((e) => {
          router.replace({
            path: "/",
          });
        });
    },
    submit() {
      const { name, phone, province, hospital, code } = this.params;
      const error = [
        {
          label: "姓名",
          value: name,
        },
        {
          label: "手机号码",
          value: phone,
        },
        {
          label: "省份",
          value: province,
        },
        {
          label: "医院",
          value: hospital,
        },
        {
          label: "验证码",
          value: code,
        },
      ].find((item) => !item.value);
      this.$refs.container.scrollTo(0,100000)
      if (error) {
        return Tip.error(`请输入${error.label}`);
      }
      LoadingControl({
        call: API.SUBMIT,
        params: {
          RealName: name,
          Tel: phone,
          Address:province && province[0]? province[0].name:'',
          HsName: hospital,
          code,
          bid: this.id,
        },
        change: ({ loading }) => {
          this.loading.submit = loading;
        },
      }).then((res) => {
        if (res) {
          UID.SET(res.uid);
        }
        Tip.success("提交成功!");
        router.replace({
          path: "/class-detail",
          query: {
            id: this.id,
          },
        });
      });
    },
  },
  components: {
    AreaPicker,
  },
};
</script>
<style lang="scss">
.live-info-record {
  height: 100%;
  background: #fff;
  overflow: auto;
  .html {
    img {
      display: block;
      width: 100%;
    }
  }
  .input-area {
    margin: 0.25rem 0.2rem;
    padding: 0.25rem 0.2rem;
    /* border: 1px solid #e4f0fe; */
    box-shadow: 0px 0px 6px 1px #e4f0fe;
    border-radius: 0.06rem;
    padding-bottom: 0.8rem;
    .field {
      margin-bottom: 0.15rem;
      font-size: 0.16rem;
      color: #070707;

      .header {
        .split {
          margin-right: 0.07rem;
          width: 0.05rem;
          height: 0.15rem;
          background: #1f80f4;
        }
      }
      .field-content {
        height: 0.5rem;
        font-size: 0.16rem;
        border-bottom: 1px solid #cdcdcd;
        input {
          height: 100%;
        }
        input::placeholder,
        .placeholder {
          color: #cdcdcd;
        }
        .code-input {
          width: 0;
          flex: 1;
        }
      }
    }
    .submit {
      position: fixed;
      width: 3rem;
      left: 0.4rem;
      bottom: 0.4rem;
      margin-top: 0.2rem;
      outline: none;
      border: none;
      display: block;
      height: 0.48rem;
      background: url("../assets/img/submit.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .code {
      width: 0.89rem;
      display: block;
      padding: 0;
      height: 0.32rem;
      background: #2784f1;
      font-size: 0.12rem;
      color: #fff;
      border-radius: 0.04rem;
    }
  }
}
</style>
<template>
  <Page title="设置">
    <div class="setting page-full">
      <input v-show="false" type="file" id="upload" @change="handleUpload" />
      <StatusHandle ref="statusHandle" :get="getUserInfo">
        <div>
          <div class="card">
            <p class="title">个人资料</p>
            <div class="list">
              <div
                v-for="item in top"
                :key="item.label"
                class="item flex-row main-between center"
              >
                <i class="label">{{ item.label }}</i>
                <StatusHandle
                  :block="false"
                  :status="status"
                  v-if="item.type === 'portrait'"
                >
                  <label for="upload">
                    <div
                      class="portrait"
                      :style="{
                        background: `url('${nextUserInfo.UserPhoto}') no-repeat center center / cover`,
                      }"
                    />
                  </label>
                </StatusHandle>
                <input
                  v-else-if="item.type === 'input'"
                  :value="nextUserInfo[item.key]"
                  @input="(e) => (nextUserInfo[item.key] = e.target.value)"
                  @blur="handleChange(item.key)"
                  type="text"
                  class="input value"
                />
                <i v-else @click="showPicker(item.key)" class="value">{{
                  item.value || nextUserInfo[item.key]
                }}</i>
              </div>
            </div>
          </div>
          <div class="card mt">
            <p class="title">账号安全</p>
            <div class="list">
              <div
                v-for="item in bottom"
                :key="item.label"
                class="item flex-row main-between center"
                @click="go(item)"
              >
                <div class="flex-row center">
                  <img :src="item.icon" alt="" class="icon" />
                  <i class="label">{{ item.label }}</i>
                  <i v-if="item.desc" class="desc">{{ item.desc }}</i>
                </div>
                <img
                  v-if="item.right === 'icon'"
                  :src="setting.right"
                  alt=""
                  class="right-icon"
                />
                <i v-else class="right">{{ item.right }}</i>
              </div>
            </div>
          </div>
        </div>
      </StatusHandle>
      <div
        @click="go({ path: '/about' })"
        class="contact card flex-row main-between center"
      >
        <i class="label">联系我们</i>
        <img :src="setting.right" alt="" class="right-icon" />
      </div>
      <button @click="logout" class="logout">退出登录</button>
      <AreaPicker
        :visible="picker.key === 'Place' && picker.visible"
        :title="picker.title"
        :value="picker.value"
        @change="pickerChange"
        @visible-change="hide"
      />
      <DatetimePicker
        :visible="picker.key === 'Birthday' && picker.visible"
        :title="picker.title"
        type="date"
        :value="picker.value"
        @change="pickerChange"
        @visible-change="hide"
      />
    </div>
  </Page>
</template>
<script>
import day from "dayjs";

import { LoadingControl, Tip, encodeMobile, router } from "@/utils";
import { mock, get, post } from "@/api/http";
import { setting } from "@/assets";
import AreaPicker from "@/components/AreaPicker";
import { getCode, utils } from "@/assets/areaList";

const API = {
  AUTH(redirect_uri) {
    return get("/Api/getWxSQ_api.php", { redirect_uri });
  },
  DEDAIL() {
    return get("/Api/getUserInfo_api.php",{},{showError:false});
  },
  EDIT(params) {
    return get("/Api/editUserInfo_api.php", params);
  },
  BIND_WECHAT(params) {
    return get("/Api/userBindWx_api.php", params);
  },
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
};

const FIELD = {
  NickName: "昵称",
  UserRemarks: "签名",
  Birthday: "生日",
  Place: "居住地",
};
const img =
  "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2495455348,2237661234&fm=11&gp=0.jpg";
export default {
  name: "setting",
  head() {
    return {
      title: "设置",
    };
  },
  data() {
    return {
      setting,
      status: "success",
      src: "",
      userInfo: {},
      nextUserInfo: {
        NickName: "",
        UserRemarks: "",
      },
      picker: {
        visible: false,
        value: null,
        title: "",
      },
    };
  },
  created() {
    const { code } = this.$route.query;
    if (code) {
      this.bindWechat(code);
    }
  },
  computed: {
    top() {
      return [
        {
          label: "头像",
          type: "portrait",
        },
        {
          label: "昵称",
          key: "NickName",
          type: "input",
        },
        {
          label: "签名",
          key: "UserRemarks",
          type: "input",
        },
        {
          label: "生日",
          key: "Birthday",
        },
        {
          label: "居住地",
          key: "Place",
          value: utils.value(this.nextUserInfo.Place) || "未设置",
        },
      ];
    },
    bottom() {
      const { UserName, OpenId, WxNick } = this.userInfo;
      return [
        {
          icon: setting.mobile,
          label: "手机号",
          type: "mobile",
          desc: `(${encodeMobile(UserName)})`,
          right: "更换绑定",
          path: "/mobile",
        },
        {
          icon: setting.reset,
          label: "重置密码",
          key: "reset",
          right: "icon",
          path: "/password",
        },
        {
          icon: setting.wechat,
          label: "微信关联",
          key: "wechat",
          desc: WxNick ? `（${WxNick}）` : "",
          right: OpenId ? "已绑定" : "未绑定",
          onClick: OpenId ? undefined : this.requestWXAuth,
        },
      ];
    },
  },
  methods: {
    getUserInfo() {
      return API.DEDAIL().then((res) => {
        this.userInfo = res;
        this.nextUserInfo = { ...res };
      });
    },
    handleChange(key) {
      const value = this.nextUserInfo[key];
      if (value !== this.userInfo[key]) {
        return API.EDIT({
          [key]: value,
        })
          .then((res) => {
            this.userInfo[key] = this.nextUserInfo[key];
            return res;
          })
          .catch((e) => {
            Tip.error(`${FIELD[key]}修改失败,请重试`);
            this.nextUserInfo[key] = this.userInfo[key];
            return Promise.reject(`${FIELD[key]}修改失败,请重试`);
          });
      } else {
        return Promise.resolve();
      }
    },
    requestWXAuth() {
      const { origin, pathname } = location;
      API.AUTH(origin + pathname).then((res) => {
        ///Api/getWxSQ_api.php
        window.location.href = res.rUrl;
      });
    },
    bindWechat(code) {
      API.BIND_WECHAT({
        code,
        usewxinfo: 2,
      }).then((res) => {
        this.$refs.statusHandle.refresh();
      });
    },
    handleUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const form = new FormData(); // FormData 对象
        form.append("file", file); // 文件对象
        LoadingControl({
          call: () => {
            return API.UPLOAD_FILE(form).then((res) => {
              this.nextUserInfo.UserPhoto = res.src;
              return this.handleChange("UserPhoto", res.src);
            });
          },
          params: form,
          change: ({ loading }) => {
            this.loading = loading;
          },
        }).then((res) => {
          Tip.success("上传成功");
        });
      }
    },
    go({ path, onClick }) {
      if (onClick) {
        return onClick();
      }
      if (path) {
        router.push({
          path,
        });
      }
    },
    showPicker(key) {
      if (key === "Place") {
        this.picker = {
          visible: true,
          key,
          value: utils.parse(this.nextUserInfo[key]),
          title: "修改居住地",
        };
      } else {
        this.picker = {
          visible: true,
          key,
          value: this.nextUserInfo[key],
          title: "修改生日",
        };
      }
    },
    hide() {
      this.picker.visible = false;
    },
    pickerChange(v) {
      const { key } = this.picker;
      if (key === "Place") {
        this.nextUserInfo.Place = utils.stringify(v);
      } else {
        this.nextUserInfo.Birthday = day(v).format("YYYY-MM-DD");
      }
      this.handleChange(key);
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },
  components: {
    AreaPicker,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.setting {
  padding: 0.15rem 0.13rem;
  background: #f5f7f9;
  .card {
    background: #fff;
    border-radius: 4px;
    &.mt {
      margin-top: 0.15rem;
    }
    .title {
      padding: 0.13rem 0;
      text-indent: 0.15rem;
      font-size: 0.14rem;
      font-weight: 500;
      color: #aaaaaa;
    }
    .list {
      padding: 0 0.11rem;
      .portrait {
        width: 0.44rem;
        height: 0.44rem;
        border-radius: 50%;
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
          width: 0;
          flex: 1;
          height: 100%;
          text-align: right;
          line-height: 0.54rem;
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
  .contact {
    height: 0.5rem;
    padding: 0 0.11rem;
    margin-top: 0.15rem;
    .right-icon {
      width: 0.06rem;
    }
  }
  .logout {
    display: block;
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.14rem;
    color: #fff;
    padding: 0 0.3rem;
    background: $color1;
    border-radius: 0.2rem;
  }
}
</style>
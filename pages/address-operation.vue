<template>
  <Page title="地址管理">
    <div class="address-operation page-full">
      <StatusHandle :get="getData">
        <div class="fields flex-column center">
          <div
            v-for="field in fields"
            :key="field.key"
            class="field flex-row center"
          >
            <i class="label">{{ field.label }}</i>
            <input
              v-if="field.key !== 'mailCity'"
              v-model="params[field.key]"
              :placeholder="field.placeholder"
              type="text"
              class="input"
            />
            <div v-else @click="showPicker" class="right flex-row center">
              <p>{{ params[field.key] || field.placeholder }}</p>
              <img :src="icons.right" alt="" class="icon" />
            </div>
          </div>
          <div v-if="id" class="delete-box">
            <van-button
              :loading="loading.delete"
              @click="_delete"
              class="delete"
              >删除地址</van-button
            >
          </div>
          <van-button :loading="loading.update" class="confirm" @click="confirm"
            >保存</van-button
          >
        </div>
      </StatusHandle>

      <AreaPicker
        :visible="picker.visible"
        :title="picker.title"
        :value="picker.value"
        @change="change"
        @visible-change="hide"
      />
    </div>
  </Page>
</template>
<script>
import AreaPicker from "@/components/AreaPicker";
import { icons } from "@/assets";
import { getCode } from "@/assets/areaList";
import { LoadingControl, Tip, router } from "@/utils";
import { post, get } from "@/api/http";

const API = {
  DETAIL(aid) {
    return get("/Api/getMailInfo_api.php", { aid });
  },
  UPDATE(params) {
    return post("/Api/SaveMailInfo_api.php", params, { json: false });
  },
  DELETE(aid) {
    return get("/Api/delMailInfo_api.php", { aid });
  },
};

export default {
  name: "address-operation",
  head() {
    return {
      title: "地址管理",
    };
  },
  data() {
    return {
      icons,
      loading: {
        update: false,
        delete: false,
      },
      picker: {
        visible: false,
        value: null,
        title: "",
      },
      params: {
        mailPeople: "",
        mailTel: "",
        mailCity: "",
        mailAdd: "",
      },
    };
  },
  created() {
    if (process.browser) {
      window.document.title = this.id ? "编辑地址" : "添加地址";
    }
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    area() {
      return (this.params.mailCity || "").split(",");
    },
    fields() {
      return [
        {
          label: "收货人",
          key: "mailPeople",
          placeholder: "请输入姓名",
        },
        {
          label: "联系方式",
          key: "mailTel",
          placeholder: "请输入手机号",
        },
        {
          label: "所在地区",
          key: "mailCity",
          placeholder: "",
        },
        {
          label: "详细地址",
          key: "mailAdd",
          placeholder: "请输入",
        },
      ];
    },
  },
  methods: {
    getData() {
      if (this.id) {
        return API.DETAIL(this.id).then((res) => {
          this.params = res;
        });
      } else {
        return Promise.resolve({});
      }
    },
    confirm() {
      const { params, fields } = this;
      const errorIndex = fields.findIndex(
        ({ required, key }) => required && !params[key]
      );
      if (errorIndex > -1) {
        return Tip.error(`请输入${fields[errorIndex].label}`);
      }
      // if (!Object.keys(params).every((key) => params[key])) {
      //   return Tip.error("请输入完整的地址信息");
      // }
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(params.mailTel)) {
        return Tip.error("请输入正确的联系方式");
      }
      LoadingControl({
        call: API.UPDATE,
        params: this.params,
        change: ({ loading }) => {
          this.loading.update = loading;
        },
      }).then((res) => {
        Tip.success(this.id ? "更新成功" : "添加成功");
        router.back();
      });
    },
    _delete() {
      Tip.request({
        title: "确定删除?",
        content: "删除的地址信息将不能找回,确定删除吗",
        call: LoadingControl,
        params: {
          call: API.DELETE,
          params: this.id,
          change: ({ loading }) => {
            this.loading.delete = loading;
          },
        },
      }).then((res) => {
        if (res !== "user:cancel") {
          Tip.success("删除成功");
          router.back();
        }
      });
    },
    showPicker() {
      this.picker = {
        visible: true,
        value: getCode(this.params.mailCity.split(",")),
      };
    },
    hide() {
      this.picker.visible = false;
    },
    change(v) {
      this.params.mailCity = v.map((item) => item.name).join(",");
    },
  },
  components: {
    AreaPicker,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.address-operation {
  background: #fff;
  .fields {
    width: 100%;
    padding: 0 0.23rem;
    .field {
      width: 100%;
      height: 0.5rem;
      font-weight: 600;
      border-bottom: 1px solid $border;
      .label {
        font-size: 0.12rem;
        color: #353544;
      }
      .input,
      .right {
        width: 0;
        flex: 1;
        height: 100%;
        font-size: 0.12rem;
        color: #7c7c7c;
      }
      .input {
        font-size: 0.12rem;
        text-align: right;
      }
      .right {
        justify-content: flex-end;
      }
      .icon {
        width: 0.12rem;
      }
    }
  }
  .delete-box {
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    /* padding-left: 0.21rem; */
    width: 100%;
    .delete {
      height: 0.24rem;
      font-size: 0.12rem;
      color: #fff;
      padding: 0 0.13rem;
      background: rgba($color: $color1, $alpha: 0.36);
      border-radius: 0.08rem;
      border: none;
    }
  }
  .confirm {
    margin-top: 0.3rem;
    height: 0.36rem;
    padding: 0 0.4rem;
    font-size: 0.15rem;
    color: #fff;
    background: $color1;
    border-radius: 0.18rem;
    border: none;
  }
}
</style>
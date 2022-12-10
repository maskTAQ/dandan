<template>
  <Page title="发票管理">
    <div class="address-operation page-full">
      <StatusHandle :get="getData">
        <div class="fields flex-column center">
          <div
            v-for="field in fields"
            :key="field.key"
            class="field flex-row center"
          >
            <i class="label">{{ field.label }}</i>
            <div class="right flex-row center" v-if="field.type === 'radio'">
              <van-radio-group
                v-model="params[field.key]"
                class="flex-row center"
              >
                <van-radio
                  v-for="item in field.options"
                  :key="item.value"
                  :name="item.value"
                  >{{ item.label }}</van-radio
                >
              </van-radio-group>
            </div>
            <input
              v-else
              v-model="params[field.key]"
              :placeholder="`请输入${field.label}${
                field.required ? '' : '(选填)'
              }`"
              type="text"
              class="input"
            />
          </div>
          <div v-if="id" class="delete-box">
            <van-button
              :loading="loading.delete"
              @click="_delete"
              class="delete"
              >删除发票</van-button
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
  DETAIL(iid) {
    return get("/Api/getInvInfo_api.php", { iid });
  },
  UPDATE(params) {
    return post("/Api/SaveInvInfo_api.php", params, { json: false });
  },
  DELETE(iid) {
    return get("/Api/delInvInfo_api.php", { iid });
  },
};
const INIT_PARAMS = {
  invType: "1",
  invName: "",
  invNo: "",
  invAddress: "",
  invTel: "",
  invBank: "",
  invBankNo: "",
};
export default {
  name: "invoice-operation",
  head() {
    return {
      title: "发票管理",
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
      params: { ...INIT_PARAMS },
    };
  },
  created() {
    if (process.browser) {
      window.document.title = this.id ? "编辑发票信息" : "添加发票";
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
      const { invType } = this.params;
      const isCompany = invType === "2";
      return [
        {
          label: "发票类型",
          key: "invType",
          type: "radio",
          options: [
            {
              label: "个人",
              value: "1",
            },
            {
              label: "企业",
              value: "2",
            },
          ],
          placeholder: "请输入姓名",
          required: true,
        },
        {
          label: isCompany ? "公司全称" : "姓名",
          key: "invName",
          placeholder: "请输入手机号",
          required: true,
        },
        isCompany && {
          label: "税号",
          key: "invNo",
          placeholder: "",
          required: true,
        },
        isCompany && {
          label: "公司地址",
          key: "invAddress",
          placeholder: "请输入",
        },

        {
          label: "电话号码",
          key: "invTel",
          placeholder: "请输入",
        },
        isCompany && {
          label: "开户银行",
          key: "invBank",
          placeholder: "请输入",
        },
        isCompany && {
          label: "银行账号",
          key: "invBankNo",
          placeholder: "请输入",
        },
      ].filter((n) => !!n);
    },
  },
  methods: {
    getData() {
      if (this.id) {
        return API.DETAIL(this.id).then((res) => {
          this.params = res;
        });
      } else {
        return Promise.resolve({ ...INIT_PARAMS });
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
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(params.invTel)) {
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
        content: "删除的发票信息将不能找回,确定删除吗",
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
        value: getCode("安徽省,合肥市,蜀山区".split(",")),
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
  .van-radio-group {
    .van-radio__icon {
      font-size: 0.14rem;
    }
    .van-radio__label {
      font-size: 0.11rem;
      color: #393939;
    }
    .van-radio:first-child {
      margin-right: 0.2rem;
    }
  }
  .fields {
    width: 100%;
    padding: 0 0.2rem;
    .field {
      width: 100%;
      height: 0.5rem;
      font-weight: 600;
      border-bottom: 1px solid $border;
      .label {
        font-size: 0.11rem;
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
    margin-top: 0.2rem;
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
<template>
  <div :class="['input-container flex-row main-between center', type]">
    <StatusHandle :get="getAreaCodeList">
      <div
        v-if="type === 'mobile' && areaCodeOptions.length"
        class="area-code flex-row align"
        @click="hadnleVisibleChange(true)"
      >
        <span>{{ areaCode }}</span>
        <img
          :src="icon || icons.bottom"
          :class="['icon', { active: visible }]"
          alt=""
          srcset=""
        />
      </div>
    </StatusHandle>
    <div class="input-box">
      <input
        :value="valueWrap"
        @input="(e) => change(e.target.value)"
        :type="inputType"
        :placeholder="placeholder"
        :maxlength="maxlength"
      />
    </div>
    <StatusHandle
      v-if="type === 'code'"
      :status="loading ? 'loading' : 'success'"
      :block="false"
      alwaysRenderChild
    >
      <p class="request-code" @click="getCodeWrap">
        {{ timeDown ? `${timeDown}s` : "获取验证码" }}
      </p>
    </StatusHandle>
    <Picker
      :columns="areaCodeOptions"
      v-model="areaCode"
      :visible="visible"
      @visible-change="hadnleVisibleChange"
      title="请选择区号"
    />
  </div>
</template>
<script>
import { LoadingControl, Tip } from "@/utils";
import { get } from "@/api/http";
import { icons } from "@/assets";
import Picker from "@/components/Picker";

const API = {
  AREA_CODE() {
    return get("/Api/getAreaCodeList_api.php");
  },
};
export default {
  name: "Input",
  model: {
    prop: "value",
    event: "change",
  },
  // props: ["value", "placeholder", "type", "request", "maxlength", "icon"],
  props: {
    value: [String, Number],
    placeholder: String,
    type: String,
    request: Function,
    maxlength: [String, Number],
    icon: String
  },
  data() {
    return {
      icons,
      loading: false,
      timeDown: 0,
      visible: false,
      areaCode: "",
      areaCodeOptions: [],
    };
  },
  computed: {
    inputType() {
      const { type } = this;
      if (type === "mobile") {
        return "text";
      }
      if (["password", "text"].includes(type)) {
        return type;
      } else {
        return "text";
      }
    },
    valueWrap() {
      const { value, type } = this;
      return type === "code" ? (value || "").substring(0, 4) : value;
    },
  },
  watch: {
    areaCode(v) {
      this.$emit("areaCodeChange", v);
    },
  },
  methods: {
    getAreaCodeList() {
      return API.AREA_CODE().then((res) => {
        this.areaCodeOptions = res.map(({ AreaCode, AreaName }) => {
          return {
            label: AreaName,
            value: AreaCode,
          };
        });
        if (res.length) {
          this.areaCode = res[0].AreaCode;
        }
      });
    },
    change(v) {
      this.$emit("change", v);
    },
    getCodeWrap() {
      if (this.timeDown) return;
      return LoadingControl({
        call: this.request,
        params: this.value,
        change: ({ loading }) => {
          this.loading = loading;
        },
      })
        .then(() => {
          this.startTimeDown();
        })
        .catch((e) => {
          console.log(e, "e");
          // Tip.error(e);
        });
    },
    startTimeDown(v = 60) {
      this.timeDown = v;
      if (+v > 0) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.startTimeDown, 1000, v - 1);
      }
    },
    hadnleVisibleChange(v) {
      this.visible = v;
    },
  },
  components: {
    Picker,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.input-container {
  /* margin: 0 0.24rem; */
  /* margin-bottom: 0.4rem; */
  width: 100%;
  height: 0.45rem;
  padding: 0 0.33rem;
  background: #f5f6fa;
  border-radius: 0.23rem;
  &.mobile {
    padding: 0;
    background: #fff;
    .area-code,
    .input-box {
      background: #f5f6fa;
    }
    .area-code {
      margin-right: 6px;
      border-radius: 0.23rem 0px 0px 0.23rem;
    }
    .input-box {
      padding-left: 0.1rem;
      border-radius: 0px 0.23rem 23px 0;
    }
  }
  .area-code {
    width: 0.78rem;
    height: 100%;
    font-size: 0.16rem;
    font-weight: bold;
    color: #0b0b0b;
    .icon {
      margin-left: 4px;
      width: 0.1rem;
      transition: all 0.6s;
      &.active {
        transform: rotate(-180deg);
      }
    }
  }
  .input-box {
    width: 0;
    flex: 1;
    height: 100%;
  }
  input {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0.16rem;
  }
  .request-code {
    font-size: 0.14rem;
    font-weight: 400;
    color: #4d6eff;
    white-space: nowrap;
  }
}
</style>
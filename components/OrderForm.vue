<template>
  <SimpleGroup
    title="表单信息"
    titleColor="rgba(0, 188, 197, 0.8)"
    border
    v-if="fields && fields.length"
    class="order-form"
  >
    <div>
      <div v-if="readonly" class="fields">
        <div
          v-for="(item, index) in fields"
          @click="handleItemClick(item, index)"
          :key="item.goid"
          class="field"
        >
          <p class="label">{{ item.theTitle }}</p>
          <div
            v-if="item.theType === FORM_TYPE.IMAGE"
            class="img-list flex-row"
          >
            <CoverImage
              v-for="url in item.theValue"
              class="img"
              :key="url"
              :url="url"
            />
          </div>
          <p v-else class="value">{{ item.theValue }}</p>
        </div>
      </div>
      <div v-else class="fields">
        <div
          v-for="(item, index) in fields"
          @click="handleItemClick(item, index)"
          :key="item.goid"
          class="field"
        >
          <p class="label">{{ item.theTitle }}</p>
          <van-field
            :value="item.theValue"
            @input="(value) => handleChange({ index, value })"
            v-if="item.theType === FORM_TYPE.INPUT"
            :placeholder="item.theMessage"
            type="text"
            class="input"
          />
          <van-field
            v-if="item.theType === FORM_TYPE.TEXTAREA"
            :value="item.theValue"
            @input="(value) => handleChange({ index, value })"
            class="textarea"
            rows="4"
            type="textarea"
            autosize
            :placeholder="item.theMessage"
          />
          <van-uploader
            v-if="item.theType === FORM_TYPE.IMAGE"
            class="uploader"
            :max-count="+item.theMessage || undefined"
            :fileList="getFileList(item, index)"
            :after-read="(file) => afterRead(file, index)"
            @delete="(file, data) => handleDeleteImg(index, data.index)"
          >
            <div slot="default" class="upload-hint align">
              <img :src="icons.add_grey" alt="" class="icon" />
            </div>
          </van-uploader>
          <div
            v-if="item.theType === FORM_TYPE.DATE"
            class="date flex-row main-between center"
          >
            <i class="date-label">{{ item.theValue }}</i>
            <img :src="icons.bottom" alt="" class="icon" />
          </div>
          <div
            v-if="item.theType === FORM_TYPE.TIME"
            class="date flex-row main-between center"
          >
            <i class="date-label">{{ item.theValue }}</i>
            <img :src="icons.bottom" alt="" class="icon" />
          </div>
        </div>
      </div>
      <div class="align">
        <van-button
          v-if="!readonly"
          :loading="loading"
          @click="submit"
          class="confirm align"
          >保存</van-button
        >
      </div>
      <DatetimePicker
        :title="picker.title"
        :type="picker.type"
        :visible="picker.visible"
        :value="picker.value"
        @change="change"
        @visible-change="hide"
      />
    </div>
  </SimpleGroup>
</template>
<script>
import day from "dayjs";

import { icons } from "@/assets";
import { mock, get, post } from "@/api/http";
import { LoadingControl, Tip, UID } from "@/utils";
const API = {
  PRE_DATA(params) {
    return get("/Api/getNoOrderInfo_api.php", params);
  },
  CONFIRM(params) {
    return get("/Api/toOrder_api.php", params);
  },
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  REQUEST_PAY(params) {
    return get("/Api/MeterRecharge_api.php", params);
  },
  SAVE_FORM(params) {
    return post("/Api/saveOther_api.php", params, { json: false });
  },
};
const FORM_TYPE = {
  INPUT: "1",
  TEXTAREA: "2",
  IMAGE: "3",
  DATE: "4",
  TIME: "5",
};
const FORM_TYPE_LABEL = {
  [FORM_TYPE.INPUT]: "单行文本",
  [FORM_TYPE.TEXTAREA]: "多行文本",
  [FORM_TYPE.IMAGE]: "图片",
  [FORM_TYPE.DATE]: "日期",
  [FORM_TYPE.TIME]: "时间",
};
export default {
  name: "OrderForm",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    handleSubmit: Function,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icons,
      FORM_TYPE,
      loading: false,
      picker: {
        visible: false,
        value: null,
        index: NaN,
        title: "",
      },
      uploadCache: {
        //   [index]:{}
      },
    };
  },
  computed: {
    fields() {
      const result = [];
      (this.value || []).forEach((item) => {
        const has = result.find((field) => field.theTitle === item.theTitle);
        if (!has) {
          result.push(item);
        }
      });
      return result;
    },
  },
  methods: {
    handleItemClick({ theType, theMessage, theValue }, index) {
      switch (theType) {
        case FORM_TYPE.DATE: {
          this.showPicker({
            type: "date",
            value: theValue,
            index,
            title: theMessage,
          });
          break;
        }
        case FORM_TYPE.TIME: {
          this.showPicker({
            type: "time",
            value: theValue,
            index,
            title: theMessage,
          });
          break;
        }
      }
    },
    handleChange({ index, value }) {
      const next = [...this.fields];
      next[index].theValue = value;
      this.$emit("change", next);
    },
    handleDeleteImg(index, deleteIndex) {
      const list = Array.isArray(this.value[index].theValue)
        ? [...this.value[index].theValue]
        : [];
      list.splice(deleteIndex, 1);
      this.handleChange({ index, value: list });
    },
    pushImg({ index, url }) {
      const list = Array.isArray(this.value[index].theValue)
        ? [...this.value[index].theValue]
        : [];
      list.push(url);
      this.handleChange({ index, value: list });
      this.uploadCache[index] = null;
    },
    getFileList(item, index) {
      const old = item.theValue;
      const prev = Array.isArray(old)
        ? old.map((url) => {
            return {
              url,
              status: "done",
            };
          })
        : [];
      return prev.concat(this.uploadCache[index] || []);
    },
    showPicker({ type, value, index, title }) {
      this.picker = {
        index,
        type,
        visible: true,
        value,
        title,
      };
    },
    submit() {
      LoadingControl({
        call: this.handleSubmit,
        params: this.value,
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        Tip.success("保存成功");
      });
    },
    change(v) {
      const { index, type } = this.picker;
      this.handleChange({
        index,
        value: type === "date" ? day(v).format("YYYY/MM/DD HH:mm:ss") : v,
      });
      //   this.params[this.picker.type] = v;
    },
    hide() {
      this.picker.visible = false;
    },
    afterRead(file, index) {
      this.$set(this.uploadCache, index, [
        {
          url: file.content,
          status: "uploading",
          message: "上传中...",
        },
      ]);

      const form = new FormData(); // FormData 对象
      form.append("file", file.file); // 文件对象
      form.append("uid", UID.GET());

      API.UPLOAD_FILE(form)
        .then((res) => {
          this.pushImg({ index, url: res.src });
          return res;
        })
        .catch((e) => {
          console.log(e, "e");
          this.$set(this.uploadCache, index, [
            {
              url: file.content,
              status: "failed",
              message: "上传失败",
            },
          ]);
        });
    },
  },
};
</script>
<style lang="scss">
.order-form {
  .fields {
    width: 100%;
  }

  .field {
    .label {
      padding-top: 0.14rem;
      padding-bottom: 0.09rem;
      font-size: 0.14rem;
      color: rgb(85, 85, 85);
    }
    .value {
      padding-left: 0.1rem;
      font-size: 0.12rem;
      font-weight: 500;
      color: rgba(126, 126, 126, 0.5);
    }
    .img-list {
      flex-wrap: wrap;
      .img {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 0.05rem;
      }
    }
    .input {
      width: 100%;
      height: 0.4rem;
      line-height: 0.4rem;
      padding: 0;
      padding-left: 0.07rem;
      background: #ffffff;
      border-radius: 0.11rem;
      border: 1px solid rgb(232, 243, 241);
    }
    .textarea {
      /* width: 100%; */
      padding: 0.07rem;
      background: #ffffff;
      border-radius: 0.11rem;
      border: 1px solid rgb(232, 243, 241);
    }
    .van-image,
    .upload-hint {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 5px;
      border: 1px solid #bcbcbc;
      overflow: hidden;
    }
    .date {
      width: 100%;
      height: 0.32rem;
      line-height: 0.32rem;
      padding: 0 0.07rem;
      background: #ffffff;
      border-radius: 5px;
      border: 1px solid #bcbcbc;
      .date-label {
        font-size: 0.12rem;
        color: #cacaca;
      }
      .icon {
        width: 0.12rem;
      }
    }
  }
  .confirm {
    margin-top: 0.37rem;
    width: 1.22rem;
    height: 0.33rem;
    border-radius: 0.15rem;
    font-size: 0.14rem;
    color: #fff;
    background: rgba(0, 188, 197, 0.8);
  }
}
</style>
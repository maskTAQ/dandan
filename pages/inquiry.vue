<template>
  <Page title="医生问诊">
    <div class="inquiry page-full">
      <DoctorCard :ask="false" :data="myDoctor.data || {}" />
      <van-field
        v-model="q"
        rows="4"
        autosize
        type="textarea"
        class="q"
        placeholder="请输入您想要向医生咨询的问题~"
      />
      <div v-for="(field, index) in fields" :key="index" class="input-box">
        <p class="title">{{ field.type }}：</p>
        <van-field
          v-model="field.value"
          rows="1"
          autosize
          type="textarea"
          placeholder="请输入病症询问内容"
        />
      </div>
      <div class="operate flex-row center">
        <div
          @click="addField(value)"
          class="btn flex-row center"
          v-for="(value, key) in TYPE"
          :key="key"
        >
          <img :src="icons.add" alt="" class="icon" />
          <i class="label">{{ value }}</i>
        </div>
      </div>
      <van-uploader class="uploader" v-model="fileList" :after-read="afterRead">
        <div slot="default" class="upload-hint flex-column align">
          <img :src="icons.photo" alt="" class="icon" />
          <i class="label">图片/视频</i>
        </div>
      </van-uploader>
      <div class="line"></div>
      <p class="hint">上传内容仅对医生可看</p>
      <van-button :loading="loading" @click="confirm" class="confirm"
        >提交问诊</van-button
      >
    </div>
  </Page>
</template>
<script>
import { mapState } from "vuex";

import { router, UID, LoadingControl, Tip } from "@/utils";
import { icons } from "@/assets";

import { get, post } from "@/api/http";
//sendInquiry_api
const API = {
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  QUERY_NUM() {
    return get("/Api/getUserSendNum_api.php");
  },
  SUBMIT(params) {
    return post("/Api/sendInquiry_api.php", params, { json: false });
  },
};
const TYPE = {
  disease: "病症询问",
  medication: "用药询问",
};
export default {
  name: "inquiry",
  head() {
    return {
      title: "医生问诊",
    };
  },
  data() {
    return {
      icons,
      TYPE,
      q: "",
      fileList: [],
      fields: [],
      loading: false,
    };
  },
  created() {
    this.getMyDoctor();
  },
  computed: {
    ...mapState(["myDoctor"]),
    id() {
      return this.$route.query.id;
    },
  },
  methods: {
    getMyDoctor() {
      this.$store.dispatch("getMyDoctor");
    },
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      const form = new FormData(); // FormData 对象
      form.append("file", file.file); // 文件对象
      form.append("uid", UID.GET());

      API.UPLOAD_FILE(form)
        .then((res) => {
          file.status = "done";
          file.message = "上传成功";
          file.source = res.src;
          // this.fileList.push({
          //   url:res.url,
          //   status:'success'
          // })
          return res;
        })
        .catch((e) => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    addField(type) {
      this.fields.push({ type, value: "" });
    },
    process() {
      //查询次数
      return API.QUERY_NUM().then((res) => {
        const { SendNum } = res;
        if (+SendNum) {
          //发送消息
          return API.SUBMIT(this.getSubmitParams()).then((res) => {
            Tip.success("提交成功");
            router.replace({
              path: "/card-list",
              query: {
                id: res.cid,
              },
            });
            console.log(res, "res");
          });
        } else {
          //支付
          localStorage.setItem(
            "inquiry",
            JSON.stringify(this.getSubmitParams())
          );
          router.push({
            path: "/inquiry-pay",
            query: {
              id: this.id,
            },
          });
          return Promise.resolve();
        }
      });
    },
    getSubmitParams() {
      const { fileList, q, fields } = this;
      return {
        cid: this.id,
        did: this.myDoctor.data.exid,
        theValueJson: [{ theTitle: "", theValue: q }].concat(
          fields
            .filter((item) => !!item.value)
            .map(({ type, value }) => {
              return {
                theTitle: type,
                theValue: value,
              };
            })
        ),
        theImgs: fileList
          .filter((item) => item.status === "done")
          .map((item) => item.source),
      };
    },
    confirm() {
      const { fileList, q, fields } = this;
      if (!q) {
        return Tip.error("请输入要咨询的问题");
      }

      LoadingControl({
        call: this.process,
        change: ({ loading }) => {
          this.loading = loading;
        },
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.inquiry {
  padding: 0.1rem 0.12rem;
  background: #fff;
  .q {
    padding: 0;
  }
  .q::after {
    display: none;
  }
  .input-box {
    margin-bottom: 0.2rem;
    font-size: 0.16rem;
    .title {
      margin: 0.2rem 0;
      color: $color4;
    }
    .van-cell {
      padding: 0;
    }
  }
  .operate {
    .btn {
      margin-right: 0.1rem;
      height: 0.28rem;
      padding: 0 0.06rem;
      background: #f4f5f9;
      border-radius: 3px;
      .icon {
        margin-right: 0.03rem;
        width: 0.09rem;
      }
      .label {
        font-size: 0.12rem;
        color: $color4;
      }
    }
  }
  .uploader {
    margin-top: 0.28rem;
  }
  .upload-hint {
    /* margin-top: .08rem; */
    width: 0.8rem;
    height: 0.8rem;
    font-size: 0.11rem;
    color: $color6;
    background: #f4f5f9;
    border-radius: 0.08rem;
    .icon {
      margin-bottom: 0.08rem;
      width: 0.2rem;
    }
  }
  .line {
    margin-top: 0.2rem;

    width: 100%;
    height: 1px;
    background: $border;
  }
  .hint {
    margin: 0.1rem 0;
    font-size: 0.12rem;
    color: $color6;
  }
  .confirm {
    margin-top: 0.4rem;
    display: block;
    width: 100%;
    height: 0.42rem;
    line-break: 0.42rem;
    font-size: 0.16rem;
    color: #fff;
    border-radius: 0.21rem;
    background: $color1;
  }
}
</style>
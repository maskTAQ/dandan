<template>
  <Page title="用户反馈">
    <div class="feedback page-full">
      <div class="input-area">
        <van-field
          v-model="value"
          rows="2"
          autosize
          type="textarea"
          maxlength="200"
          placeholder="请说明建议，我们将为您不断改进～"
          show-word-limit
          class="textarea"
        />
        <van-uploader
          class="uploader"
          v-model="fileList"
          max-count="4"
          :after-read="afterRead"
        >
          <div slot="default" class="upload-hint align">
            <img :src="icons.add_grey" alt="" class="icon" />
          </div>
        </van-uploader>
        <div class="file-count">{{ fileList.length }}/4</div>
        <div class="line" />
        <input
          v-model="mobile"
          class="input"
          placeholder="请输入手机号码方便联系"
          type="text"
        />
      </div>
      <van-button @click="submit" :loading="loading" class="submit"
        >提交</van-button
      >
    </div>
  </Page>
</template>
<script>
import { icons } from "@/assets";
import { get, post } from "@/api/http";
import { UID, LoadingControl, Tip, router } from "@/utils";
const API = {
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  SUBMIT(params) {
    return get("/Api/sendfeedback_api.php", params);
  },
};
export default {
  name: "feedback",
  head() {
    return {
      title: "用户反馈",
    };
  },
  data() {
    return {
      icons,
      value: "",
      mobile: "",
      fileList: [
        // {
        //   url: "https://img.yzcdn.cn/vant/leaf.jpg",
        //   status: "success",
        //   message: "上传中...",
        // },
        // {
        //   url: "",
        //   status: "",
        //   message: "上传中...",
        // },
        // {
        //   url: 'https://img.yzcdn.cn/vant/tree.jpg',
        //   status: 'failed',
        //   message: '上传失败',
        // },
      ],
      loading: false,
    };
  },
  methods: {
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
    submit() {
      const { fileList, value } = this;
      const imgs = fileList
        .filter((file) => file.status === "done")
        .map((item) => item.source)
        .join("||");
      if (!value) {
        return Tip.error("请输入建议");
      }
      LoadingControl({
        call: API.SUBMIT,
        params: {
          theValues: value,
          imgs,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        router.back();
        Tip.success("反馈成功");
      });
    },
  },
};
</script>
<style lang="scss">
.feedback {
  padding: 0.15rem 0.13rem;
  background: #f0f2f5;
  .input-area {
    background: #fff;
    border-radius: 4px;
    padding: 0 0.11rem;
    .van-cell {
      padding: 0.1rem 0;
    }
    .van-cell::after {
      display: none;
    }
    .uploader {
      .van-image,
      .upload-hint {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 5px;
        border: 1px solid #bcbcbc;
        overflow: hidden;
      }
    }
    .file-count {
      color: #646566;
      font-size: 0.12rem;
      line-height: 0.16rem;
      text-align: right;
    }
    .line {
      margin-top: 0.26rem;
      margin-bottom: 0.05rem;
      height: 1px;
      background: #d7d7d7;
    }
    .input {
      width: 100%;
      height: 0.4rem;
      font-size: 0.14rem;
      color: #a0a0a0;
    }
  }
  .submit {
    margin: 0 auto;
    display: block;
    margin-top: 0.46rem;
    width: 1.95rem;
    height: 0.34rem;
    font-size: 0.14rem;
    color: #fff;
    background: #6dc7c6;
    border-radius: 4px;
  }
}
</style>
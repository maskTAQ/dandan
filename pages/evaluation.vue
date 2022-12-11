<template>
  <Page title="发布评论">
    <StatusHandle :get="getData">
      <div class="evaluation page-full">
        <div class="order-info">
          <p class="order-no">订单号 {{ orderInfo.orderNo }}</p>
          <div class="flex-row center">
            <CoverImage :url="orderInfo.gImg" class="cover" />
            <div class="info">
              <p class="name">{{ orderInfo.goodsName }}</p>
              <p class="subtitle">{{ orderInfo.bName }}</p>
              <p class="subtitle">{{ orderInfo.itemName }}</p>
            </div>
          </div>
        </div>
        <div class="score">
          <div
            v-for="(rate, index) in rateList"
            :key="rate.label"
            class="item flex-row main-between center"
          >
            <i class="label">{{ rate.theTitle }}</i>
            <div class="flex-row center">
              <van-rate
                :value="+rate.theScore"
                @change="(value) => change({ index, value })"
                size=".2rem"
                color="#6dc7c6"
                void-icon="star"
                void-color="#D9D9D9"
              />
              <i class="value">{{ rate.theScore }}分</i>
            </div>
          </div>
        </div>
        <van-field
          v-model="message"
          :disabled="isE"
          rows="5"
          autosize
          type="textarea"
          placeholder="期待您的评价，你的评价是我们最大的进步～"
          class="textarea"
        />
        <div class="file-count flex-row center">
          <i class="label">评价图片</i>
          <i v-if="!isE" class="value">({{ fileList.length }}/6)</i>
        </div>
        <van-uploader
          class="uploader"
          v-model="fileList"
          :deletable="!isE"
          :show-upload="!isE"
          max-count="6"
          :after-read="afterRead"
        >
          <div slot="default" class="upload-hint align">
            <img :src="icons.add_grey" alt="" class="icon" />
          </div>
        </van-uploader>
        <button v-if="!isE" :loading="loading" @click="submit" class="submit">
          发布
        </button>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { icons } from "@/assets";
import { get, post } from "@/api/http";
import { LoadingControl, router, Tip, UID, toArray } from "../utils";
const API = {
  DETAIL(params) {
    return get("/Api/getOrderInfoByItem_api.php", params);
  },
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  SEND(params) {
    return get("/Api/sendOrderPJ_api.php", params);
  },
};

export default {
  name: "evaluation",
  head() {
    return {
      title: "发布评论",
    };
  },
  data() {
    return {
      icons,
      value: 2,
      message: "",

      orderInfo: {},
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
      rateList: [],
      loading: false,
    };
  },
  computed: {
    isE() {
      return +this.orderInfo.isPJ === 1;
    },
  },
  methods: {
    getData() {
      const { oid, oiid } = this.$route.query;
      return API.DETAIL({ oid, oiid }).then((res) => {
        this.orderInfo = res;
        if (+res.isPJ === 1) {
          const { pjImgs, pjItem, pjValue } = res.pJData;
          this.message = pjValue || "";
          this.rateList = pjItem;
          this.fileList = pjImgs.map((source) => {
            return {
              url: source,
              source,
              status: "done",
            };
          });
        } else {
          this.rateList =res.pjItem.map((v) => {
            return {
              theTitle: v.theTitle,
              theScore: 5,
            };
          });
        }
      });
    },
    change(v) {
      const { value, index } = v;
      if (!this.isE) {
        this.rateList[index].theScore = value;
      }
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
    submit() {
      const { rateList, message, fileList } = this;
      console.log(fileList, "fileList");
      LoadingControl({
        call: API.SEND,
        params: {
          oid: this.orderInfo.oid,
          pjItem: JSON.stringify(rateList),
          pjValue: message,
          pjImgs: JSON.stringify(
            fileList
              .filter((item) => item.status === "done")
              .map((item) => item.source)
          ),
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        Tip.success("评价成功");
        router.back();
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.evaluation {
  padding: 0 0.15rem;
  background: #fff;
  .order-info {
    padding: 0.15rem;
    .order-no {
      margin-bottom: 0.11rem;
      font-size: 0.12rem;
      color: #333333;
    }
    .cover {
      margin-right: 0.1rem;
      width: 1.2rem;
      height: 0.79rem;
      background-color: #e8e8e8;
      border-radius: 8px;
    }
    .info {
      width: 0;
      flex: 1;
      .name {
        margin-bottom: 0.04rem;
        font-size: 0.16rem;
        color: #333333;
      }
      .subtitle {
        font-size: 0.12rem;
        color: #8e8e8e;
      }
    }
  }
  .score {
    margin-top: 0.28rem;
    margin-bottom: 0.16rem;
    padding-bottom: 0.23rem;
    border-bottom: 1px solid #e7e7e7;
    .item {
      margin-bottom: 4px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .label,
    .value {
      font-size: 0.14rem;
      color: #0c0c0c;
    }
    .value {
      margin-left: 0.4rem;
    }
  }
  .textarea {
    padding: 0;
  }
  .file-count {
    margin-bottom: 0.16rem;
    .label {
      margin-right: 2px;
      font-size: 0.14rem;
      color: #0c0c0c;
    }
    .value {
      font-size: 0.12rem;
      color: #a5a5a5;
    }
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
      background: #f1f1f1;
      overflow: hidden;
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
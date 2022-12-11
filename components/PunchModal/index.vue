<script>
import day from "dayjs";

import { icons } from "@/assets";
import { post, get } from "@/api/http";
import { UID } from "@/utils";
import { LoadingControl, Tip } from "../../utils";

const API = {
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  PUNCH(params) {
    return post("/Api/saveUserClock_api.php", params, { json: false });
  },
};
const assets = {
  bg: require("./imgs/bg.png"),
  close: require("./imgs/close.png"),
  closeBg: require("./imgs/close-bg.png"),
  add: require("./imgs/add.png"),
};
export default {
  name: "PunchModal",
  props: ["visible", "data"],
  data() {
    return {
      icons,
      message: "",
      imgList: [],
      anonymous: false,
      share: false,
      loading: false,
    };
  },

  render() {
    const { visible, loading, message, imgList, anonymous, share, data } = this;
    if (!visible) return null;
    return (
      <div class="punch-modal model-layer flex-column">
        <div class="model-content">
          <img src={assets.bg} class="head" />
          <img
            onClick={() => {
              this.$emit("cancel");
            }}
            src={assets.close}
            class="close"
          />
          <van-field
            value={message}
            onInput={(v) => {
              this.message = v;
            }}
            class="textarea"
            rows="4"
            autosize
            type="textarea"
            // maxLength={200}
            placeholder="请输入打卡内容"
          />
          <p class="label">上传图片</p>
          <van-uploader
            class="uploader"
            fileList={this.imgList}
            onInput={(v) => {
              this.imgList = v;
            }}
            after-read={this.afterRead}
          >
            <div
              slot="default"
              class="upload-hint align"
              style={{
                background: `url('${assets.add}') no-repeat center center / 100% 100%`,
              }}
            ></div>
          </van-uploader>
          <div class="checkbox-box flex-row center">
            <van-checkbox
              value={share}
              onInput={() => {
                this.share = !this.share;
              }}
              shape="square"
              class="mr"
            >
              分享
            </van-checkbox>
            <van-checkbox
              value={anonymous}
              onInput={() => {
                this.anonymous = !this.anonymous;
              }}
              shape="square"
            >
              匿名
            </van-checkbox>
          </div>
          <div class="btn-group flex-row main-between">
            <van-button
              loading={loading}
              onClick={() => {
                if (!message) {
                  return Tip.error("请输入打卡内容");
                }
                LoadingControl({
                  call: API.PUNCH,
                  params: {
                    cid: data.id,
                    share: share ? 1 : 0,
                    cday: day(day().format("YYYY/MM/DD")).unix(),
                    anonymous: anonymous ? 1 : 0,
                    message,
                    imgList: imgList
                      .filter((img) => img.status === "done")
                      .map((item) => item.source),
                  },
                  change: ({ loading }) => {
                    this.loading = loading;
                  },
                }).then((res) => {
                  this.reset();
                  this.$emit("cancel");
                  this.$emit("success");
                });
              }}
              type=""
              class="btn confirm"
            >
              发布
            </van-button>
          </div>
        </div>
      </div>
    );
  },
  methods: {
    reset() {
      this.message = "";
      this.imgList = [];
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
  },
};
</script>
<style lang="scss">
.punch-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  justify-content: center;
  background: rgba($color: #000000, $alpha: 0.2);

  .model-content {
    position: relative;
    margin: 0 0.19rem;
    padding: 0.1rem 0.15rem;
    padding-bottom: 0.25rem;
    background: #ffffff;
    border-radius: 0.08rem;
    border: 1px solid #ccc;

    .head {
      display: block;
      margin: 0 auto;
      margin-top: -0.6rem;
      margin-bottom: 0.41rem;
      width: 1.59rem;
    }
    .close {
      position: absolute;
      top: 0.27rem;
      right: 0.19rem;
      width: 0.19rem;
      height: 0.19rem;
    }

    .textarea {
      padding: 0.16rem 0;
      margin-bottom: 0.1rem;
      &::after {
        /* display: none; */
        left: 0;
        right: 0;
      }
    }
    .label {
      margin-bottom: 0.22rem;
      font-size: 0.14rem;
      color: rgba(77, 77, 77, 0.84);
    }
    .van-image,
    .upload-hint {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 0.04rem;
      overflow: hidden;
    }
    .checkbox-box {
      margin: 0.1rem 0;
      .mr {
        margin-right: 0.1rem;
      }
    }
    .btn-group {
      margin-top: 0.22rem;
    }

    .btn {
      margin: 0;
      flex: 1;
      height: 0.38rem;
      line-height: 0.38rem;
      font-size: 0.14rem;
      color: #fff;
      border-radius: 0.19rem;
      &.confirm {
        background: #6dc7c6;
      }

      &.cancel {
        background: #cdcdcd;
      }
    }
  }
}
</style>
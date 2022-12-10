<script>
import { icons } from "@/assets";
import { post } from "@/api/http";
import { UID } from "@/utils";

const API = {
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params, {
      // headers: {
      //   "Content-Type": "application/octet-stream",
      // },
    });
  },
};
export default {
  name: "MessageModal",
  props: ["visible", "data"],
  data() {
    return {
      icons,
      message: "",
      imgList: [],
      rateList: [],
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.rateList = (this.data.ScoreJson || []).map((item) => {
          return {
            ...item,
            thescore: 5,
          };
        });
        // this.rateList = [
        //   {
        //     scoreName: "test",
        //     thescore: 5,
        //   },
        // ];
      }
    },
  },
  render() {
    const { visible, data, message, imgList, rateList } = this;
    if (!visible) return null;
    return (
      <div class="model-layer flex-column">
        <div class="model-content">
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
            placeholder="输入文本"
          />

          <van-uploader
            class="uploader"
            fileList={this.imgList}
            multiple
            max-count="9"
            onInput={(v) => {
              this.imgList = v;
            }}
            after-read={this.afterRead}
          >
            <div slot="default" class="upload-hint align">
              <img src={icons.add_grey} alt="" class="icon" />
            </div>
          </van-uploader>
          <div class="rate-list">
            {rateList.map(({ scoreName, thescore }, index) => {
              return (
                <div key={index} class="item flex-row main-between center">
                  <p class="label">{scoreName}</p>
                  <div class="flex-row center">
                    <van-rate
                      value={thescore}
                      onChange={(v) => {
                        const next = [...rateList];
                        next[index].thescore = v;
                        this.rateList = next;
                      }}
                      color="#4d6eff"
                    />
                    <p class="value">{thescore}分</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div class="btn-group flex-row main-between">
            <button
              onClick={() => {
                this.$emit("confirm", {
                  message,
                  imgList: imgList
                    .filter((img) => img.status === "done")
                    .map((item) => item.source),
                  rateList,
                });
              }}
              type=""
              class="btn confirm"
            >
              发布
            </button>
            <button
              onClick={() => {
                this.$emit("cancel");
              }}
              class="btn cancel"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  },
  methods: {
    reset() {
      this.message = "";
      this.imgList = [];
      this.rateList = [];
    },
    afterRead(file, index) {
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
.model-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  justify-content: center;
  background: rgba($color: #000000, $alpha: 0.2);

  .model-content {
    margin: 0 0.25rem;
    padding: 0.1rem 0.15rem;
    padding-bottom: 0.25rem;
    background: #ffffff;
    border-radius: 0.08rem;
    border: 1px solid #ccc;
    overflow: hidden;

    .textarea {
      padding: 0.16rem 0;
      margin-bottom: 0.1rem;
      &::after {
        /* display: none; */
        left: 0;
        right: 0;
      }
    }
    .van-image,
    .upload-hint {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 0.05rem;
      border: 1px solid #bcbcbc;
      overflow: hidden;
    }
    .rate-list {
      padding: 0.1rem;

      .item {
        height: 0.3rem;
      }

      .label {
        margin-right: 0.06rem;
        font-size: 0.14rem;
        color: #0c0c0c;
      }

      .value {
        margin-top: 2px;
        margin-left: 0.05rem;
        font-size: 0.14rem;
        color: #0c0c0c;
      }
    }

    .btn-group {
      margin-top: 0.05rem;
    }

    .btn {
      margin: 0;
      width: 1.2rem;
      height: 0.3rem;
      line-height: 0.3rem;
      font-size: 0.14rem;
      color: #fff;
      border-radius: 0.15rem;
      &.confirm {
        margin-right: 0.2rem;
        background: #2D4EF5;
      }

      &.cancel {
        background: #cdcdcd;
      }
    }
  }
}
</style>
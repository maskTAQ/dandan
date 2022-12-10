<script>
import { icons } from "@/assets";
import { post } from "@/api/http";
import { UID } from "@/utils";
import Page from "@/components/Page";

const API = {
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
};
export default {
  name: "advice",
  head() {
    return {
      title: "产品建议",
    };
  },
  data() {
    return {
      value: "",
      fileList: [
        // {
        //   url: "https://img.yzcdn.cn/vant/leaf.jpg",
        //   status: "success",
        //   message: "上传中...",
        // },
      ],
      mobile: "",
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
  },
  render() {
    const { value, fileList, mobile } = this;
    return (
      <Page title="产品建议">
        <div class="advice">
          <div class="input-area">
            <van-field
              value={value}
              onInput={(v) => {
                this.value = v;
              }}
              rows="4"
              autosize
              type="textarea"
              // maxLength={200}
              placeholder="请说明建议，我们将为您不断改进～"
              class="placeholder"
            />
            <p class="num">{value.length}/200</p>
            <van-uploader
              class="uploader"
              fileList={fileList}
              max-count={4}
              onInput={(v) => {
                this.fileList = v;
              }}
              after-read={this.afterRead}
            >
              <div slot="default" class="upload-hint align">
                <img src={icons.add_grey} alt="" class="icon" />
              </div>
            </van-uploader>
            <div class="line"></div>
            <van-field
              value={mobile}
              onInput={(v) => {
                this.mobile = v;
              }}
              class="placeholder"
              placeholder="请输入手机号码方便联系"
            />
          </div>
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
.advice {
  height: 100%;
  background: #f5f6fa;
  overflow: hidden;

  .input-area {
    margin: 0.1rem;
    padding: 0.16rem 0.14rem;
    background: #ffffff;
    border-radius: 0.16rem;

    .textarea {
      display: block;
      width: 100%;
      min-height: 1.5rem;
    }

    .placeholder {
      font-size: 0.14rem;
      color: #a0a0a0;
    }

    .num {
      display: block;
      width: 100%;
      font-size: 0.14rem;
      color: #a0a0a0;
      text-align: right;
    }

    .line {
      margin-top: 0.26rem;
      margin-bottom: 0.11rem;
      height: 1px;
      background: #d7d7d7;
    }
  }
}
</style>
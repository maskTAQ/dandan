<script>
import { LoadingControl, app, OS, download, Tip } from "@/utils";
import { get } from "@/api/http";

const API = {
  POSTERS(params) {
    return get("/Api/xcx/getLinkQR_api.php", params);
  },
};

export default {
  name: "SaveModal",
  // visible, data, index, type
  props: ["opid", "visible", "data", "index", "type"],
  data() {
    return {
      loading: false,
      creating: false,
      current: 0,
      posters: "",
    };
  },
  watch: {
    visible(v) {
      const { opid } = this;
      opid && this.getPosters(opid);
    },
  },
  methods: {
    getPosters(opid) {
      LoadingControl({
        call: API.POSTERS,
        params: { opid },
        change: ({ loading, success, data }) => {
          this.creating = loading;
        },
      })
        .then((res) => {
          this.posters = res.opQR;
        })
        .catch((res) => {
          Tip.error("海报生成失败,请重试!");
        });
    },
    download() {
      // if (OS.isWechat) {
      //   app.$nuxt.$emit("download");
      // } else {
      const { type, data, current, posters } = this;
      const url =
        type === "posters" ? posters : type === "imgs" ? data[current] : data;
      download(url, "url");
      // }

      //实现下载
      return Promise.resolve();
    },

    save(e) {
      this.stopPropagation(e);
      LoadingControl({
        call: this.download,
        change: ({ loading }) => {
          this.loading = loading;
        },
      })
        .then((res) => {
          // Tip.success("保存成功");
          this.onClose();
        })
        .catch((e) => {
          Tip.error(JSON.stringify(e));
        });
    },
    stopPropagation(e) {
      //   console.log(e, "e");
      e.stopPropagation();
    },
    onClose() {
      this.$emit("close");
    },
  },
  render() {
    const { visible, data, index, type } = this;
    const { creating, loading, posters } = this;
    if (!visible) return null;
    const label = creating
      ? "生成海报中"
      : loading
      ? ""
      : type === "video"
      ? "保存视频"
      : "保存图片";
    return (
      <div
        onClick={() => {
          this.onClose();
        }}
        class="save-model-layer flex-column align"
      >
        {type === "posters" && posters && (
          <img
            onClick={this.stopPropagation}
            src={posters}
            mode="heightFix"
            class="posters"
          />
        )}
        {type === "video" && (
          <video
            controls
            onClick={this.stopPropagation}
            src={data}
            class="video"
          />
        )}
        {type === "imgs" && (
          <van-swipe
            indicatorColor="#999"
            indicatorActiveColor="#333"
            circular
            current={index}
            class="swiper"
            indicatorDots={data.length > 1}
            onClick={this.stopPropagation}
            onChange={(current) => {
              this.current = current;
            }}
          >
            {data
              .filter((n) => !!n)
              .map((src, i) => {
                return (
                  <van-swipe-item key={i}>
                    <img class="img" mode="heightFix" src={src} />
                  </van-swipe-item>
                );
              })}
          </van-swipe>
        )}

        <van-button
          onClick={this.save}
          loading={creating || loading}
          class="save"
        >
          {label}
        </van-button>
      </div>
    );
  },
};
</script>
<style lang="scss">
.save-model-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  justify-content: center;
  background: rgba($color: #000000, $alpha: 0.6);

  .posters {
    height: calc(90% - 0.5rem);
  }

  .video {
    width: 90%;
    max-height: calc(90% - 0.5rem);
  }

  .swiper {
    width: 100%;
    height: 3rem;
  }

  .img {
    margin: 0 auto;
    display: block;
    height: 100%;
  }

  .save {
    margin-top: 0.23rem;
    width: 1.46rem;
    height: 0.385rem;
    line-height: 0.385rem;
    font-size: 0.18rem;
    color: #fff;
    background: #30b9ff;
    border-radius: 38px;
  }
}
</style>
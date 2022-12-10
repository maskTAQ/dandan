<script>
import { formatTime } from "@/utils";
import { agentIcons } from "@/assets";
import { router, copy, OS, app, download } from "@/utils";

const TYPE = {
  ARTICLE: "链接",
  IMAGE: "海报",
  VIDEO: "视频",
};
export default {
  name: "Message",
  props: ["data"],
  render() {
    const {
      opid,
      opType: type,
      opVideo,
      opTitle,
      opValue,
      opImg: imgList = [],
      opTime,
    } = this.data;
    const onSave = (value) => {
      if (value.type === "video") {
        if (OS.isWechat) {
          app.$nuxt.$emit("download");
        } else {
          download(value.data);
        }
      } else {
        this.$emit("save", value);
      }
    };
    return (
      <div class="message">
        <div class="header flex-row center">
          <div class="border"></div>
          <p class="time">{formatTime(opTime)}</p>
        </div>
        {type !== TYPE.ARTICLE && opTitle && (
          <div
            onClick={() => {
              copy(opTitle);
            }}
            class="text-box"
          >
            <p class="text">{opTitle}</p>
          </div>
        )}
        {type !== TYPE.ARTICLE && opValue && (
          <div
            onClick={() => {
              copy(opValue);
            }}
            class="text-box"
          >
            <p class="text">{opValue}</p>
          </div>
        )}
        {type !== TYPE.ARTICLE && (
          <div class="img-list">
            {imgList.length === 1 ? (
              <img
                onClick={() => {
                  onSave({
                    type: "imgs",
                    data: imgList,
                    index: 0,
                  });
                }}
                class="only-one"
                mode="widthFix"
                src={imgList[0]}
              />
            ) : (
              (imgList || [])
                .filter((n) => !!n)
                .map((img, index) => {
                  return (
                    <img
                      onClick={() => {
                        onSave({
                          type: "imgs",
                          data: imgList,
                          index,
                        });
                      }}
                      key={index}
                      src={img}
                      class="multiple"
                      mode="aspectFill"
                    ></img>
                  );
                })
            )}
          </div>
        )}

        {type === TYPE.ARTICLE && (
          <div
            onClick={() => {
              const pathList = opValue.split("/");
              router.push({
                path: "/" + pathList[pathList.length - 1],
              });
            }}
            class="article flex-row center"
          >
            <img
              onLongPress={(v) => {
                console.log("长按图片");
              }}
              src={imgList[0]}
              class="icon"
              mode="aspectFill"
            />
            <div class="right">
              <p class="desc ellipsis line-2">{opTitle}</p>
            </div>
          </div>
        )}
        {type === TYPE.VIDEO && (
          <video
            onClick={() => {
              onSave({
                type: "video",
                data: opVideo[0],
              });
            }}
            onLongPress={(v) => {
              console.log("长按视频");
            }}
            src={opVideo[0].src}
            poster={opVideo[0].cover}
            class="video"
            controls
          />
        )}
        {type === TYPE.IMAGE && imgList.length === 1 && (
          <div class="show-posters-box flex-row">
            <div
              onClick={() => {
                onSave({
                  type: "posters",
                  data: imgList[0],
                  opid,
                });
              }}
              class="show-posters flex-row center"
            >
              <img src={agentIcons.save} mode="widthFix" class="icon" />
              生成
            </div>
          </div>
        )}
        {type === TYPE.ARTICLE && (
          <div class="mt show-posters-box flex-row">
            <div
              onClick={() => {
                // copy(opValue);
                const pathList = opValue.split("/");
                router.push({
                  path: "/" + pathList[pathList.length - 1],
                });
              }}
              class="show-posters flex-row center"
            >
              <img src={agentIcons.save} mode="widthFix" class="icon" />
              进入分享
            </div>
          </div>
        )}
        {type === TYPE.VIDEO && (
          <div class="mt show-posters-box flex-row">
            <div
              onClick={() => {
                onSave({
                  type: "video",
                  data: opVideo[0].src,
                });
              }}
              class="show-posters flex-row center"
            >
              <img src={agentIcons.save} mode="widthFix" class="icon" />
              下载视频
            </div>
          </div>
        )}
      </div>
    );
  },
};
</script>
<style lang="scss">
.message {
  padding: 0.12rem 0.14rem;
  background: #fff;

  .header {
    .border {
      margin-right: 0.1rem;
      width: 0.15rem;
      height: 0.15rem;
      background: #fff;
      border-radius: 50%;
      border: 0.03rem solid #31a4f6;
    }

    .time {
      font-size: 0.12rem;
      color: #6c6c6c;
    }
  }

  .text-box {
    width: 2.5rem;
  }

  .text {
    font-size: 0.12rem;
    color: #2d2d2d;
  }

  .img-list {
    width: 0.75rem * 3 + 0.1rem * 3;
    flex-wrap: wrap;
    margin-top: 0.1rem;

    .only-one {
      width: 50%;
    }

    .multiple {
      margin-right: 0.1rem;
      width: 0.75rem;
      height: 0.75rem;
    }
  }

  .article {
    margin-top: 0.1rem;
    height: 0.57rem;
    padding: 0.07rem 0.11rem;
    background: rgba($color: #d8d8d8, $alpha: 0.3);

    .icon {
      margin-right: 0.1rem;
      width: 0.43rem;
      height: 0.43rem;
    }

    .right {
      width: 0;
      flex: 1;
    }

    .label {
      font-size: 0.11rem;
      color: #2d2d2d;
    }
  }

  .video {
    width: 2.5rem;
  }
}
</style>
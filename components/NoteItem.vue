<script>
import { icons } from "@/assets";
import { router, formatTime, LoadingControl, Tip } from "@/utils";
import CoverImage from "@/components/CoverImage";
import { get, post } from "@/api/http";

const API = {
  DELETE(params) {
    return get("/Api/delForum_api.php", params);
  },
  TOGGLE(params) {
    return get("/Api/stopForum_api.php", params);
  },
};

const STATUS = {
  "-1": "拒绝",
  0: "待审核",
  1: "显示",
  "-2": "不显示",
};
const TAG_ICON = {
  "-1": icons.noteTagDisabled,
  0: icons.noteReview,
  1: icons.noteTagNormal,
  "-2": icons.noteTagDisabled,
};
export default {
  name: "note-item",
  props: {
    data: Object,
  },
  data() {
    return {
      loading: false,
    };
  },
  render() {
    const {
      title,
      Tag,
      ctime,
      UserPhoto,
      fileUrl,
      readNum,
      fid,
      isShow,
      ApplyRemark,
    } = this.data;
    return (
      <div class="note-item">
        <div class="card">
          <div class="card-top flex-row main-between center">
            <div class="flex-row  center">
              <span class="line"></span>
              <span class="time">发布时间：{formatTime(ctime)}</span>
            </div>
            <CoverImage
              class="status"
              url={TAG_ICON[isShow] || icon.noteTagNormal}
            >
              {STATUS[isShow] || isShow}
            </CoverImage>
          </div>
          <div class="card-center flex-row">
            <CoverImage class="cover" url={fileUrl[0] || UserPhoto} />
            <div class="info flex-column main-between">
              <div>
                <p class="title ellipsis line-2">{title}</p>
                <div class="flex-row main-between center">
                  <div class="flex-row center">
                    <span class="label">阅读量</span>
                    <span class="value">{readNum || 0}</span>
                  </div>
                  <div class="flex-row center">
                    <span class="label">点赞量</span>
                    <span class="value">{readNum || 0}</span>
                  </div>
                </div>
                {ApplyRemark && isShow == -1 ? (
                  <div class="flex-row center">
                    <span class="label">拒绝原因</span>
                    <span class="value">{ApplyRemark}</span>
                  </div>
                ) : null}
              </div>
              <ul class="tags flex-row">
                {Tag.map((text, index) => {
                  return (
                    <li class="tag" key={index}>
                      #{text}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div class="btn-group flex-row center">
          {isShow == 1 && (
            <button
              onClick={() => {
                Tip.request({
                  title: "确定下架?",
                  // content: "删除的信息将不能找回,确定删除吗",
                  call: LoadingControl,
                  params: {
                    call: API.TOGGLE,
                    params: {
                      id: this.data.fid,
                      isShow: -2,
                    },
                    change: ({ loading }) => {
                      this.loading = loading;
                    },
                  },
                }).then((res) => {
                  this.$emit("refresh");
                  Tip.success("下架成功");
                });
              }}
              class="btn down"
            >
              下 架
            </button>
          )}
          {isShow == -2 && (
            <button
              onClick={() => {
                Tip.request({
                  title: "确定上架?",
                  // content: "删除的信息将不能找回,确定删除吗",
                  call: LoadingControl,
                  params: {
                    call: API.TOGGLE,
                    params: {
                      id: this.data.fid,
                      isShow: 1,
                    },
                    change: ({ loading }) => {
                      this.loading = loading;
                    },
                  },
                }).then((res) => {
                  this.$emit("refresh");
                  Tip.success("上架成功");
                });
              }}
              class="btn up"
            >
              上 架
            </button>
          )}
          {[0, 1, -1].includes(+isShow) && (
            <button
              onClick={() => {
                router.push({
                  path: "/notes/publish",
                  query: {
                    id: fid,
                  },
                });
              }}
              class="btn edit"
            >
              编 辑
            </button>
          )}
          <van-button
            onClick={() => {
              this._delete();
            }}
            class="btn delete"
            loading={this.loading}
          >
            删 除
          </van-button>
        </div>
      </div>
    );
  },
  methods: {
    _delete() {
      Tip.request({
        title: "确定删除?",
        content: "删除的信息将不能找回,确定删除吗",
        call: LoadingControl,
        params: {
          call: API.DELETE,
          params: {
            id: this.data.fid,
          },
          change: ({ loading }) => {
            this.loading = loading;
          },
        },
      }).then((res) => {
        this.$emit("refresh");
        Tip.success("删除成功");
      });
    },
  },
};
</script>
<style lang="scss">
.note-item {
  /* height: 0.92rem; */
  /* border: 1px solid red; */
  margin-bottom: 0.15rem;
  border-radius: 0.1rem;
  background: #f7f9fb;
  overflow: hidden;
  box-shadow: 0px 1px 10px 0px rgba($color: #eff2f7, $alpha: 0.3);
  .card {
    background: #fff;
    border-radius: 0.1rem;
    box-shadow: 0px 1px 10px 0px rgba($color: #eff2f7, $alpha: 0.3);
    .card-top {
      padding: 0.15rem 0;
    }
    .line {
      margin-right: 0.16rem;
      width: 0.03rem;
      height: 0.12rem;
      background: linear-gradient(148deg, #ff7d00 0%, #ff5f00 100%);
    }
    .time {
      font-size: 0.14rem;
      color: #a3a3a3;
    }
    .status {
      width: 0.54rem;
      height: 0.25rem;
      line-height: 0.22rem;
      text-align: center;
      font-size: 0.14rem;
      color: #fff;
    }
    .card-center {
      padding: 0.15rem;
      padding-top: 0;
    }
    .cover {
      margin-right: 0.08rem;
      width: 0.83rem;
      height: 0.86rem;
    }
    .info {
      width: 0;
      flex: 1;
      .title {
        margin-bottom: 6px;
        font-size: 0.15rem;
        font-weight: 600;
        color: #040a2d;
      }
      .label {
        margin-right: 6px;
        font-size: 0.12rem;
        color: #b1b4b9;
      }
      .value {
        font-size: 0.12rem;
         color: #1ebcc4;
      }
    }
    .tags {
      flex-wrap: wrap;
      .tag {
        height: 0.16rem;
        line-height: 0.16rem;
        padding: 0 0.06rem;
        font-size: 0.1rem;
        color: #46a9b4;
        background: #def9fb;
        border-radius: 0.11rem;
      }
    }
  }
  .btn-group {
    padding: 0.15rem;
    justify-content: flex-end;
    .btn {
      margin-left: 0.15rem;
      height: 0.3rem;
      padding: 0 0.24rem;
      font-size: 0.14rem;
      background: #ffffff;
      border-radius: 0.17rem;

      &.edit {
        border: 1px solid #4d6eff;
        color: #4d6eff;
      }
      &.up {
        border: 1px solid #4D6EFF;
        color: #4D6EFF;
      }
      &.down {
        border: 1px solid #FF4E80;
        color: #FF4E80;
      }
      &.delete {
        border: 1px solid #f03434;
        color: #f03434;
      }
    }
  }
}
</style>
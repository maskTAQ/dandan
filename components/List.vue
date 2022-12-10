<script >
// import moment from "moment";
import BScroll from "better-scroll";

import Icon from "@/components/Icon.vue";
import Waterfall from "@/components/Waterfall.vue";
const REFRESH_LOADING_HEIGHT = 60;

/*
1.loading
用户下拉加载
无数据时加载
有数据是加载
*/

const LOADING = {
  NONE: {
    user: false,
    noData: false,
    hasData: false,
  },
  USER: {
    user: true,
    noData: false,
    hasData: false,
  },
  NO_DATA: {
    user: false,
    noData: true,
    hasData: false,
  },
  HAS_DATA: {
    user: false,
    noData: false,
    hasData: true,
  },
};

export default {
  name: "List",
  props: {
    renderItem: Function,
    request: Function,
    pageSize: {
      type: [String, Number],
      default: 10,
    },
    columnNum: {
      type: [String, Number],
      default: 1,
    },
    message: {
      type: Object,
      default() {
        return {};
      },
    },
    disabledRefresh: {
      type: Boolean,
      default: false,
    },
    disabledLoadmore: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object,
      default() {
        return {
          loaded: true,
        };
      },
    },
    eventPassthrough: {
      type: Boolean,
      default: false,
    },
    customControl: {
      type: Boolean,
      default: false,
    },
    resetDatasource: {
      type: Boolean,
      default: false,
    },
    extra: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      canRefresh: false,
      list: [],
      errorText: "",
      status: "init", //loading success error loaded
      current: 0,
      update: "",
      next: NaN,
    };
  },
  mounted() {
    if (!this.customControl) {
      this.init();
    }

    this.getData({ current: 1 });
  },
  watch: {
    list(v) {
      this.$emit("listChange", v);
    },
  },
  computed: {
    refreshInfo() {
      const { canRefresh, status, isInRefresh, list, message } = this;
      switch (true) {
        case isInRefresh.user: {
          return {
            icon: "loading",
            label: message.loading || "正在刷新数据中...",
          };
        }
        // case status === "loading": {
        //   return {
        //     icon: "loading",
        //     label: "正在获取数据中...",
        //     init: true
        //   };
        // }
        case canRefresh: {
          return {
            icon: "up",
            label: "松开立即刷新",
          };
        }
        case !canRefresh: {
          return {
            icon: "down",
            label: "下拉可以刷新",
          };
        }
        default: {
          return null;
        }
      }
    },
    isInRefresh() {
      const { by, next, list, status } = this;
      if (status !== "loading") {
        return LOADING.NONE;
      }
      if (this.by) {
        return LOADING.USER;
      }
      if (list.length) {
        return LOADING.HAS_DATA;
      } else {
        return LOADING.NO_DATA;
      }
    },
    isInLoadmore() {
      return this.next > 1 && this.status === "loading";
    },
  },
  beforeDestroy() {
    !this.customControl && this.control.destroy();
  },
  render() {
    return (
      <div class="scroll-wrapper" ref="scroll">
        {this.$slots.default
          ? this.renderCoustomContent()
          : this.renderDataContent()}
      </div>
    );
  },
  methods: {
    init() {
      const config = {
        scrollX: false,
        scrollY: true,
        pullDownRefresh: this.disabledRefresh
          ? undefined
          : {
              threshold: REFRESH_LOADING_HEIGHT,
              stop: this.disabledRefresh ? 0 : REFRESH_LOADING_HEIGHT - 10,
            },
        pullUpLoad: {
          threshold: 50,
        },
        click: true,
        tap: true,
        mouseWheel: true,
        probeType: 3,
      };
      if (this.eventPassthrough) {
        config.eventPassthrough = "vertical";
      }
      this.control = new BScroll(this.$refs.scroll, config);
      if (!this.disabledRefresh) {
        this.control.on("pullingDown", () => {
          this.refresh("pullingDown").finally((res) => {
            this.control.finishPullDown();
          });
        });
      }
      if (!this.disabledLoadmore) {
        this.control.on("pullingUp", () => {
          this.loadmore().finally((res) => {
            this.control.finishPullUp();
          });
        });
      }
      if (this.request) {
        this.control.on("scroll", (scroll) => {
          if (scroll.y >= REFRESH_LOADING_HEIGHT) {
            this.canRefresh = true;
          } else {
            this.canRefresh = false;
          }
        });
        window.control = this.control;
      }
    },
    reflow() {
      this.control && this.control.refresh();
    },
    getHeader() {
      const { isInRefresh, list, next, status, message } = this;
      let content;
      switch (true) {
        case isInRefresh.noData: {
          content = this.$slots.loading || (
            <div key="header" class="header align loading">
              <van-loading
                class="refresh-icon"
                type="spinner"
                size="0.24rem"
                color="#1c1c1c"
              />
              <i class="label">{message.refresh || "更新中..."}</i>
            </div>
          );
          break;
        }
        case isInRefresh.hasData: {
          content = this.$slots.loading || (
            <div class="header align loading">
              <van-loading
                class="refresh-icon"
                type="spinner"
                size="0.24rem"
                color="#2D4EF5"
              />
              <i class="label">{message.loading || "加载中..."}</i>
            </div>
          );
          break;
        }
        default: {
          content = null;
          break;
        }
      }
      return content;
    },
    getFooter() {
      const {
        isInRefresh,
        list,
        status,
        isInLoadmore,
        disabledRefresh,
        hint,
        message,
        errorText,
      } = this;
      let content;
      switch (true) {
        case status === "error": {
          return (
            <div onClick={this.retry} class="error-box flex-row align">
              {errorText && <i class="value">{errorText},</i>}
              <button class="retry">点我重试</button>
            </div>
          );
        }

        case isInLoadmore: {
          content = (
            <div class="align loadmore">
              <van-loading
                class="refresh-icon"
                type="spinner"
                size="0.24rem"
                color="#1c1c1c"
              />
              <i class="label">正在加载更多数据中...</i>
            </div>
          );
          break;
        }
        case status === "loaded" && !list.length: {
          content = this.$slots.nodata || <van-empty description="暂无数据" />;
          break;
        }
        // case disabledRefresh:
        // case status === "loaded": {
        //   content = hint.loaded && (
        //     <div class="noMore align">
        //       <span class="line" />
        //       <i>到底了</i>
        //       <span class="line" />
        //     </div>
        //   );
        //   break;
        // }
        default: {
          content = null;
          break;
        }
      }
      return content ? <div class="footer">{content}</div> : null;
    },
    refresh(by) {
      this.by = by;
      // this.list = [];
      return this.getData({ current: 1, force: true });
    },
    retry(extra) {
      return this.getData({
        current: this.current,
        force: true,
        extra: this.extra,
      });
    },
    composing() {
      if (this.$refs.waterfall) {
        this.$refs.waterfall.composing();
      }
    },
    reload(extra) {
      // this.list = [];
      return this.getData({ current: 1, force: true, extra });
    },
    loadmore() {
      return this.getData({ current: this.current + 1 });
    },
    getData({ current, force = false, extra = this.extra || {} }) {
      const { customControl } = this;
      if (!this.request) {
        this.status = "loaded";
        this.list = this.data || [];
        return Promise.resolve(this.list);
      }
      // if(current === 1 && this.status === 'loading'){
      //   return Promise.resolve(this.list);
      // }
      if (["loading"].includes(this.status) && !force) {
        return Promise.resolve(this.list);
      }
      if (this.status === "loaded" && current !== 1) {
        return Promise.resolve(this.list);
      }
      this.extra = extra;
      this.next = current;
      this.status = "loading";
      if (current === 1 && this.resetDatasource) {
        this.list = [];
      }
      !customControl && this.$nextTick(() => this.control.refresh());
      return this.request({
        // page: current,
        pageIndex: current,
        pageNum: this.pageSize,
        // pageSize: this.pageSize,
        ...extra,
      })
        .then((r) => {
          const res = r || [];
          const data = Array.isArray(res) ? res : res.lists;
          this.total = Array.isArray(res) ? res.length : res.total;

          this.current = current;
          // this.update = moment().format("HH:mm:ss");
          if (data.length === 0) {
            if (current === 1) {
              this.list = data;
            }
            this.status = "loaded";
          } else {
            if (current === 1) {
              this.list = data;
            } else {
              this.list = this.list.concat(data);
            }
            this.$emit("change", this.list);
            if (data.length < this.pageSize || this.disabledLoadmore) {
              this.status = "loaded";
            } else {
              this.status = "success";
            }
          }
          //this.control.stop();
          //this.control.refresh();
          !customControl && this.control.refresh();
          !customControl && this.$nextTick(() => this.control.refresh());
        })
        .catch((e) => {
          console.log(e, "e");
          this.errorText = typeof e === "object" ? e.message : e;
          this.status = "error";
        })
        .finally(() => {
          this.next = NaN;
        });
    },
    renderDataContent() {
      const { refreshInfo, update, list, renderItem, columnNum } = this;
      return (
        <div class="scroll-content">
          {refreshInfo && (
            <div
              class={{
                "request-tip align": true,
                init: refreshInfo.init,
                refresh: !refreshInfo.init,
              }}
            >
              {refreshInfo.icon === "loading" ? (
                <van-loading
                  class="refresh-icon"
                  type="spinner"
                  size="0.24rem"
                  color="#1c1c1c"
                />
              ) : (
                <Icon type={refreshInfo.icon} />
              )}
              <div class="info flex-column align">
                <i class="top">{refreshInfo.label}</i>
                {update && <i class="update-time">最后更新:今天 {update}</i>}
              </div>
            </div>
          )}
          {this.getHeader()}
          {+columnNum === 1 ? (
            [...this.extra, ...this.list].map((item, i) => {
              return renderItem(item, i, this);
            })
          ) : (
            <Waterfall
              ref="waterfall"
              datasource={[...this.extra, ...this.list]}
              renderItem={(item, i) => renderItem(item, i, this)}
              onComposing={()=>{
                setTimeout(()=>{
                  this.reflow();
                })
              }}
            />
          )}
          {this.getFooter()}
        </div>
      );
    },
    formatData(list, split) {
      if (split === 1) {
        return [list];
      }
      const result = new Array(split).fill("").map((i) => []);
      result.forEach((column, columnIndex) => {
        list.forEach((item, i) => {
          const isCurrentColumn = (i - columnIndex) % split === 0;
          if (isCurrentColumn) {
            column.push(item);
          }
        });
      });
      return result;
    },
    renderCoustomContent() {
      return (
        <div class="scroll-content">
          {this.request && this.getHeader()}
          {this.$slots.default}
          {this.request && this.getFooter()}
        </div>
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/theme.scss";
.scroll-wrapper {
  position: relative;
  overflow: hidden;
  //height: 100%;
  $REFRESH_LOADING_HEIGHT: 0.6rem;

  .request-tip {
    width: 100%;
    height: $REFRESH_LOADING_HEIGHT;

    &.refresh {
      transition: all 1s;
      position: absolute;
      top: -$REFRESH_LOADING_HEIGHT;
      left: 0;
    }
    /* &.init {
      position: absolute;
      top: 0;
      left: 0;
    } */
    .info {
      margin-left: 0.06rem;
      .update-time {
        margin-top: 0.06rem;
      }
    }
  }
  .header {
    padding-top: 0.3rem;
    padding-bottom: 0.2rem;
    color: $color1;
    .label {
      margin-left: 0.06rem;
    }
    &.fixed {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 99;
    }
  }
  .columns {
    .column {
      flex: 1;
    }
  }
  .footer {
    padding: 0.26rem 0;
    min-height: 0.8rem;
    .loading,
    .loadmore {
      .label {
        margin-left: 0.06rem;
      }
    }
    .noMore {
      padding: 0 0.15rem;
      font-size: 0.12rem;
      color: #bdb6b6;
      .line {
        flex: 1;
        height: 1px;
        background: #bdb6b6;
      }
      i {
        margin: 0 0.15rem;
      }
    }
  }
  .error-box {
    padding: 0.26rem 0;
    font-size: 0.12rem;
    .retry {
      color: $color1;
    }
  }
}
</style>
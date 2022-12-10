<script>
import { LoadingControl } from "@/utils";
export default {
  name: "StatusHandle",
  props: {
    status: String,
    get: {
      type: Function,
    },
    loading: {
      type: Object,
      default() {
        return {
          type: "normal",
          color: "#000",
          size: 25,
        };
      },
    },
    block: {
      type: Boolean,
      default: true,
    },
    alwaysRenderChild: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inner: {
        status: "",
        error: "",
      },
    };
  },
  created() {
    if (!process.browser) {
      return;
    }
    if (this.status) {
      this.inner.status = this.status;
    }
    this.getData();
  },
  activated() {
    // if (this.status) {
    //   this.inner.status = this.status;
    // }
    // this.getData();
  },
  watch: {
    status(v) {
      this.inner.status = v;
    },
  },
  methods: {
    refresh() {
      this.getData();
    },
    getData() {
      const { inner, get } = this;
      if (get) {
        LoadingControl({
          call: get,
          change: ({ status }) => {
            this.inner.status = status;
          },
        }).catch((e) => {
          this.inner.error = typeof e === "object" ? e.message : e;
        });
      } else {
        this.$nextTick(() => {
          if (!["loading", "success"].includes(inner.status)) {
            this.$emit("retry");
          }
        });
      }
    },
    getLoading() {
      const { $slots, loading } = this;
      return (
        $slots.loading || (
          <van-loading
            color={loading.color}
            size={loading.size / 100 + "rem"}
          />
        )
      );
    },
    getFloatLoading() {
      return <div class="float-loading align">{this.getLoading()}</div>;
    },
  },
  render() {
    const { inner, block, alwaysRenderChild } = this;
    switch (inner.status) {
      case "":
      case "init":
      case "loading":
        return (
          <div
            class={[
              "loading-box flex-column",
              inner.status,
              block ? "block align " : "",
            ]}
          >
            {alwaysRenderChild
              ? [this.$slots.default, this.getFloatLoading()]
              : this.getLoading()}
          </div>
        );
      case "success":
        return this.$slots ? this.$slots.default : null;
      case "error":
      default:
        if (block) {
          return (
            <button
              class={["retry block", inner.status]}
              onClick={this.getData}
            >
              <van-empty image="error" description={inner.error} />
            </button>
          );
        } else {
          return (
            <button class="retry" onClick={this.getData}>
              {inner.error}
              {inner.error ? "," : ""}点我重试
            </button>
          );
        }
    }
  },
};
</script>
<style lang="scss">
.loading-box {
  position: relative;
  white-space: nowrap;
  &.block {
    padding: 0.15rem;
    width: 100%;
  }
  .float-loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
.retry {
  font-size: 0.14rem;
  line-height: 0.25rem;
  text-align: center;
  &.block {
    padding: 0.15rem;
    width: 100%;
  }
}
</style>

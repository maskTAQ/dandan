<script>
import { icons } from "@/assets";
import ScrollView from "@/components/ScrollView";
export default {
  name: "Tab",
  // props: ["value", "data", "placeholder", "hint"],
  props: {
    value: String,
    data: Array,
    placeholder: String,
    hint: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selected: [
        // {
        //   value:'',
        //   children:[]
        // }
      ],
      icons,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  render() {
    const { data, hint } = this;
    return (
      <div class="tab-scroll">
        <ScrollView ref="scrollTop">
          <div class="tab-box 1">{this.renderList(data, 0)}</div>
        </ScrollView>
        {hint && (
          <img
            src={icons.more}
            class="more animate__animated animate__infinite animate__fadeOutLeft"
          />
        )}

        {/*
          <ScrollView ref="scrollBottom" style={{ display: selected.length ? "" : "none" }}>
          <div class="tab-box 2">
            {selected.map(({ value, node, children }, level) =>
              children && children.length
                ? this.renderList(children, level + 1, node)
                : null
            )}
          </div>
        </ScrollView>
          */}
      </div>
    );
  },
  mounted() {
    this.$emit("load");
  },
  methods: {
    renderList(data, level, parent) {
      if (level >= 2) {
        return null;
      }
      const { selected } = this;

      if (!data || !data.length) {
        return null;
      }
      const list = (
        level
          ? [
              {
                TypeName: "全部",
                tid: parent.tid,
                isAll: true,
              },
            ]
          : [
              {
                TypeName: this.placeholder,
                tid: "",
              },
            ]
      ).concat(data);
      const value = selected[level] ? selected[level].value : "";
      return (
        <div class={["level flex-row center", `level-${level}`]}>
          {list.map((node) => {
            const { TypeName, isAll, tid, children } = node;
            return (
              <div
                key={tid}
                class={[
                  "node flex-column align",
                  {
                    selected:
                      tid === value ||
                      (parent && isAll && (parent.value === value || !value)),
                  },
                ]}
                onClick={() => this.change(node, level)}
              >
                <i>{TypeName}</i>
              </div>
            );
          })}
        </div>
      );
    },
    change(v, level) {
      const { tid, children } = v;
      this.selected[level] = {
        value: tid,
        node: v,
        children,
      };
      this.selected.length = level + 1;
      this.selected = [...this.selected];
      this.$emit("change", this.selected[this.selected.length - 1].value);
      this.refresh();
    },
    refresh() {
      this.$nextTick(() => {
        const scrollTop = this.$refs.scrollTop;
        if (scrollTop) {
          scrollTop.refresh();
        }
        const scrollBottom = this.$refs.scrollBottom;
        if (scrollBottom) {
          scrollBottom.refresh();
        }
      });
    },
    setSelected(value) {
      this.selected = value;
      if (this.selected.length) {
        this.$emit("change", this.selected[this.selected.length - 1].value);
      }
      this.refresh();
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.tab-scroll {
  position: relative;
  .more {
    position: absolute;
    top: 0.14rem;
    right: 0;
    margin-right: -0.1rem;
    width: 0.12rem;
    animation-duration: 1s;
  }
}
.animate__animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-duration: var(--animate-duration);
  animation-duration: var(--animate-duration);
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animate__animated.animate__infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

@keyframes slideInRight {
  0% {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
@keyframes fadeOutLeft {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

.animate__fadeOutLeft {
  -webkit-animation-name: fadeOutLeft;
  animation-name: fadeOutLeft;
}
.animate__slideInRight {
  -webkit-animation-name: slideInRight;
  animation-name: slideInRight;
}
.tab-box {
  padding: 0.1rem 0;

  .level-0 {
    margin-top: 0 !important;
    .node {
      position: relative;
      margin-right: 0.16rem;
      font-size: 0.14rem;
      color: #868e9e;
      &.selected {
        margin-top: -0.02rem;
        padding: 0 0.08rem;
        font-size: 0.16rem;
        font-weight: bold;
      }
      .icon {
        margin-top: 0.05rem;
        width: 0.13rem;
      }
    }
  }
  .level {
    position: relative;
    margin-top: 0.1rem;
  }

  .node {
    margin-right: 0.16rem;
    font-size: 0.12rem;
    color: #2a2a2a;
    &.selected {
      color: #4d6eff;
    }
  }
}
</style>
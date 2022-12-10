<script>
export default {
  name: "Waterfall",
  props: {
    renderItem: Function,
    datasource: Array,
    _key: {
      type: String,
      default: "id",
    },
    columnNum: {
      type: Number,
      default: 2,
    },
    padding: {
      type: Array,
      default() {
        return [20, 0, 10, 0];
      },
    },
    gap: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      columnLayouts: [],
      layouts: [],
      containerH: 0,
    };
  },
  render() {
    const { datasource, renderItem, containerH } = this;
    return (
      <div
        class="waterfall"
        ref="container"
        style={containerH ? { height: containerH + "px" } : {}}
      >
        {datasource.map((data, index) => {
          return (
            <div
              ref={`item-${index}`}
              style={this.getStyle(index)}
              class="waterfall-item"
              key={index}
            >
              {renderItem(data, index)}
            </div>
          );
        })}
      </div>
    );
  },
  watch: {
    datasource() {
      this.composing();
    },
  },
  methods: {
    getStyle(index) {
      const { columnNum, layouts, gap } = this;
      const layout = layouts[index];
      if (layout) {
        const { top, column, height: h } = layout;
        const left = `${100 / (columnNum - column) - 100 / columnNum}%`;
        const height = h ? h + "px" : "auto";
        // console.log({height,h})
        switch (true) {
          case column === 0: {
            return {
              top: top + "px",
              left,
              width: `calc( ${100 / columnNum}% - ${gap / 2}px )`,
              // height: height,
            };
          }
          case column === columnNum - 1: {
            return {
              top: top + "px",
              left: `calc( ${left} + ${gap / 2}px )`,
              width: `calc( ${100 / columnNum}% - ${gap / 2}px )`,
              // height: height,
            };
          }
          default: {
            return {
              top: top + "px",
              left: `calc( ${left} + ${gap / 2}px )`,
              width: `calc( ${100 / columnNum}% - ${gap}px )`,
              // height: height,
            };
          }
        }
      }
      return {
        width: `${100 / columnNum}%`,
        height: "auto",
      };
    },
    getMin(list) {
      if (list.length) {
        const min = Math.min.apply(Math, list);
        return list.indexOf(min);
      } else {
        return 0;
      }
    },
    getMax(list) {
      if (list.length) {
        const max = Math.max.apply(Math, list);
        return list.indexOf(max);
      } else {
        return 0;
      }
    },
    getCount(list) {
      if (list.length) {
        let count = 0;
        list.forEach((v) => {
          count = +count + v;
        });
        return count;
      } else {
        return 0;
      }
    },
    composing() {
      if (!this.$refs["item-0"]) {
        clearTimeout(this.callComposing);
        this.callComposing = setTimeout(() => {
          this.composing();
        }, 10);
        return;
      }
      const { datasource, columnNum, padding, renderItem, layout } = this;
      const [top, right, bottom, left] = padding;
      const columnLayouts = new Array(columnNum).fill("").map(() => []);
      const layouts = [];

      datasource.map((data, index) => {
        const dom = this.$refs[`item-${index}`];
        const countHList = columnLayouts.map((column) =>
          this.getCount(
            column.map((item) => {
              return item.height + top / 2 + bottom / 2;
            })
          )
        );
        const columnIndex = this.getMin(countHList);
        const layout = {
          index,
          top: countHList[columnIndex],
          column: columnIndex,
          height: dom?.clientHeight || 0,
        };
        // console.log(dom,layout.height, "layout");
        columnLayouts[columnIndex].push(layout);
        layouts.push(layout);
      });
      const countHList = columnLayouts.map((column) =>
        this.getCount(column.map((item) => item.height + top / 2 + bottom / 2))
      );
      const max = this.getMax(countHList);
      this.containerH = countHList[max] + top + bottom;
      this.columnLayouts = columnLayouts;
      this.layouts = layouts;
      
      this.$emit('composing');
    },
  },
  mounted() {
    this.composing("mounted");
  },
};
</script>
<style lang="scss">
.waterfall {
  position: relative;
  .waterfall-item {
    position: absolute;
  }
}
</style>
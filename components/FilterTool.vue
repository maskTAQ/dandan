<template>
  <div ref="box" class="filter-tool">
    <div @click.stop class="operation flex-row center">
      <div v-for="item in data" :key="item.key" class="item align">
        <p
          v-if="item.type === 'switch'"
          :class="['switch label', { active: params[item.key] }]"
          @click="change(item)"
        >
          {{ item.label }}
        </p>
        <div
          v-if="item.type === 'radio'"
          @click="onClickTab(item)"
          class="radio flex-row center"
        >
          <i class="label">{{ getLabel(item) }}</i>
          <Triangle
            class="bottom"
            direction="bottom"
            size="6"
            :color="
              dropdown.visible && dropdown.data.key === item.key
                ? '#6dc7c6'
                : '#999'
            "
          />
        </div>
        <div
          v-if="item.type === 'sort'"
          class="sort flex-row center"
          @click="change(item)"
        >
          <i class="label">{{ item.label }}</i>
          <div class="icon">
            <Triangle
              direction="top"
              size="6"
              :color="params[item.key] === 'asc' ? '#6dc7c6' : '#999'"
            />
            <Triangle
              class="bottom"
              direction="bottom"
              size="6"
              :color="params[item.key] === 'desc' ? '#6dc7c6' : '#999'"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="dropdown.visible" class="dropdown-list" :style="{ top }">
      <div @click.stop class="content">
        <div
          v-for="item in dropdown.data.options"
          :key="item.value"
          @click="change({ ...dropdown.data, ...item })"
          :class="[
            'item flex-row main-between center',
            { selected: params[dropdown.data.key] === item.value },
          ]"
        >
          <i class="label">{{ item.label }}</i>
          <img
            v-if="params[dropdown.data.key] === item.value"
            class="icon"
            :src="icons.dropdown_selected"
            alt=""
            srcset=""
          />
        </div>
        <p
          v-if="!dropdown.data.options || !dropdown.data.options.length"
          class="nodata"
        >
          暂无选项
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
const nextSort = {
  none: "asc",
  asc: "desc",
  desc: "",
};
export default {
  name: "FilterTool",
  model: {
    prop: "params",
    event: "change",
  },
  props: ["data", "params"],
  data() {
    return {
      icons,
      dropdown: {
        visible: false,
        data: {},
      },
    };
  },
  mounted() {
    document.addEventListener("click", this.hideDropdown);
  },
  computed: {
    top() {
      const { y, height } = this.$refs.box.getBoundingClientRect();
      return `${y + height}px`;
    },
  },
  methods: {
    onClickTab(data) {
      const { visible, key } = this.dropdown;
      if (key === data.key) {
        this.hideDropdown();
      } else {
        this.dropdown = {
          visible: true,
          data,
          key: data.key,
        };
      }
    },
    hideDropdown() {
      this.dropdown = {
        visible: false,
        data: {},
        key: "",
      };
    },
    change(item) {
      const { params } = this;
      const { key, type, value } = item;
      switch (type) {
        case "radio": {
          this.trigger(key, value);
           this.hideDropdown();
          break;
        }
        case "switch": {
          this.trigger(key, !params[key]);
          this.hideDropdown();
          break;
        }
        case "sort": {
          const v = params[key] || "none";
          this.trigger(key, nextSort[v]);
          this.hideDropdown();
          break;
        }
      }
    },
    trigger(key, value) {
      const next = { ...this.params };
      next[key] = value;
      this.$emit("change", next);
    },
    getLabel({ options, key, label }) {
      const match = options.find((item) => item.value === this.params[key]);
      return match ? match.label : label;
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.filter-tool {
  .operation {
    height: 0.32rem;
    background: #fff;
    .item {
      flex: 1;
      .label {
        font-size: 0.15rem;
        color: $color6;
      }
      .active {
        color: $color1;
      }
    }
    .sort {
      .label {
        margin-right: 0.05rem;
      }
      .bottom {
        margin-top: 1px;
      }
    }
    .radio {
      .label {
        margin-right: 0.06rem;
      }
    }
  }

  .dropdown-list {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    overflow: auto;
    border-top: 1px solid $border;
    background: rgba(0, 0, 0, 0.5);
    .content {
      padding: 0 0.24rem;
      background: #fff;
      box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.05);
      border-radius: 0px 0px 0.06rem 0.06rem;
      .item {
        height: 0.45rem;
        font-size: 0.15rem;
        color: $color6;
        border-bottom: 1px solid $border;
        &:last-child {
          border: none;
        }
        &.selected {
          color: $color1;
        }
        .icon {
          width: 0.16rem;
        }
      }
      .nodata {
        line-height: 0.45rem;
        text-align: center;
        font-size: 0.15rem;
        color: $color6;
      }
    }
  }
}
</style>
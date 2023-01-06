<template>
  <div class="sort-filter flex-row center">
    <!-- <div class="item align">
      <p :class="['switch label', { active: !params.selected }]" @click="reset">
        综合
      </p>
    </div> -->
    <div v-for="item in data" :key="item.key" class="item align">
      <div
        v-if="!item.type"
        :class="['sort flex-row center', { selected: !!params[item.key] }]"
        @click="onClick(item)"
      >
        <i class="label">{{ item.label }}</i>
        <div class="icon">
          <Triangle
            direction="top"
            size="6"
            :color="params[item.key] === 'asc' ? 'rgb(25, 154, 142)' : '#999'"
          />
          <Triangle
            class="bottom"
            direction="bottom"
            size="6"
            :color="params[item.key] === 'desc' ? 'rgb(25, 154, 142)' : '#999'"
          />
        </div>
      </div>
      <div
        v-if="item.type === 'radio'"
        :class="['radio flex-row center']"
        @click="onClick(item)"
      >
        <img
          class="icon"
          :src="
            params[item.key] ? icons.checkboxChecked : icons.checkboxUnchecked
          "
          alt=""
          srcset=""
        />
        <i class="label">{{ item.label }}</i>
      </div>
    </div>
  </div>
</template>
<script>
import { icons } from "@/assets";
const nextSort = {
  none: "asc",
  asc: "desc",
  desc: "asc",
};
export default {
  name: "SortFilter",
  model: {
    prop: "params",
    event: "change",
  },
  props: ["data", "params"],
  data() {
    return {
      icons,
    };
  },

  methods: {
    reset() {
      this.$emit("change", {});
    },
    onClick(data) {
      const { type, key } = data;
      const next = { ...this.params };
      if (type === "radio") {
        next[key] = !next[key];
      } else {
        for (const k in next) {
          const value = next[k];
          if (key !== k && Object.keys(nextSort).includes(value)) {
            next[k] = "";
          }
        }
        next[key] = nextSort[next[key] || "none"];
        next.selected = key;
        next.value = next[key];
      }
      this.$emit("change", next);
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.sort-filter {
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
    &.selected {
      .label {
        color:rgb(25, 154, 142);
      }
    }
    .label {
      margin-right: 0.05rem;
    }
    .bottom {
      margin-top: 1px;
    }
  }
  .radio {
    .icon {
      margin-right: 4px;
      width: 0.14rem;
    }
  }
}
</style>
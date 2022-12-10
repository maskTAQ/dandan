<template>
  <div class="goods-sort-filter flex-row center">
    <div :class="['item align', { active: isAll }]">
      <p :class="['switch label', { active: isAll }]" @click="selectAll">
        全部项目
      </p>
    </div>
    <div v-for="item in data" :key="item.key" class="item align">
      <div class="sort flex-row center" @click="onClick(item)">
        <i class="label">{{ item.label }}</i>
        <div class="icon">
          <Triangle
            direction="top"
            size="8"
            :color="
              params.selected === item.key && params.value === 'asc'
                ? '#2D4EF5'
                : '#fff'
            "
          />
          <Triangle
            class="bottom"
            direction="bottom"
            size="8"
            :color="
              params.selected === item.key && params.value === 'desc'
                ? '#2D4EF5'
                : '#fff'
            "
          />
        </div>
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
  props: ["data", "params", "isAll"],
  data() {
    return {
      icons,
    };
  },

  methods: {
    reset() {
      this.$emit("change", { selected: "", value: "" });
    },
    selectAll() {
      this.$emit("selectAll");
    },
    onClick(data) {
      const { label, key } = data;
      if (this.params.selected === key) {
        const v = this.params.value || "none";
        this.$emit("change", { selected: key, value: nextSort[v] });
      } else {
        this.$emit("change", { selected: key, value: "asc" });
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.goods-sort-filter {
  height: 0.32rem;
  padding: 0 0.13rem;
  background: #fff;
  .item {
    margin-right: 0.11rem;
    padding: 0 0.12rem;
    height: 100%;
    background: #f7f8fa;
    border-radius: 4px;
    &:last-child {
      margin-right: 0;
    }
    .label {
      font-size: 0.14rem;
      font-weight: 400;
      color: #231916;
    }
    .active {
      color: #2d4ef5;
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
}
</style>
<template>
  <van-popup
    :value="visible"
    :close-on-click-overlay="false"
    :close-on-popstate="false"
    @close="hide"
    @click="hide"
    @click-overlay="hide"
    position="bottom"
    get-container="#__nuxt"
  >
    <van-area
      :key="visible"
      ref="picker"
      :value="value"
      @confirm="change"
      :title="title || '请选择地址'"
      :area-list="areaList"
      :columns-num="columnsNum || '3'"
    />
  </van-popup>
</template>
<script>
import areaList from "@/assets/areaList";
export default {
  name: "AreaPicker",
  model: {
    prop: "value",
    event: "change",
  },
  props: ["visible", "value", "title", "columnsNum"],
  data() {
    return {
      areaList,
      //   visible: false,
    };
  },
  watch: {
    // visible(v) {
    //   if (v) {
    //     this.$nextTick(() => {
    //         this.$refs.picker.reset('')
    //       console.log(this.$refs.picker, "this.$refs.picker");
    //     });
    //   }
    // },
  },
  methods: {
    change(v) {
      this.$emit("change", v);
    },
    hide() {
      this.$emit("visible-change", false);
    },
  },
};
</script>
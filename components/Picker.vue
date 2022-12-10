<template>
  <van-popup
    :value="visible"
    :close-on-click-overlay="false"
    :close-on-popstate="false"
    @close="hide"
    @click-overlay="hide"
    position="bottom"
    get-container="#__nuxt"
  >
    <van-picker
      show-toolbar
      :default-index="index"
      @confirm="change"
      :title="title"
      :columns="formatColumns"
    />
  </van-popup>
</template>
<script>
export default {
  name: "Picker",
  model: {
    prop: "value",
    event: "change",
  },
  props: ["visible", "value", "title", "columns"],
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
  computed: {
    formatColumns() {
      return this.columns.map(({ label, value }) => {
        return {
          text: label,
          value,
        };
      });
    },
    index() {
      return this.columns.findIndex(item=>item.value === this.value);
    },
  },
  methods: {
    change(v) {
      this.$emit("change", v.value);
      this.hide();
    },
    hide() {
      this.$emit("visible-change", false);
    },
  },
};
</script>
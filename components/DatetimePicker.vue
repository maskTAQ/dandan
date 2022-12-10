<template>
  <van-popup
    v-if="visible"
    :value="visible"
    :close-on-click-overlay="false"
    :close-on-popstate="false"
    @close="hide"
    @click="hide"
    @click-overlay="hide"
    position="bottom"
    get-container="#__nuxt"
  >
    <van-datetime-picker
      :value="v"
      :min-date="minDate"
      @confirm="change"
      :type="type || 'date'"
      :title="title"
    />
  </van-popup>
</template>
<script>
import day from "dayjs";
if (process.browser) {
  window.day = day;
}
export default {
  name: "DatetimePicker",
  model: {
    prop: "value",
    event: "change",
  },
  props: ["value", "type", "title", "visible"],
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      day,
      //   visible: false,
    };
  },
  computed: {
    v() {
      const { type = "date", value } = this;
      console.log({ value });
      return type === "date"
        ? value
          ? day(value).toDate()
          : day().toDate()
        : value || "";
    },
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
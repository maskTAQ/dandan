<template>
  <Page :title="title">
    <div class="webview-container">
      <iframe :src="src" frameborder="0"></iframe>
    </div>
  </Page>
</template>
<script>
export default {
  name: "webview",

  data() {
    return {};
  },
  computed: {
    src() {
      const { src } = this.query;
      if (String(src).includes("://")) {
        return src;
      } else {
        return `http://${src}`;
      }
    },
    query() {
      return this.$route.query;
    },
    title() {
      const title = this.$route.query.title;

      if (process.browser) {
        window.document.title = title;
      }
      return title;
    },
  },
  methods: {},
};
</script>
<style lang="scss">
.webview-container {
  height: 100%;
  /* padding: 0.1rem; */
  background: #fff;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
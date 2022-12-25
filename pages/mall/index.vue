<template>
  <MallPage key="mall" :config="config" />
</template>
<script>
import MallPage from "@/components/MallPage/index";

export default {
  name: "Hospital",
  head() {
    return {
      title: "周边",
    };
  },

  data() {
    return {
      config: {
        type: "mall",
        title: "周边",
        root: "服务",
        defaultBanner: "陪诊服务",
      },
    };
  },
  components: {
    MallPage,
  },
};
</script>
<template>
  <MallPage key="mall" :config="config" />
</template>
<script>
import MallPage from "@/components/MallPage/index";

export default {
  name: "Hospital",
  head() {
    return {
      title: "服务",
    };
  },

  data() {
    return {
      config: {
        type: "mall",
        title: "服务",
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
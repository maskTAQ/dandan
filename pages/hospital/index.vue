<template>
  <MallPage key="hospital" :config="config" />
</template>
<script>
import MallPage from "@/components/MallPage/index";

export default {
  name: "Hospital",
  head() {
    return {
      title: "医院",
    };
  },
  
  data() {
    return {
      config:{
        type:'hospital',
        title:'医院',
        root:'root',
        defaultBanner:'海外医院'
      }
    }
  },
  components: {
    MallPage,
  },
};
</script>
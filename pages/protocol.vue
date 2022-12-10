<template>
  <Page title="隐私协议">
    <StatusHandle :get="getDetail">
      <div class="html-container">
        <div v-html="HTML"></div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { get } from "@/api/http";
import { icons, img } from "@/assets";
import { router } from "@/utils";

const API = {
  DETAIL(params) {
    return get("/Api/getHideInfo_api.php", params);
  },
};
export default {
  name: "address",
  head() {
    return {
      title: "隐私协议",
    };
  },
  data() {
    return {
      img,
      list: [],
      HTML:''
    };
  },
  methods: {
    getDetail() {
      return API.DETAIL({ id: "protocol" }).then((res) => {
        console.log(res, "res");
        this.HTML = res.Content;
      });
    },
  },
};
</script>
<style lang="scss">
  .html-container{
    height: 100%;
    padding: .1rem;
    background: #fff;
  }
</style>
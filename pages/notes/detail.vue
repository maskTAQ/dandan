<template>
  <Page title="详情">
    <StatusHandle :get="getData">
      <div v-if="data" class="encyclopedia-detail page-full">
        <img v-if="isSelf" @click="edit" :src="icons.edit" alt="" class="edit" />
        <p class="title">{{ data.title }}</p>
        <div class="info flex-row center">
          <div
            v-if="data.fileUrl[0]"
            class="portrait"
            :style="{
              background: `url(${data.fileUrl[0]}) no-repeat center center / cover`,
            }"
          ></div>
          <div>
            <p class="user-name">{{ data.UserName }}</p>
            <p class="time">发布时间：{{ time }}</p>
          </div>
        </div>
        <div v-html="data.content" class="html"></div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { formatTime, wxApi,UID } from "@/utils";
import { get, mock } from "@/api/http";
import { icons } from "@/assets";
const API = {
  DETAIL(params) {
    return get("/Api/getForumInfo_api.php", params, { showError: false });
  },
};
export default {
  name: "encyclopedia-detail",
  head() {
    return {
      title: "详情",
    };
  },
  data() {
    return {
      icons,
      data: null,
    };
  },
  computed: {
    time() {
      return formatTime(this.data.ctime);
    },
    isSelf(){
      return this.data && this.data.uid === UID.GET();
    }
  },
  methods: {
    getData() {
      return API.DETAIL({ fid: this.$route.query.id }).then((res) => {
        this.data = res || {};
        window.shareConfig = {
          title: res.Tital,
          link: "",
        };
        setTimeout(() => {
          wxApi.onMenuShareAppMessage({
            desc: res.title,
            title: res.content, // 分享标题
            // desc: desc, // 分享描述
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            // imgUrl: "https://m.dhcivf.com/depu/favicon.ico", // 分享图标
          });
          wxApi.updateTimelineShareData({
            title: res.title, // 分享标题
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            // imgUrl: "https://m.dhcivf.com/depu/favicon.ico",
          });
        });
      });
    },
    edit() {
      this.$router.push({
        path: "/notes/publish",
        query: {
          id: this.$route.query.id,
        },
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";
.encyclopedia-detail {
  position: relative;
  padding: 0.12rem;
  background: #fff;
  .edit {
    position: absolute;
    top: 0.5rem;
    right: 0.1rem;
    width: 0.14rem;
  }
  .title {
    margin: 0.16rem 0;
    font-size: 0.2rem;
    color: $color4;
  }
  .info {
    margin-bottom: 0.16rem;
    .portrait {
      margin-right: 0.08rem;
      width: 36px;
      height: 36px;
    }
    .user-name {
      font-size: 0.14rem;
      color: $color4;
    }
    .time {
      font-size: 0.12rem;
      color: #ccc;
    }
  }
  .html * {
    max-width: 100%;
  }
}
</style>
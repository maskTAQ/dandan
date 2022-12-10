<template>
  <Page title="系统消息">
    <div class="notify page-full">
      <List
        :request="request"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import day from "dayjs";
import { ImagePreview } from "vant";

import { get, post } from "@/api/http";
import { Tip, UID } from "@/utils";
import Bubble from "@/components/Bubble";
const API = {
  LIST(params) {
    return get("/Api/xcx/getDocBonList_api.php", params);
  },
  SEND(params) {
    return post("/Api/xcx/sendReply_api.php", params, { json: false });
  },
};
export default {
  name: "notify",
  head() {
    return {
      title: "系统消息",
    };
  },
  data() {
    return {
      value: "",
      mobile: "",
      fileList: [
        // {
        //   url: "https://img.yzcdn.cn/vant/leaf.jpg",
        //   status: "success",
        //   message: "上传中...",
        // },
        // {
        //   url: "",
        //   status: "",
        //   message: "上传中...",
        // },
        // {
        //   url: 'https://img.yzcdn.cn/vant/tree.jpg',
        //   status: 'failed',
        //   message: '上传失败',
        // },
      ],
      loading: false,
    };
  },
  methods: {
    request() {
      return API.LIST().then((list) => {
        return [{
            children:[{}]
          }].map(this.format)
      });
    },
    format(item) {
      // console.log(item, "item");
      const { SendDate, redate, ...o } = item;
      const d = day((SendDate || redate) * 1000);
      return {
        ...o,
        day: d.format("MM-DD"),
        year: d.format("YYYY"),
        time: d.format("HH:mm"),
        date: d.format("YYYY年MM月DD日 HH:mm"),
        isChild: !!redate,
      };
    },
    renderItem(item, index, that) {
      const { date, children = [] } = item;
      return (
        <div key={index} class="time-line">
          <div class="time flex-row main-between center">{date}</div>
          <div class="card-list">
            {children.map((child, index) => {
              const { reType } = child;
              return (
                <div class="card">
                  <CoverImage class="portrait" url="" />
                  <Bubble>
                    您购买的服务已进度第二阶段，请您留
                    意电话或短信内容，详情请访问链接地 址:
                    https://yyxx.com/dsbjhj/dsadsa/ dsa=231
                  </Bubble>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },
  components: {
    Bubble,
  },
};
</script>
<style lang="scss">
.notify {
  padding: 0.15rem 0.13rem;
}
</style>
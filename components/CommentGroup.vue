<template>
  <Group
    title="全部评论"
    more
    :moreText="`${total ? total + '条' : ''}`"
    @more="go"
    class="comment-group area radius"
    border
  >
    <div class="flex-row center" slot="headright">
      <ul class="tabs flex-row center">
        <li
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { active: tab.value === activeTab }]"
          @click="handleTabCick(tab)"
        >
          {{ tab.label }}
        </li>
      </ul>
      <img :src="icons.right" alt="" class="right" />
    </div>
    <StatusHandle ref="statusHandle" key="statusHandle" :get="getList">
      <div>
        <template v-if="list.length">
          <CommentInfo
            v-for="item in list"
            :key="item.id"
            :data="item"
            @reply="handleReply"
            @toggle="handleToggle"
          />
        </template>
        <van-empty v-else description="暂无评论，快来发表吧" />
      </div>
    </StatusHandle>
    <div @click.stop class="comment-bar">
      <div class="input-area flex-row center" @click="handleLogin">
        <div class="input-box">
          <Input
            type="text"
            v-model="value"
            :disabled="!userInfo"
            :placeholder="placeholder"
            @focus="focus = true"
          />
        </div>
        <button v-if="isInInput" class="send" @click="send">发送</button>
        <ul v-else class="comment-menus flex-row center">
          <li
            v-for="menu in menus"
            :key="menu.icon"
            class="menu flex-column align"
            @click="handleMenuCick(menu)"
          >
            <span class="value">{{ menu.value }}</span>
            <img :src="menu.icon" alt="" class="icon" />
          </li>
        </ul>
      </div>
      <div v-show="isEmojiPanelVisible" class="emoji-area">
        <Emoji @input="handleInputEmoji" />
      </div>
      <div v-if="isInInput" class="nm flex-row main-between center">
        <div class="flex-row center">
          <van-checkbox v-model="isNoUser" checked-color="#2d4ef5"
            >匿名回复</van-checkbox
          >
        </div>
        <img
          @click="isEmojiPanelVisible = !isEmojiPanelVisible"
          :src="isEmojiPanelVisible ? icons.emoji : icons.emojiHide"
          class="icon"
        />
      </div>
    </div>
  </Group>
</template>

<script>
import day from "dayjs";

import { icons } from "@/assets";
import { get } from "@/api/http";
import CommentInfo from "./CommentInfo";
import { LoadingControl, Tip } from "@/utils";
import { router, UID } from "../utils";

import Emoji from "./Emoji";
import emojiData from "./Emoji/data";
import Input from "./Emoji/Input";

const API = {
  LIST(params) {
    return get("/Api/getContentPL_api.php", params);
  },
  SEND(params) {
    return get("/Api/SendContentPL_api.php", params);
  },
  TOGGLE(params) {
    return get("/Api/SetPLHot_api.php", params);
  },
  COUNT(params) {
    return get("/Api/getRoomInfo_api.php", params);
  },
};
let emojiList = [];
Object.values(emojiData).forEach((obj) => {
  emojiList = emojiList.concat(Object.keys(obj));
});
export default {
  name: "EvaluateGroup",
  props: ["data"],
  data() {
    return {
      icons,
      list: [],
      total: "",
      context: "",
      activeTab: "",
      tabs: [
        {
          label: "最新",
          value: "PLTime",
        },
        {
          label: "最热",
          value: "hotNum",
        },
      ],
      value: "",
      count: {},
      visible: false,
      focus: false,
      isEmojiPanelVisible: false,
      isNoUser: false,
    };
  },
  computed: {
    showList() {
      const { list, visible } = this;
      if (list.length > 3 && !visible) {
        return list.slice(0, 3);
      } else {
        return list;
      }
    },
    toggleLabel() {
      const { list, visible } = this;
      if (list.length > 3 && !visible) {
        return `查看剩余${list.length - 3}条`;
      } else {
        return "收起";
      }
    },
    gid() {
      return this.goods.gid;
    },
    placeholder() {
      const { context, userInfo } = this;
      if (UID.GET() && userInfo) {
        return context ? `@${context.UserName}` : "请输入内容";
      }
      return "登录后发表评论";
    },
    menus() {
      const { count } = this;
      return [
        {
          icon: icons.comment,
          value: count.MessageNum || 0,
          call: this.handleClickComment,
        },
        {
          value: this.data.GoodNum || 0,
          icon: +this.data.isGood ? icons.plLike : icons.plUnlike,
          call: this.toggleLike,
        },
        {
          value: count.fictitiousNum || 0,
          icon: icons.readNum,
        },
      ];
    },
    userInfo() {
      return this.$store.state.userInfo.data;
    },
    isInInput() {
      const { focus, isEmojiPanelVisible } = this;
      return focus || isEmojiPanelVisible;
    },
  },
  created() {
    this.count = { ...this.data };
  },
  methods: {
    setFocus(v) {
      this.focus = v;
    },
    toggle() {
      this.visible = !this.visible;
    },
    handleTabCick(tab) {
      if (tab.value === this.activeTab) {
        this.activeTab = "";
      } else {
        this.activeTab = tab.value;
      }
      this.refresh();
    },
    handleReply(data) {
      if (this.context && this.context.id === data.id) {
        // this.context = null;
      } else {
        this.context = data;
      }
    },
    getList() {
      console.log(this, this.data);
      const params = {
        bid: this.data.bid,
      };
      if (this.activeTab) {
        params.OrderType = this.activeTab;
        params.OrderAsc = "asc";
      }
      return API.LIST(params).then((res) => {
        this.list = res;
      });
    },
    refresh() {
      if (this.$refs.statusHandle) {
        this.$refs.statusHandle.refresh();
      }
    },
    go() {
      this.$router.push({ path: "/evaluation-list", query: { gid: this.gid } });
    },
    handleLogin() {
      if (!(UID.GET() && this.userInfo)) {
        this.$store.commit("toggleForceLoginModalVisible", true);
      }
    },
    handleInputEmoji(emoji) {
      this.value += emoji;
    },
    send() {
      const { context, data, value, list, userInfo, isNoUser } = this;
      if (!userInfo) {
        return;
      }
      if (!value) {
        return Tip.error(context ? "请输入回复内容" : "请输入发表内容");
      }
      const params = {
        bid: data.bid,
        Content: value,
        isNoUser: isNoUser ? 1 : 0,
      };
      if (context) {
        if (context.parent) {
          params.topid = context.parent.id;
          params.touid = context.parent.uid;
        } else {
          params.topid = context.id;
          // params.touid = context.uid;
        }
      }
      LoadingControl({
        call: API.SEND,
        params,
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        const next = [...list];
        const { UserPhoto, NickName } = userInfo;
        const defaultIcon = "https://xxyybaby.com/Tool/user.png";
        const comment = {
          UserPhoto: isNoUser ? defaultIcon : UserPhoto,
          UserName: isNoUser ? "匿名用户" : NickName,
          Content: value,
          PLTime: day().unix(),
        };
        if (context) {
          if (context.parent) {
            comment.AtNickName = context.UserName;
          }
          context.children = context.children || [];
          if (context.parent) {
            context.parent.children.splice(context.index, 0, comment);
          } else {
            context.children.push(comment);
          }
          // const i = list.findIndex((item) => item.id === context.id);

          // next[i].children.push(comment);
        } else {
          next.push(comment);
        }
        this.list = next;
        this.value = "";
        this.context = null;
        this.count.MessageNum = +this.count.MessageNum + 1;
        this.count = { ...this.count };
        this.isEmojiPanelVisible = false;
        Tip.success(context ? "回复成功" : "发表成功");
      });
    },
    handleToggle(data) {
      const next = +data.isHot ? 0 : 1;
      API.TOGGLE({
        pid: data.id,
        isHot: next,
      }).then((res) => {
        if (next) {
          data.isHot = 1;
          data.hotNum = +data.hotNum + 1;
        } else {
          data.isHot = 0;
          data.hotNum = +data.hotNum - 1;
        }
        // this.count.GoodNum = +data.isHot
        //   ? +this.count.GoodNum + 1
        //   : +this.count.GoodNum - 1;
        // this.count = { ...this.count };
        this.list = [...this.list];
        // Tip.success(+data.isHot ? "点赞成功" : "取消点赞成功");
      });
    },
    toggleLike() {
      // this.$emit("toggle-like");
      this.$emit("toggleLike");
    },
    handleClickComment(){
      this.$emit("comment");
    },
    handleMenuCick(menu) {
      if (menu.call) {
        menu.call.call(this);
      }
    },
  },
  components: {
    CommentInfo,
    Input,
    Emoji,
  },
};
</script>
<style lang="scss">
.comment-group {
  /* margin-top: 0.12rem; */
  margin-bottom: 0.24rem;
  /* padding: 0.15rem; */
  padding-top: 0;
  background: #fff;
  /* border-radius: 0.12rem; */
  .title {
    margin: 0 !important;
    margin-bottom: 0.2rem !important;
  }
  .title .icon {
    margin-right: 0.08rem;
  }
  .mt {
    margin-top: 0.15rem;
  }
  .tabs {
    .tab {
      font-size: 0.13rem;
      font-weight: bold;
      color: #989898;
      &.active {
        color: #4d6eff;
      }
      &:first-child {
        margin-right: 0.24rem;
      }
      &:last-child {
        margin-right: 0.07rem;
      }
    }
  }
}
.comment-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  border-top: 1px solid #dbdbdb;
  background: #ffffff;
  z-index: 99;
  .input-area {
    padding: 0.1rem 0.15rem;
    height: 0.5rem;
  }
  .input-box {
    margin-right: 0.12rem;
    width: 0;
    height: 0.3rem;
    flex: 1;
    background: #f7f8fa;
    border-radius: 0.19rem;
    input {
      width: 100%;
      height: 100%;
      padding: 0 4px;
      text-indent: 0.16rem;
      font-size: 0.14rem;
      &::placeholder {
        color: #b6b6b6;
      }
    }
  }
  .send {
    padding: 0 0.1rem;
    height: 0.3rem;
    font-size: 0.14rem;
    color: #fff;
    background: #2d4ef5;
    border-radius: 0.19rem;
  }
  .comment-menus {
    .menu {
      min-width: 0.38rem;
    }
    .value {
      font-size: 0.11rem;
      color: #4e4e4e;
    }
    .icon {
      margin-top: 4px;
      width: 0.14rem;
    }
  }
  .nm {
    padding: 0 0.15rem;
    padding-bottom: 0.1rem;
    .icon {
      width: 0.3rem;
    }
  }
}
</style>
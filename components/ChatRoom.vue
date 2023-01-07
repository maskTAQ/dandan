<script>
import { get, post } from "@/api/http";
import { LoadingControl, UID } from "@/utils";
import { icons } from "@/assets";
import CoverImage from "@/components/CoverImage";
import Emoji from "./Emoji";
import emojiData from "./Emoji/data";
import Input from "./Emoji/Input";
import StatusHandle from "@/components/StatusHandle";
import { router } from "../utils";

const API = {
  MESSAGES(params) {
    return get("/Api/getRoomChats_api.php", params);
  },
  SEND(params) {
    return get("/Api/sendRoomChats_api.php", params);
  },
  UPLOAD_FILE(params) {
    return post("/Api/sendRoomImgChats_api.php", params);
  },
};
let emojiList = [];
Object.values(emojiData).forEach((obj) => {
  emojiList = emojiList.concat(Object.keys(obj));
});
console.log(emojiList, "emojiList");
const DEFAULT_IMG = "";
export default {
  name: "ChatRoom",
  props: ["data", "update", "barFixed"],
  data() {
    return {
      messages: [],
      sendInfo: {
        value: "",
        loading: false,
      },
      uid: "",
      flag: "",
      isFirst: true,
      isEmojiPanelVisible: false,
    };
  },
  render() {
    const { sendInfo, barFixed, uid, isEmojiPanelVisible, flag } = this;
    const canSend = +flag === 1 && uid;
    // this.data.isHost = 1;
    return (
      <div class="chat-room">
        <div
          class="message-area"
          style={{ paddingBottom: isEmojiPanelVisible ? "2.5rem" : ".6rem" }}
          ref="messageArea"
        >
          {this.list.map((group, index) => {
            const { username, messages, portrait, isHost, isTop } = group;
            const self = String(username) === uid;
            console.log(group, "group");
            return (
              <div
                class={{ "group flex-row": true, self, admin: +isHost }}
                key={index}
              >
                <div class={"user-info flex-row"}>
                  <CoverImage url={portrait} class="portrait" />
                  {/*
                    <div class="flex-column">
                    <p clss="username">
                      {self ? "我" : username}:{}
                    </p>
                    {+isTop ? <p class="set-top">置顶</p> : null}
                  </div>
                    */}
                </div>
                <div class="messages">
                  <p class="username">{self ? "我" : username}</p>
                  {messages.map((message, index) => {
                    const {
                      role = "user",
                      ChatsType: type,
                      chatsValue: value,
                    } = message;
                    const className = {
                      message: true,
                      [role || "user"]: true,
                    };
                    switch (type) {
                      case "img": {
                        return (
                          <img src={value || DEFAULT_IMG} class={className} />
                        );
                      }
                      case "text":
                      default: {
                        return (
                          <p
                            class={className}
                            domPropsInnerHTML={this.renderEmoji(value)}
                          ></p>
                        );
                      }
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div
          class={["input-area", canSend ? "" : "disabled"]}
          onClick={this.handleClickInputArea}
          style={{ position: barFixed ? "fixed" : "absolute" }}
        >
          <div class="text-area flex-row center">
            {/*
            <div class="portrait"></div>
            */}
            <img
              onClick={() => {
                this.isEmojiPanelVisible = !this.isEmojiPanelVisible;
              }}
              src={isEmojiPanelVisible ? icons.emoji : icons.emojiHide}
              class="upload-img"
            />
            <Input
              contenteditable={true}
              value={sendInfo.value}
              dan
              onInput={(e) => {
                // this.sendInfo.value = e.target.value;
                console.log(e, "e");
                this.sendInfo.value = e;
              }}
              placeholder={
                canSend
                  ? "问点什么"
                  : uid
                  ? "您已被管理员禁言"
                  : "请先登录,点我登录"
              }
              class="input"
              disabled={!canSend}
            />
            {!!+this.data.isHost && (
              <input
                ref="upload"
                type="file"
                id="file"
                accept="image/*"
                style="display:none"
                onChange={this.handleUploadFile}
                blur={this.fixedIosBrowerBug}
              />
            )}
            {!!+this.data.isHost && canSend && (
              <label for="file">
                <img src={icons.image} class="upload-img" />
              </label>
            )}

            {canSend && (
              <van-button
                onClick={this.send}
                disabled={!sendInfo.value}
                loading={sendInfo.loading}
                class="send"
              >
                提问
              </van-button>
            )}
          </div>
          <div
            style={{
              display: isEmojiPanelVisible ? "block" : "none",
            }}
            class="emoji-area"
          >
            <Emoji
              onInput={(emoji) => {
                if (canSend) {
                  this.sendInfo.value += emoji;
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  },
  computed: {
    list() {
      return this.format(this.messages);
    },
  },
  created() {
    this.get("init");
    this.uid = String(UID.GET() || "");
    window.chatRoom = this;
  },
  watch: {
    update(v) {
      if (!!v) {
        this.get("update");
      } else {
        clearTimeout(this.timeout);
      }
    },
  },
  destroyed() {
    clearTimeout(this.timeout);
  },
  methods: {
    get(by) {
      const { bid, CreateTime } = this.data;
      // console.log("获取消息列表", Date.now());
      LoadingControl({
        call: API.MESSAGES,
        params: {
          LastTime: CreateTime,
          bid: bid,
          isF: this.isFirst ? 1 : 0,
        },
        change: ({ loading }) => {
          this.isFirst = false;
          this.loading = loading;
        },
      }).then(({ list, Flag, MessageNum, HotNum, fictitiousNum }) => {
        this.messages = list;
        this.flag = Flag;
        this.$emit("message", {
          count: MessageNum
            ? +MessageNum + this.messages.length
            : this.messages.length,
          HotNum,
          fictitiousNum,
        });
        //用户自主发送消息时触底
        by === "user" && this.$nextTick(this.scrollBottom);

        clearTimeout(this.timeout);
        if (!!this.update) {
          this.timeout = setTimeout(this.get, 1000, "timeout");
        }
      });
    },
    format(messages) {
      const result = [
        // {
        //   username: "",
        //   messages: [],
        // },
      ];
      messages.forEach((message) => {
        const { UserName: username, UserPhoto: portrait, ...o } = message;
        const group = result[result.length - 1];
        // if (!group || group.username !== username) {
        result.push({
          portrait,
          username,
          messages: [],
          ...o,
        });
        // }
        result[result.length - 1].messages.push(message);
      });
      return result.sort((p, n) => (+n.isTop ? 1 : -1));
    },
    send(message) {
      return LoadingControl({
        call: API.SEND,
        params: {
          bid: this.data.bid,
          message: this.sendInfo.value,
          ChatsType: "text",
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        this.sendInfo.value = "";
        this.isEmojiPanelVisible = false;
        this.get("user");
      });
    },
    scrollBottom() {
      const dom = this.$refs.messageArea;
      if (dom) {
        console.log("scrollBottom");
        // dom.scrollTo(0, dom.scrollHeight);
        dom.scrollTo(0, 0);
      }
    },
    handleUploadFile(e) {
      const file = e.target.files[0];
      if (file) {
        const form = new FormData(); // FormData 对象
        form.append("file", file); // 文件对象
        form.append("bid", this.data.bid);
        form.append("uid", UID.GET());
        form.append("ChatsType", "img");
        LoadingControl({
          call: API.UPLOAD_FILE,
          params: form,
          change: ({ loading }) => {
            this.loading = loading;
          },
        }).then((res) => {
          console.log(res, "res");
          this.get("user");
        });
      }
    },
    fixedIosBrowerBug() {
      window.scroll(0, 0);
    },
    handleClickInputArea() {
      if (!this.uid) {
        const { path, query } = this.$route;
        delete query.uid;
        localStorage.setItem(
          "redirect",
          JSON.stringify({
            path,
            query,
          })
        );
        router.push({
          path: "/login",
        });
      }
    },
    renderEmoji(msg) {
      return msg.replace(/\[[a-z_]+\]/gim, (emoji) => {
        if (emojiList.includes(emoji)) {
          const imgName = emoji.replace(/\[|\]/g, "") + ".png";
          return `<img class="emoji" src="/h5/emoji/${imgName}" />`;
        } else {
          return emoji;
        }
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.chat-room {
  position: relative;
  
  /* min-height: calc(100vh - 1.06rem); */

  .message-area {
    height: 100%;
    overflow: auto;
    padding: 0.25rem 0.12rem;
    /* padding-bottom: 0.5rem; */
    overflow: auto;
  }
  .group {
    align-items: flex-start;
    margin-bottom: 0.18rem;
    &.admin {
      color: #6dc7c6 !important;
      .message {
        color: #6dc7c6 !important;
      }
    }
    .user-info {
      margin-right: 0.1rem;
    }
    .set-top {
      margin-top: 4px;
      width: 0.32rem;
      height: 0.18rem;
      padding: 0 0.04rem;
      border-radius: 0.04rem;
      font-size: 0.12rem;
      color: #fff;
      background: #fea770;
    }
    .messages {
      position: relative;
      width: 0;
      flex: 1;
      .username {
        position: absolute;
        left: 0;
        top: -0.08rem;
        height: 0.16rem;
        padding: 0 0.11rem;
        font-size: 0.08rem;
        color: #fff;
        border-radius: 0.1rem;
        background: rgb(25, 154, 142);
      }
    }
    .portrait {
      /* margin-right: 0.15rem; */
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
    }
    .username {
      font-size: 0.14rem;
      color: $color6;
    }
    .messages {
      & > * {
        margin-bottom: 0.08rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    p.message {
      padding: 0.1rem;
      background: rgb(246, 246, 246);
      border-radius: 0px 16px 16px 16px;
      line-height: 0.2rem;
      &.user {
        font-size: 0.14rem;
        color: #6e6e6e;
      }
      &.host {
        font-size: 0.14rem;
        color: $color4;
        font-weight: bold;
      }
      .emoji {
        width: 0.2rem;
        vertical-align: bottom;
      }
    }
    img.message {
      display: block;
      max-width: 100%;
    }
  }
  .input-area {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    background: #fff;
    box-shadow: 0px 12px 50px rgba(20, 72, 130, 0.06);
    border-radius: 0.1rem;
    .text-area {
      /* height: 0.5rem;
      padding: 0 0.12rem; */
      height: 0.58rem;
      padding-left: 0.19rem;
      padding-right: 0.15rem;
      box-shadow: 0px 12px 50px rgba(20, 72, 130, 0.06);
      border-radius: 0.1rem;
    }
    .portrait {
      margin-right: 0.13rem;
      width: 0.26rem;
      height: 0.26rem;
      border-radius: 50%;
      /* border: 1px solid red; */
    }
    .input {
      width: 0;
      flex: 1;
      height: 0.32rem;
      text-indent: 0.12rem;
      font-size: 0.14rem;
      border-radius: 0.16rem;
      background: $color13;
    }
    .upload-img {
      margin-right: 0.13rem;
      width: 0.24rem;
    }
    .send {
      margin-left: 0.13rem;
      height: 0.26rem;
      line-height: 0.26rem;
      padding: 0 0.12rem;
      font-size: 0.12rem;
      color: #fff;
      border-radius: 0.13rem;
      background: $color1;
    }
  }
}
</style>
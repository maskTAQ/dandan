<script>
import day from "dayjs";

import { get, post } from "@/api/http";
import { LoadingControl, router,UID } from "@/utils";
import { icons } from "@/assets";
import Q from "@/components/Q";

const API = {
  MESSAGES(params) {
    return get("/Api/getMsgListByDoctor_api.php", params);
  },
  SEND(params) {
    return get("/Api/sendMessage_api.php", params);
  },
  UPLOAD_FILE(params) {
    return post("/Api/sendImgMessage_api.php", params);
  },
};

const MESSAGE_TYPE = {
  NAME: "MESSAGE",
  TEXT: "text",
  IMAGE: "img",
};
const TYPE = {
  Q: "Q",
  HINT: "HINT",
  TIME: "TIME",
};
const DEFAULT_IMG =
  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606382432741&di=b5ebb8a284436b0ef78a396fbbed3172&imgtype=0&src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F0829%2F372edfeb74c3119b666237bd4af92be5.jpg";
const isMessage = (type) => Object.values(MESSAGE_TYPE).includes(type);
const now = day(1606378563047 - 1000 * 60);
const getTime = (v) => day(1606378563047 - 1000 * 60 + v * 1000 * 1000);

export default {
  name: "consult-doctor",
  head() {
    return {
      title: "医生咨询",
    };
  },
  data() {
    return {
      data: {},
      messages: [],
      sendInfo: {
        value: "",
        loading: false,
      },
    };
  },
  render() {
    const { sendInfo, list } = this;
    return (
      <div class="consult-doctor page-full">
        <div class="message-area" ref="messageArea">
          {list.map((group, index) => {
            const { username, messages, type, portrait, value, isSelf } = group;
            switch (type) {
              case MESSAGE_TYPE.NAME: {
                const self = !!isSelf;
                return (
                  <div
                    class={{ "group flex-row": true, self: isSelf }}
                    key={index}
                  >
                    <div class="user-info flex-row center">
                      <div
                        class="portrait"
                        style={{
                          background: `url('${portrait}') no-repeat left center / 100%`,
                        }}
                      />
                    </div>
                    <div class="messages flex-column">
                      {!self && (
                        <p class="username">{self ? "我" : username}</p>
                      )}
                      {messages.map((message, index) => {
                        const { role = "user", type, value } = message;
                        const className = {
                          message: true,
                          [role || "user"]: true,
                        };
                        switch (type) {
                          case MESSAGE_TYPE.IMAGE: {
                            return (
                              <img
                                src={value || DEFAULT_IMG}
                                class={className}
                              />
                            );
                          }
                          case MESSAGE_TYPE.TEXT:
                          default: {
                            return <p class={className}>{value}</p>;
                          }
                        }
                      })}
                    </div>
                  </div>
                );
              }
              case TYPE.Q: {
                return <Q class="q" key={index} />;
              }
              case TYPE.HINT: {
                return (
                  <div class="hint-box align">
                    <div class="hint flex-row center">
                      <i class="text">提醒：您的1次提问3次追问已用完请</i>
                      <button class="btn">重新提问</button>
                    </div>
                  </div>
                );
              }
              case TYPE.TIME: {
                return (
                  <div class="hint-box align">
                    <div class="hint time flex-row center">
                      <i class="text">{value}</i>
                    </div>
                  </div>
                );
              }
            }
          })}
        </div>
        <div class="input-area flex-row center">
          <input
            value={sendInfo.value}
            onInput={(e) => (this.sendInfo.value = e.target.value)}
            placeholder="问点什么"
            class="input"
          />
          <input
            ref="upload"
            type="file"
            id="file"
            accept="image/*"
            style="display:none"
            onChange={this.handleUploadFile}
            blur={this.fixedIosBrowerBug}
          />
          <label for="file">
            <img src={icons.image} class="upload-img" />
          </label>
          <van-button
            onClick={this.send}
            disabled={!sendInfo.value}
            loading={sendInfo.loading}
            class="send"
          >
            提问
          </van-button>
        </div>
      </div>
    );
  },
  computed: {
    list() {
      return this.format(this.messages);
    },
    did() {
      return this.$route.query.id;
    },
  },
  created() {
    this.get("init");
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
          did: this.did,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        this.messages = res;

        clearTimeout(this.timeout);

        // this.timeout = setTimeout(this.get, 1000, "timeout");
      });
    },
    format(messages) {
      const result = [
        // {
        //   username: "",
        //   messages: [],
        // },
      ];
      let lastTime = null;
      messages.forEach((message) => {
        const {
          ChatsType: type,
          exName: username,
          CreateTime: time,
          Msg: value,
          exPhoto: portrait,
          isSelf,
        } = message;
        const isMsg = isMessage(type);
        //如果俩条时间间隔 >= 10m 则插入时间
        if (lastTime) {
          const diff = day(lastTime * 1000).diff(time * 1000, "m");
          if (diff >= 10 || diff <= -10) {
            result.push({
              type: TYPE.TIME,
              value: day(time * 1000).format("MM-DD HH:mm:ss"),
            });
            lastTime = time;
          }
        } else {
          lastTime = time;
        }
        const msg = { type, username, time, value, portrait, isSelf };
        if (isMsg) {
          const group = result[result.length - 1];

          if (!group || group.username !== username || !isMessage(group.type)) {
            result.push({
              username,
              portrait,
              isSelf,
              type: MESSAGE_TYPE.NAME,
              messages: [],
            });
          }
          result[result.length - 1].messages.push(msg);
        } else {
          result.push(msg);
        }
      });
      console.log(result, "result");
      return result;
    },
    send(message) {
      LoadingControl({
        call: API.SEND,
        params: {
          did: this.did,
          message: this.sendInfo.value,
          ChatsType: MESSAGE_TYPE.TEXT,
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        this.sendInfo.value = "";
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
        form.append("uid", UID.GET());
        form.append("ChatsType", MESSAGE_TYPE.IMAGE);
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
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.consult-doctor {
  position: relative;
  background: $color8;

  .message-area {
    height: calc(100% - 0.5rem);
    overflow: auto;
    padding: 0.12rem;
    overflow: auto;
  }
  .q,
  .hint {
    margin-bottom: 0.2rem;
  }
  .hint {
    height: 0.2rem;
    padding: 2px 0.28rem;
    background: #f1f2f4;
    border-radius: 5px;
    font-size: 0.12rem;
    color: #aaaaaa;
    &.time {
      padding: 2px 0.11rem;
    }
    .btn {
      color: $color1;
    }
  }
  .group {
    align-items: flex-start;
    margin-bottom: 0.16rem;
    &.self {
      flex-direction: row-reverse;
      .user-info {
        margin-right: 0;
        margin-left: 0.08rem;
      }

      .messages {
        align-items: flex-end;
        p.message {
          border-radius: 5px 0px 10px 10px;
        }
      }
    }
    .user-info {
      margin-right: 0.08rem;
    }
    .portrait {
      width: 0.38rem;
      height: 0.38rem;
      border-radius: 50%;
      /* border: 1px solid red; */
    }
    .username {
      font-size: 0.14rem;
      color: #aaaaaa;
    }
    .messages {
      width: 0;
      flex: 1;
      & > * {
        margin-bottom: 0.08rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
      p.message {
        padding: 0.09rem 0.16rem;
        background: #ffffff;
        border-radius: 0px 10px 10px 10px;
        &.user {
          font-size: 0.14rem;
          color: $color4;
        }
        &.host {
          font-size: 0.14rem;
          color: $color4;
          font-weight: bold;
        }
      }
      img.message {
        display: block;
        max-width: 50%;
        max-height: 50%;
      }
    }
  }

  .input-area {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.5rem;
    padding: 0 0.12rem;
    background: #fff;
    box-shadow: 0px -1px 12px 0px rgba(76, 135, 249, 0.05);
    .input {
      margin-right: 0.13rem;
      width: 0;
      flex: 1;
      height: 0.32rem;
      text-indent: 0.12rem;
      font-size: 0.14rem;
      border-radius: 0.16rem;
      background: $color13;
    }
    .upload-img {
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
<script>
import { icons, agent } from "@/assets";
import { router } from "@/utils";
import Page from "@/components/Page";
import CoverImage from "@/components/CoverImage";
import StatusHandle from "@/components/StatusHandle";
import Group from "@/components/Group";

// import './index.scss'
// console.log(require("../assets/agent/bg.png"),'-')
const eye = require("./imgs/eye.png");
export default {
  name: "agent",
  head() {
    return {
      title: "",
    };
  },
  data() {
    return {
      eye,
      visible: false,
      tabs: [
        // {
        //   label: "旦旦医学官网",
        //   icon: agent.website,
        //   path: "/",
        // },
        {
          label: "知识库",
          icon: agent.sell,
          path: "/agent/marketing-center",
        },
        {
          label: "助孕大使权益",
          icon: agent.bill,
          path: "/agent/vip",
        },
        {
          label: "助孕分享码",
          icon: agent.invite,
          path: "/agent/code",
        },
      ],
      listBottom: [
        {
          label: "佣金明细",
          icon: agent.jfmx,
          path: "/agent/integral",
        },
        {
          label: "佣金提现",
          icon: agent.exchange,
          path: "/agent/exchange",
        },
        {
          label: "客户管理",
          icon: agent.customerManage,
          path: "/agent/client",
        },
        {
          label: "我的团队",
          icon: agent.friends,
          path: "/agent/team",
        },
        {
          label: "我的二维码",
          icon: agent.code,
          path: "/agent/code",
        },
      ],
      integralList: [
        {
          label: "可兑换积分",
          key: "UserNum",
        },
        {
          label: "累计积分",
          key: "realAmt",
        },
        {
          label: "预计收入积分",
          key: "bValue",
        },
      ],
    };
  },
  methods: {
    getAgentUserInfo() {
      return this.$store.dispatch("getAgentUserInfo");
    },
    toggle() {
      this.visible = !this.visible;
    },
  },
  render() {
    const { visible } = this;
    const agentUserInfo = this.$store.state.agentUserInfo.data || {};
    console.log({ visible },agentUserInfo, "agentUserInfo");
    const conut = String(agentUserInfo.UserNum);
    return (
      <Page title="助孕大使">
        <StatusHandle get={this.getAgentUserInfo}>
          <div class="agent">
            <div class="agent-content">
              <div class="user-info">
                <CoverImage
                  url={agentUserInfo.UserPhoto}
                  size="0.5rem"
                  circle
                  class="portrait"
                />
                <div class="level">初级助孕大使</div>
                <p class="name">{agentUserInfo.NickName || "--"}</p>
                <div class="flex-row main-between center">
                  <div class="flex-row center">
                    <span class="label text">可兑换积分：</span>
                    <span class="value text">
                      {visible ? conut : conut.replace(/./gim, "*")}
                    </span>
                    <img
                      onClick={() => {
                        this.visible = !this.visible;
                      }}
                      src={eye}
                      class="icon"
                    />
                  </div>
                  <button
                    onClick={() => {
                      router.push({ path: "/agent/integral-exchange" });
                    }}
                    class="exchange align"
                  >
                    提 现
                  </button>
                </div>
              </div>
              <Group class="card" title="更多功能" border>
                <div class="list">
                  {this.listBottom.map(({ label, icon, path }) => {
                    return (
                      <div
                        onClick={() => {
                          router.push({ path });
                        }}
                        key={label}
                        class="item flex-row main-between center"
                      >
                        <div class="flex-row center">
                          <img mode="widthFix" src={icon} class="icon"></img>
                          <p class="label">{label}</p>
                        </div>
                        <img
                          mode="widthFix"
                          src={icons.right}
                          class="more"
                        ></img>
                      </div>
                    );
                  })}
                </div>
              </Group>
            </div>
          </div>
        </StatusHandle>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";
$base: 1;
.agent {
  height: 100%;
  overflow: auto;
  background: $color1;

  .agent-content {
    // position: absolute;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // z-index: 1;
    position: relative;
    /* padding: 0 0.12rem; */
    /* padding-bottom: 0.64rem; */
  }
  .user-info {
    position: relative;
    margin: 0 0.06rem;
    margin-top: 0.68rem;
    height: 1.18rem;
    padding: 0 0.23rem;
    padding-top: 0.35rem;

    background: #fff;
    background: url("./imgs/bg.png") no-repeat left bottom / 100% auto;

    .portrait {
      position: absolute;
      top: -0.5rem;
      left: 50%;
      margin-left: -0.345rem;
      width: 0.69rem;
      height: 0.69rem;
      margin-right: 0.12rem;
      border-radius: 50%;
      box-shadow: 3px 3px 9px 0px rgba(232, 234, 236, 0.51);
      border: 4px solid #ffffff;
      /* border: 1px solid red; */
    }
    .level {
      position: absolute;
      top: -0.4rem;
      left: 50%;
      margin-left: 0.45rem;
      text-indent: 0.04rem;
      line-height: 0.2rem;
      width: 0.83rem;
      height: 0.3rem;
      font-size: 0.11rem;
      color: #4474f7;
      background: url("./imgs/level.png") no-repeat left bottom / 100% 100%;
    }
    .name {
      margin-bottom: 0.1rem;
      font-size: 0.19rem;
      font-weight: bold;
      text-align: center;
      color: #1c1c1c;
    }
    .text {
      font-size: 0.12rem;
      color: #989898;
      font-weight: 400;
    }
    .icon {
      margin-left: 0.1rem;
      width: 0.11rem;
    }
    .exchange {
      padding: 0 0.1rem;
      height: 0.24rem;
      font-size: 0.12rem;
      color: #ffffff;
      background: linear-gradient(160deg, #fea845 0%, #fe6a22 100%);
      border-radius: 0.13rem;
    }
  }
  .card {
    margin: 0 0.12rem;
    margin-top: 0.06rem;
    padding: 0 0.2rem;
    background: #ffffff;
    box-shadow: 0px 2px 6px 0px rgba(139, 156, 164, 0.17);
    border-radius: 0.1rem;
  }
  .list {
    margin-top: 0.14rem;
    padding: 0 0.12rem;
    background: #fff;
    border-radius: 0.05rem;

    .item {
      height: 0.57rem;
      /* border-bottom: 1px solid $border;

      &:last-child {
        border-bottom: none;
      } */

      .icon {
        max-width: 0.2rem;
        max-height: 0.2rem;
        // height: 0.18rem;
      }

      .label {
        margin-left: 0.07rem;
        font-size: 0.15rem;
        color: #2a2a2a;
      }

      .more {
        width: 0.06rem;
        // height: 0.14rem;
      }
    }
  }
}
</style>
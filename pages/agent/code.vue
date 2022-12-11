<script>
import { ImagePreview } from "vant";
import { get } from "@/api/http";
import UserInfo from "@/components/UserInfo";
import Page from "@/components/Page";
import CoverImage from "@/components/CoverImage";
import StatusHandle from "@/components/StatusHandle";
import { icons, agent } from "@/assets";

const border = require("@/assets/img/code-border.png").default;
const logo = require("@/assets/img/code-logo.png").default;

const API = {
  CODE() {
    return get("/Api/getUserQR_api.php");
  },
  h() {
    return get("/Api/getUserXHQR_api.php");
  },
};

export default {
  name: "agent-code",
  head() {
    return {
      title: "我的二维码",
    };
  },
  data() {
    return {
      tab: ["三笙医生二维码", "瑞孕试管二维码"],
      current: 0,
      img: "",
      img2: "",
      tab: "web",
    };
  },
  created() {
    this.getImg();
  },
  methods: {
    getUserInfo() {
      return this.$store.dispatch("getAgentUserInfo");
    },
    show() {
      const { tab, img, img2 } = this;
      ImagePreview({
        images: [tab === "web" ? img : img2],
        startPosition: 0,
      });
    },
    getImg() {
      API.CODE().then((res) => {
        this.img = res.url;
      });
      // API.h().then((res) => {
      //   this.img2 = res.url;
      // });
    },
  },
  render() {
    const { img, img2, tab } = this;
    const agentUserInfo = this.$store.state.agentUserInfo.data || {};
    return (
      <Page title="我的二维码">
        <StatusHandle get={this.getUserInfo}>
          <div class="code">
            <div class="inner  flex-column align">
              <div class="user-info flex-row center">
                <CoverImage
                  url={agentUserInfo.UserPhoto}
                  size="0.5rem"
                  circle
                  class="portrait"
                />
                <div class="info">
                  <p class="name">{agentUserInfo.NickName || "--"}</p>
                  <p class="slogan">
                    {agentUserInfo.UserRemarks || "定制个性签名"}
                  </p>
                </div>
              </div>
              <div class="code-box">
                <img src={img} />
              </div>
              <p class="text">长按保存扫一扫上面的二维码图案</p>
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

.code {
  height: 100%;
  overflow: auto;
  background: $color1 url("./imgs/code-bg.png") no-repeat center top 0.41rem /
    3.22rem auto;
  .inner {
    margin: 0 auto;
    margin-top: 1.5rem;
    width: 3.45rem;
    height: 4.53rem;
    background: #ffffff;
    box-shadow: 0px 2px 6px 0px rgba(139, 156, 164, 0.17);
    border-radius: 0.1rem;
  }
  .user-info {
    .portrait {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.07rem;
      border-radius: 50%;
    }
    .name {
      font-size: 0.16rem;
      font-weight: bold;
      color: #333;
    }
    .slogan {
      margin-top: 0.08rem;
      font-size: 0.14rem;
      color: #6dc7c6;
    }
    .more {
      width: 0.16rem;
    }
  }
  .code-box {
    margin: 0 auto;
    margin-top: 0.2rem;
    margin-bottom: 0.32rem;
    width: 2.55rem;
    height: 2.55rem;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .text {
    margin-bottom: 4px;
    font-size: 0.13rem;
    color: #666666;
  }
}
</style>
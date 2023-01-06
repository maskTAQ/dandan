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
    const levelName = {
      1: "用户",
      2: "普通合伙人",
      3: "高级合伙人",
    };
    const level = levelName[agentUserInfo.UserLevel];
    return (
      <Page title="我的二维码" fixed>
        <StatusHandle get={this.getUserInfo}>
          <div class="code">
            <div class="inner  flex-column center">
              <div class="user-info-card flex-column align">
                <CoverImage
                  url={agentUserInfo.UserPhoto}
                  size="0.5rem"
                  circle
                  class="portrait"
                />
                <div class="info">
                  <p class="name">{agentUserInfo.NickName || "--"}</p>
                  {level && <p class="slogan">{level}</p>}
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
  background: $color1 url("./imgs/code-bg.png") no-repeat center top / 100% auto;
  .inner {
    margin: 0 auto;
    margin-top: 1.5rem;
    width: 3.45rem;
    height: 4.62rem;
    background: rgb(255, 255, 255, 0.77);
    box-shadow: 0px 7px 16px rgba(88, 91, 120, 0.38);
    border-radius: 0.1rem;
  }
  .user-info-card {
    margin-top: -0.6rem;
    .portrait {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }
    .name {
      margin-top: 0.12rem;
      font-size: 0.16rem;
      font-weight: 600;
      color: rgb(25, 154, 142);
    }
    .slogan {
      margin-top: 0.08rem;
      font-size: 0.14rem;
      font-weight: 500;
      color: rgb(25, 154, 142);
    }
    .more {
      width: 0.16rem;
    }
  }
  .code-box {
    margin: 0 auto;
    margin-top: 0.2rem;
    margin-bottom: 0.32rem;
    width: 1.88rem;
    height: 1.88rem;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .text {
    margin-bottom: 4px;
    font-size: 0.13rem;
    color: rgb(25, 154, 142);
  }
}
</style>
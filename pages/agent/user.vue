<script>
import { agentIcons } from "@/assets";
import { formatTime, router } from "@/utils";
import { get } from "@/api/http";
import List from "@/components/List";
import StatusHandle from "@/components/StatusHandle";
import Page from "@/components/Page";

const API = {
  ARTICLE_LIST(params) {
    return get("/Api/xcx/getZXList_api.php", params);
  },
};

const bg = require("@/assets/img/user-bg.png");
export default {
  name: "user",
  head() {
    return {
      title: "个人中心",
    };
  },
  methods: {
    getAgentUserInfo() {
      return this.$store.dispatch("getAgentUserInfo");
    },
    request(params) {
      return API.ARTICLE_LIST(params);
    },
    renderItem(item) {
      const { bid, PageImg, Tital, CreateTime } = item;
      return (
        <div
          onClick={() => {
            router.push({ path: "article", query: { id: bid } });
          }}
          class="item"
        >
          <img mode="aspectFill" src={PageImg} class="cover"></img>
          <p class="title ellipsis line-2">{Tital}</p>
          <p class="time">{formatTime(CreateTime)}</p>
        </div>
      );
    },
  },
  render() {
    const data = this.$store.state.agentUserInfo.data || {};
    return (
      <Page title="个人中心" fixed>
        <StatusHandle get={this.getAgentUserInfo}>
          <div class="user flex-column">
            <div class="user-card">
              <img class="bg" mode="widthFix" src={bg} />
              <div class="content flex-column align">
                <img class="portrait" src={data.UserPhoto} />
                <p class="name">{data.NickName}</p>
                {/*
              <p class="mobile">134****4334</p>
              */}
              </div>
              <div class="tool">
                <img class="btn" src={agentIcons.message} mode="widthFix"></img>
              </div>
            </div>
            <div class="list-wrapper">
              <div class="header flex-row center">
                <img
                  src={agentIcons.user_title}
                  mode="widthFix"
                  class="icon"
                ></img>
                <p class="title">代理商资讯</p>
              </div>
              <List
                class="list"
                request={this.request}
                renderItem={this.renderItem}
                hint={{
                  loaded: false,
                }}
              />
            </div>
          </div>
        </StatusHandle>
      </Page>
    );
  },
};
</script>
<style lang="scss">
.user {
  height: 100%;
  background: #f5f6fb;
}

.user-card {
  position: relative;
  padding: 0;

  .bg {
    width: 100%;
    height: 100%;
  }

  .tool {
    position: absolute;
    top: 0.27rem;
    right: 0.14rem;

    .btn {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;

      &:first-child {
        margin-right: 0.1rem;
      }
    }
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .portrait {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
  }

  .name {
    margin-top: 0.24rem;
    margin-bottom: 0.09rem;
    font-size: 0.18rem;
    color: #fff;
  }

  .mobile {
    font-size: 0.14rem;
    color: #fff;
  }
}

.list-wrapper {
  height: 0;
  flex: 1;
  padding: 0.1rem 0.15rem;
  padding-top: 0;
  .list {
    height: calc(100% - 0.4rem);
  }
}

.header {
  height: 0.4rem;
  .icon {
    margin-right: 0.1rem;
    width: 0.2rem;
  }

  .label {
    font-size: 0.16rem;
    color: #000000;
  }
}

.item {
  margin-top: 0.14rem;
  padding: 0.12rem 0.11rem;
  background: #ffffff;
  border-radius: 0.08rem;

  .cover {
    margin-bottom: 0.14rem;
    display: block;
    width: 100%;
    height: 1.39rem;
  }

  .title {
    margin-bottom: 0.1rem;
    font-size: 0.14rem;
    color: #2d2d2d;
  }

  .time {
    display: block;
    width: 100%;
    text-align: right;
    font-size: 0.12rem;
    color: #6c6c6c;
  }
}
</style>
<script>
import { get } from "@/api/http";
import SearchTool from "@/components/SearchTool";
import List from "@/components/List";
import Page from "@/components/Page";
import { OS, router } from "@/utils";

const API = {
  LIST(params) {
    return get("/Api/xcx/getMyTeam_api.php", params);
  },
};
const filter = [
  {
    label: "推荐值",
    key: "TJ",
  },
  {
    label: "积分值",
    key: "JF",
  },
];
export default {
  name: "team",
  head() {
    return {
      title: "我的好友",
    };
  },
  data() {
    return {
      seachValue: "",
      sort: {
        selected: "",
        value: "",
      },
    };
  },
  methods: {
    refresh() {
      this.$refs.list && this.$refs.list.refresh();
    },
    request(params) {
      const { selected: OrderType, value: AscType } = this.sort;
      return this.$store.dispatch("getAgentUserInfo").then((userInfo) => {
        return API.LIST({
          ...params,
          OrderType,
          AscType,
          seachValue: this.seachValue || "",
          uid: (userInfo || {}).uid,
        });
      });
    },
    renderItem(item) {
      const { UserPhoto, uid, NickName, JF } = item;
      return (
        <div key={uid} class="item flex-row center">
          <img src={UserPhoto} class="portrait"></img>
          <div class="info flex-row main-between">
            <div class="flex-column">
              <p class="name">{NickName}</p>
              <div class="flex-row center">
                <span class="label">咨询积分:</span>
                <span class="value">{JF}</span>
              </div>
            </div>
            <p class="id">ID：{uid}</p>
            {/*
              <button
              onClick={() => {
                router.push({
                  path: "/agent/client",
                  query: {
                    id: uid,
                  },
                });
              }}
              class="view"
            >
              客户列表
            </button>
              */}
          </div>
        </div>
      );
    },
  },
  render() {
    const { seachValue, sort } = this;
    return (
      <Page title="我的好友">
        <div class="friend page-full">
          <SearchTool
            search={seachValue}
            onInput={(v) => {
              this.seachValue = v;
            }}
            onSearch={this.refresh}
            params={sort}
            onChange={(sort) => {
              this.sort = sort;
              this.$nextTick(this.refresh);
            }}
            data={filter}
            style={{ top: OS.isWechat ? 0 : ".5rem" }}
          />
          <List
            class="list"
            request={this.request}
            renderItem={this.renderItem}
            ref="list"
          />
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.friend {
  padding-top: 0.94rem;
  background: #f5f6fa;

  .search-tool {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
  }

  .list {
    /* padding: 0.12rem; */
    height: 100%;

    .item {
      margin-bottom: 0.1rem;
      padding: 0.15rem;
      /* box-shadow: 0px 4px 12px 0px rgba(76, 135, 249, 0.05);
      border-radius: 0.08rem; */
      background: #fff;

      .portrait {
        margin-right: 0.1rem;
        width: 0.57rem;
        height: 0.57rem;
        border-radius: 50%;
      }
      .info {
        flex: 1;
        height: 100%;
        .flex-column {
          /* height: 0.9rem; */
        }
      }

      p {
        font-size: 0.16rem;
        color: $color2;
      }
      .name {
        margin-bottom: 0.06rem;
        font-size: 0.16rem;
        font-weight: 500;
        color: #000000;
      }
      .label {
        font-size: 0.14rem;
        color: #666666;
      }
      .value {
        font-size: 0.14rem;
        color: #2d4ef5;
      }
      .id {
        font-size: 0.13rem;
        font-weight: 400;
        color: #999999;
      }
      .view {
        height: 0.3rem;
        line-height: 0.3rem;
        padding: 0 0.18rem;
        font-size: 0.16rem;
        color: #fff;
        background: #2d4ef5;
        border-radius: 0.15rem;
      }
    }
  }
}
</style>
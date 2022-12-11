<script>
import { Badge } from "vant";
import SearchTool from "@/components/SearchTool";
import StatusHandle from "@/components/StatusHandle";
import List from "@/components/List";
import Page from "@/components/Page";
import { get } from "@/api/http";
import { router, formatTime } from "@/utils";
import { OS } from "@/utils";

console.log(Badge, "Badge");
const API = {
  LIST(params) {
    return get("/Api/xcx/getDoctorUserList_api.php", params);
  },
};
const filter = [
  {
    label: "按加入时间",
    key: "RegDate",
  },
  {
    label: "咨询积分",
    key: "JF",
  },
  {
    label: "已咨询",
    key: "HaveJF",
    type: "radio",
  },
];
export default {
  name: "client",
  head() {
    return {
      title: "客户管理",
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
    refresh(v) {
      this.$refs.list && this.$refs.list.refresh();
    },
    request(params) {
      const { id } = this.$route.query;
      const { seachValue, sort } = this;
      const { selected: OrderType, value: AscType, ...other } = sort;
      const userInfo = this.$store.state.agentUserInfo.data || {};

      return API.LIST({
        ...params,
        ...other,
        OrderType,
        AscType,
        seachValue,
        uid: id || userInfo.uid,
      });
    },
    getAgentUserInfo() {
      return this.$store.dispatch("getAgentUserInfo");
    },
    renderItem(item) {
      const { id } = this.$route.query;
      const { UserPhoto, uid, NickName, RegDate, JF, isNoRead } = item;
      return (
        <div key={uid} class="item flex-row main-between center">
          <div class="flex-row center">
            <img src={UserPhoto} class="portrait"></img>
            <div class="flex-column">
              <p class="name">{NickName}</p>
              <p class="id">ID:{uid}</p>
              <p class="value">咨询积分:{JF}</p>
            </div>
          </div>
          <div class="right flex-column">
            <p class="time">{formatTime(RegDate * 1000, "YYYY/MM/DD")}</p>
            {+isNoRead === 1 ? (
              <van-badge dot>
                <button
                  onClick={() => {
                    router.push({ path: "/agent/chat", query: { id: uid } });
                  }}
                  class="btn"
                >
                  服务跟进
                </button>
              </van-badge>
            ) : (
              <button
                onClick={() => {
                  router.push({ path: "/agent/chat", query: { id: uid } });
                }}
                class="btn"
              >
                服务跟进
              </button>
            )}
          </div>
        </div>
      );
    },
  },
  render() {
    const { sort, seachValue } = this;
    return (
      <Page title="患者管理">
        <StatusHandle get={this.getAgentUserInfo}>
          <div class="patient page-full">
            <SearchTool
              search={seachValue}
              onInput={(v) => {
                this.seachValue = seachValue;
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
              request={this.request}
              renderItem={this.renderItem}
              class="list"
              ref="list"
            />
          </div>
        </StatusHandle>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.patient {
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
    height: 100%;
    /* padding: 0.12rem; */
    .item {
      margin-bottom: 0.1rem;
      padding: 0.16rem;
      /* box-shadow: 0px 4px 12px 0px rgba(76, 135, 249, 0.05); */
      /* border-radius: 0.08rem; */
      background: #fff;

      .portrait {
        margin-right: 0.1rem;
        width: 0.69rem;
        height: 0.69rem;
        border-radius: 50%;
      }

      .name {
        font-size: 0.16rem;
        font-weight: 500;
        color: #000000;
      }
      .id {
        margin-top: 0.06rem;
        margin-bottom: 0.04rem;
        font-size: 0.12rem;
        font-weight: 400;
        color: #666666;
      }
      .value {
        font-size: 0.12rem;
        color: #666666;
      }
      text {
        font-size: 0.16rem;
        color: $color2;
      }

      .time {
        margin-bottom: 0.16rem;
        text-align: right;
        font-size: 0.12rem;
        color: #999999;
      }

      .btn {
        height: 0.26rem;
        line-height: 0.26rem;
        padding: 0 0.12rem;
        font-size: 0.14rem;
        color: #fff;
        background: #1ebcc4;
        border-radius: 0.13rem;
      }
    }
  }
}
</style>
<script>
import WithdrawalMethod from "@/components/WithdrawalMethod";
import StatusHandle from "@/components/StatusHandle";
import NumberCard from "@/components/NumberCard";
import Group from "@/components/Group";

import Page from "@/components/Page";
import { Tip, router, LoadingControl } from "@/utils";
import { icons } from "@/assets";
import { get, post } from "@/api/http";

const API = {
  SUBMIT(params) {
    return post("/Api/xcx/saveExChangeInfo_api.php", params, { json: false });
  },
  GET_BANK_CARD_INFO(params) {
    return get("/Api/xcx/getUserBankInfo_api.php", params);
  },
};
export default {
  name: "integral-exchange",
  head() {
    return {
      title: "积分兑换",
    };
  },
  data() {
    return {
      loading: false,
      params: {
        exType: "bankcard",
        exAmt: "",
      },
      list: [
        {
          label: "开户人",
          placeholder: "请输入正确的姓名",
          key: "bankUser",
        },
        {
          label: "开户行",
          placeholder: "请输入正确的银行名称",
          key: "bankName",
        },
        {
          label: "账户",
          placeholder: "请输入正确的银行卡号",
          key: "bankCode",
        },
      ],
    };
  },
  methods: {
    handleChange(key, value) {
      const next = { ...this.params };
      next[key] = value;
      this.params = next;
    },
    getBankCardInfo() {
      return API.GET_BANK_CARD_INFO()
        .then((res) => {
          if (res) {
            this.params = {
              ...this.state.params,
              ...res,
            };
          }
          //   console.log(res, "res");
        })
        .catch((e) => {
          return true;
        });
    },
    submit() {
      const { exType, exAmt } = this.params;
      const agentUserInfo = this.$store.state.agentUserInfo.data || {};
      if (!+agentUserInfo.UserNum) {
        return Tip.error("当前账户没有积分可以提取");
      }
      if (!+exAmt) {
        return Tip.error("请填写需要提前的积分");
      }
      if (exAmt > agentUserInfo.UserNum) {
        return Tip.error(`最多可以提取${agentUserInfo.UserNum}`);
      }
      if (exType === "1") {
        let error = "";
        this.list.every(({ key, label }) => {
          if (!params[key]) {
            error = `请输入${label}`;
            return false;
          } else {
            return true;
          }
        });
        if (error) {
          return Tip.error(error);
        }
      }
      LoadingControl({
        call: API.SUBMIT,
        params,
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        this.$store.dispatch("getAgentUserInfo");
        Tip.success("兑换成功");
        setTimeout(router.back, 1000);
      });
    },
    getUserInfo() {
      return this.$store.dispatch("getAgentUserInfo");
    },
  },
  render() {
    const { loading, params } = this;
    const agentUserInfo = this.$store.state.agentUserInfo.data || {};
    return (
      <Page title="积分兑换">
        <StatusHandle get={this.getUserInfo}>
          <div class="integral-exchange page-full">
            <NumberCard value={agentUserInfo.UserNum || 0} />
            <Group border class="card card-top" title="兑换积分">
              <div class="money-box flex-row center">
                <img src={icons.money} class="money" />
                <Input
                  value={params.exAmt}
                  onInput={(e) => {
                    this.handleChange("exAmt", e.target.value);
                  }}
                  placeholder={`可兑换金额${agentUserInfo.UserNum || 0}`}
                  class="input"
                />
                <button
                  onClick={() => {
                    this.handleChange("exAmt", agentUserInfo.UserNum);
                  }}
                  class="all"
                >
                  全部
                </button>
              </div>
            </Group>
            <p class="hint">
              提现金额不能小于1000.00元
              每月申请1次提现需收取6%手续费，每月10号结算
            </p>
            <WithdrawalMethod
              value={params.exType}
              onChange={(value) => {
                this.handleChange("exType", value);
              }}
            />

            <StatusHandle get={this.getBankCardInfo}>
              {params.exType === "bankcard" ? (
                <div>
                  <Group border class="card card-bottom" title="填写信息">
                    <div class="list">
                      {this.list.map(({ label, placeholder, key }) => {
                        return (
                          <div key={key} class="item flex-row center">
                            <div class="left flex-row center">
                              <p class="required">*</p>
                              <p class="label">{label}</p>
                            </div>

                            <van-field
                              value={params[key]}
                              onInput={(value) => {
                                this.handleChange(key, value);
                              }}
                              placeholder={placeholder}
                              class="input"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Group>
                  <van-button
                    loading={loading}
                    onClick={this.submit}
                    class="confirm"
                  >
                    提交申请
                  </van-button>
                </div>
              ) : (
                <div class="bottom">
                  <van-button
                    loading={loading}
                    onClick={this.submit}
                    class="confirm"
                  >
                    提交申请
                  </van-button>
                </div>
              )}
            </StatusHandle>
          </div>
        </StatusHandle>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.integral-exchange {
  padding: 0.15rem 0.23rem;
  padding-bottom: 1rem;
  background: $bg;
  .card {
    padding: 0.15rem;
    padding-top: 0;
    background: #fff;
    border-radius: 0.05rem;
  }
  .card-top {
    margin-top: 0.21rem;
  }
  .money-box {
    padding-top: 0.2rem;
    padding-bottom: 0.1rem;
    .money {
      margin: 0 0.11rem;
      width: 0.18rem;
    }
    .input {
      flex: 1;
      font-size: 0.15rem;
      height: 100%;
      color: #cccccc;
    }
    .all {
      font-size: 0.15rem;
      color: #5b79ff;
    }
  }
  .hint {
    margin-top: 0.1rem;
    padding: 0.1rem 0.15rem;
    font-size: 0.11rme;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #666666;
    line-height: 0.2rem;
    background: #e9ecf1;
    border-radius: 0.05rem;
  }

  .list {
    .item {
      height: 0.54rem;
      font-size: 0.14rem;

      .left {
        width: 0.62rem;
      }

      .required {
        color: #ff4938;
      }

      .label {
        margin-left: 0;
        color: $color2;
      }

      .input {
        color: $color5;
      }
    }
  }

  .confirm {
    display: block;
    width: 100%;
    margin-top: 0.2rem;
    height: 0.42rem;
    line-height: 0.42rem;
    font-size: 0.16rem;
    color: #fff;
    background: $color4;
    border-radius: 0.21rem;
  }
}
</style>
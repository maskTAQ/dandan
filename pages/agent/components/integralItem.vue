<script>
import { agentIcons } from "@/assets";

const STATUS = {
  1: "待处理",
  2: "待付款",
  3: "进行中",
  4: "退款",
  5: "已失效",
  6: "已完成",
};
const CHILD_ORDER_STATUS = {
  1: "待付款",
  2: "已付款待确认",
  //   3: "待服务",
  4: "服务中",
  5: "退款申请中",
  6: "退款中",
  7: "已退款",
  9: "完成",
  WAIT_PAY: "1",
  PAID_WAIT_CONFIRM: "2",
  WAIT_SERVICE: "3",
  SERVING: "4",
  APPLY_REFOUND: "5",
  REFOUNDING: "6",
  REFOUNDED: "7",
  COMPLETE: "9",
};
export default {
  name: "integralItem",
  props: ["data"],
  data() {
    return {
      showDetail: false,
      list: [
        {
          label: "促排阶段",
          process: "已完成",
          value: "+120",
          labelColor: "red",
          valueColor: "red",
        },
        {
          label: "移植阶段",
          process: "进行中",
          value: "",
          labelColor: "red",
          valueColor: "red",
        },
        {
          label: "尾款",
          process: "未进行",
          value: "",
          labelColor: "red",
          valueColor: "red",
        },
      ],
    };
  },
  methods: {
    toggle() {
      this.showDetail = !this.showDetail;
    },
  },
  render() {
    const { showDetail, data } = this;
    const {
      buyName,
      orderFlag,
      UserPhoto,
      oid,
      orderNo,
      Amt,
      itemData,
      gImg,
      goodsName,
      bName,
      ThePrice,
    } = this.data;
    return (
      <div class={["integral-item", { open: showDetail }]}>
        <div class={["header flex-row main-between center", `_${orderFlag}`]}>
          <p class="id">订单号:{orderNo}</p>
          <p class={["status align", `_${orderFlag}`]}>{STATUS[orderFlag]}</p>
        </div>
        <div class="info flex-row main-between center">
          <div class="flex-row center">
            <img src={UserPhoto} class="portrait"></img>
            <div class="flex-column">
              <p class="name">{buyName}</p>
              <p class="text">ID:{oid}</p>
            </div>
          </div>
          <div onClick={this.toggle} class="flex-row center">
            <p class="num flex-row center">
              <span class="label">已结算：</span>
              <span class="value">{Amt}</span>
            </p>
            <img mode="widthFix" src={agentIcons.right} class="icon"></img>
          </div>
        </div>
        {showDetail && (
          <div class="step-list-box">
            <div class="step-list">
              {/*
                <div class="goods-info flex-row center">
                <img src={gImg} class="cover"></img>
                <div class="flex-column">
                  <p class="goods-name">{goodsName}</p>
                  <p class="goods-desc">
                    {bName} {ThePrice}
                  </p>
                </div>
              </div>
                */}
              {itemData.map(({ bonusName, bonusFlag, realAmt = "-" }) => {
                return (
                  <div class="step-list-item flex-row main-between center">
                    <div class="flex-row center">
                      <p class="label">{bonusName} </p>
                      <p class={["process", `_${bonusFlag}`]}>
                        {CHILD_ORDER_STATUS[bonusFlag]}
                      </p>
                    </div>
                    <p
                      class={[
                        "value",
                        {
                          plus: realAmt && realAmt > 0,
                          minus: realAmt && realAmt < 0,
                        },
                      ]}
                    >
                      {realAmt || "-"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";
.integral-item {
  margin-bottom: 0.1rem;
  /* padding: 0 0.16rem; */
  /* box-shadow: 0px 4px 12px 0px rgba(76, 135, 249, 0.05);
  border-radius: 0.08rem; */
  background: #f5f6fa url("../imgs/card.png") no-repeat center top / 100% auto;
  border-radius: 0.11rem;
  overflow: hidden;

  .header {
    height: 0.41rem;
    padding-left: 0.15rem;
    border-radius: 0.11rem;
    font-size: 0.14rem;
    font-weight: 400;
    /* border-bottom: 1px solid $border; */
    &._6 {
      background: linear-gradient(136deg, #ffffff 66%, #f3f7eb 100%);
      color: #8bbf54;
    }
    &._1 {
      background: linear-gradient(136deg, #ffffff 66%, #ffe6e3 100%);
      color: #f91e00;
    }
    &._4 {
      background: linear-gradient(136deg, #ffffff 66%, #fef0e5 100%);
      color: #ef7f15;
    }
  }

  .id {
    font-size: 0.14rem;
    color: #a3a3a3;
  }

  .status {
    width: 0.88rem;
    height: 100%;
  }

  .info {
    padding: 0.15rem;

    .portrait {
      margin-right: 0.1rem;
      width: 0.56rem;
      height: 0.56rem;
      border-radius: 50%;
    }
    .name {
      font-size: 0.16rem;
      font-weight: bold;
      color: #040a2d;
    }

    .text {
      font-size: 0.14rem;
      color: #b1b4b9;
    }

    .num {
      font-size: 0.13rem;
      color: #909399;
      .value {
        color: #ff5601;
      }
    }

    .icon {
      margin-left: 0.09rem;
      width: 0.12rem;
    }
  }
  .step-list-box {
    padding: 0 0.15rem;
    background: #fff;
  }
  .step-list {
    padding: 0.15rem 0;
    font-size: 0.14rem;
    border-top: 1px solid #eeeeee;

    .step-list-item {
      height: 0.25rem;

      text {
        margin: 0;
      }
    }

    .label {
      padding-right: 0.11rem;
      // width: 0.56rem;
      color: #666666;
    }

    .process {
      color: #040a2d;
      &._4 {
        color: #ef7f15;
      }
      &._2 {
        color: #f91e00;
      }
    }

    .value {
      color: #040a2d;
      &.plus {
        color: #f91e00;
      }
    }
  }

  .goods-info {
    margin-bottom: 0.1rem;

    .cover {
      margin-right: 0.1rem;
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
    }

    .goods-name {
      font-size: 0.14rem;
      color: #343434;
    }

    .goods-desc {
      margin-top: 0.04rem;
      font-size: 0.12rem;
      color: #949494;
    }
  }
}
</style>
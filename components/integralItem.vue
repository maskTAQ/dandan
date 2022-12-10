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
      <div class="integral-item">
        <div class="header flex-row main-between center">
          <p class="id">订单号:{orderNo}</p>
          <p class="status">{STATUS[orderFlag]}</p>
        </div>
        <div class="info flex-row main-between center">
          <div class="flex-row center">
            <img src={UserPhoto} class="portrait"></img>
            <div class="flex-column">
              <p class="text">{buyName}</p>
              <p class="text">ID:{oid}</p>
            </div>
          </div>
          <div onClick={this.toggle} class="flex-row center">
            <p class="num">已结算：{Amt}</p>
            <img mode="widthFix" src={agentIcons.right} class="icon"></img>
          </div>
        </div>
        {showDetail && (
          <div class="list">
            <div class="goods-info flex-row center">
              <img src={gImg} class="cover"></img>
              <div class="flex-column">
                <p class="goods-name">{goodsName}</p>
                <p class="goods-desc">
                  {bName} {ThePrice}
                </p>
              </div>
            </div>
            {itemData.map(({ bonusName, bonusFlag, realAmt = "-" }) => {
              return (
                <div class="list-item flex-row main-between center">
                  <div class="flex-row center">
                    <p class="label">{bonusName} </p>
                    <p class="process">{CHILD_ORDER_STATUS[bonusFlag]}</p>
                  </div>
                  <p class="value">{realAmt || "-"}</p>
                </div>
              );
            })}
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
  padding: 0 0.16rem;
  box-shadow: 0px 4px 12px 0px rgba(76, 135, 249, 0.05);
  border-radius: 0.08rem;
  background: #fff;

  .header {
    height: 0.5rem;
    border-bottom: 1px solid $border;
  }

  .id {
    font-size: 0.14rem;
    color: $color2;
  }

  .status {
    font-size: 0.14rem;
  }

  .info {
    padding: 0.16rem 0;

    .portrait {
      margin-right: 0.1rem;
      width: 0.56rem;
      height: 0.56rem;
    }

    .text {
      font-size: 0.16rem;
      color: $color2;
    }

    .num {
      font-size: 0.16rem;
      color: $color7;
    }

    .icon {
      margin-left: 0.09rem;
      width: 0.12rem;
    }
  }

  .list {
    padding: 0.15rem 0;
    font-size: 0.12rem;
    border-top: 1px solid $border;

    .list-item {
      height: 0.25rem;

      text {
        margin: 0;
      }
    }

    .label {
      padding-right: 0.05rem;
      // width: 0.56rem;
      font-size: 0.12rem;
      color: #333;
    }

    .process {
      color: $color7;
    }

    .value {
      color: $color5;
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
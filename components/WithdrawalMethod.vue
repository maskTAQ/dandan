<script>
import Group from "@/components/Group";
import { agentIcons } from "@/assets";
export default {
  name: "WithdrawalMethod",
  props: ["value"],
  data() {
    return {
      list: [
        {
          label: "银行卡",
          icon: agentIcons.bankcard,
          value: "bankcard",
        },
        {
          label: "其他",
          icon: agentIcons.others,
          value: "others",
        },
      ],
    };
  },
  render() {
    const { value } = this;
    return (
      <Group class="withdrawal-method" title="提现方式" border>
        <div class="methods-list flex-row center">
          {this.list.map(({ label, icon, value: v }) => {
            console.log({ v, value });
            return (
              <div
                onClick={() => {
                  this.$emit("change", v);
                }}
                class={"item flex-row align" + (v === value ? " selected" : "")}
              >
                <img mode="widthFix" src={icon} class="icon" />
                <p class="label">{label}</p>
              </div>
            );
          })}
        </div>
      </Group>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.withdrawal-method {
  margin: 0.15rem 0;
  padding: 0.15rem;
  padding-top: 0;
  background: #fff;
  border-radius: 0.05rem;

  .title {
    font-size: 0.16rem;
    color: $color2;
  }

  .methods-list {
    margin-top: 0.14rem;

    .item {
      flex: 1;
      height: 0.49rem;
      border: 2px solid #cfcfcf;
      border-radius: 0.04rem;

      &:first-child {
        margin-right: 0.09rem;
      }

      .icon {
        margin-right: 0.06rem;
        width: 0.36rem;
      }

      .label {
        font-size: 0.14rem;
        color: #999;
      }

      &.selected {
        /* border-color: $color4; */
        border: none;
        border-radius: 0;
        background: url('../assets/img/selected-border.png') no-repeat center center / 100% 100%;
        color: #2D4EF5;
      }
    }
  }
}
</style>
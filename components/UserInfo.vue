<script>
import { user, icons } from "@/assets";
export default {
  name: "UserInfo",
  created() {
    this.$store.dispatch("getUserInfo");
  },
  render() {
    const data = this.$store.state.userInfo.data || {};
    return (
      <div class="user-info flex-row center">
        <img src={data.UserPhoto} class="portrait"></img>
        <div class="right">
         
          <img
            class="vip"
            src={icons["vip" + data.UserLevel]}
            alt=""
            srcset=""
          />
           <p class="name">{data.NickName}</p>
        </div>
      </div>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.user-info {
  .portrait {
    margin-right: 0.1rem;
    width: 0.56rem;
    height: 0.56rem;
    border-radius: 100%;
  }

  .name {
    font-size: 0.18rem;
    color: #fff;
  }
  .vip {
    /* margin-bottom: 0.1rem; */
    width: 0.9rem;
  }
  .tag-group {
    margin-top: 0.04rem;

    .tag {
      width: 0.38rem * 2;
      height: 0.2rem;
      background: url("../assets/img/tag.png") no-repeat;
      background-size: 100% 100%;

      // &.tag-y {
      //     margin-right: 0.13rem;
      //     background: url('../../assets/img/tag-y.png') no-repeat;
      //     background-size: cover;
      // }

      // &.tag-g {
      //     background: url('../../assets/img/tag-g.png') no-repeat;
      //     background-size: cover;
      // }

      .label {
        margin-left: 0.2rem;
        font-size: 0.11rem;
        line-height: 0.2rem;
        color: #fff;
      }
    }
  }
}
</style>
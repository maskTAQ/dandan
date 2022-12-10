<script>
import { copy, call } from "@/utils";
import { agentIcons } from "@/assets";
import Page from "@/components/Page";

export default {
  name: "contact-agent",
  head() {
    return {
      title: "联系我们",
    };
  },
  render() {
    const wechat = "DeepIVFcenter";
    return (
      <Page title="联系我们">
        <div class="contact flex-column main-between page-full">
          <div class="top flex-column center">
            <img src={agentIcons.logoText} class="logo-text" />
            <div class="fields">
              <div
                onClick={() => copy(wechat)}
                class="field flex-row main-between center"
              >
                <p class="label">官方微信</p>
                <p class="value">{wechat}</p>
              </div>
              <div
                onClick={() => call("4000913522")}
                class="field flex-row main-between center"
              >
                <p class="label">客服电话</p>
                <p class="value">4000913522</p>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.contact {
  height: 100%;
  padding: 0.11rem 0;
  justify-content: space-between;
  align-items: center;
  background: #f5f6fb;

  .top {
    width: 100%;

    .logo-text {
      margin: 0.28rem 0;
      width: 2.03rem;
      /* height: 0.6rem; */
    }

    .fields {
      width: 100%;
      padding: 0 0.11rem;
      background: #fff;

      .field {
        height: 0.51rem;

        &:first-child {
          border-bottom: 1px solid #e7e7e7;
        }

        .label {
          font-size: 0.14rem;
          color: #595959;
        }

        .value {
          font-size: 0.14rem;
          color: #30b9ff;
        }
      }
    }
  }

  .logo {
    width: 0.77rem;
    height: 0.23rem;
  }
}
</style>
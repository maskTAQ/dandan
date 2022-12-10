<script>
import Page from "@/components/Page";

const bg = require("@/assets/img/vip2.png");
export default {
  name: "vip",
  head() {
    return {
      title: "助孕大使权益",
    };
  },
  render() {
    return (
      <Page title="助孕大使权益" fixed>
        <div class="vip">
          <img src={bg} class="bg" mode="widthFix" />
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
.vip .bg {
  display: block;
  width: 100%;
}
</style>
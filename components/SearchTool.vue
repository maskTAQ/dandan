<script>
import { icons } from "@/assets";
import SortFilter from "@/components/SortFilter";
import CoverImage from "@/components/CoverImage";

export default {
  name: "search-tool",
  props: {
    data: Array,
    params: Object,
    search: String,
  },
  render() {
    const { data, params, search } = this;
    return (
      <div class="search-tool">
        <div class="search flex-row center">
          <div class="input-box flex-row center">
            <img
              onClick={() => {
                this.$emit("search");
              }}
              src={icons.searchActive}
              class="icon"
            />
            <input
              value={search}
              onInput={(e) => {
                this.$emit("input", e.target.value);
              }}
              class="input"
              placeholder="请输入名称/ID"
            />
          </div>
        </div>
        <SortFilter
          params={params}
          onChange={(v) => {
            this.$emit("change", v);
          }}
          data={data}
        />
      </div>
    );
  },
};
</script>
<style lang="scss">
@import "@/assets/themes.scss";

.search-tool {
  height: 0.84rem;
  background: #fff;

  .search {
    padding: 0.06rem 0.12rem;
    margin-bottom: 0.04rem;

    .input-box {
      margin-right: 0.1rem;
      width: 0;
      flex: 1;
      height: 0.34rem;
      padding: 0 0.21rem;
      background: $color6;
      border-radius: 0.18rem;
    }

    .input {
      width: 100%;
      height: 100%;
      padding-left: 0.09rem;
      font-size: 0.14rem;
      color: #b6b6b6;

      &::placeholder {
        font-size: 0.14rem;
        color: $color5;
      }
    }

    .icon {
      width: 0.18rem;
    }
  }
}
</style>
<template>
  <div class="hospital-list page-tab">
    <div class="header">
      <ToolBar placeholder="请输入搜索内容" theme="dark" kf-type="hospital"/>
      <StatusHandle :status="hospitalClassify.status" @retry="getHospitalClassify">
        <div class="tab-list flex-row center">
          <div
            key="all"
            :class="['item align', { selected: !selectedTab }]"
            @click="selectedTab = ''"
          >
            全部
          </div>
          <div
            v-for="item in hospitalClassify.data || []"
            :key="item.label"
            :class="['item align', { selected: item.value === selectedTab }]"
            @click="selectedTab = item.value"
          >
            {{ item.label }}
          </div>
        </div>
      </StatusHandle>
    </div>
    <List
      v-if="hospitalClassify.success"
      :request="request"
      :renderItem="renderItem"
      class="list"
      ref="list"
    />
    <TabBar />
  </div>
</template>
<script>
import { mapState } from "vuex";

import { get, mock } from "@/api/http";
import { icons } from "@/assets";
import { router } from "@/utils";
import CoverImage from "@/components/CoverImage";

const API = {
  LIST(params) {
    return get("/Api/getGoodsList_api.php", params);
  },
};
export default {
  name: "hospital-list",
  head() {
    return {
      title: "泰国DHC生殖医院代表处",
      meta: [
        {
          name: "keywords",
          content:
            "深圳泰国DHC诊所,广州好运医院,郑州长江中医院,基因检测中心",
        },
        {
          name: "description",
          content:
            "为了更好的不断增长的中国客户提供一站式闭环医疗服务，我们在深圳设立首家直属备孕门诊，并逐步在中国境内多个省市陆续建立多家直属备孕门诊，以中国多家知名三甲医院权威专家团队为医疗支持，与泰国DHC生殖医院无缝隙链接，提供试管前的检查，评估，移植前宫腔准备，移植后保胎等诊疗项目，通过IVF前中后期的医疗介入，最大程度的提高试管成功率及活产率",
        },
      ],
    };
  },
  data() {
    return {
      icons,
      selectedTab: "",
    };
  },
  watch: {
    selectedTab() {
      this.refresh();
    },
  },
  computed: mapState(["hospitalClassify"]),
  created() {
    this.getHospitalClassify();
  },
  methods: {
    getTag(tid) {
      const data = this.hospitalClassify.data || [];
      const match = data.find((item) => item.tid === tid);
      console.log({ data, tid });
      return match ? match.label : "";
    },
    getHospitalClassify() {
      this.$store.dispatch("getHospitalClassify");
    },
    request(params) {
      return API.LIST({
        ...params,
        root: "门诊/医院",
        tid: this.selectedTab,
      });
    },
    renderItem(item, i, instance) {
      const {
        gid,
        PageImg,
        SalesNum,
        gName,
        gTital,
        Tag = "",
        ThePrice,
        tid,
        gImg,
        TypeName = "",
      } = item;
      // const tag = this.getTag(tid);
      const imgList = Array.isArray(gImg) ? gImg : [];
      return (
        <div
          key={gid}
          class="item"
          onClick={() => {
            router.push({
              path: "/hospital-detail",
              query: {
                id: gid,
              },
            });
          }}
        >
          <div class="content">
            <div class="img-list flex-row">
              <div class="a">
                <CoverImage url={imgList[0]} class="cover-image" />
                <div class="num">就诊人数：{SalesNum}</div>
              </div>
              <div class="flex-column">
                <CoverImage class="b" url={imgList[1]} />
                <CoverImage class="b" url={imgList[2]} />
              </div>
            </div>
            <p class="title">{gName}</p>
            <div class="item-footer flex-row main-between center">
              <div class="tag-list flex-row center">
                {(Tag || "").split(";").map((tag) => {
                  return (
                    <div class="tag" key={tag}>
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div class="price flex-row center">
                <i class="unit"></i>
                <i class="value">{ThePrice}</i>
                <i class="label"></i>
              </div>
            </div>
          </div>
          {!!TypeName && <div class="fixed-tag">{TypeName}</div>}
        </div>
      );
    },
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/theme.scss";
.hospital-list {
  background: #fff;
  .header {
    height: 1rem;
    padding: 0.12rem;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    .tab-list {
      margin-top: 0.18rem;
      .item {
        margin-right: 0.1rem;
        flex: 1;
        height: 0.27rem;
        font-size: 0.12rem;
        background: $color18;
        color: $color4;
        border-radius: 0.14rem;
        &:last-child {
          margin-right: 0;
        }
        &.selected {
          background: $color14;
          color: #fff;
        }
      }
    }
  }
  .list {
    height: calc(100% - 1rem);
    .item {
      position: relative;
      padding: 0.18rem 0.12rem;
      border-bottom: 6px solid $color8;

      .fixed-tag {
        position: absolute;
        top: 0.12rem;
        left: 0.12rem;
        width: 0.52rem;
        height: 0.2rem;
        font-size: 0.1rem;
        color: #fff;
        line-height: 0.2rem;
        text-align: center;
        /* background: url("../assets/img/tag.png") no-repeat center center / cover; */
      }
    }
    .content {
      .a,
      .b {
        border-radius: 0.08rem;
        overflow: hidden;
      }
      .a {
        position: relative;
        margin-right: 0.08rem;
        flex: 1;
        height: 1.4rem;
        .cover-image {
          width: 100%;
          height: 100%;
        }
        .num {
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 0.08rem;
          height: 0.2rem;
          line-height: 0.2rem;
          font-size: 0.1rem;
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 0px 4px 0px 0px;
        }
      }
      .b {
        width: 0.86rem;
        height: 0.66rem;
        &:first-child {
          margin-bottom: 0.08rem;
        }
      }
      .title {
        padding: 0.12rem 0;
        font-size: 0.14rem;
        color: $color4;
        font-weight: bold;
      }
      .tag-list {
        width: 0;
        flex: 1;
        flex-wrap: wrap;
        .tag {
          margin-right: 0.08rem;
          margin-bottom: 4px;
          height: 0.18rem;
          padding: 0 0.04rem;
          line-height: 0.18rem;
          font-size: 0.1rem;
          color: $color14;
          background: rgba($color: $color14, $alpha: 0.08);
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .price {
        color: $color3;
        .unit {
          font-size: 0.12rem;
        }
        .value {
          font-size: 0.16rem;
        }
        .label {
          font-size: 0.1rem;
        }
      }
    }
  }
}
</style>
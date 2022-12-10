<template>
  <Page title="医生详情">
    <StatusHandle :get="getDetail">
      <div class="doctor-detail page-full">
        <div class="bg"></div>
        <div class="content flex-column">
          <DoctorCard :data="data" class="doctor-card">
            <div slot="intro" class="intro">
              <p v-if="data.exCan">【擅长】：{{ data.exCan }}</p>
              <p v-if="data.Resume">【履历】：{{ data.Resume }}</p>
            </div>
          </DoctorCard>

          <div class="evaluation-list">
            <div class="header flex-row center">
              <span class="border"></span>
              <i class="title">患者评价</i>
              <i v-if="count" class="num">({{count}})</i>
            </div>
            <List
              :request="request"
              :renderItem="renderItem"
              class="list"
              ref="list"
            />
          </div>
        </div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { mapState } from "vuex";

import { mock, get } from "@/api/http";
import EvaluateInfo from "@/components/EvaluateInfo";

const API = {
  LIST(params, config) {
    return get("/Api/getPJList_api.php", params, config);
  },
  DETAIL(exid) {
    return get("/Api/getDoctorInfo_api.php", { exid });
  },
};
export default {
  name: "doctor-detail",
  head() {
    return {
      title: "医生详情",
    };
  },
  data() {
    return {
      data: {},
      count:''
    };
  },
  methods: {
    getDetail() {
      return API.DETAIL(this.$route.query.id).then((res) => {
        this.data = res;
      });
    },
    request(params) {
      return API.LIST(
        { ...params, eid: this.$route.query.id },
        { full: true }
      ).then(({count,data}) => {
        this.count = count
        return data;
      });
    },
    renderItem(item, i, instance) {
      // return (
      //   <div class="item">
      //     <div class="top flex-row main-between center">
      //       <div class="flex-row center">
      //         <div class="portrait"></div>
      //         <i class="name">匿名用户</i>
      //       </div>
      //       <i class="time">8月8日 12:12</i>
      //     </div>
      //     <p class="value">
      //       周医生技术很好，人品也很好，没有让我多用药！妙
      //       手仁心，中国好医生！！
      //     </p>
      //   </div>
      // );
      return <EvaluateInfo data={item} project={false} />;
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.doctor-detail {
  position: relative;
  background: $color8;
  .bg {
    height: 1.5rem;
    background: $color1;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 0.12rem;
    padding-top: 0.52rem;
    .intro {
      /* margin-top: 0.12rem; */
      font-size: 0.11rem;
      color: $color5;
    }
  }
  .evaluation-list {
    height: calc(100vh - 0.6rem);
    /* min-height: 300px; */
    flex: 1;
    margin-top: 0.1rem;
    padding: 0 0.14rem;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(76, 135, 249, 0.05);
    border-radius: 0.08rem;
    .header {
      height: 0.53rem;
      .border {
        width: 3px;
        height: 0.16rem;
        background: $color1;
      }
      .title {
        margin: 0 0.06rem;
        font-size: 0.18rem;
        color: $color4;
      }
      .num {
        font-size: 0.14rem;
        color: $color6;
      }
    }
    .list {
      height: calc(100% - 0.53rem);
      padding: 0 0.14rem;
    }
    .item {
      padding: 0.14rem 0;
      border-bottom: 1px solid $border;
      .portrait {
        margin-right: 0.05rem;
        width: 0.28rem;
        height: 0.28rem;
        border-radius: 50%;
        /* border: 1px solid red; */
      }
      .name {
        font-size: 0.14rem;
        color: $color4;
      }
      .time {
        font-size: 0.11rem;
        color: $color6;
      }
      .value {
        margin-top: 0.1rem;
        font-size: 0.14rem;
        color: $color4;
      }
    }
  }
}
</style>
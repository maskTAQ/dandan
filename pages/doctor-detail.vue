<template>
  <Page title="医生详情" fixed>
    <StatusHandle :get="getDetail">
      <div class="doctor-detail page-full">
        <StatusHandle :get="getDoctorLiveList">
          <div class="group doctor-live-list-card">
            <p class="title">名医直播</p>
            <ScrollView>
              <div class="doctor-live-list flex-row">
                <DoctorLiveCard
                  class="card"
                  :data="item"
                  v-for="item in doctorLiveList"
                  :key="item.gid"
                />
              </div>
            </ScrollView>
          </div>
        </StatusHandle>
        <p v-if="data.exCan">【擅长】：{{ data.exCan }}</p>
        <p v-if="data.Resume">【履历】：{{ data.Resume }}</p>
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
  DOCTOR_LIVE_LIST(params) {
    return Promise.resolve([{},{},{},{}]);
    // return get("/Api/getGoodsList_api.php", params);
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
      count: "",
      doctorLiveList: [],
    };
  },
  methods: {
    getDoctorLiveList() {
      return API.DOCTOR_LIVE_LIST().then((res) => {
        this.doctorLiveList = res;
      });
    },
    getDetail() {
      return API.DETAIL(this.$route.query.id).then((res) => {
        this.data = res;
      });
    },
    request(params) {
      return API.LIST(
        { ...params, eid: this.$route.query.id },
        { full: true }
      ).then(({ count, data }) => {
        this.count = count;
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
@import "@/assets/theme.scss";
.doctor-detail {
  .doctor-live-list-card {
    .content {
      margin: 0 -0.15rem;
    }
    .doctor-live-list {
      padding: 0.15rem;
    }
    .card {
      margin-right: 0.15rem;
    }
  }
}
</style>
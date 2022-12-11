<template>
  <Page title="医生详情" fixed>
    <StatusHandle :get="getDetail">

      <div class="doctor-detail page-full">
        <div class="ys-photo">
          <CoverImage :url="img.jb" class="ys-jb" />
          <p class="name">{{ data.exName }}</p>
          <CoverImage :url="data.exPhoto" class="ys-photo-img" />
        </div>
        <div class="doc-bj">
          <div class="doctor-content">
            <p class="name">{{ data.exName }}</p>
            <p class="introduce">{{ data.HsName }}</p>
            <div class="flex-row center">
              <span class="tag" v-if="tag">{{ data.tag }}</span>
              <span class="exLevel">
                <span class="circular"></span>
                {{ data.exLevel }}</span>
            </div>
            <StatusHandle :get="getDoctorLiveList">
              <SimpleGroup title="名医直播" more class="doctor-live-list-card line">
                <ScrollView>
                  <div class="doctor-live-list flex-row">
                    <DoctorLiveCard class="card" :data="item" v-for="item in doctorLiveList" :key="item.gid" />
                  </div>
                </ScrollView>
              </SimpleGroup>
            </StatusHandle>
            <SimpleGroup title="所在医院" more moreText="进入" class="line">
              <div class="flex-row center">
                <CoverImage url="" class="ys-tx" />
                <div class="ys-info">
                  <p class="ys-title ellipsis">标题</p>
                  <p class="content">{{ data.Resume }}</p>
                </div>
              </div>
            </SimpleGroup>
            <SimpleGroup title="擅长领域" class="line">
              {{ data.exCan }}
            </SimpleGroup>
            <SimpleGroup title="专业履历" class="line">
              {{ data.Resume }}
            </SimpleGroup>
            <div class="sx-btn">
              私信医生
            </div>
            <!-- <p v-if="data.exCan">【擅长】：{{ data.exCan }}</p>
        <p v-if="data.Resume">【履历】：{{ data.Resume }}</p> -->
          </div>
        </div>

      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { mapState } from "vuex";
import CoverImage from "@/components/CoverImage.vue"
import { icons, img } from "@/assets";

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
    return Promise.resolve([{}, {}, {}, {}]);
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
      icons,
      img,
      data: {},
      count: "",
      doctorLiveList: [],
    };
  },
  components: {
    CoverImage
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
  .ys-photo {
    height: 6.07rem;
    background: #80c5c6;
    position: relative;

    .name {
      font-size: 0.32rem;
      color: #fff;
      padding-top: 0.70rem;
      padding-left: 0.34rem;
    }

    .ys-photo-img {
      height: 4.58rem;
      margin: 0px 0.34rem;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      // border: 1px solid red;
    }

    .ys-jb {
      height: 8.07rem;
      width: 100%;
      position: absolute;
      top: -119px;
      left: 0px;
    }
  }

  .doc-bj {
    background: #6dc7c6;
  }

  .doctor-content {
    .line {
      border-bottom: 1px solid rgb(232, 243, 241);
      padding-top: 0.1rem;
    }

    background: #fff;
    padding: 0.23rem;
    border-radius: 30px 30px 0px 0px;
    // margin-top: -0.3rem;
    width: 100%;

    // height: ;
    .name {
      font-size: 0.22rem;
      font-weight: 600;
    }

    .introduce {
      font-size: 0.12rem;
      color: #989898;
      padding: 0.1rem 0px;
    }

    .tag {
      background: #eaf3f1;
      color: #48988e;
      border-radius: 0.05rem;
      padding: 0.05rem;
      font-weight: 600;
      font-size: 0.12rem;
      margin-right: 0.1rem;
    }

    .circular {
      background: #48988e;
      display: inline-block;
      height: 0.08rem;
      width: 0.08rem;
      border-radius: 0.3rem;
    }

    .exLevel {
      font-size: 0.12rem;
    }

    // height: 100px;
    .ys-tx {
      border: 1px solid red;
      height: 70px;
      width: 70px;
      margin-right: 18px;
      border-radius: 50px;
      overflow: hidden;
      background: red;
    }

    .ys-info {
      flex: 1;
      width: 0;

      .ys-title {
        font-size: 0.16rem;
        font-weight: 500;
      }

      .content {
        font-size: 0.12rem;
        color: rgb(102, 102, 102);
      }
    }

    .sx-btn {
      width: 3.05rem;
      height: 0.46rem;
      color: #fff;
      font-size: 0.14rem;
      background: rgb(0, 188, 197);
      border-radius: 8px;
      text-align: center;
      line-height: 0.46rem;
      margin-top: 0.17rem;
    }
  }

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
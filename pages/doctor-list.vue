<template>
  <Page title="医生列表">
    <div class="doctor-list page-full">
      <NewTabs class="tabs" :value="selected" @change="select" :data="tabs" />
      <List
        :request="request"
        :extra="extra"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
    </div>
  </Page>
</template>
<script>
import { mapState } from "vuex";

import { mock } from "@/api";
import { get } from "@/api/http";
import { icons } from "@/assets";
import ArticleCard from "@/components/ArticleCard.vue";
import DoctorCard from "@/components/DoctorCard.vue";

const API = {
  LIST(params) {
    return get("/Api/getDoctorList_api.php", params);
  },
};
export default {
  name: "doctor-list",
  head() {
    return {
      title: "医生列表",
    };
  },
  data() {
    return {
      tabs: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "国内",
          value: "1",
        },
        {
          label: "国外",
          value: "2",
        },
      ],
    };
  },
  computed: {
    selected() {
      return this.$route.query.status || "";
    },
    ...mapState(["departmentList", "areaList", "myDoctor"]),
    filter() {
      const { departmentList, areaList } = this;
      return [
        {
          type: "switch",
          key: "zh",
          label: "综合排序",
        },
        // {
        //   type: "radio",
        //   key: "exRoom",
        //   label: "科室",
        //   options: (departmentList.data || []).map(({ rName, rOrderNo }) => {
        //     return {
        //       label: rName,
        //       value: rOrderNo,
        //     };
        //   }),
        //   loading: departmentList.loading,
        // },
        {
          type: "radio",
          key: "HSCity",
          label: "地区",
          options: (areaList.data || []).map(({ HsCity }) => {
            return {
              label: HsCity,
              value: HsCity,
            };
          }),
          loading: areaList.loading,
        },
      ];
    },
    extra() {
      const { data } = this.myDoctor;
      if (data) {
        return [
          {
            ...data,
            isParent: true,
          },
        ];
      } else {
        [];
      }
    },
  },
  created() {
    if (process.browser) {
      this.$store.dispatch("getMyDoctor");
      this.$store.dispatch("getDepartmentList");
      this.$store.dispatch("getAreaList");
    }
  },
  watch: {
    selected() {
      this.refresh();
    },
  },
  methods: {
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    select(tab) {
      router.replace({
        query: {
          status: tab,
        },
      });
    },
    request(params) {
      return API.LIST({
        ...params,
        InChina: this.selected,
      });
    },
    renderItem(item, i, instance) {
      return (
        <DoctorCard
          isParent={true}
          intro={"简介:" + item.exCan}
          data={item}
          class="item"
        />
      );
    },
    handleParamsChange(next) {
      if (!this.params.zh && next.zh) {
        next.exRoom = "";
        next.HSCity = "";
        this.params = next;
        return;
      }
      const { exRoom, HSCity } = next;
      this.params = {
        exRoom,
        HSCity,
        zh: !exRoom && !HSCity,
      };
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.doctor-list {
  background: #fff;
  padding: 0rem 0.16rem;
  .tabs {
    padding: 0.15rem 0;
  }
  .list {
    height: calc(100% - 0.6rem);
    // padding: 20px;
    padding-bottom: 0.15rem;
    .item {
      margin-bottom: 0.2rem;
    }
  }
}
</style>
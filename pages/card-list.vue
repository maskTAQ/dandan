<template>
  <Page title="我的孕程">
    <div class="dialogue-info-list page-full">
      <div class="tabs flex-row center">
        <div
          :class="['tab align', { selected: tab.value === selectedTab }]"
          v-for="tab in tabs"
          :key="tab.value"
          @click="select(tab)"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="content">
        <List
          :request="request"
          :renderItem="renderItem"
          class="list"
          ref="list"
        />
        <MessageModal
          :visible="modal.visible"
          :data="modal.data"
          @confirm="publish"
          @cancel="hide"
        />
      </div>
    </div>
  </Page>
</template>
<script>
import day from "dayjs";
import { ImagePreview } from "vant";

import { get, post } from "@/api/http";
import { Tip, router } from "@/utils";
import MessageCard from "@/components/MessageCard";
import MessageModal from "@/components/MessageModal";
const API = {
  LIST(params) {
    return get("/Api/xcx/getDocBonList_api.php", params);
  },
  SEND(params) {
    return post("/Api/xcx/sendReply_api.php", params, { json: false });
  },
};
export default {
  name: "card-list",
  head() {
    return {
      title: "我的孕程",
    };
  },
  data() {
    return {
      list: [],
      modal: {
        visible: false,
        data: null,
        type: "",
      },
      selectedTab: "",
      tabs: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "检查报告",
          value: "检查报告",
        },
        {
          label: "卵泡监测",
          value: "卵泡监测",
        },
        {
          label: "试管档案",
          value: "试管档案",
        },
        {
          label: "阶段小结",
          value: "阶段小结",
        },
        {
          label: "其他",
          value: "其他",
        },
      ],
    };
  },
  methods: {
    select(tab) {
      const next = tab.value;
      if (next !== this.selectedTab) {
        this.selectedTab = next;
        this.$nextTick(() => {
          this.$refs.list.refresh();
        });
      }
    },
    request() {
      return API.LIST({
        // uid: this.$route.query.uid,
        isUser: 1,
        cType: this.selectedTab,
      }).then((list) => {
        setTimeout(() => {
          this.$refs.list.reflow();
        }, 100);
        return list.map(this.format);
      });
    },
    format(item) {
      // console.log(item, "item");
      const { SendDate, redate, ...o } = item;
      const d = day((SendDate || redate) * 1000);
      return {
        ...o,
        day: d.format("MM/DD"),
        time: d.format("HH:mm"),
        isChild: !!redate,
      };
    },
    renderItem(item, index, that) {
      const { day, time, children = [] } = item;
      return (
        <div key={index} class="time-line flex-row">
          <div class="time flex-column">
            <p>{time}</p>
            <p>{day}</p>
          </div>
          <div class="card-list">
            <MessageCard
              classify="patient"
              data={item}
              onReply={(data) => {
                console.log("onReply", data);
                // this.setState({
                //   modal: {
                //     visible: true,
                //     type: "1",
                //     data,
                //   },
                // });
                this.modal = {
                  visible: true,
                  type: "1",
                  data,
                };
              }}
              onEvaluation={(data) => {
                console.log("onEvaluation", data);
                // this.setState({
                //   modal: {
                //     visible: true,
                //     type: "2",
                //     data,
                //   },
                // });
                this.modal = {
                  visible: true,
                  type: "2",
                  data,
                };
              }}
              onShowImageModal={(data) => {
                const { imgList, index } = data;
                ImagePreview({
                  images: imgList,
                  startPosition: index,
                });
              }}
            />
            {children.map((child, index) => {
              const { reType } = child;
              return (
                <MessageCard
                  classify="patient"
                  key={index}
                  data={child}
                  isChild={true}
                  isReply={reType === "1"}
                  isEvaluation={reType === "2"}
                  onShowImageModal={(data) => {
                    const { imgList, index } = data;
                    ImagePreview({
                      images: imgList,
                      startPosition: index,
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    },
    hide() {
      this.modal.visible = false;
    },
    publish(data) {
      const { message, imgList, rateList } = data;
      const { modal } = this;
      const { uid, cid } = modal.data;
      const params = {
        cid,
        // uid: '53',
        theValue: message,
        reType: modal.type,
        theImgs: imgList,
        ScoreJson: rateList,
      };
      API.SEND({
        ...params,
        theImgs: JSON.stringify(params.theImgs),
        ScoreJson: JSON.stringify(params.ScoreJson),
      }).then((userInfo) => {
        // const { UserPhoto, NickName: UserName } =
        //   this.props.store.dataStore.userInfo.data || {};
        const list = modal.data.children || [];
        list.push({
          ...params,
          ...userInfo,
          // UserPhoto,
          // UserName,
        });
        modal.data.children = list;
        this.hide();
        Tip.success(modal.type === "1" ? "回复成功" : "评价成功");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/theme";
.dialogue-info-list {
  background: #f5f6fa;
  .tabs {
    height: 0.32rem;
    background: #fff;

    .tab {
      flex: 1;
      height: 100%;
      color: 0.14rem;
      /* color: $color5; */

      &.selected {
        font-weight: bold;
        color: $color1;
      }
    }
  }
  .content {
    height: calc(100% - 0.32rem);
    padding: 0.1rem 0.12rem;
  }
  .list {
    height: 100%;
  }
  .time-line {
    .time {
      margin-right: 0.1rem;
      height: 0.46rem;
      padding: 0.06rem 0.08rem;
      font-size: 0.12rem;
      /* color: $color7; */
      background: #ffefdb;
    }
  }

  .card-list {
    width: 0;
    flex: 1;
  }
  .nodata {
    display: block;
    width: 100%;
    text-align: center;
    color: #333;
    padding: 0.15rem;
    font-size: 0.12rem;
  }
}
</style>
<template>
  <Page title="跟进信息">
    <div class="dialogue-info-list page-full">
      <Tabs :value="selectedTab" @change="select" :data="tabs" />
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
import { Tip, UID } from "@/utils";
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
  name: "chat",
  head() {
    return {
      title: "跟进信息",
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
          label: "服务节点",
          value: "服务",
        },
        {
          label: "诊疗档案",
          value: "医疗",
        },
      ],
    };
  },
  methods: {
    select(tab) {
      this.selectedTab = tab;
      this.$nextTick(() => {
        this.$refs.list.refresh();
      });
    },
    request() {
      const { id } = this.$route.query;
      return API.LIST({
        uid: id || UID.GET(),
        isUser: 2,
        cType: this.selectedTab,
      }).then((list) => {
        return list.map(this.format);
      });
    },
    format(item) {
      // console.log(item, "item");
      const { SendDate, redate, ...o } = item;
      const d = day((SendDate || redate) * 1000);
      return {
        ...o,
        day: d.format("MM-DD"),
        year: d.format("YYYY"),
        time: d.format("HH:mm"),
        isChild: !!redate,
      };
    },
    renderItem(item, index, that) {
      const { day, year, children = [] } = item;
      return (
        <div key={index} class="time-line">
          <div class="line" />
          <div class="card-list">
            <div class="time flex-row main-between center">
              <span class="m">{day}</span>
              <span class="y">{year}</span>
            </div>
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
  components: {
    MessageModal,
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/theme";
.dialogue-info-list {
  background: #f5f6fa;
  .tabs {
    height: 0.5rem;
    background: #fff;
  }
  .content {
    height: calc(100% - 0.5rem);
    padding: 0.1rem 0.15rem;
  }
  .list {
    height: 100%;
  }
  .time-line {
    position: relative;
    .time {
      font-size: 0.12rem;
      margin-bottom: 0.12rem;
      .m {
        font-size: 0.2rem;
        font-weight: bold;
        color: #6dc7c6;
      }
      .d {
        font-size: 0.14rem;
        color: #999999;
      }
    }
    .line {
      position: absolute;
      top: 0.1rem;
      left: 0.05rem;
      bottom: 0;
      width: 1px;
      background: rgba($color: #6dc7c6, $alpha: 0.1);
      &::after {
        content: "";
        position: absolute;
        left: -0.035rem;
        top: 0;
        width: 0.07rem;
        height: 0.07rem;
        background: #6dc7c6;
        box-shadow: inset 0px 0px 4px 0px rgb(255 255 255 / 50%);
        border-radius: 50%;
      }
    }
  }

  .card-list {
    margin-left: 0.2rem;
    /* width: 0;
    flex: 1; */
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
<template>
  <Page title="图库/视频库">
    <div class="gallery page-full">
      <div class="g-header">
        <div class="kind-list flex-row center">
          <button
            :class="{ selected: kind.value === selectedKind }"
            v-for="kind in kindList"
            :key="kind.value"
            @click="changeKind(kind)"
          >
            {{ kind.label }}
          </button>
        </div>
        <StatusHandle :get="getClassifyList">
          <ScrollView class="scroll">
            <div class="tabs flex-row center">
              <div
                v-for="tab in childClassifyList"
                :key="tab.TypeName"
                :class="['tab', { selected: selected === tab.fid }]"
                @click="selected = tab.fid"
              >
                {{ tab.TypeName }}
                <span v-if="selected === tab.fid" class="border"></span>
              </div>
            </div>
          </ScrollView>
        </StatusHandle>
      </div>
      <List
        v-if="classifyList.length"
        :request="request"
        :pageSize="20"
        columnNum="2"
        :renderItem="renderItem"
        class="list"
        ref="list"
      />
      <VideoModal
        :visible="modal.visible"
        @close="modal.visible = false"
        :data="modal.data"
      />
    </div>
  </Page>
</template>
<script>
import { ImagePreview } from "vant";

import { LoadingControl, formatTime, size } from "@/utils";
import { icons } from "@/assets";
import { get, mock } from "@/api/http";
import CoverImage from "@/components/CoverImage";
import VideoModal from "@/components/VideoModal";

const API = {
  CLASSIFY_LIST(gid) {
    return get("/Api/getCloudTypeList_api.php", { gid, FileType: "" });
  },
  LIST(params) {
    return get("/Api/getCloudList_api.php", params);
  },
  MODIFY(params) {
    return get("/Api/setShopCats_api.php", params);
  },
};
export const TYPE = {
  ORDER: "order",
};
export default {
  name: "gallery",
  head() {
    return {
      title: "图库/视频库",
    };
  },
  data() {
    return {
      selectedKind: "img",
      kindList: [
        {
          label: "图片",
          value: "img",
        },
        {
          label: "视频",
          value: "video",
        },
      ],
      selectedCache: {
        img: "",
        video: "",
      },
      selected: "",
      status: "",
      classifyList: [],
      modal: {
        visible: false,
        data: "",
      },
    };
  },
  computed: {
    gid() {
      return this.$route.query.id;
    },
    childClassifyList() {
      const { classifyList, selectedKind } = this;
      return [
        {
          fid: "",
          TypeName: "全部",
        },
        ...classifyList.filter((item) => item.FileType === selectedKind),
      ];
    },
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
    changeKind(kind) {
      if (this.selectedKind === kind.value) {
        return;
      }
      this.selectedCache[this.selectedKind] = this.selected;

      this.selectedKind = kind.value;
      if (this.selectedCache[kind.value]) {
        this.selected = this.selectedCache[kind.value];
      } else {
        this.selected = "";
      }
      this.$nextTick(this.refresh);
    },
    getClassifyList() {
      return API.CLASSIFY_LIST(this.gid).then((res) => {
        // if (res.length) {
        //   this.selected = res[0].fid;
        // }
        this.classifyList = res.filter((item) => item.TypeName);
      });
    },
    request(params) {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      return API.LIST({
        ...params,
        FileType: this.selectedKind,
        fid: this.selected,
        gid: this.gid,
      });
    },
    showImg(index) {
      // const { selected, classifyList } = this;
      // const match = classifyList.find((item) => item.fid === selected);
      if (this.selectedKind === "img") {
        const list = this.$refs.list.list.map((item) => item.fileUrl);
        ImagePreview({
          images: list,
          startPosition: index,
        });
      } else {
      }
    },
    showVideo(item) {
      console.log(item, "item");
      this.modal = {
        visible: true,
        data: item.fileUrl,
      };
    },
    renderItem(item, index) {
      const { itemid, fileUrl, fileName } = item;
      const isVideo = ["mp4"].some((format) => fileUrl.includes(format));
      return (
        <div class="item" key={itemid}>
          {isVideo ? (
            <video
              class="cover"
              src={fileUrl}
              onClick={() => this.showVideo(item)}
            />
          ) : (
            <CoverImage
              onClick={() => this.showImg(index)}
              url={fileUrl}
              class="cover"
            />
          )}
          <p class="name">{fileName}</p>
        </div>
      );
    },
  },
  components: {
    VideoModal,
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";

.gallery {
  position: relative;
  background: $color8;
  /* padding-bottom: 0.5rem; */
  .g-header {
    height: 0.9rem;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    .kind-list {
      margin: 0.14rem;
      margin-bottom: 0;
      border: 1px solid #1ebcc4;
      border-radius: 4px;
      overflow: hidden;
      button {
        flex: 1;
        height: 0.32rem;
        font-size: 0.15rem;
        color: #1ebcc4;
        &.selected {
          color: #fff;
          background: #1ebcc4;
          border-radius: 4px;
        }
      }
    }
    .scroll {
    }
    .tabs {
      height: 0.41rem;
      justify-content: space-around;

      .tab {
        margin: 0 0.14rem;
        position: relative;
        line-height: 0.4rem;
        font-size: 0.14rem;
        color: $color6;
        &.selected {
          font-weight: bold;
          color: #1ebcc4;
        }
        .border {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          border-radius: 3px;
          background: #1ebcc4;
        }
      }
    }
  }
  .list {
    /* height: calc(100% - 0.9rem); */
    /* flex: 1; */
    height: 100%;
    padding: 0.12rem;
    .column-0 {
      margin-right: 0.2rem;
    }
  }
  .item {
    margin-bottom: 0.12rem;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 0.12rem;
    overflow: hidden;
    .cover {
      display: block;
      width: 100%;
      height: 1.66rem;
    }
    .name {
      height: 0.48rem;
      line-height: 0.48rem;
      font-size: 0.16rem;
      padding-left: 0.1rem;
      color: #333;
    }
  }
}
</style>
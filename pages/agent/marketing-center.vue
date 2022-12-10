<script>
import { get } from "@/api/http";
import List from "@/components/List";
import Message from "@/components/Message";
import SaveModal from "@/components/SaveModal";
import Page from "@/components/Page";
import { marketing } from "@/assets";
import { OS } from "@/utils";

const API = {
  LIST(params) {
    return get("/Api2/getOperationList_api.php", params);
  },
};
const TYPE = {
  ARTICLE: "链接",
  IMAGE: "海报",
  VIDEO: "视频",
};
export default {
  name: "marketing-center",
  head() {
    return {
      title: "助孕知识库",
    };
  },
  data() {
    return {
      selected: "",
      datasource: [],
      modal: {
        visible: false,
        type: "",
        data: null,
        opid: "",
      },
      tabList: [
        {
          label: "全部",
          value: "",
          icon: marketing.all,
          activeIcon: marketing.allActive,
        },
        {
          label: "图片",
          value: TYPE.IMAGE,
          icon: marketing.video,
          activeIcon: marketing.videoActive,
        },
        {
          label: "文章",
          value: TYPE.ARTICLE,
          icon: marketing.art,
          activeIcon: marketing.artActive,
        },
        // {
        //   label: "视频",
        //   value: TYPE.VIDEO,
        //   icon: marketing.video,
        //   activeIcon: marketing.videoActive,
        // },
      ],
    };
  },
  methods: {
    refresh() {
      this.$refs.list.refresh();
    },
    request(params) {
      return API.LIST({
        opType: this.selected,
        ...params
      });
    },
    showSaveModal(data) {
      this.modal = {
        ...this.modal,
        ...data,
        visible: true,
      };
    },
    close() {
      this.modal.visible = false;
    },
    renderItem(item, index) {
      return <Message data={item} key={index} onSave={this.showSaveModal} />;
    },
  },
  render() {
    const { selected, datasource, modal } = this;
    const { visible, type, data, index, opid } = modal;
    return (
      <Page title="助孕知识库">
        <div class="marketing-center page-full">
          <div
            class="tabs flex-row center"
            style={{ top: OS.isWechat ? 0 : ".5rem" }}
          >
            {this.tabList.map(({ label, value, icon, activeIcon }) => {
              const isSelected = value === selected;
              return (
                <div
                  onClick={() => {
                    this.selected = value;
                    this.$nextTick(this.refresh);
                  }}
                  key={label}
                  class={["tab flex-row center", isSelected ? "selected" : ""]}
                >
                  <img
                    src={isSelected ? activeIcon : icon}
                    class="icon"
                    mode="widthFix"
                  />
                  <p class="label">{label}</p>
                </div>
              );
            })}
          </div>
          <List
            class="list"
            request={this.request}
            renderItem={this.renderItem}
            pageSize="5"
            ref="list"
          />
          <SaveModal
            visible={visible}
            type={type}
            data={data}
            index={index}
            onClose={this.close}
            opid={opid}
          />
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
.marketing-center {
  position: relative;
  background: #f5f6fb;
  padding-top: 0.55rem;

  .tabs {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 999;
    height: 0.5rem;
    padding: 0 0.14rem;
    background: #fff;
    border-bottom: 0.05rem solid #f5f6fb;

    .tab {
      margin-right: 0.07rem;
      height: 0.25rem;
      padding: 0 0.08rem;
      border: 2px solid #ddd;
      border-radius: 0.13rem;
      background: #ddd;

      &.selected {
        background: rgba(49, 164, 246, 0.2);
        border-color: #31a4f6;

        .label {
          color: #31a4f6;
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .icon {
      margin-right: 0.09rem;
      width: 0.18rem;
      height: 0.16rem;
    }

    .label {
      font-size: 0.12rem;
      color: #616161;
    }
  }
  .list {
    height: 100%;
  }
  .message {
    padding: 0.12rem 0.14rem;
    background: #fff;

    .header {
      .border {
        margin-right: 0.1rem;
        width: 0.15rem;
        height: 0.15rem;
        background: #fff;
        border-radius: 50%;
        border: 0.03rem solid #31a4f6;
      }

      .time {
        font-size: 0.12rem;
        color: #6c6c6c;
      }
    }

    .text-box {
      width: 2.5rem;
    }

    .text {
      font-size: 0.12rem;
      color: #2d2d2d;
    }

    .img-list {
      width: 0.75rem * 3 + 0.1rem * 3;
      flex-wrap: wrap;
      margin-top: 0.1rem;

      .only-one {
        width: 50%;
      }

      .multiple {
        margin-right: 0.1rem;
        width: 0.75rem;
        height: 0.75rem;
      }
    }

    .article {
      margin-top: 0.1rem;
      height: 0.57rem;
      padding: 0.07rem 0.11rem;
      background: rgba($color: #d8d8d8, $alpha: 0.3);

      .icon {
        margin-right: 0.1rem;
        width: 0.43rem;
        height: 0.43rem;
      }

      .right {
        width: 0;
        flex: 1;
      }

      .label {
        font-size: 0.11rem;
        color: #2d2d2d;
      }
    }

    .video {
      width: 2.5rem;
    }
  }

  .mt {
    margin-top: 0.1rem;
  }
}

.show-posters-box {
  justify-content: flex-end;

  .show-posters {
    background: #f1f1f1;
    height: 0.25rem;
    padding: 0 0.07rem;
    font-size: 0.12rem;
    color: #828282;
    border-radius: 0.06rem;
    .icon {
      margin-right: 0.05rem;
      width: 0.1rem;
    }
  }
}
</style>
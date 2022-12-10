<template>
  <div class="task-box">
    <div @click="go" class="task flex-row center">
      <img v-if="readonly" class="badge" :src="user.punch" alt="" srcset="" />
      <div class="left flex-row center">
        <div class="cover-box">
          <CoverImage class="cover" :url="data.icon" />
          <div
            v-if="!readonly"
            :class="['bradge', { already: +data.isclock === 1 }]"
          >
            {{ +data.isclock === 1 ? "已打卡" : "未打卡" }}
          </div>
        </div>
        <div class="flex-column">
          <div class="flex-row center">
            <p class="name">{{ data.name }}</p>
            <p v-if="data.ctype === '1'" class="tag align">上传图文</p>
          </div>
          <p class="desc">{{ data.remark }}</p>
        </div>
      </div>
      <img v-if="readonly" :src="user.msg" alt="" srcset="" class="msg" />
      <template v-else>
        <template v-if="+data.isclock === 0">
          <div v-if="isToday" class="check align" />
        </template>

        <div v-else class="check align">
          <img :src="icons.checked" alt="" srcset="" />
        </div>
      </template>
    </div>
    <PunchRecord v-if="+data.isclock === 1" :data="data" />
    <PunchModal
      v-if="!readonly"
      :visible="modal.visible"
      :data="data"
      @success="onSuccess"
      @cancel="hide"
    />
  </div>
</template>
<script>
import PunchModal from "@/components/PunchModal";
import PunchRecord from "@/components/PunchRecord";
import { icons, user } from "@/assets";
import { router } from "../utils";

export default {
  name: "Task",
  props: {
    data: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
    isToday: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user,
      icons,
      modal: {
        visible: false,
        data: null,
        type: "",
      },
    };
  },
  methods: {
    showModal() {
      if (!this.readonly) {
        this.modal.visible = true;
      }
    },
    go() {
      if (this.readonly) {
        router.push({
          path: "/punch",
        });
        return;
      }
      if (+this.data.isclock === 0 && this.isToday) {
        this.showModal();
      }
    },
    punch(data) {
      console.log(data, "data");
    },
    hide() {
      this.modal.visible = false;
    },
    onSuccess() {
      this.$emit("refresh");
    },
  },

  components: {
    PunchModal,
    PunchRecord,
  },
};
</script>
<style lang="scss">
.task-box {
  margin-bottom: 0.11rem;
  padding: 0.07rem 0.1rem;
  background: #fff;
  border-radius: 0.13rem;
}
.task {
  position: relative;
  min-height: 0.75rem;
  .left {
    flex: 1;
  }
  .badge {
    position: absolute;
    left: 0;
    top: -0.08rem;
    width: 0.66rem;
  }
  .cover-box {
    position: relative;
    margin-right: 0.14rem;
    width: 0.54rem;
    height: 0.54rem;
    border-radius: 50%;
    /* border: 1px solid red; */
    .bradge {
      position: absolute;
      top: 0.06rem;
      right: -0.13rem;
      height: 0.14rem;
      line-height: 0.14rem;
      padding: 0 4px;
      font-size: 0.1rem;
      color: #fff;
      border-radius: 4px;
      background: #FF5899;
      &.already {
        background: #58DD71;
      }
    }
    .cover {
      width: 0.54rem;
      height: 0.54rem;
      border-radius: 50%;
    }
  }
  .name {
    font-size: .18rem;
    font-weight: 500;
    color: rgba(33, 33, 33, 0.84);
  }
  .tag {
    margin-left: 0.07rem;
    padding: 0 0.05rem;
    height: 0.15rem;
    background: #f5d8b9;
    font-size: 0.1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.84);
    border-radius: 0.05rem;
  }
  .desc {
    margin-top: 0.05rem;
    font-size: 0.14rem;
    color: #4d4d4d;
  }
  .msg {
    width: 0.2rem;
  }
  .check {
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 4px;
    border: 1px solid #edcaa4;
    img {
      width: 100%;
    }
  }
}
</style>
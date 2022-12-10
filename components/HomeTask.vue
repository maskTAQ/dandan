<template>
  <div class="home-task-box" @click="go">
    <div class="task flex-row center">
      <img v-if="readonly" class="badge" :src="user.punch" alt="" srcset="" />
      <div class="left flex-row center">
        <CoverImage class="cover" :url="data.icon" />
        <div class="flex-column">
          <div class="flex-row center">
            <p class="name">{{ data.name }}</p>
            <p class="tag align">已完成</p>
          </div>
          <p class="desc">{{ data.remark }}</p>
        </div>
      </div>
    </div>
    <PunchRecord home v-if="+data.ctype === 1" :data="data" />
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
.home-task-box {
  margin-bottom: 0.11rem;
  padding: 0.07rem 0.2rem;
  background: #fff;
  /* border-radius: 0.13rem; */
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
  .cover {
    margin-right: 0.14rem;
    width: 0.54rem;
    height: 0.54rem;
    border-radius: 50%;
    /* border: 1px solid red; */
  }
  .name {
    font-size: .18rem;
    font-weight: 500;
    color: rgba(33, 33, 33, 0.84);
  }
  .tag {
    margin-left: 0.07rem;
    padding: 0 0.05rem;
    height: 0.18rem;
    background: #ebb177;
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
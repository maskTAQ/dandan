<script>
import day from "dayjs";
import Page from "@/components/Page";
import Task from "@/components/Task.vue";
import { get } from "@/api/http";
import StatusHandle from "@/components/StatusHandle";
import { formatTime, UID } from "../utils";

let Calendar;
if (process.browser) {
  Calendar = require("vue-calendar-component").default;
}

const API = {
  LIST(params) {
    return get("/Api/getUserClockList_api.php", params);
  },
  TASK(params) {
    return get("/Api/getUserClockInfo_api.php", params);
  },
  STATUS() {
    return get("/Api/getUserIsClock_api.php", {}, { showError: false });
  },
};
const today = day().format("YYYY/M/DD");
export default {
  name: "punch",
  data() {
    return {
      isBrowser: process.browser,
      auth: true,
      today,
      selectedDay: today,
      remarks: [{ date: today, className: "today" }],
      tasks: [],
    };
  },
  render() {
    const { auth, tasks, selectedDay, today } = this;
    if (!UID.GET()) {
      return (
        <Page title="打卡">
          <div class="punch">
            <div class="no-auth flex-column align">
              <p class="title">定制全周期医疗服务</p>
              <p class="label">优孕管理团队一站式服务跟进</p>
              <button onClick={this.goLogin} class="login">登录后立即体验</button>
            </div>
          </div>
        </Page>
      );
    }
    if (Calendar) {
      return (
        <Page title="打卡">
          <div class="punch">
            <Calendar
              onChoseDay={this.clickDay}
              onChangeMonth={this.changeDate}
            />
            <StatusHandle ref="statusHandle" get={this.get}>
              {auth ? (
                <div class="task-list">
                  {tasks.map((task) => {
                    return (
                      <Task
                        onRefresh={this.refresh}
                        data={task}
                        isToday={selectedDay === today}
                      />
                    );
                  })}
                </div>
              ) : (
                <div class="no-auth flex-column align">
                  <p class="title">定制全周期医疗服务</p>
                  <p class="label">优孕管理团队一站式服务跟进</p>
                  <button class="btn"></button>
                </div>
              )}
            </StatusHandle>
          </div>
        </Page>
      );
    } else {
      return (
        <Page title="打卡">
          <div class="punch"></div>
        </Page>
      );
    }
  },
  methods: {
    goLogin() {
      router.push({
        path: "/login",
      });
    },
    refresh() {
      this.$refs.statusHandle.refresh();
    },
    get() {
      return this.getStatus().then(this.getTaskList);
      // .then((todayTask) => {
      //   if (todayTask) {
      //     return API.TASK({ id: todayTask.id }).then((res) => {
      //       this.tasks = res.Item || [];
      //     });
      //   }
      // });
    },
    getStatus() {
      return API.STATUS()
        .then((res) => {
          this.auth = true;
        })
        .catch((e) => {
          this.auth = true;
        });
    },
    // getTaskList() {
    //   return API.LIST().then((res) => {
    //     let todayTask = null;
    //     const list = res.map((item) => {
    //       const date = formatTime(item.ctime, "YYYY/M/DD");
    //       const isToday = today === date;
    //       item.date = date;
    //       if (isToday) {
    //         todayTask = item;
    //       }
    //       return {
    //         date,
    //         className: isToday ? "today" : "",
    //       };
    //     });
    //     this.remarks = list;
    //     console.log(list, "list");
    //     return todayTask;
    //   });
    // },
    getTaskList() {
      return API.LIST({
        cday: day(day(this.selectedDay).format("YYYY/MM/DD")).unix(),
      }).then(async (res) => {
        // return Promise.all(
        //   res.map((item) => {
        //     const { cuid } = item;
        //     if (+cuid) {
        //       return API.TASK({ cuid }).then((detail) => {
        //         return {
        //           cuid,
        //           detail,
        //         };
        //       });
        //     } else {
        //       return Promise.resolve({ cuid });
        //     }
        //   })
        // ).then((detailList) => {
        //   console.log({
        //     detailList,
        //     res,
        //   });
        //   this.tasks = res.map((item) => {
        //     return item;
        //   });
        // });
        this.tasks = res;
      });
    },
    clickDay(data) {
      console.log(data); //选中某天
      this.selectedDay = data;
      this.$nextTick(() => {
        this.$refs.statusHandle.refresh();
      });
    },
    changeDate(data) {
      console.log(data); //左右点击切换月份
    },
    clickToday(data) {
      console.log(data); // 跳到了本月
    },
  },
  //   components: {
  //     Calendar,
  //   },
};
</script>
<style lang="scss">
.punch {
  height: 100%;
  background: #f1f5fb;
  overflow: auto;
  .wh_content_all {
    background: #fff !important;
    .wh_jiantou1,
    .wh_jiantou2 {
      border-color: #939fba;
    }
    .wh_top_changge li {
      color: rgba(77, 77, 77, 0.84);
    }
    .wh_content_item {
      color: #939fba;
      .wh_chose_day {
        background: none;
        border: 2px solid #2D4EF5;
        border-radius: 4px;
      }
      .wh_isToday {
        background: none;
        border-radius: 4px;
        color: #77c0fd;
      }
    }
    & > :nth-child(1) {
      border-bottom: 1px solid #f0f1f4;
    }
    .wh_content {
    }
  }
  .task-list {
    padding: 0.15rem;
  }
  .no-auth {
    padding-top: 0.96rem;
    .title {
      font-size: 0.21rem;
      font-weight: 500;
      color: rgba(33, 33, 33, 0.84);
    }
    .label {
      margin-top: 0.06rem;
      margin-bottom: 0.1rem;
      font-size: 0.14rem;
      color: rgba(77, 77, 77, 0.84);
    }
    .btn {
      width: 1.87rem;
      height: 0.44rem;
      background: url("../assets/img/open-pubch-auth.png") no-repeat center
        center / 100% 100%;
    }
    .login{
      width: 1.87rem;
      height: 0.44rem;
      background: #e7ae75;
      font-size: .16rem;
      color: #fff;
      border-radius: .04rem;
    }
  }
}
</style>
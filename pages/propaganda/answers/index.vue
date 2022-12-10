<script>
import { router, LoadingControl, Tip } from "@/utils";
import { post, get } from "@/api/http";
import Page from "@/components/Page";
const API = {
  SUBMIT(params) {
    return post("/Api/saveUserTest_api.php", params, { json: false });
  },
  CAN() {
    return get("/Api/getUserIsTest_api.php");
  },
};

const icons = {
  selected: require("./imgs/selected.png"),
  unselected: require("./imgs/unselected.png"),
  unchecked: require("./imgs/unchecked.png"),
  checked: require("./imgs/checked.png"),
};
const answers = [
  {
    answer: "您的姓名",
    type: "input",
    props: {
      placeholder: "请输入您的姓名",
    },
    page: 0,
  },
  {
    answer: "您的年龄",
    type: "input",
    props: {
      placeholder: "请输入您的年龄",
      type: "number",
    },
    page: 0,
  },
  {
    answer: "您备孕了多长时间",
    type: "radio",
    props: {
      options: ["6个月以内", "6个月到1年", "1年到2年", "2年以上"],
    },
    page: 0,
  },
  {
    answer: "您的身份",
    type: "radio",
    props: {
      options: ["准妈妈", "备孕妈妈", "准爸爸", "正在备孕"],
    },
    page: 1,
  },
  {
    answer: "您有哪些生活习惯（多选）",
    type: "selected",
    props: {
      options: ["运动", "养生", "熬夜", "抽烟", "饮酒"],
    },
    page: 1,
  },
  {
    answer: "您想了解哪些备孕信息（多选）",
    type: "selected",
    props: {
      options: [
        "医学生理知识",
        "备孕/孕期产检项目",
        "辅助生殖知识",
        "心理辅导",
        "其他",
      ],
    },
    page: 2,
  },
  {
    answer: "您目前身体有哪些健康隐患（多选）",
    type: "selected",
    props: {
      options: [
        "失眠/内分泌失调",
        "肥胖/身体指标差",
        "多囊卵巢/卵巢早衰",
        "排卵障碍/精子障碍",
        "宫腔粘连/输卵管堵塞",
        "其他",
        "以上均无",
      ],
    },
    page: 2,
  },
  {
    answer: "您目前遇到的试管治疗困惑有哪些",
    type: "radio",
    props: {
      options: [
        "术后生理病痛",
        "激素不利影响",
        "反复移植失败",
        "心理及经济压力",
        "缺乏权威报告解读",
      ],
    },
    page: 3,
  },
  {
    answer: "在试管过程中您更在乎哪方面的问题",
    type: "radio",
    props: {
      options: [
        "取卵数量",
        "取卵后并发症",
        "精子冷冻保存率",
        "胚胎解冻率",
        "异位妊娠",
        "出生缺陷",
      ],
    },
    page: 3,
  },
  {
    answer: "还有以上没有提到，但是您更想了解的内容吗",
    type: "textarea",
    page: 4,
  },
];
export default {
  name: "answers",
  data() {
    return {
      answers,
      step: 0,
      loading: false,
      params: {},
      can: false,
    };
  },
  created() {
    if (process.browser) {
      API.CAN()
        .then((res) => {
          this.can = +res.isTest !== 1;
          if (!this.can) {
            router.replace({
              path: "/propaganda/answers/complete",
            });
          }
          return this.can;
        })
        .catch((e) => {
          this.can = true;
        });
    }
  },
  computed: {
    list() {
      const { answers, step } = this;
      return answers
        .map((item, index) => {
          item.index = index;
          return item;
        })
        .filter((answer) => answer.page === step);
    },
  },
  methods: {
    handleChange(index, value) {
      this.$set(this.params, index, value);
    },
    back() {
      router.back();
    },
    prev() {
      this.step -= 1;
    },
    next() {
      const { params, step, list } = this;
      const result = list.every((item) => !!params[item.index]);
      if (result) {
        this.step += 1;
      } else {
        // this.step += 1;
        Tip.error("请填写问卷内容");
      }
    },
    submit() {
      LoadingControl({
        call: API.SUBMIT,
        params: {
          answerJson: JSON.stringify(this.params),
        },
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        // Tip.success("感谢您填写问卷,优惠券请稍后至卡包查看!");
        router.replace({
          path: "/propaganda/answers/complete",
        });
      });
      console.log(JSON.stringify(this.params), "params");
    },
  },
  render() {
    const { can, list, params, step, loading } = this;
    if (!can) {
      return null;
    }
    return (
      <Page title="助孕测试" fixed>
        <div class="q flex-column">
          <div class="content">
            <div class="answers">
              {list.map(({ answer, type, props, index }) => {
                let content = null;
                const value = params[index];
                switch (type) {
                  case "input": {
                    content = (
                      <div class="field-content input">
                        <input
                          value={value}
                          onInput={(e) =>
                            this.handleChange(index, e.target.value)
                          }
                        />
                      </div>
                    );
                    break;
                  }
                  case "textarea": {
                    content = (
                      <div class="field-content">
                        <van-field
                          value={value}
                          onInput={(value) => this.handleChange(index, value)}
                          rows="5"
                          autosize
                          class="textarea"
                          placeholder="请输入您的想法"
                          type="textarea"
                        />
                      </div>
                    );
                    break;
                  }
                  case "radio": {
                    content = (
                      <div class="flex-row field-content radio">
                        {props.options.map((item) => {
                          const isSelected = value === item;
                          return (
                            <div
                              onClick={() => {
                                this.handleChange(index, item);
                              }}
                              class="flex-row center radio-item"
                            >
                              <img
                                src={
                                  isSelected ? icons.selected : icons.unselected
                                }
                                class="icon"
                              />
                              <span class="text">{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                    break;
                  }
                  case "selected": {
                    content = (
                      <div class="flex-row field-content radio">
                        {props.options.map((item) => {
                          const i = (value || []).indexOf(item);
                          return (
                            <div
                              onClick={() => {
                                const next = value ? [...value] : [];
                                if (i > -1) {
                                  next.splice(i, 1);
                                } else {
                                  next.push(item);
                                }
                                this.handleChange(index, next);
                              }}
                              class="flex-row center radio-item"
                            >
                              <img
                                src={i > -1 ? icons.checked : icons.unchecked}
                                class="icon"
                              />
                              <span class="text">{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                    break;
                  }
                }
                return (
                  <div class="field">
                    <p class="field-label">
                      {index + 1}、{answer}
                    </p>
                    {content}
                  </div>
                );
              })}
            </div>
            <div class="btn-group flex-row align">
              {step === 0 && (
                <button class="exit" onClick={this.back}>
                  以后再测
                </button>
              )}
              {step !== 0 && (
                <button class="prev" onClick={this.prev}>
                  上一步
                </button>
              )}
              {step !== 4 && (
                <button class="next" onClick={this.next}>
                  下一步
                </button>
              )}
              {step === 4 && (
                <van-button
                  loading={loading}
                  class="submit"
                  onClick={this.submit}
                >
                  确定提交
                </van-button>
              )}
            </div>
          </div>
        </div>
      </Page>
    );
  },
};
</script>
<style lang="scss">
.q {
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 0.3rem;
  background: url("./imgs/bg.png") no-repeat center top / 100% auto,
    url("./imgs/cloud.png") no-repeat left bottom / 110% auto;
  background-color: #cae6fc;
  .content {
    margin-top: 0.3rem;
    width: 3.5rem;
    .answers {
      width: 100%;
      min-height: 3rem;
      padding: 0 0.13rem;
      background: #fff;
      box-shadow: 0px 1px 3px 0px rgba(61, 101, 250, 0.61);
      border-radius: 0.1rem;
      .field {
        padding: 0.1rem 0;
      }
      .field-label {
        margin: 0.15rem 0;
        font-size: 0.14rem;
        /* line-height: 0.3rem; */
        color: #010101;
      }
      .input {
        height: 0.4rem;
        padding-left: 0.1rem;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 0.08rem;
        input {
          width: 100%;
          height: 100%;
        }
      }
      .radio,
      .checked {
        flex-wrap: wrap;
      }
      .radio-item,
      .checked-item {
        width: 50%;
        height: 30px;
        /* border: 1px solid red; */
      }
      .icon {
        width: 0.12rem;
      }
      .text {
        margin-left: 0.08rem;
        font-size: 0.13rem;
        color: #666666;
      }
    }
    .textarea {
      /* height: 1.5rem; */
      background: #f8fcff;
      border: 1px solid #cccccc;
      border-radius: 0.1rem;
    }
    .btn-group {
      margin-top: 0.3rem;
    }
    .exit,
    .prev {
      margin-right: 0.45rem;
      width: 1.25rem;
      height: 0.36rem;
      font-size: 0.14rem;
      color: #ffffff;
      background: #a4c1ff;
      border-radius: 0.18rem;
    }
    .next,
    .submit {
      width: 1.25rem;
      height: 0.36rem;
      font-size: 0.14rem;
      color: #ffffff;
      background: #3d65fa;
      border-radius: 0.18rem;
    }
  }
}
</style>
<script>
import { LoadingControl } from "@/utils";
export default {
  name: "MessageCard",
  props: ["isChild", "isReply", "reply", "canReply", "data"],
  data() {
    return {
      loading: false,
    };
  },
  render() {
    const { isChild, isReply, canReply, data, loading } = this;
    const {
      UserPhoto,
      adminPhoto,
      UserName,
      adminName,
      cType,
      theValue,
      cardText,
      UserType,
      adminType,
      theImgs,
      cardImg,
      isHF,
      ScoreJson,
      children,
    } = data;
    console.log({ ScoreJson });
    const portrait = isChild ? UserPhoto : adminPhoto;
    const name = isChild ? UserName : adminName;
    const classify = isChild ? UserType : adminType;
    const type = isChild ? (isReply ? "回复" : "评价") : cType;
    const message = isChild ? theValue : cardText;
    let imgList = isChild ? theImgs : cardImg;
    if (!Array.isArray(imgList)) {
      try {
        imgList = JSON.parse(imgList);
      } catch (e) {
        imgList = [];
      }
    }
    const alreadyReplay =
      !isChild && (children || []).find((item) => item.reType === "1");
    const alreadyEvaluation =
      !isChild && (children || []).find((item) => item.reType === "2");
    return (
      <div class="message-card">
        <div class="top flex-row center">
          <img src={portrait} class="portrait" />
          <div class="flex-column">
            <div class="flex-row center">
              <p class="user-name">{name}</p>
              {classify && (
                <div class={"classify customer-service "}>
                  <p>{classify}</p>
                </div>
              )}
            </div>
            <p class="label">{type}</p>
          </div>
        </div>
        <p class="message">{message}</p>
        {imgList && (
          <div class="img-list flex-row">
            {imgList.map((src, index) => {
              return (
                <div
                  onClick={() => {
                    this.$emit("showImageModal", {
                      imgList,
                      index,
                    });
                  }}
                  style={{
                    background: `url('${src}') no-repeat center / cover`,
                  }}
                  class="img"
                />
              );
            })}
          </div>
        )}
        {!isChild && (
          <div class="btn-group flex-row center">
            {isHF === "1" && (
              <button
                class={alreadyReplay ? "disabled" : ""}
                disabled={alreadyReplay}
                onClick={() => {
                  // onReply(data);
                  this.$emit("reply", data);
                }}
              >
                {alreadyReplay ? "已回复" : "回复"}
              </button>
            )}
            {ScoreJson && ScoreJson.length && (
              <button
                class={alreadyEvaluation ? "disabled" : ""}
                onClick={() => {
                  // onEvaluation(data);
                  this.$emit("evaluation", data);
                }}
              >
                {alreadyEvaluation ? "已评价" : "评价"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
};
</script>
<style lang="scss" scoped>
.message-card {
  margin-bottom: 0.15rem;
  padding: 0.16rem;
  box-shadow: 0px 2px 6px 0px rgba(139, 156, 164, 0.17);
  border-radius: 0.1rem;
  background: #fff;

  .top {
    margin-bottom: 0.18rem;
  }

  .portrait {
    margin-right: 0.06rem;
    width: 0.49rem;
    height: 0.49rem;
    border-radius: 50%;
  }

  .user-name {
    font-size: 0.16rem;
    color: #333333;
    font-weight: 600;
    /* color: $color2; */
  }

  .classify {
    margin-left: 0.04rem;
    height: 0.18rem;
    line-height: 0.18rem;
    padding: 0 0.08rem;
    font-size: 0.11rem;
    border-radius: 3px;

    &.patient {
      background: #fff4ed;
      color: #ff944a;
    }

    &.doctor {
      background: #e7f9f5;
      color: #0dc6a1;
    }

    &.customer-service {
      background: rgba($color: #4C87F9, $alpha: 0.1);
      color: #4C87F9;
    }
  }

  .label {
    margin: 0;
    /* margin-top: 0.07rem; */
    font-size: 0.14rem;
    color: #b1b4b9;
    /* color: $color7; */
  }

  .message {
    font-size: 0.14rem;
    color: #666666;
    /* color: $color2; */
  }

  .img-list {
    margin-top: 0.1rem;
    flex-wrap: wrap;
    .img {
      margin-right: 0.1rem;
      margin-bottom: 0.1rem;
      width: .61rem;
      height: 0.61rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .btn-group {
    margin-top: 0.1rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    button {
      margin: 0;
      margin-left: 0.14rem;
      height: 0.3rem;
      line-height: 0.3rem;
      padding: 0 0.22rem;
      font-size: 0.12rem;
      color: #fff;
      background: #6dc7c6;
      border-radius: 0.15rem;
    }

    .disabled {
      background: #cdcdcd;
      color: #fff;
    }
  }
}
</style>
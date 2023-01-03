<template>
  <div class="hospital-card" @click="click">
    <div class="flex-row">
      <CoverImage class="img" :url="data.gImg">
        <!-- <div class="badge align" :style="badgeStyle">
          {{ data.Country }}
        </div> -->
      </CoverImage>
      <div class="info flex-column main-between">
        <div>
          <p class="name ellipsis">{{ data.gName }}</p>
          <div class="flex-row main-between center">
            <van-rate
              :value="data.pjScore"
              :size="9"
              color="rgba(0, 188, 197, 0.8)"
              void-icon="star"
              void-color="rgba(0, 188, 197, 0.3);"
            />
            <span class="score">{{data.pjScore}}分</span>
            <span class="line"></span>
            <span class="yy">{{ data.SalesNum }}人次预约</span>
          </div>
          <ScrollView>
            <ul class="tag-list-1 flex-row center">
              <li class="tag" v-for="tag in tagList" :key="tag">{{ tag }}</li>
            </ul>
          </ScrollView>
        </div>
        <div class="bottom flex-row main-between center">
          <p class="addr">深圳·宝安区</p>
          <p class="distance">15.2km</p>
          <!-- <button class="buy align">购买</button> -->
        </div>
      </div>
    </div>
    <ScrollView v-if="typeList.length">
      <div class="type-list flex-row">
        <div
          class="type-item flex-column"
          v-for="item in typeList"
          :key="item.itemid"
        >
          <CoverImage class="type-cover" :url="data.gImg" />
          <p class="name">{{ item.itemName }}</p>
          <p class="price">
            <span class="unit">￥</span>
            <span class="value">{{ item.itemPrice }}</span>
          </p>
        </div>
      </div>
    </ScrollView>
  </div>
</template>
<script>
export default {
  name: "hospital-card",
};
</script>
<script>
import TagList from "@/components/TagList";
import ScrollView from "@/components/ScrollView";
import { icons } from "@/assets";
import { getTagList } from "@/utils";

export default {
  name: "hospital-card",
  props: ["data"],
  computed: {
    isRed() {
      return parseInt(this.data.SuccessRate) > 90;
    },
    badgeStyle() {
      if (this.isRed) {
        return {
          background: `url(${icons.nation2}) no-repeat center center / 100% 100%`,
        };
      }
      return {
        background: `url(${icons.nation1}) no-repeat center center / 100% 100%`,
      };
    },
    tagList() {
      return getTagList({ text: this.data.Tag, max: 3 });
    },
    typeList() {
      return this.data.bonusitem || [];
    },
  },
  methods: {
    buy() {
      this.$emit("buy");
    },
    click() {
      this.$emit("click");
    },
  },
  components: {
    TagList,
    ScrollView,
  },
};
</script>
<style lang="scss">
.hospital-card {
  padding: 0.12rem 0;
  /* border-bottom: 1px solid #eeeeee; */
  .img {
    position: relative;
    margin-right: 0.08rem;
    width: 0.96rem;
    height: 0.8rem;
    border-radius: 0.08rem;
    .badge {
      position: absolute;
      top: 0;
      right: 0;
      width: 0.5rem;
      height: 0.2rem;
      font-size: 0.12rem;
      color: #fff;
    }
  }
  .info {
    width: 0;
    flex: 1;
    .name {
      margin-bottom: 0.04rem;
      font-size: 0.1rem;
      color: rgb(0, 0, 0);
    }
    .subtitle {
      font-size: 0.12rem;
      font-weight: 400;
      color: #999999;
    }
    .score {
      font-size: 0.1rem;
      color: rgb(153, 153, 153);
    }
    .split {
      height: 0.2rem;
      background: rgb(153, 153, 153);
    }
    .tag-list-1 {
      margin-top: 0.04rem;
      .tag {
        margin-right: 0.1rem;
        height: 0.19rem;
        line-height: .19rem;
        padding: 0 0.1rem;
        font-size: 0.1rem;
        color: #fff;
        background: rgb(255, 166, 56);
        box-shadow: 0px 0px 20px rgba(30, 36, 58, 0.04);
        border-radius: 0.04rem;
      }
    }
    .yy {
      font-size: 0.12rem;
      font-weight: 400;
      color: #777a78;
    }
    .bottom {
      .addr {
        font-size: 0.1rem;
        color: rgb(106, 106, 106);
      }
      .distance {
        font-size: 0.1rem;
        color: rgb(106, 106, 106);
      }
    }
  }
  .type-list {
    margin-top: 0.08rem;
    /* flex-wrap: wrap; */
    .type-item {
      margin-right: 0.05rem;
      border-radius: 0.08rem;
      .type-cover {
        width: 0.86rem;
        height: 0.54rem;
        border-radius: 0.05rem;
      }
      .name {
        margin: 0.05rem 0;
        font-size: 0.1rem;
        color: rgb(0, 0, 0);
      }
      .price {
        font-size: 0.1rem;
        color: rgb(244, 72, 72);
      }
    }
  }
}
</style>
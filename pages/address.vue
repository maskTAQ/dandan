<template>
  <Page title="地址管理">
    <div class="address-list flex-column align page-full">
      <List
        :request="request"
        :pageSize="20"
        :renderItem="renderItem"
        :hint="{ loaded: false }"
        disabledLoadmore
        class="list"
        ref="list"
        @change="(e) => (list = e)"
      >
        <div class="nodata flex-column align" slot="nodata">
          <van-empty :image="img.nodata" description="暂无收货地址" />
          <button class="add" @click="add">添加地址</button>
        </div>
      </List>
      <button v-if="list.length" class="add fixed" @click="add">
        添加地址
      </button>
    </div>
  </Page>
</template>
<script>
import { get } from "@/api/http";
import { icons, img } from "@/assets";
import { router } from "@/utils";

const API = {
  LIST(params) {
    return get("/Api/getMailList_api.php", params);
  },
};
export default {
  name: "address",
  head() {
    return {
      title: "地址管理",
    };
  },
  data() {
    return {
      img,
      list: [],
    };
  },
  computed: {
    fromOrder() {
      return this.$route.query.from === "order";
    },
  },
  activated() {
    this.refresh();
  },
  methods: {
    refresh() {
      if (this.$refs.list) {
        this.$refs.list.refresh();
      }
    },
    request(params) {
      if (!process.browser) {
        return Promise.reject("请在浏览器打开");
      }
      return API.LIST().then((res) => {
        //更新列表时同步更新store
        this.$store.commit({
          type: "update",
          field: "addressList",
          payload: {
            status: "success",
            loading: false,
            data: res,
          },
        });
        return res;
      });
    },
    renderItem(item) {
      const { aid, mailPeople, mailTel, mailAdd } = item;
      return (
        <div
          onClick={() => {
            if (this.fromOrder) {
              this.$store.commit("select", { key: "address", value: item });
              router.back();
            } else {
              router.push({
                path: "/address-operation",
                query: {
                  id: aid,
                },
              });
            }
          }}
          key={aid}
          class="item flex-row main-between center"
        >
          <div class="left">
            <div class="flex-row center">
              <i class="name">{mailPeople}</i>
              <i class="mobile">{mailTel}</i>
            </div>
            <p class="address">{mailAdd}</p>
          </div>
          <img class="edit" src={this.fromOrder ? icons.right : icons.edit} />
        </div>
      );
    },
    add() {
      router.push({
        path: "/address-operation",
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.address-list {
  background: #fff;
  .list {
    width: 100%;
    height: 100%;
  }
  .item {
    height: 0.84rem;
    padding: 0 0.13rem;
    border-bottom: 1px solid $border;
    .name,
    .mobile {
      font-size: 0.14rem;
      color: #464646;
    }
    .name {
      margin-right: 0.4rem;
    }
    .address {
      margin-top: 0.1rem;
      font-size: 0.14rem;
      color: #767676;
    }
    .edit {
      width: 0.15rem;
    }
  }
  .nodata {
    .van-empty {
      img {
        height: auto;
      }
    }
  }
  .add {
    height: 0.36rem;
    padding: 0 0.3rem;
    font-size: 0.15rem;
    color: #fff;
    background: $color1;
    border-radius: 0.18rem;
    &.fixed {
      position: fixed;
      bottom: 0.55rem;
    }
  }
}
</style>
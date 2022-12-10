<template>
  <Page title="发票管理">
    <div class="invoice-list flex-column align page-full">
      <List
        :request="request"
        :pageSize="20"
        :renderItem="renderItem"
        disabledLoadmore
        :hint="{ loaded: false }"
        class="list"
        ref="list"
        @change="(e) => (list = e)"
      >
        <div class="nodata flex-column align" slot="nodata">
          <van-empty :image="img.noinvoice" description="暂无发票" />
          <button class="add" @click="add">添加发票</button>
        </div>
      </List>
      <button v-if="list.length" class="add fixed" @click="add">
        添加发票
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
    return get("/Api/getInvList_api.php", params);
  },
};
export default {
  name: "invoice",
  head() {
    return {
      title: "发票管理",
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
          field: "invoiceList",
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
      const {
        iid,
        invName = "invName",
        invType = "invType",
        invAddress = "invAddress",
        invBankNo = "invBankNo",
      } = item;
      return (
        <div
          onClick={() => {
            if (this.fromOrder) {
              this.$store.commit("select", { key: "invoice", value: item });
              router.back();
            } else {
              router.push({
                path: "/invoice-operation",
                query: {
                  id: iid,
                },
              });
            }
          }}
          key={iid}
          class="item flex-row main-between center"
        >
          <div class="left">
            <p class="title">
              {invName}-{invType === "1" ? "个人" : "企业"}
            </p>
            <p class="name">{invAddress}</p>
            <p class="mobile">{invBankNo}</p>
          </div>
          <img class="edit" src={this.fromOrder ? icons.right : icons.edit} />
        </div>
      );
    },
    add() {
      router.push({
        path: "/invoice-operation",
      });
    },
  },
};
</script>
<style lang="scss">
@import "../assets/theme.scss";
.invoice-list {
  background: #fff;
  .list {
    width: 100%;
    height: 100%;
  }
  .item {
    height: 0.98rem;
    padding: 0 0.12rem;
    border-bottom: 1px solid $border;
    .title {
      font-size: 0.14rem;
      color: #464646;
      font-weight: bold;
    }
    .name {
      margin-top: 0.14rem;
      font-size: 0.14rem;
      color: #767676;
    }
    .mobile {
      font-size: 0.14rem;
      color: #767676;
    }
    .edit {
      width: 0.14rem;
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
    padding: 0 0.4rem;
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
<template>
  <Page title="好孕笔记">
    <StatusHandle :get="getData">
      <div class="publish-note page-full">
        <div class="field">
          <p class="label">内容标题</p>
          <van-field
            v-model="title"
            rows="1"
            autosize
            type="textarea"
            class="title-textarea"
            placeholder="请填写内容标题"
            maxlength="50"
          />
        </div>
        <div class="field">
          <p class="label">{{ uploadHint }}</p>
          <van-uploader
            class="uploader"
            v-model="fileList"
            :after-read="afterRead"
            :accept="accept"
          >
            <div slot="default" class="upload-hint flex-column align">
              <img :src="icons.photo" alt="" class="icon" />
            </div>
          </van-uploader>
        </div>
        <div class="field">
          <p class="label">内容正文</p>
          <van-field
            v-model="content"
            rows="4"
            autosize
            type="textarea"
            class="content-textarea"
            placeholder="请输入正文..."
          />
        </div>
        <div class="field">
          <p class="label">请输入标签</p>
          <StatusHandle :get="getTagList">
            <div class="tag-list flex-row">
              <div
                :class="['tag', { selected: selectedTags.includes(tag) }]"
                v-for="tag in tags"
                :key="tag"
                @click="select(tag)"
              >
                #{{ tag }}
              </div>
            </div>
          </StatusHandle>
        </div>
        <!-- <div v-if="showToggle" class="field">
          <p class="label">显示</p>
          <van-switch v-model="visible" />
        </div> -->

        <div class="btn-box align">
          <van-button :loading="loading" @click="submit" class="publish"
            >发 布</van-button
          >
        </div>
      </div>
    </StatusHandle>
  </Page>
</template>
<script>
import { mapState } from "vuex";

import { router, UID, LoadingControl, Tip } from "@/utils";
import { icons } from "@/assets";

import { get, post } from "@/api/http";
//sendInquiry_api
const API = {
  DETAIL(params) {
    return get("/Api/getForumInfo_api.php", params, { showError: false });
  },
  UPLOAD_FILE(params) {
    return post("/Api/uploadImg_api.php", params);
  },
  TAG_LIST() {
    return get("/Api/getBaikeTypeList_api.php");
  },
  SUBMIT(params) {
    return post("/Api/saveForum_api.php", params, { json: false });
  },
};
const TYPE = {
  disease: "病症询问",
  medication: "用药询问",
};
export default {
  name: "publish-note",
  head() {
    return {
      title: "",
    };
  },
  data() {
    return {
      icons,
      fileList: [],
      title: "",
      content: "",
      selectedTags: [],
      tags: [],
      loading: false,
      visible: true,
      data: {},
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    type() {
      const type = +this.$route.query.type === 1 ? "笔记" : "文章";
      if (process.browser) {
        document.title = `发布${type}`;
      }
      return type;
    },
    showToggle() {
      return [1, -2].includes(+this.data.isShow);
    },
    uploadHint() {
      return this.type === "文章" ? "内容主图" : "封面图片/视频";
    },
    accept() {
      return this.type === "文章" ? "image/*" : "image/*,video/*";
    },
  },
  methods: {
    getData() {
      if (!this.$route.query.id) {
        return Promise.resolve();
      }
      return API.DETAIL({ fid: this.$route.query.id }).then((res) => {
        const { title, content, isShow, fileUrl, Tag } = res;
        this.data = res;
        this.title = title;
        this.content = content;
        this.selectedTags = Tag;
        this.visible = isShow == 1;
        this.fileList = fileUrl.map((source) => {
          return {
            status: "done",
            source,
            url: source,
          };
        });
      });
    },
    getTagList() {
      return API.TAG_LIST().then((res) => {
        this.tags = res.map((item) => item.TypeName);
      });
    },
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      const form = new FormData(); // FormData 对象
      form.append("file", file.file); // 文件对象
      form.append("uid", UID.GET());

      API.UPLOAD_FILE(form)
        .then((res) => {
          file.status = "done";
          file.message = "上传成功";
          file.source = res.src;
          // this.fileList.push({
          //   url:res.url,
          //   status:'success'
          // })
          return res;
        })
        .catch((e) => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    select(tag) {
      // const next = [...this.selectedTags];
      // const index = next.indexOf(tag);
      // if (index > -1) {
      //   next.splice(index, 1);
      // } else {
      //   next.push(tag);
      // }
      // this.selectedTags = next;
      this.selectedTags = [tag];
    },
    back() {
      router.back();
    },
    submit() {
      const { title, content, fileList, selectedTags, showToggle, visible } =
        this;
      console.log(fileList, "fileList");
      if (!title) {
        return Tip.error("请填写标题");
      }
      if (!content) {
        return Tip.error("请填写内容");
      }
      if (!selectedTags.length) {
        return Tip.error("请填选择分类");
      }
      const params = {
        // theType: type,
        fid: this.id,
        title,
        content,
        fileUrl: fileList
          .filter((file) => file.status === "done")
          .map((item) => item.source),
        Tag: selectedTags,
        flag: 2,
      };
      // if (showToggle) {
      //   params.isShow = visible ? 1 : -2;
      // }
      LoadingControl({
        call: API.SUBMIT,
        params,
        change: ({ loading }) => {
          this.loading = loading;
        },
      }).then((res) => {
        Tip.success("发布成功,等待审核通过后展示!");
        setTimeout(() => {
          router.back();
        });
      });
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/theme.scss";

.publish-note {
  background: #f3f5f9;
  .field {
    margin-top: 0.1rem;
    padding: 0.19rem 0.22rem;
    background: #fff;
    .label {
      margin-bottom: 0.1rem;
      font-size: 0.16rem;
      font-weight: 500;
      color: #000000;
    }
  }

  .van-field {
    padding: 0;
  }
  .van-field::after {
    display: none;
  }
  .title-textarea {
    /* margin-top: 0.13rem; */
    /* padding: 0.12rem 0; */
    /* border-bottom: 1px solid #bbbbbb; */
    textarea {
      font-size: 0.14rem;
      color: #101010;
      &::placeholder {
        color: #d7d7d7;
      }
    }
  }
  .content-textarea {
    /* margin-top: 0.13rem;
    padding: 0.12rem 0;
    border-bottom: 1px solid #bbbbbb; */
  }
  .van-image,
  .upload-hint {
    width: 0.99rem;
    height: 0.99rem;
  }
  .upload-hint {
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .tag-list {
    flex-wrap: wrap;
    padding-top: 0.1rem;
    .tag {
      margin-right: 0.05rem;
      margin-bottom: 0.1rem;
      height: 0.16rem;
      line-height: 0.16rem;
      padding: 0 0.06rem;
      font-size: 0.1rem;
      color: #ccc;
      border-radius: 0.11rem;
      &.selected {
        color: #46a9b4;
        background: #def9fb;
      }
    }
  }
  .btn-box {
    margin-top: 1.21rem;
    margin-bottom: 0.5rem;
    .publish {
      width: 2.85rem;
      height: 0.49rem;
      font-size: 0.16rem;
      font-weight: 600;
      color: #ffffff;
      background: #4d6eff;
      border-radius: 0.26rem;
    }
  }
}
</style>
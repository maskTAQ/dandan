<template>
    <div class="hw-list">
        <div class="">
            <CoverImage :url="img.chatHead" class="exPhoto" />
            <div class="info">
                <p class="title ellipsis">名称名称名称名称名称名称名称名称名称</p>
                <div class="flex-row center main-between">
                    <span class="type">0元（免费预约）</span>
                    <span class="fw">服务645次</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { icons, img } from "@/assets";
import CoverImage from "@/components/CoverImage.vue"
export default {
    name: "PartnerAgencies",
    components: {
        CoverImage
    },
    data() {
        return {
            icons,
            img
        }
    }
}
</script>
<style lang="scss">
.hw-list {
    .info {
        line-height: 22px;
        padding: 0.1rem;
    }

    .exPhoto {
        height: 1.34rem;
        width: 100%;
        border-radius: 0.15rem;
        // background-size: contain;
        // background-size: 100% 100%;
    }

    .title {
        font-size: 0.14rem;
        font-weight: 500;
        // padding: 0.05rem 0rem;
    }

    .type {
        color: rgb(241, 85, 32);
        font-size: 0.12rem;
        font-weight: 400;
    }

    .fw {
        color: rgb(153, 153, 153);
        font-size: 0.10rem;
    }
}
</style>
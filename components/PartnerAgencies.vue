<template>
    <div class="partner-agencies-wrap flex-row main-between">
        <div class="hw-jg">
            <div class="head">
                <CoverImage :url="img.hw" class="tab-img" />
            </div>
            <CardInfo1></CardInfo1>
        </div>
        <div class="hw-jg">
            <div class="head">
                <CoverImage :url="img.gn" class="tab-img" />
            </div>
            <CardInfo1></CardInfo1>
        </div>
    </div>
</template>
<style lang="scss">
.partner-agencies-wrap {
    padding: 0.12rem;
    background: #fff;
    .hw-jg {
        width: 48%;

        .head {
            margin-bottom: 0.1rem;
            .tab-img {
                height: 0.88rem;
                width: 100%;
                background-size: 100% 100%;
            }
        }

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
    }
}
</style>
<script>
import { icons, img } from "@/assets";
import CoverImage from "@/components/CoverImage.vue"
import CardInfo1 from "@/components/CardInfo1.vue"

export default {
    name: "PartnerAgencies",
    components: {
        CoverImage,
        CardInfo1
    },
    data() {
        return {
            icons,
            img
        }
    }
}
</script>
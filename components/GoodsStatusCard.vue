<template>
    <div class="goods-status-card-wrap">
        <div class="goods-box">
            <div class="goods-head">
                <div class="flex-row main-between">
                    <span>订单号：{{data.orderNo}}</span>
                    <span class="flex-row center">
                        <span class="circular"></span>进行中</span>
                </div>
                <div><img :src="icons.like1" class="time-icon" alt="" />2022/22/33
                    <img :src="icons.like1" class="time-icon" alt="" />10:90:11
                </div>
            </div>
            <div class="goods-content">
                <div class="goods-info flex-row  center">
                    <div class="cover">
                        <img :src="data.gImg" alt="">
                    </div>
                    <div class="info">
                        <div class="title">{{data.goodsName}}</div>
                        <div class="type">{{data.bName}}</div>
                        <div class="money" v-if="goodsType === 'yhj'">
                            <span class="type">优惠</span>
                            <span class="sizey">¥90</span>
                            <span class="type">总计</span>
                            <span class="sizez">¥190</span>
                        </div>
                        <div class="money" v-if="goodsType === 'jf'">
                            <span class="type">总计</span>
                            <span class="sizez">¥90+</span>
                            <span class="type">积分</span>
                            <span class="sizez">90</span>
                        </div>
                    </div>
                </div>
                <div class="price-details">
                    <p class="label">价格明细</p>
                    <div v-for="(item,index) in 4" :key="item" class="list">
                        <div class="flex-row main-between center">
                            <div class="title">第一笔名称</div>
                            <div class="price">¥90</div>
                        </div>
                        <div class="flex-row main-between center">
                            <div class="remarks">付款描述</div>
                            <div class="sta-n" v-if="index ==1">待支付<img :src="icons.right" class="icon" alt="" /></div>
                            <div class="sta-y" v-else>已支付<img :src="icons.right" class="icon" alt="" /></div>
                        </div>
                    </div>
                </div>
                <div class="submit">
                    <div class="tj-btn" v-show="false">支付</div>
                    <div class="flex-row main-between center">
                        <div class="qx-btn">取消</div>
                        <div class="zf-btn">支付</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { icons } from "@/assets";
export default {
    name: "GoodsStatusCard",
    props: ["goodsType",'data'],
    data() {
        return {
            icons,
        };
    },
}
</script>
<style lang="scss" scoped>
.goods-status-card-wrap {
    padding: 0.17rem;
    background: #fff;

    .icon {
        height: 0.08rem;
        width: 0.08rem;
        margin-left: 5px;
    }

    .goods-box {
        border: 1px solid rgb(232, 243, 241);
        border-radius: 8px;
        overflow: hidden;

        .goods-head {
            height: 0.68rem;
            background: rgb(0, 188, 197);
            color: #fff;
            padding: 0.1rem;
            line-height: 24px;
            margin-bottom: 0.10rem;
            font-size: 0.14rem;

            .circular {
                height: 5px;
                display: inline-flex;
                width: 5px;
                border-radius: 50px;
                background: #fff;
                margin-right: 5px;
            }

            .time-icon {
                height: 10px;
                width: 10px;
                margin-right: 3px;
            }
        }


        .goods-content {
            padding: 0.07rem;
            padding-bottom: 0.22rem;
            .goods-info {

                .cover {
                    height: 1.22rem;
                    width: 1.22rem;
                    background: rebeccapurple;
                    img{
                        width: 100%;
                    }
                }

                .info {
                    line-height: 0.32rem;
                    padding-left: 0.16rem;
                    flex: 1;

                    .title {
                        /* OBH Combi */
                        color: rgb(16, 22, 35);
                        font-family: Inter;
                        font-size: 0.18rem;
                        font-weight: 600;
                        text-align: left;


                    }

                    .type {

                        color: rgb(173, 173, 173);
                        font-family: Inter;
                        font-size: 0.12rem;
                        font-weight: 500;
                        text-align: left;


                    }

                    .money {
                        text-align: right;

                        .sizey {
                            font-size: 0.14rem;
                            color: rgb(85, 85, 85);
                            font-weight: 600;
                        }

                        .sizez {
                            font-size: 0.22rem;
                            font-weight: 600;
                        }
                    }

                }
            }

            .price-details {
                .label {
                    margin-top: 0.10rem;
                    font-size: 0.16rem;
                    padding-bottom: 0.17rem;
                }

                .list {
                    margin-bottom: 10px;
                    // margin: 0.11rem 0px;
                    line-height: 0.25rem;

                    .title {
                        font-size: 0.16rem;
                    }

                    .price {
                        font-size: 0.16rem;
                        padding-right: 0.13rem;
                    }

                    .remarks {
                        font-size: 0.12rem;
                        color: #989898;
                    }

                    .sta-n {
                        color: #989898;
                        font-size: 0.13rem;
                    }

                    .sta-y {
                        color: #6cb1a9;
                        font-size: 0.13rem;
                    }
                }

            }

            .submit {
                font-size: 0.13rem;
                .tj-btn {
                    background: #55b9c3;
                    color: #fff;
                    text-align: center;
                    line-height: 0.43rem;
                    border-radius: 0.10rem;
                }

                .qx-btn {
                    background: #eaf3f1;
                    // color: #fff;
                    text-align: center;
                    line-height: 0.43rem;
                    border-radius: 0.10rem;
                    width: 48%;
                }

                .zf-btn {
                    background: #55b9c3;
                    color: #fff;
                    text-align: center;
                    line-height: 0.43rem;
                    border-radius: 0.10rem;
                    width: 48%;
                }
            }
        }
    }
}

/* Rectangle 48 */
</style>
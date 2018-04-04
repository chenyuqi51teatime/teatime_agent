<template>
    <div class="home_aside">
        <!--  管理员  -->
        <ul class="asideContainer" v-if='this.currole == 1'>
            <!-- 首页 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon9.jpeg" alt=""></span>首页
                </div>
            </li>
            <!-- 商品管理 -->
            <li>
                <div class="title">
                    <span class="tit_img" style="width: 18px; left: 26px;"><img src="../assets/icon5.jpg" alt=""></span>商品管理
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/ProductsList' class="routerLinkActive" v-if='location[$route.name] == "商品列表"'>商品列表</router-link>
                        <router-link to='/container/ProductsList' v-if='location[$route.name] != "商品列表"'>商品列表</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/BrandList' class="routerLinkActive" v-if='location[$route.name] == "品牌管理"'>品牌管理</router-link>
                        <router-link to='/container/BrandList' v-if='location[$route.name] != "品牌管理"'>品牌管理</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/ClassificationList' class="routerLinkActive" v-if='location[$route.name] == "分类管理"'>分类管理</router-link>
                        <router-link to='/container/ClassificationList' v-if='location[$route.name] != "分类管理"'>分类管理</router-link>
                    </li>
                </ul>
            </li>
            <!-- 设备管理 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon2.jpg" alt=""></span>设备管理
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/AdminDeviceList' class="routerLinkActive" v-if='location[$route.name] == "设备列表"'>设备列表</router-link>
                        <router-link to='/container/AdminDeviceList' v-if='location[$route.name] != "设备列表"'>设备列表</router-link>
                    </li>
                </ul>
            </li>
            <!-- 订单 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon3.png" alt=""></span>订单
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/saleOrders' @click="active" class="routerLinkActive" v-if='location[$route.name] == "销售订单"'>销售订单</router-link>
                        <router-link to='/container/saleOrders' @click="active" v-if='location[$route.name] != "销售订单"'>销售订单</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/replenishment' @click="active" class="routerLinkActive" v-if='location[$route.name] == "补货订单"'>补货订单</router-link>
                        <router-link to='/container/replenishment' @click="active" v-if='location[$route.name] != "补货订单"'>补货订单</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/DetailsOrder' @click="active" class="routerLinkActive" v-if='location[$route.name] == "审核订单"'>审核订单</router-link>
                        <router-link to='/container/DetailsOrder' @click="active" v-if='location[$route.name] != "审核订单"'>审核订单</router-link>
                    </li>
                </ul>
            </li>
            <!-- 用户中心 -->
            <li>
                <router-link class="title" to='/container/addminList'><span class="tit_img user_tit"><img src="../assets/icon4.jpg" alt=""></span>用户中心</router-link>
            </li>
        </ul>

        <!--  代理商  -->
        <ul class="asideContainer" v-if='this.currole == 3'>
            <li @click='active()'>
                <router-link class="title" to='/container/home'><span class="tit_img user_tit"><img src="../assets/icon9.jpeg" alt=""></span>首页</router-link>
            </li>
            <!-- 货柜管理 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon6.jpg" alt=""></span>货柜管理
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/ContainerBinding' class="routerLinkActive" v-if='location[$route.name] == "货柜绑定"'>货柜绑定</router-link>
                        <router-link to='/container/ContainerBinding' v-if='location[$route.name] != "货柜绑定"'>货柜绑定</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/GoodsTemplate' class="routerLinkActive" v-if='location[$route.name] == "商品模板"'>商品模板</router-link>
                        <router-link to='/container/GoodsTemplate' v-if='location[$route.name] != "商品模板"'>商品模板</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/ContainerGoods' class="routerLinkActive" v-if='location[$route.name] == "货柜商品"'>货柜商品</router-link>
                        <router-link to='/container/ContainerGoods' v-if='location[$route.name] != "货柜商品"'>货柜商品</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/InventoryStatus' class="routerLinkActive" v-if='location[$route.name] == "库存状况"'>库存状况</router-link>
                        <router-link to='/container/InventoryStatus' v-if='location[$route.name] != "库存状况"'>库存状况</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/ReplenishmentRules' class="routerLinkActive" v-if='location[$route.name] == "补货规则"'>补货规则</router-link>
                        <router-link to='/container/ReplenishmentRules' v-if='location[$route.name] != "补货规则"'>补货规则</router-link>
                    </li>
                </ul>
            </li>
            <!-- 补货管理 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon2.jpg" alt=""></span>补货管理
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/repMentOrdManagement' class="routerLinkActive" v-if='location[$route.name] == "补货单管理"'>补货单管理</router-link>
                        <router-link to='/container/repMentOrdManagement' v-if='location[$route.name] != "补货单管理"'>补货单管理</router-link>
                    </li>
                </ul>
            </li>
            <!-- 营业收入 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon3.png" alt=""></span>营业收入
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/BusinessSum' class="routerLinkActive" v-if='location[$route.name] == "营业汇总报表"'>营业汇总报表</router-link>
                        <router-link to='/container/BusinessSum' v-if='location[$route.name] != "营业汇总报表"'>营业汇总报表</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/PaymentType' class="routerLinkActive" v-if='location[$route.name] == "付款类型统计"'>付款类型统计</router-link>
                        <router-link to='/container/PaymentType' v-if='location[$route.name] != "付款类型统计"'>付款类型统计</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/OrderStatistics' class="routerLinkActive" v-if='location[$route.name] == "订单统计报表"'>订单统计报表</router-link>
                        <router-link to='/container/OrderStatistics' v-if='location[$route.name] != "订单统计报表"'>订单统计报表</router-link>
                    </li>
                </ul>
            </li>
            <!-- 商品销售 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon7.jpg" alt=""></span>商品销售
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/CommoditySales' class="routerLinkActive" v-if='location[$route.name] == "商品销售汇总"'>商品销售汇总</router-link>
                        <router-link to='/container/CommoditySales' v-if='location[$route.name] != "商品销售汇总"'>商品销售汇总</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/GoodsClassification' class="routerLinkActive" v-if='location[$route.name] == "商品分类统计"'>商品分类统计</router-link>
                        <router-link to='/container/GoodsClassification' v-if='location[$route.name] != "商品分类统计"'>商品分类统计</router-link>
                    </li>
                    <li @click='active()'>
                        <router-link to='/container/MerSalesRanking' class="routerLinkActive" v-if='location[$route.name] == "商品销售排行"'>商品销售排行</router-link>
                        <router-link to='/container/MerSalesRanking' v-if='location[$route.name] != "商品销售排行"'>商品销售排行</router-link>
                    </li>
                </ul>
            </li>
            <!-- 会员统计 -->
            <!-- <li>
                <span class="title">
                    <span class="tit_img"><img src="../assets/icon8.jpg" alt=""></span>会员统计
                </span>
                <ul class="asideContainer_list">
                    <li>
                        <router-link to='/container/MemberStatistics' v-if='location[$route.name] != "会员统计表"'>会员统计表</router-link>
                    </li>
                    <li>
                        <router-link to='/container/statement' class="routerLinkActive" v-if='location[$route.name] == "充值消费明细"'>充值消费明细</router-link>
                        <router-link to='/container/statement' v-if='location[$route.name] != "充值消费明细"'>充值消费明细</router-link>
                    </li>
                </ul>
            </li> -->
            <!-- 用户中心 -->
            <li>
                <div class="title">
                    <span class="tit_img"><img src="../assets/icon4.jpg" alt=""></span>用户中心
                </div>
                <ul class="asideContainer_list">
                    <li @click='active()'>
                        <router-link to='/container/distributionList' class="routerLinkActive" v-if='location[$route.name] == "补货员管理"'>补货员管理</router-link>
                        <router-link to='/container/distributionList' v-if='location[$route.name] != "补货员管理"'>补货员管理</router-link>
                    </li>
                    
                </ul>
            </li>
        </ul>

    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import RouterName from '../RouterName.js'

    export default {
        name: 'home',
        data() {
            return {
                currole: 1,
                location: RouterName
            }
        },
        computed: {
            ...mapState(['acIndex', 'pageNo', 'isFirstEnter', 'isOrderFirst', 'isRepFirst'])
        },
        methods: {
            ...mapActions(['changepageNo', 'changeacIndex', 'changeEnter', 'changeOenter', 'changeRenter']),
            active() {
                this.$store.dispatch('changeEnter', true)
                this.$store.dispatch('changeOenter', true)
                this.$store.dispatch('changeRenter', true)
                this.$store.dispatch('changeacIndex', '1')
                this.$store.dispatch('changepageNo', 1)
                localStorage.removeItem('skulistStr')
                localStorage.removeItem('skulistStr1')
                localStorage.removeItem('templateStr')
                // console.log(this.$store.state.keepAlive = 1)
            }
        },
        created() {
            // 根据登陆者角色判断显示用户中心      暂时隐藏   1.管理员   3.代理商
            this.currole = localStorage.getItem('teauserStatus');
        }
    }

</script>
<style scoped>
    /* .router-link-active{
        color: #f5d978;
    } */

    .routerLinkActive {
        color: #f7ba2a;
        font-size: 16px;
        font-weight: 600;
    }

    .home_aside {
        width: 100%;
        text-align: left;
    }

    .asideContainer {
        box-sizing: border-box;
        /* padding-left: 60px; */
        width: 100%;
        /* height: 100%; */
        /* border: 1px solid red; */
        line-height: 50px;
    }

    .asideContainer>li {
        margin-bottom: 18px;
        position: relative;
        /* background: red; */
    }

    .asideContainer a {
        padding-left: 60px;
        display: block;
    }

    .asideContainer a:hover {
        background: #eee;
    }

    .asideContainer>li::before {
        content: " ";
        position: absolute;
        bottom: -10px;
        left: 60px;
        width: 60%;
        border-top: 1px solid #E4E8EB;
    }

    .asideContainer_list {
        box-sizing: border-box;
        /* padding-left: 20px; */
        width: 100%;
        height: 100%;
        /* border: 1px solid blue; */
        line-height: 36px;
        font-size: 14px;
        color: #000;
    }

    .title {
        box-sizing: border-box;
        padding-left: 60px;
        font-size: 18px;
        color: #000;
        position: relative;
        /* border: 1px solid purple; */
        position: relative;
    }

    .tit_img {
        /* border: 1px solid red; */
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 24px;
        margin: auto 0;
        display: inline-block;
        width: 20px;
        height: 20px;
    }

    .tit_img>img {
        width: 100%;
        vertical-align: top;
        -webkit-vertical-align: top;
    }

</style>
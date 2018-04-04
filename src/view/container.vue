<template>
    <div id="container">
        <div id="home">
            <div class="home-header">
                <home-header></home-header>
            </div>

            <div id="product-list">

                <div class="con">
                    <home-aside></home-aside>
                </div>

                <div class="rou">
                    <div id="breadcrumb">
                        <p>{{location[$route.name]}}</p>
                        <!-- <p>{{$route.name}}</p>  -->
                    </div>
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import homeHeader from '../components/homeHeader'
    import homeAside from '../components/homeAside'
    import RouterName from '../RouterName.js'

    export default {
        name: 'home',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                location: RouterName
            }
        },
        components: {
            homeHeader,
            homeAside
        },
    }

</script>

<style scoped>
    #product-list {
        /*width: 100%;*/
        margin: 0 auto;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        height: 100%;
        position: relative;
    }

    .home-header {
        width: 100%;
        height: 80px;
        position: absolute;
        top: 0;
        left: 0;
        /* background: red; */
        /* box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5); */
    }

    .rou {
        /*width: 100%;*/
        /*height:100%;*/
        background-color: #F6F8F9;
        float: right;
        padding: 20px;
        position: absolute;
        top: 100px;
        left: 160px;
        right: 20px;
    }

    .con {
        /* overflow: auto; */
        width: 160px;
        /* height: 100%; */
        /* background-color: #333; */
        position: absolute;
        top: 100px;
        bottom: 0;
        left: 0;
        z-index: 1000;
        padding-bottom: 400px;
        /* background: blue; */
    }

    #breadcrumb {
        width: 100%;
        height: 40px;
        /* padding-bottom: 20px; */
        font-size: 18px;
        /* background: red; */
    }

    #breadcrumb p {
        margin-top: 0;
        float: left;
        margin-bottom: 0;
    }

    #split-line {
        width: 100%;
        height: 2px;
        float: left;
        background-color: #999999
    }

    .el-table .caret-wrapper {
        width: 22px;
    }

    .el-table .sort-caret.ascending {
        top: 5px!important;
        border-top: none!important;
        border-right: 8px solid transparent!important;
        border-bottom: 8px solid rgb(190, 190, 151)!important;
        border-left: 8px solid transparent!important;
    }

    .el-table .sort-caret.descending {
        bottom: 5px!important;
        border-top: 8px solid rgb(190, 190, 151)!important;
        border-right: 8px solid transparent!important;
        border-bottom: none!important;
        border-left: 8px solid transparent!important;
    }

    .el-table .ascending .sort-caret.ascending {
        border-bottom-color: rgb(106, 105, 72)!important;
    }

    .el-table .descending .sort-caret.descending {
        border-top-color: rgb(106, 105, 72)!important;
    }

    .el-pagination__editor {
        width: 60px!important;
    }

    .el-button.el-button--default:nth-child(1) {
        display: none!important;
    }

    .bread-con {
        float: left;
    }

    .bread {
        float: left;
    }
</style>
<template>
    <div id="repDetail">
        <div class="opeationBtn">
            <!-- <el-button type="primary" @click.native.prevent="prind" class="btn-print">打印补货单</el-button> -->
            <!-- <el-button v-if="this.a === '3'" type="danger" @click.native.prevent="deleteOrder" class="btn-delete">删除补货单</el-button> -->
        </div>
        <div class="basicInfo">
            <div class="tip">
                <span>基本信息</span>
            </div>
            <el-table :data="basicTable" border style="width:80%;" class="basicTable">
                <el-table-column prop="repenishmentOrderId" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="skuKindTotal" label="商品品种总数" align="center"></el-table-column>
                <el-table-column prop="skuSize" label="商品总量" align="center"></el-table-column>
                <el-table-column label="所属货柜" align="center">
                    <template slot-scope="scope">
                        <el-button @click.stop.native.prevent="gotoDevice(scope.$index, scope.row)" type="text" size="small">{{basicTable[scope.$index].vendorId}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="productInfo">
            <div class="tip1">商品信息</div>
            <el-table :data="productTable" border style="width:100%" class="basicTable">
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <img v-if="productTable[scope.$index].image" class="image" :src="image + productTable[scope.$index].image">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="property" label="属性" align="center"></el-table-column>
                <!-- todo: 托盘计算 -->
                <el-table-column prop="sensorId" label="托盘" align="center"></el-table-column>
                <el-table-column prop="size" label="数量" align="center"></el-table-column>
                <el-table-column label="状态" align="center" v-if="this.a === '3'">
                    <template slot-scope="scope">
                        <p style="color: red" v-if="productTable[scope.$index].status === '调货'">{{productTable[scope.$index].status}}</p>
                        <p v-if="productTable[scope.$index].status !== '调货'">{{productTable[scope.$index].status}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button @click.native.prevent="back" class="btn-back">返回</el-button>
    </div>

</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import { picAddress } from '@/config.json'
    export default {
        name: 'repDetail',
        data() {
            return {
                image: `${picAddress}`,
                basicTable: [],
                productTable: []
            }
        },
        computed: {
            ...mapState(['isRepFirst'])
        },
        created() {
            this.$store.dispatch('changeRenter', false)
            this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
            this.search()
        },
        methods: {
            ...mapActions(['changeRenter']),
            deleteOrder() {
                this.$confirm('确定删除补货单？').ok(() => {
                    this.$xhr('deleteOrder', { repenishmentOrderId: this.$route.params.rid }).success(res => {
                        this.$message('已成功删除')
                        this.$router.back()
                    }).error(res => { this.$message.error(res.message) })
                })
            },
            gotoUser() { },
            search() {
                if (this.a === '1') {
                    this.$xhr('repDetail', { repenishmentOrderId: this.$route.params.rid }).success(res => {
                        this.basicTable.push({})
                        this.basicTable[0].repenishmentOrderId = res.repenishmentOrderId
                        this.basicTable[0].skuKindTotal = res.skuKindTotal
                        this.basicTable[0].skuSize = res.skuSize
                        this.basicTable[0].vendorId = res.vendorId
                        this.productTable = res.data
                        this.productTable.forEach((e) => {
                            e.sensorId = e.sensorId + ''
                            e.sensorId = (5 - parseInt(e.sensorId.slice(2, 3))) + '-' + (parseInt(e.sensorId.slice(3, 4)) + 1)
                            switch (e.status) {
                                case 1: e.status = '补货'
                                    break
                                case 2: e.status = '调货'
                                    break
                                default: e.status = ''
                                    break
                            }
                        })
                    }).error(res => { this.$message.error(res.message) })
                }
                if (this.a === '3') {
                    this.$xhr('drepDetail', { repenishmentOrderId: this.$route.params.rid }).success(res => {
                        this.basicTable.push({})
                        this.basicTable[0].repenishmentOrderId = res.repenishmentOrderId
                        this.basicTable[0].skuKindTotal = res.skuKindTotal
                        this.basicTable[0].skuSize = res.skuSize
                        this.basicTable[0].vendorId = res.vendorId
                        this.productTable = res.data
                        this.productTable.forEach((e) => {
                            e.sensorId = e.sensorId + ''
                            e.sensorId = (5 - parseInt(e.sensorId.slice(2, 3))) + '-' + (parseInt(e.sensorId.slice(3, 4)) + 1)
                            switch (e.status) {
                                case 1: e.status = '补货'
                                    break
                                case 2: e.status = '调货'
                                    break
                                default: e.status = ''
                                    break
                            }
                        })
                    }).error(res => { this.$message.error(res.message) })
                }
            },
            back() {
                this.$router.back()
            },
            gotoDevice(num) {
                this.$router.push(`/container/deDetails3/${this.basicTable[num].vendorId}/${this.$route.params.rid}`)
            }
        }
    }

</script>
<style scoped>
    #repDetail {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
        -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    }

    .tip {
        float: left;
        padding-bottom: 11px;
        font-size: 16px;
        margin-top: 15px;
        font-weight: 600;
        line-height: 17px;
        color: #333333;
    }

    .basicTable {
        clear: left;
        margin-top: 20px;
    }

    .image {
        height: 78px;
    }

    .btn-back {
        margin-top: 10px;
        /* float: right; */
        width: 100px;
    }

    .tip1 {
        float: left;
        padding-bottom: 11px;
        font-size: 16px;
        margin-top: 15px;
        font-weight: 600;
        line-height: 17px;
        color: #333333;
    }

    .opeationBtn {
        margin-top: 5px;
        float: right;
        margin-right: 20%;
    }
</style>
<!-- 货柜详情 -->
<template>
    <div class="ArrivalGoodsdetails" v-loading="loading">
        <div class="common">
            <!-- <div class="common_lef">
                <span>库存总额：<span>1000</span></span>
                <span>已售金额：<span>100</span></span>
                <span>销售额百分比：<span>10%</span></span>
            </div>
            <div class="common_rig">
                <span>最大库存：</span><span>1000</span>
                <span>当前库存：</span><span>100</span>
                <span>库存百分比：</span><span>10%</span>
            </div> -->
            <div class="common_btn">
                <el-button type="warning" @click="replenishment_order">生成补货单</el-button>
            </div>
        </div>
        <div class="lines">
            <div class="sss" v-for="x in tableLines">
                <table :style="classObject" v-for="e in x">
                    <tr class="sku-tr1">
                        <td v-if="e.yichang !== true" class="sku-td">{{e.pan}}</td>
                        <td v-if="e.yichang == true" class="sku-td red">{{e.pan}}（异常）</td>
                    </tr>
                    <tr class="sku-tr2 property">
                        <td class="sku-td2">
                            <div class="goodsimg">
                                <img v-if='e.sku' :src=image+e.sku.image alt="">
                            </div>
                        </td>
                    </tr>
                    <tr class="sku-tr3">
                        <td class="sku-td3">
                            <div v-if='e.sku'>
                                <p>{{e.sku.productName}}</p>
                                <p>重量：{{e.sku.weight}}</p>
                                <p>总重：{{e.weight}}</p>
                                <p>数量：{{e.sku.count}}</p>
                                <!-- <p style="position:relative;">最大库存：
                                    <button v-if='e.sku' :style='SetBtn_sty' @click='SetInventory(e)'>设置</button>
                                </p> -->
                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </div>
        <div class="sure">
            <el-button @click="back">返回</el-button>
        </div>

        <!--  生成补货单二次确认  -->
        <el-dialog title="提示" :visible.sync="confirmAgainDialog" width="30%" :before-close="exit_notsure">
            <div class="exitMsg">确定生成补货单？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="confirmAgain_sure">确 定</el-button>
                <el-button @click="confirmAgain_notsure">取 消</el-button>
            </div>
        </el-dialog>
        
        <!--  生成补货单成功  -->
        <el-dialog class="RepairInvoice" title="提示" :visible.sync="repOrder_dialog_success" width="30%" :before-close="dialog_sure">
            <div class="dialog_tit">补货单已经成功生成！</div>
            <div class="dialog_foot">
                <el-button class="dialog_btn_sure" type="warning" @click='dialog_sure'>确定</el-button>
                <el-button class="dialog_btn_check" @click='dialog_ImmediatelyCheck'>立即查看</el-button>
            </div>
        </el-dialog>
        <!--  生成补货单 - 货柜正在开门中  -->
        <el-dialog class="RepairInvoice" title="提示" :visible.sync="repOrder_dialog_opendoor" width="30%">
            <div class="dialog_tit"> 当前货柜开门状态，有人正在购物，请稍后重新生成补货单！ </div>
            <div class="dialog_foot">
                <el-button class="dialog_btn_sure" type="warning" @click='repOrder_dialog_opendoor = false'>确定</el-button>
            </div>
        </el-dialog>

        <!-- 生成补货单 - 已有补货单，是否作废之前 -->
        <el-dialog class="RepairInvoice" title="提示" :visible.sync="repOrder_dialog_existing" width="30%" :before-close="existing_notsure">
            <div class="dialog_tit"> 此货柜有未完成的补货单，重新生成补货单会将之前的补货单作废，确定作废？ </div>
            <div class="dialog_foot">
                <el-button class="dialog_btn_sure" type="warning" @click='existing_sure'>确定</el-button>
                <el-button class="dialog_btn_sure" @click='existing_notsure'>取消</el-button>
            </div>
        </el-dialog>

        <!-- 设置最大库存dialog -->
        <el-dialog title="设置最大库存" :visible.sync="LargestInventoryDialog" width="34%" :before-close="exit_notsure">
            <div style='text-align:center;padding:20px 0;'>
                <span style="margin-right:20px;">最大库存:</span>
                <el-input v-model="LargestInventory" style="width: 180px;"></el-input>
            </div>
            <div slot="footer" class="dialog-footer" style="padding:0 0 10px 0;">
                <el-button type="warning" @click="LargestInv_sure">确 定</el-button>
                <el-button @click="LargestInv_notsure">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 生成补货单 - 不需要补货 -->
        <el-dialog class="RepairInvoice" title="提示" :visible.sync="repOrder_dialog_GoodsEmpty" width="30%">
            <div class="dialog_tit"> 无需生成补货单! </div>
            <div class="dialog_foot">
                <el-button class="dialog_btn_sure" type="warning" @click='repOrder_dialog_GoodsEmpty = false'>确定</el-button>
            </div>
        </el-dialog>

        <!-- 生成补货单 - 有未完成补货单不能生成 -->
        <el-dialog class="RepairInvoice" title="提示" :visible.sync="repOrder_dialog_unfinished" width="30%">
            <div class="dialog_tit"> 此货柜有未完成的补货单，不能生成。 </div>
            <div class="dialog_foot">
                <el-button class="dialog_btn_sure" type="warning" @click='repOrder_dialog_unfinished = false'>确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import { areas } from '@/area'
    import { picAddress } from '@/config.json'
    import { Loading } from 'element-ui';
    export default {
        name: 'category_new',
        components: {},
        data() {
            return {
                loading: false,
                confirmAgainDialog: false, // 生成补货单二次确认
                repOrder_dialog_success: false, // 补货单生成成功
                repOrder_dialog_opendoor: false, // 补货单生成失败 - 设备正在开门
                repOrder_dialog_existing: false, // 已存在补货单 是否作废
                repOrder_dialog_GoodsEmpty: false, // 不需要补货
                repOrder_dialog_unfinished: false, // 有未完成补货单-不能生成
                LargestInventoryDialog: false, // 设置最大库存dialog

                classObject: {
                    width: '10%',
                    textAlign: 'center',
                    position: 'relative',
                },
                SetBtn_sty: {
                    position: 'absolute',
                    bottom: '0',
                    right: '10px',
                    width: '38px',
                    height: '22px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    background: '#f7ba2a',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                },
                teauserStatus: '',
                provinces: areas.filter(area => area.level === 1),
                cities: [],
                districts: [],
                image: `${picAddress}`,
                tableLines: [],
                list: [],
                form: {
                    pass: '',
                    id: 135,
                    mac: '1',
                    createTime: '',
                    memo: '',
                    provinceId: '',
                    cityId: '',
                    districtId: ''
                },
                searchId: {
                    deviceId: 135
                },
                LargestInventory: 0, // 设置最大库存
            }
        },
        computed: {
            ...mapState(['deviceFrom'])
        },
        methods: {
            ...mapActions(['changeDeviceFrom']),
            reset() {
                /* TODO 重置状态 */
                this.$xhr('deviceDetailreset', {
                    id: this.searchId.deviceId
                }).success(res => {
                    this.$message('重置成功!')
                    this.detail()
                }).error(err => {
                    this.$message.error(err.message)     // '未设置商品与是否已投放不能重置!'
                })
            },
            detail() {
                this.list = JSON.parse(this.$route.query.data).plantDtos;
                // console.log(JSON.parse(this.$route.query.data))

                // 取最大值
                var arr = [];

                this.list.forEach((v, i) => {
                    // console.log(v.sensorId)
                    arr.push(Number(v.sensorId.toString().slice(2, 3)))
                })

                var max = Math.max.apply(null, arr);

                var x = 1

                this.tableLines = []

                this.list.sort((a, b) => {
                    return b.sensorId - a.sensorId
                })

                this.list.forEach((e) => {

                    let index = Math.floor((e.sensorId / 10) % 100)

                    if (Array.isArray(this.tableLines[index])) {

                        this.tableLines[index].push(e)

                    } else {

                        this.tableLines[index] = [e]

                    }
                })

                this.tableLines.forEach(e => {
                    if (e.length > x) {
                        x = e.length
                    }
                })

                this.classObject.width = (100 / x) + '%'
                this.tableLines.reverse()
                this.tableLines.forEach((e, i) => {
                    e.reverse()
                    e.forEach((a, c) => {
                        a.pan = a.sensorId + ''
                        a.pan = (max + 1 - parseInt(a.pan.slice(2, 3))) + '—' + (parseInt(a.pan.slice(3, 4)) + 1)
                        if (a.sensorId > 1049) {
                            a.pan = '托盘组装错误'
                            e.yichang = true
                        }
                    })
                })
            },
            // 设置最大库存
            SetInventory(data) {
                // console.log(data);
                this.LargestInventoryDialog = true;
            },
            // 设置最大库存 - 确定
            LargestInv_sure() {
                var obj = {
                    sensorId: plate.sensorId,
                    skuId: plate.sku.skuId,
                    count: plate.sku.count,
                    maxCount: plate.maxCount,
                    errorCode: plate.error
                }
                // console.log(this.LargestInventory)
                // this.LargestInventoryDialog = false;
            },
            LargestInv_notsure() {
                this.LargestInventoryDialog = false;
            },
            back() {
                this.$router.back()
            },
            formatDate(now) {
                var year = now.getFullYear()
                var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
                var date = now.getDate() < 10 ? '0' + (now.getDate()) : now.getDate()
                var hour = now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours()
                var minute = now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes()
                var second = now.getSeconds() < 10 ? '0' + (now.getSeconds()) : now.getSeconds()
                return year + '-' + month + '-' + date + '  ' + hour + ':' + minute + ':' + second
            },
            // 生成补货单
            replenishment_order() {
                this.confirmAgainDialog = true;
            },
            // 确认生成补货单  -确认按钮
            confirmAgain_sure() {
                var loadingInstance = Loading.service({ loading: true });

                this.confirmAgainDialog = false;

                this.$http.post('/v1/business/order/replenishment', {
                    "vendorId": JSON.parse(this.$route.query.data).vendorId,
                    "cover": false
                }).then(res => {
                    if (res.data.error == 113){
                        // 设备正在开门
                        loadingInstance.close()
                        this.repOrder_dialog_opendoor = true;
                        return;
                    }
                    if (res.data.error == 1011){
                        // 请勿重复创建
                        loadingInstance.close()
                        this.repOrder_dialog_existing = true;
                        return;
                    }
                    if (res.data.error == 132) {
                        // 补货商品为空，不需要补货
                        loadingInstance.close()
                        this.repOrder_dialog_GoodsEmpty = true;
                        return;
                    }
                    if (res.data.error == 134){
                        // 有未完成补货单 不能生成
                        loadingInstance.close()
                        this.repOrder_dialog_unfinished = true;
                    }
                    if (res.data.success) {
                        loadingInstance.close()
                        this.repOrder_dialog_success = true;
                        return;
                    }
                }, err => {
                    // console.log(err)
                })
            },
            // 取消生成补货单
            confirmAgain_notsure() {
                this.confirmAgainDialog = false;
            },
            // 确认作废
            existing_sure() {

                var loadingInstance = Loading.service({ loading: true });

                this.$http.post('/v1/business/order/replenishment', {
                    "vendorId": JSON.parse(this.$route.query.data).vendorId,
                    "cover": true
                }).then(res => {
                    if (res.data.error == 113){
                        // 设备正在开门
                        loadingInstance.close()
                        this.repOrder_dialog_opendoor = true;
                        this.existing_notsure(); // 当前dialog取消
                        return;
                    }
                    if (res.data.error == 132) {
                        // 补货商品为空，不需要补货
                        loadingInstance.close()
                        this.repOrder_dialog_GoodsEmpty = true;
                        this.existing_notsure(); // 当前dialog取消
                        return;
                    }
                    if (res.data.error == 134){
                        // 有未完成补货单 不能生成
                        loadingInstance.close()
                        this.repOrder_dialog_unfinished = true;
                    }
                    if (res.data.success) {
                        // 成功
                        loadingInstance.close()
                        this.repOrder_dialog_success = true;
                        this.existing_notsure(); // 当前dialog取消
                        return;
                    }

                })

            },
            // 取消作废
            existing_notsure() {
                this.repOrder_dialog_existing = false;
            },
            // dialog 确定
            dialog_sure() {
                this.repOrder_dialog_success = false;
            },
            // dialog 立即查看
            dialog_ImmediatelyCheck() {
                this.repOrder_dialog_success = false;
                this.$router.push('/container/repMentOrdManagement');
                this.$store.dispatch('changeEnter', true)
            }
        },
        created() {
            /*  取到设备详细和货道  */
            this.$store.dispatch('changepageNo', 1)
            this.$store.dispatch('changeEnter', false); // 不需要刷新
            this.teauserStatus = localStorage.getItem('teauserStatus')
            this.detail()
        },
    }

</script>

<style scoped>
    .ArrivalGoodsdetails {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .data-header {
        display: flex;
        justify-content: space-between;
    }

    .new-data {
        height: 40px!important;
        margin-top: 10px;
    }

    .new {
        float: right;
        margin-top: 5px;
        margin-left: 10px;
    }

    .image {
        height: 40px;
    }

    .common {
        display: flex;
        width: 100%;
        height: 54px;
        line-height: 54px;
    }

    .common span {
        font-weight: 400;
        font-style: none;
        font-size: 14px;
    }

    .common_rig {
        margin-left: 40px;
    }

    .common_btn {
        /* padding-left: 40px; */
    }

    .sku {
        display: inline-block;
        width: 6px;
        height: 8px;
        border-right: 1px #333 solid;
        border-left: 1px #333 solid;
        border-top: 2px #333 solid;
        border-bottom: 2px #333 solid;
    }

    span {
        margin-left: 5px;
        font-size: 16px;
        font-weight: bold;
    }

    .tableDetail {
        width: 100%;
        height: 220px;
        padding-top: 30px;
        padding-bottom: 40px;
    }

    .hang {
        height: 20px;
    }

    .word {
        display: inline-block;
        width: 200px;
        height: 30px;
        line-height: 30px;
        float: left;
    }

    .reset {
        margin-left: 8px;
    }

    .edit {
        margin-left: 10px;
    }

    .sure {
        margin-top: 50px;
    }

    .detail {
        border: 1px solid #ccc;
        border-collapse: collapse;
        margin-top: 30px;
    }

    .detail tr {
        border: 1px solid #ccc;
        height: 40px;
    }

    .detail td {
        border: 1px solid #ccc;
        font-size: 14px;
    }

    .detail-one {
        background-color: #fff;
    }

    .detail-two {
        text-align: center;
        background-color: #eee;
        width: 200px;
    }

    .detail-three {
        padding-left: 5px;
        text-align: left;
        background-color: #fff;
        width: 300px;
    }

    .resetBtn {
        float: right;
        margin-right: 10px;
        background-color: red;
        color: #fff;
        border-radius: 5px;
        border: 1px solid red;
        width: 50px;
        height: 40px;
        cursor: pointer;
    }

    .sku-tr1 {
        height: 30px;
        font-size: 16px;
    }

    .sku-tr2 {
        height: 60px;
    }

    .sku-td2 {
        width: 100%;
    }

    .sku-tr3 {
        height: 80px;
        text-align: left;
    }

    .sku-td3 {
        box-sizing: border-box;
        padding: 0 0 0 8px;
        width: 100%;
        font-size: 12px;
    }

    /* .header {
        background-color: #eee;
    } */

    .red {
        color: red;
    }

    .sss {
        width: 100%;
        display: inline-block;
        /* margin-top: -6px; */
        height: 202px;
    }

    .sss table {
        border: 1px solid #ccc;
        float: left;
        height: 100%;
        margin-left: -1px;
        border-collapse: collapse;
    }

    .sure {
        text-align: center;
        margin-top: 50px;
    }

    .lines {
        width: 100%;
        height: 100%;
        display: block;
    }

    .goodsimg {
        margin: 10px auto 0 auto;
        width: 46px;
    }

    .goodsimg>img {
        width: 100%;
    }

    /*  dialog  */

    .dialog_tit {
        padding: 50px 0;
        text-align: center;
    }

    .dialog_foot {
        text-align: center;
    }

    .dialog_btn_sure {
        width: 100px;
        margin-right: 15px;
    }

    .dialog_btn_check {
        margin-left: 15px;
        width: 100px;
    }
</style>
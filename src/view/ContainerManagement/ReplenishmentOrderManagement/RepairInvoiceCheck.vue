<template>
    <div class="RepairInvoiceCheck">
        <!--  头部信息  -->
        <div class="reContainer">
            <div class="ReCheck">
                <div>
                    <span>补货单号：</span>
                    <span>{{vendormsg.replenishmentOrderId}}</span>
                </div>
                <div>
                    <span>货柜编号：</span>
                    <span>{{vendormsg.vendorId}}</span>
                </div>
                <div>
                    <span>摆放地址：</span>
                    <span>{{vendormsg.vendorAddress}}</span>
                </div>
            </div>
            <!--  展示流程图  -->
            <div class="flowChart">
                <div>
                    <span class="fontSizeMsg">打印</span>
                    <!-- <span class="posi_msg">{{vendormsg.printTime}}</span> -->
                </div>
                <div><i class="iconfont icon-web__bitebiyoujiantou"></i></div>
                <div>
                    <span class="fontSizeMsg">领取</span>
                    <!-- <span class="posi_msg">{{vendormsg.accessTime}}</span> -->
                </div>
                <div><i class="iconfont icon-web__bitebiyoujiantou"></i></div>
                <div>
                    <span class="fontSizeMsg">开门</span>
                    <!-- <span class="posi_msg">{{vendormsg.firstOpendoorTime}}</span> -->
                </div>
                <div><i class="iconfont icon-web__bitebiyoujiantou"></i></div>
                <div><span class="fontSizeMsg">关门</span></div>
                <div><i class="iconfont icon-web__bitebiyoujiantou"></i></div>
                <div><span class="fontSizeMsg">审核</span></div>
                <div><i class="iconfont icon-web__bitebiyoujiantou"></i></div>
                <div><span class="fontSizeMsg">完成</span></div>
            </div>
            <!--  table表格  -->
            <el-table :data="recheck" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="pan" label="摆放货道" align="center" width='100'></el-table-column>
                <el-table-column prop="expectNum" label="应补数量" align="center" width='150'></el-table-column>
                <el-table-column prop="actualNum" label="实补数量" align="center" width='150'></el-table-column>

                <el-table-column prop="backNum" label="退回数量" align="center" width='150' v-if='this.$route.query.state == 1'>
                    <template slot-scope="scope">
                        <el-input class="changeIpt" v-model="backNumModel[scope.$index]" @blur='backNumsellingChange(backNumModel[scope.$index],scope.$index)'></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="backNum" label="退回数量" align="center" width='150' v-else>
                    <template slot-scope="scope">
                        <div>{{scope.row.backNum}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="memo" label="备注" align="center" v-if='this.$route.query.state == 1'>
                    <template slot-scope="scope">
                        <el-input class="changeIpt" v-model="memoModel[scope.$index]" @blur='memosellingChange(memoModel[scope.$index],scope.$index,scope.row)'></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" align="center" v-else></el-table-column>
            </el-table>
            <!--  脚部按钮  -->
            <div class="ipt_footer">
                <el-button type="warning" v-if='this.$route.query.state == 1' @click='audit'>审核</el-button>
                <el-button class="cancelBtn" v-if='this.$route.query.state == 1' @click='cancelBtn'>取消</el-button>
                <el-button class="cancelBtn" v-if='this.$route.query.state == 0' @click='cancelBtn'>返回</el-button>
            </div>
            <!--  生成补货单  -->
            <el-dialog title="提示" :visible.sync="repOrder_dialog" width="30%" :before-close="handleClose">
                <div class="dialog_tit">您确定审核通过吗？</div>
                <div class="dialog_foot">
                    <el-button class="dialog_btn_sure" type="warning" @click='dialog_sure'>确定</el-button>
                    <el-button class="dialog_btn_check" @click='dialog_cancel'>取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                repOrder_dialog: false,
                recheck: [],
                vendormsg: [], // 货柜信息
                backNumModel: [], // 退回数量
                memoModel: [], // 备注
            }
        },
        methods: {
            // 审核
            audit() {
                this.repOrder_dialog = true;
            },
            // 取消
            cancelBtn() {
                this.$store.dispatch('changeEnter', false); // 不需要刷新
                this.$router.back();
            },
            // dialog确定
            dialog_sure() {

                this.repOrder_dialog = false;

                var obj = {
                    vendorId: JSON.parse(this.$route.query.orderData).vendorId,
                    id: JSON.parse(this.$route.query.orderData).replenishmentOrderId,
                    productList: this.recheck
                }

                console.log(obj)
                
                this.$http.post('/v2/stock/replenishment/audit', obj).then(res => {

                    if (res.data.result.code == 0) {

                        this.repOrder_dialog = false;

                        this.$store.dispatch('changeEnter', true); // 刷新
                        this.$router.push({path: '/container/repMentOrdManagement'}); // 跳转
                        sessionStorage.setItem('RepairInvoiceAudit', '3'); // 设置状态
                    }

                }, err => {
                    console.log(err)
                })
            },
            // dialog取消
            dialog_cancel() {
                this.repOrder_dialog = false;
            },
            // 处理货到信息
            senId() {
                // console.log(this.recheck[0].sensorId.toString().slice(2,3));

                // 处理托盘

                // 取最大值
                var arr = [];
                
                this.recheck.forEach((v, i) => {
                    arr.push(Number(v.sensorId.toString().slice(2,3)))
                })

                var max = Math.max.apply(null,arr);

                this.recheck.map((v, i) => {
                    v.pan = (max + 1 - parseInt(v.sensorId.toString().slice(2, 3))) + '' + (parseInt(v.sensorId.toString().slice(3, 4)) + 1);
                })
                
                this.recheck.sort((a, b) => {
                    return a.pan - b.pan
                })

                this.recheck.map((v, i) => {
                    v.pan = v.pan.slice(0,1) + '-' + v.pan.slice(1,2)
                })
            },
            backNumsellingChange(val, idx) {
                // 转换为number类型
                this.backNumModel.map((v, i) => {
                    return this.backNumModel[i] = Number(v)
                })
                // 更改数据
                this.recheck.map((v, i) => {
                    v.backNum = this.backNumModel[i]
                })
            },
            // 更改备注
            memosellingChange(val, idx, row) {

                this.recheck[idx].memo = this.memoModel[idx];

            }
        },
        created() {
            this.vendormsg = JSON.parse(this.$route.query.vendormsg);

            this.recheck = JSON.parse(this.$route.query.skuDatas).replenishmentDetailList;

            if (this.recheck) {
                // console.log(this.recheck)

                this.recheck.forEach((v, i) => {
                    this.backNumModel.push(0)
                })

                this.recheck.forEach((v, i) => {
                    this.memoModel.push(' ')
                })

                // 处理货道信息
                this.senId();
            }
        }
    }

</script>
<style scoped>
    .RepairInvoiceCheck {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }
    /*  头部信息  */

    .reContainer {
        width: 100%;
        /* height: 100%; */
    }

    .ReCheck {
        width: 900px;
        /* border:1px solid red;  */
        /* border: 1px solid red; */
        display: flex;
    }

    .ReCheck>div {
        /* width: 100%; */
        margin-right: 80px;
        height: 40px;
        line-height: 40px;
        /* flex: 1; */
        font-size: 14px;
        overflow: hidden;
    }
    /*  展示流程图  */

    .flowChart {
        width: 800px;
        /* border:1px solid red; */
        text-align: center;
        display: flex;
        margin-bottom: 60px;
    }

    .flowChart>div {
        /* flex: 1; */
        position: relative;
    }

    .posi_msg {
        display: inline-block;
        width: 80px;
        text-align: center;
        position: absolute;
        bottom: -40px;
        left: -50%;
        margin-left: 10px;
    }

    .flowChart>div:nth-child(2n) {
        width: 10%;
    }

    .flowChart i {
        color: #666;
        line-height: 50px;
        font-size: 28px;
    }
    /*  文字描述  */

    .fontSizeMsg {
        display: inline-block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #000;
        border-radius: 50%;
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

    .ipt_footer {
        padding: 20px 0;
        text-align: center;
    }
</style>
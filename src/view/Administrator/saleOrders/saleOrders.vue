<template>
    <div id="saleOrders">
        <div class="orderStatus">
            <span class="orderState orderState_active" @click='search(1)'>全部订单({{allOrder}})</span>
            <span class="orderState" @click='no(1)'>未支付({{noPay}})</span>
            <span class="orderState" @click='com(1)'>已完成({{complate}})</span>
            <span class="orderState" @click='clo(1)'>已关闭({{close}})</span>
            <!-- <el-button type="primary" plain @click="search(1)">全部订单({{allOrder}})</el-button> -->
            <!-- <el-button type="primary" plain @click="no(1)">未支付({{noPay}})</el-button>
            <el-button type="primary" plain @click="com(1)">已完成({{complate}})</el-button>
            <el-button type="primary" plain @click="clo(1)">已关闭({{close}})</el-button> -->
        </div>
        <!-- <el-button type="primary" @click="print(1)" class="export" :loading="downloadLoading">数据导出</el-button>-->
        <div class="search">
            <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" :show-header="header">
                <el-table-column label="筛选查询">
                    <template slot-scope="scope">
                        <div class="searchForm">
                            <el-form :inline="true" :model="searchData" class="searchData">
                                <el-form-item label="订单编号">
                                    <el-input class="user-input" v-model="searchData.orderId" placeholder="订单编号"></el-input>
                                </el-form-item>
                                <el-form-item label="用户编号">
                                    <el-input class="user-input" v-model="searchData.userId" placeholder="用户编号" width="50"></el-input>
                                </el-form-item>
                                <el-form-item label="货柜编号">
                                    <el-input class="user-input" v-model="searchData.vendorId" placeholder="货柜编号"></el-input>
                                </el-form-item>
                                <el-form-item label="订单生成时间">
                                    <el-date-picker :clearable="false" v-model="dataRange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="warning" icon="el-icon-search" @click.native.prevent="choose">搜索</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="orderTable">
            <el-table :data="orderTable" border style="width:100%">
                <el-table-column prop="orderId" label="订单编号" align="center" width='110'></el-table-column>
                <el-table-column prop="total" label="订单金额" align="center" width='110'></el-table-column>
                <el-table-column prop="" label="订单生成时间" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime.split(' ')[0]}}</div>
                        <div>{{scope.row.createTime.split(' ')[1]}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="支付完成时间" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.paiedTime.split(' ')[0]}}</div>
                        <div>{{scope.row.paiedTime.split(' ')[1]}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="货柜编号" align="center">
                    <template slot-scope="scope">
                        <el-button @click.stop.native.prevent="gotoDevice(scope.$index, scope.row)" type="text" size="small">{{orderTable[scope.$index].vendorId}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="用户编号" align="center">
                    <template slot-scope="scope">
                        <el-button @click.stop.native.prevent="gotoUser(scope.$index, scope.row)" type="text" size="small">{{orderTable[scope.$index].userId}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="paiedType" label="支付方式" align="center"></el-table-column>
                <el-table-column label="支付状态" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status !== '未支付'" type="text" size="small" class="black">{{orderTable[scope.$index].status}}</p>
                        <p v-if="scope.row.status === '未支付'" type="text" size="small" class="red">{{orderTable[scope.$index].status}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click.stop.native.prevent="viewOrder(scope.$index, scope.row)" type="text" size="small">查看订单</el-button>
                        <el-button v-if="(scope.row.status === '未支付') && (a=== '1')" @click.stop.native.prevent="closeO(scope.$index, scope.row)"
                            type="text" size="small">确认完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination class="page" v-show="showPage === 1" layout="total, prev, pager, next" :current-page.sync="page1.pageNo" :page-size="page1.pageSize"
            :total="page1.total" @current-change="search" />
        <el-pagination class="page" v-show="showPage === 2" layout="total, prev, pager, next" :current-page.sync="page2.pageNo" :page-size="page2.pageSize"
            :total="page2.total" @current-change="no" />
        <el-pagination class="page" v-show="showPage === 3" layout="total, prev, pager, next" :current-page.sync="page3.pageNo" :page-size="page3.pageSize"
            :total="page3.total" @current-change="com" />
        <el-pagination class="page" v-show="showPage === 4" layout="total, prev, pager, next" :current-page.sync="page4.pageNo" :page-size="page4.pageSize"
            :total="page4.total" @current-change="clo" />
        <el-dialog title="关闭订单" :visible.sync="memu">
            <el-form :model="remark" :inline="true" ref="remark" :rules="Rules">
                <el-form-item prop="memo" label="备注" style="margin-left: 1%;">
                    <el-input type="textarea" v-model="remark.memo" style="clear: left;width: 500px;" :rows=7></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelRemark">取 消</el-button>
                <el-button type="primary" @click.stop.native.prevent="closeOrder('remark')">确认关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'saleOrders',
        data() {
            return {
                downloadLoading: false,
                index: '',
                memu: false,
                showPage: 0,
                dataRange: [],
                allOrder: '',
                noPay: '',
                complate: '',
                close: '',
                searchData: {},
                tableData: [{}],
                header: true,
                temp: 1, // 用来存放二次筛选的状态
                orderTable: [], // 全部订单分页
                page1: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                    status: '0'
                },
                // 未支付订单分页
                page2: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                    status: '1'
                },
                // 已完成订单分页
                page3: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                    status: '2'
                },
                // 已关闭订单分页
                page4: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                    status: '3'
                },
                remark: {},
                Rules: {
                    memo: { required: true, message: '请填写备注信息', trigger: 'blur' }
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            this.$store.dispatch('changepageNo', 1)
            next()
        },
        activated() {
            console.log(this.$store.state.isOrderFirst)
            if (this.$store.state.isOrderFirst) {
                this.dataRange = []
                this.searchData = {}
                this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
                this.search(1)
            }
        },
        created() {
            console.log(1111111)
            // a 1管理员 3代理商
            this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
            // payStatus 1未支付2已完成3已关闭

            this.$store.state.payStatus = 0;

            if (this.$store.state.payStatus === '1') {
                this.no(this.$store.state.pageNo)
            } else if (this.$store.state.payStatus === '2') {
                this.com(this.$store.state.pageNo)
            } else if (this.$store.state.payStatus === '3') {
                this.clo(this.$store.state.pageNo)
            } else {
                this.search();
            }
        },
        computed: {
            ...mapState(['pageNo', 'payStatus', 'deviceFrom', 'isOrderFirst'])
        },
        watch: {
            dataRange(range) {
                this.setSearchDate(range)
            }
        },
        methods: {
            ...mapActions(['changepageNo', 'changePayStatus', 'changeDeviceFrom', 'changeOenter']),
            // 点击tab
            changeOrderState(idx) {

                var btns = document.getElementsByClassName('orderState');
                
                if (btns.length != 0) {

                    for (var i = 0; i < btns.length; i++) {
                        btns[i].className = 'orderState'
                    }

                    btns[idx].className = 'orderState orderState_active'
                }

            },
            print() {
                this.downloadLoading = true
            },
            gotoDevice(num) {
                this.$router.push(`/container/deDetails/${this.orderTable[num].vendorId}`)
            },
            closeO(num) {
                this.index = num
                this.memu = true
            },
            cancelRemark() {
                this.remark = {}
                this.memu = false
            },
            choose() {
                // temp: 1全部2未支付3已完成4已关闭
                if (this.temp === 1) {
                    this.search(1)
                } else if (this.temp === 2) {
                    this.no(1)
                } else if (this.temp === 3) {
                    this.com(1)
                } else if (this.temp === 4) {
                    this.clo(1)
                }
            },
            search(pageNo) {
                this.changeOrderState(0);
                this.temp = 1
                if (this.a === '1') {
                    this.page1.pageNo = pageNo;
                    this.$store.dispatch('changepageNo', pageNo)
                    let requestData = Object.assign(this.searchData, this.page1)
                    // console.log(this.page1)
                    // console.log(requestData)
                    this.$xhr('saleOrders', requestData).success(res => {
                        //            this.searchData = {}
                        this.page1.total = res.total
                        this.orderTable = res.data
                        this.showPage = 1
                        console.log(res)
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
                if (this.a === '3') {
                    this.page1.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    let requestData = Object.assign(this.searchData, this.page1)
                    this.$xhr('detailSaleOrders', requestData).success(res => {
                        this.page1.total = res.total
                        this.orderTable = res.data
                        this.showPage = 1
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
            },
            closeOrder(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let num = this.index
                        this.$xhr('closeOrder', { orderId: this.orderTable[num].orderId, memo: this.remark.memo }).success(res => {
                            this.$message('操作成功')
                            this.remark = {}
                            this.memu = false
                            if (this.$store.state.payStatus === '1') {
                                this.no(this.$store.state.pageNo)
                            } else if (this.$store.state.payStatus === '2') {
                                this.com(this.$store.state.pageNo)
                            } else if (this.$store.state.payStatus === '3') {
                                this.clo(this.$store.state.pageNo)
                            } else {
                                this.search(this.$store.state.pageNo)
                            }
                        }).error(res => {
                            this.$message.error(res.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            setSearchDate(range = this.dataRange || []) {
                if (range != null) {
                    this.searchData.startDate = range[0] ? range[0].getTime() : ''
                    this.searchData.endDate = range[1] ? range[1].getTime() : ''         // + 24 * 60 * 60 * 1000 : ''
                } else {
                    this.searchData.startDate = '';
                    this.searchData.endDate = '';
                }
            },
            viewOrder(num) {
                this.$router.push(`/container/saleDetail/${this.orderTable[num].orderId}`)
            },
            gotoUser() { },
            all() {
                this.temp = 1
                if (this.a === '1') {
                    this.$store.dispatch('changePayStatus', this.page1.status)
                    let requestData = Object.assign(this.searchData, this.page1)
                    this.$xhr('saleOrders', requestData).success(res => {
                        this.page1.total = res.total
                        this.orderTable = res.data
                        this.showPage = 1
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
                if (this.a === '3') {
                    let requestData = Object.assign(this.searchData, this.page1)
                    this.$xhr('detailSaleOrders', requestData).success(res => {
                        this.page1.total = res.total
                        this.orderTable = res.data
                        this.showPage = 1
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
            },
            no(pageNo = 1) {
                this.changeOrderState(1);
                this.temp = 2
                if (this.a === '1') {
                    console.log(this.searchData)
                    this.page2.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    this.$store.dispatch('changePayStatus', this.page2.status)
                    let requestData = Object.assign(this.searchData, this.page2)
                    this.$xhr('saleOrders', requestData).success(res => {
                        this.page2.total = res.total
                        this.orderTable = res.data
                        this.showPage = 2
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
                if (this.a === '3') {
                    this.page2.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    this.$store.dispatch('changePayStatus', this.page2.status)
                    let requestData = Object.assign(this.searchData, this.page2)
                    this.$xhr('detailSaleOrders', requestData).success(res => {
                        this.page2.total = res.total
                        this.orderTable = res.data
                        this.showPage = 2
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
            },
            com(pageNo = 1) {
                this.changeOrderState(2);
                this.temp = 3
                if (this.a === '1') {
                    this.page3.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    this.$store.dispatch('changePayStatus', this.page3.status)
                    let requestData = Object.assign(this.searchData, this.page3)
                    this.$xhr('saleOrders', requestData).success(res => {
                        this.page3.total = res.total
                        this.orderTable = res.data
                        this.showPage = 3
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
                if (this.a === '3') {
                    this.page3.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    this.$store.dispatch('changePayStatus', this.page3.status)
                    let requestData = Object.assign(this.searchData, this.page3)
                    this.$xhr('detailSaleOrders', requestData).success(res => {
                        this.page3.total = res.total
                        this.orderTable = res.data
                        this.showPage = 3
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
            },
            clo(pageNo = 1) {
                this.changeOrderState(3);
                this.temp = 4
                if (this.a === '1') {
                    this.page4.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    this.$store.dispatch('changePayStatus', this.page4.status)
                    let requestData = Object.assign(this.searchData, this.page4)
                    this.$xhr('saleOrders', requestData).success(res => {
                        this.page4.total = res.total
                        this.orderTable = res.data
                        this.showPage = 4
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
                if (this.a === '3') {
                    this.page4.pageNo = pageNo
                    this.$store.dispatch('changepageNo', pageNo)
                    this.$store.dispatch('changePayStatus', this.page4.status)
                    let requestData = Object.assign(this.searchData, this.page4)
                    this.$xhr('detailSaleOrders', requestData).success(res => {
                        this.page4.total = res.total
                        this.orderTable = res.data
                        this.showPage = 4
                        this.orderTable.forEach(e => {
                            switch (e.paiedType) {
                                case 1: e.paiedType = '余额支付'
                                    break
                                case 2: e.paiedType = '支付宝免密'
                                    break
                                case 3: e.paiedType = '支付宝非免密'
                                    break
                                default: e.state = ''
                            }
                            switch (e.status) {
                                case 1: e.status = '未支付'
                                    break
                                case 2: e.status = '已支付'
                                    break
                                case 3: e.status = '已关闭'
                                    break
                                default: e.status = ''
                            }
                        })
                        this.allOrder = res.unPaidCount + res.paidCount + res.closedCount
                        this.noPay = res.unPaidCount
                        this.complate = res.paidCount
                        this.close = res.closedCount
                    }).error(res => {
                        this.$message.error(res.message)
                    })
                }
            }
        }
    }

</script>
<style scoped>
    #saleOrders {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
        -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    }

    .orderStatus {
        float: left;
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .search {
        margin-top: 10px;
    }

    .user-input {
        width: 110px;
    }

    .searchForm {
        width: 100%;
        /* float: left; */
        margin-top: 15px;
    }

    .page {
        /* float: right; */
        margin-top: 1%;
    }

    .orderTable {
        margin-top: 10px;
    }

    .searchData {
        /* float: left; */
    }

    .memo {
        /* float: left; */
    }

    .dialog-footer {
        margin-top: 1%;
    }

    .red {
        color: red;
    }

    .black {
        color: #000000;
    }

    .export {
        /* float: right; */
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .orderState {
        background: #fff;
        border: 1px solid rgb(217, 215, 191);
        color: rgb(61, 59, 31);
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        padding: 10px 15px;
        font-size: 14px;
        border-radius: 4px;
    }

    .orderState_active {
        border: 1px solid #f7ba2a;
        color: #f7ba2a;
        /* background: #f7ba2a; */
    }
</style>
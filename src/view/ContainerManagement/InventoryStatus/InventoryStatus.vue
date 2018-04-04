<template>
    <div class="InventoryStatus" v-loading="loading">
        <el-form :inline="true" :model="searchData">
            <!--  地址  -->
            <el-form-item label="摆放地址">
                <el-form-item class="addr-sel" prop="provinceId">
                    <el-select class="address-select" v-model="searchData.provinceId" @change="changeProvince" placeholder="请选择省">
                        <el-option v-for="p in provinces" :label="p.name" :value="p.code" :key="p.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="addr-sel" prop="cityId">
                    <el-select class="address-select" v-model="searchData.cityId" @change="changeCity" placeholder="请选择市">
                        <el-option v-for="c in cities" :label="c.name" :value="c.code" :key="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="addr-sel" prop="districtId">
                    <el-select class="address-select" v-model="searchData.districtId" placeholder="请选择区">
                        <el-option v-for="d in districts" :label="d.name" :value="d.code" :key="d.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>
            <!--  货柜编号  -->
            <el-form-item label="货柜编号">
                <el-input class="address-select" v-model="searchData.vendorId"></el-input>
            </el-form-item>
            <!--  查询  -->
            <el-form-item>
                <el-button type="warning" class="checkBtn" @click.native.prevent="search(1)">查询</el-button>
            </el-form-item>
        </el-form>
        <!--  table表格  -->
        <el-table :data="ContainerMsg" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
            <el-table-column prop="vendorId" label="货柜编号" align="center" width="100" fixed></el-table-column>
            <el-table-column prop="address" label="摆放地址" align="center" min-width="140"></el-table-column>
            <el-table-column prop="maxCount" label="在售商品最大库存" align="center" min-width='100'></el-table-column>
            <el-table-column prop="count" label="在售商品当前库存" align="center" min-width='100'></el-table-column>
            <el-table-column label="库存百分比" align="center" min-width='100'>
                <template slot-scope="scope">
                    <div v-if='scope.row.count == 0 || scope.row.maxCount == 0'>0%</div>
                    <div v-else>{{parseInt(parseInt(scope.row.count) / parseInt(scope.row.maxCount) * 100)}}%</div>
                </template>
            </el-table-column>
            <el-table-column prop="lastReplenishmengTime" label="上次补货时间" align="center" min-width="100">
                <template slot-scope="scope">
                    <div>{{scope.row.lastReplenishmengTime.split(' ')[0]}}</div>
                    <div>{{scope.row.lastReplenishmengTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="plantStatus" label="货道状态" align="center" min-width='100'>
                <template slot-scope="scope">
                    <div v-if='scope.row.plantStatus == 0'>正常</div>
                    <div v-if='scope.row.plantStatus == 1' style="color:red;">有异常</div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" min-width='100'>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="Goodsdetails(scope.$index, scope.row)">货道详情</el-button>
                    <el-button type="text" size="small" @click='ContainerLog(scope.$index, scope.row)'>货道日志</el-button>
                    <el-button type="text" size="small" @click='replenishment_order(scope.$index, scope.row)'>生成补货单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--  分页器  -->
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="search" />

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
    import { areas } from '@/area'
    import { serverAddress } from '@/config.json'
    import { mapState, mapActions } from 'vuex'
    import { Loading } from 'element-ui';
    export default {
        data() {
            return {
                loading: false,

                confirmAgainDialog: false, // 生成补货单
                repOrder_dialog_success: false, // 补货单生成成功
                repOrder_dialog_opendoor: false, // 补货单生成失败 - 设备正在开门
                repOrder_dialog_existing: false, // 已存在补货单 是否作废
                repOrder_dialog_GoodsEmpty: false, // 不需要补货
                repOrder_dialog_unfinished: false, // 有未完成补货单-不能生成

                invoiceOrder: [], // 补货单列表
                provinces: areas.filter(area => area.level === 1),    // 省
                cities: [],       // 市
                districts: [],    // 区
                searchData: {
                    vendorId: '',    // 货柜编号
                    startDate: '',
                    endDate: '',
                    memo: '',
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    sortCondition: 1,
                    sortType: 1
                },
                searchData1: {
                    vendorId: '',
                    memo: '',
                    startDate: '',
                    endDate: '',
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    sortCondition: 1,
                    sortType: 1
                },
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                ContainerMsg: [], // 货柜信息
                createvendorId: null,
            }
        },
        computed: {
            ...mapState(['role', 'pageNo', 'isFirstEnter'])
        },
        methods: {
            sortChange1(pageNo = 1) {
                /* todo 排序 */
                this.$store.dispatch('changepageNo', pageNo)
                if (this.searchData.provinceId === '请选择省') {
                    this.searchData1.provinceId = ''
                    this.searchData1.cityId = ''
                    this.searchData1.districtId = ''
                }
                if (this.searchData.cityId === '请选择市') {
                    this.searchData1.cityId = ''
                    this.searchData1.districtId = ''
                }
                if (this.searchData.districtId === '请选择区') {
                    this.searchData1.districtId = ''
                }
                if (this.searchData.provinceId !== '') {
                    this.searchData1.provinceId = parseInt(this.searchData.provinceId)
                }
                if (this.searchData.cityId !== '') {
                    this.searchData1.cityId = parseInt(this.searchData.cityId)
                }
                if (this.searchData.districtId !== '') {
                    this.searchData1.districtId = parseInt(this.searchData.districtId)
                }
                this.searchData1.sortCondition = this.searchData.sortCondition
                this.searchData1.sortType = this.searchData.sortType
                this.searchData1.vendorId = this.searchData.vendorId
                this.searchData1.memo = this.searchData.memo
                this.searchData1.startDate = this.searchData.startDate
                this.searchData1.endDate = this.searchData.endDate
                let requestData = Object.assign(this.searchData1, this.page)
                this.$xhr('deviceListApiB', requestData).success(res => {
                    this.devices = res.data
                    this.multipleSelection = JSON.parse(localStorage.getItem('deviceStr1'))
                    console.log(this.devices.length)
                    for (var i = 0; i < this.devices.length; i++) {
                        if (this.devices[i].provinceId === 0) {
                            this.devices[i].provinceId = ''
                        }
                        if (this.devices[i].cityId === 0) {
                            this.devices[i].cityId = ''
                        }
                        if (this.devices[i].districtId === 0) {
                            this.devices[i].districtId = ''
                        }
                        this.devices[i].provinceId = this.devices[i].provinceId + ''
                        this.devices[i].cityId = this.devices[i].cityId + ''
                        this.devices[i].districtId = this.devices[i].districtId + ''
                        this.provinces.forEach(e => {
                            if (e.code === this.devices[i].provinceId) {
                                this.devices[i].provinceId = e.name
                                const pcode = e.code.slice(0, 2)
                                this.cities = areas.filter(area => area.level === 2 && area.sheng === pcode)
                                this.cities.forEach(e => {
                                    if (e.code === this.devices[i].cityId) {
                                        this.devices[i].cityId = e.name
                                        const pcode = e.code.substr(0, 2)
                                        const ccode = e.code.substr(2, 2)
                                        this.districts = areas.filter(area => area.level === 3 && area.sheng === pcode && area.di === ccode)
                                        this.districts.forEach(e => {
                                            if (e.code === this.devices[i].districtId) {
                                                this.devices[i].districtId = e.name
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        this.devices[i].addressDetail = this.devices[i].provinceId + this.devices[i].cityId + this.devices[i].districtId + this.devices[i].address
                        this.devices[i].createTime = this.formatDate(new Date(this.devices[i].createTime)).slice(0, -8)
                        if (this.devices[i].replenishmentTime !== 0) {
                            this.devices[i].replenishmentTime = this.formatDate(new Date(this.devices[i].replenishmentTime))
                        } else {
                            this.devices[i].replenishmentTime = ''
                        }
                        // 货柜状态
                        switch (this.devices[i].status) {
                            case 4:
                                this.devices[i].status = '未投放'
                                break
                            case 5:
                                this.devices[i].status = '未设置商品'
                                break
                            case 1:
                                this.devices[i].status = '正常'
                                break
                            case 2:
                                this.devices[i].status = '补货中'
                                break
                            case 3:
                                this.devices[i].status = '异常'
                                break
                        }
                    }
                    this.page.total = res.total
                    this.searchData.sortType = 2
                })
            },
            // 改变省份
            changeProvince(code) {
                if (this.searchData.provinceId === '请选择省') {
                    this.cities = [];
                    this.searchData = {
                        vendorId: '',    // 货柜编号
                        startDate: '',
                        endDate: '',
                        memo: '',
                        provinceId: '',    // 省
                        cityId: '',    // 市
                        districtId: '',    // 区
                        sortCondition: 1,
                        sortType: 1
                    }
                    this.searchData1 = {
                        vendorId: '',
                        memo: '',
                        startDate: '',
                        endDate: '',
                        provinceId: '',    // 省
                        cityId: '',    // 市
                        districtId: '',    // 区
                        sortCondition: 1,
                        sortType: 1
                    }
                }
                const pCode = code.slice(0, 2)
                this.cities = areas.filter(area => area.level === 2 && area.sheng === pCode)
                if (!this.searchData.cityId.startsWith(pCode)) {
                    this.searchData.cityId = ''
                    this.searchData.districtId = ''
                }
                this.districts = []
                this.cities.unshift({ name: '请选择市', code: '请选择市' })
                this.searchData.cityId = ''
                this.searchData.districtId = ''
            },
            // 改变省城市
            changeCity(code) {
                if (this.searchData.cityId === '请选择市') {
                    this.districts = []
                }
                if (this.searchData.provinceId === '请选择省') {
                    this.cities = []
                    this.cities.unshift({ name: '请选择市', code: '请选择市' })
                }
                const pCode = code.substr(0, 2)
                const cCode = code.substr(2, 2)
                this.districts = areas.filter(area => area.level === 3 && area.sheng === pCode && area.di === cCode)
                if (!this.searchData.districtId.startsWith(code.substr(0, 4))) {
                    this.searchData.districtId = ''
                }
                this.districts.unshift({ name: '请选择区', code: '请选择区' })
                this.searchData.districtId = ''
            },
            // 查询
            search(pageNo = 1) {
                this.page.pageNo = pageNo
                this.$store.dispatch('changepageNo', pageNo)
                /* TODO 商品列表接口 */
                if (this.searchData.provinceId === '请选择省') {
                    this.searchData1.provinceId = ''
                    this.searchData1.cityId = ''
                    this.searchData1.districtId = ''
                }
                if (this.searchData.cityId === '请选择市') {
                    this.searchData1.cityId = ''
                    this.searchData1.districtId = ''
                }
                if (this.searchData.districtId === '请选择区') {
                    this.searchData1.districtId = ''
                }
                if (this.searchData.provinceId !== '') {
                    this.searchData1.provinceId = this.searchData.provinceId
                }
                if (this.searchData.cityId !== '') {
                    this.searchData1.cityId = this.searchData.cityId
                }
                if (this.searchData.districtId !== '') {
                    this.searchData1.districtId = this.searchData.districtId
                }
                this.searchData1.vendorId = this.searchData.vendorId
                this.searchData1.memo = this.searchData.memo
                this.searchData1.startDate = this.searchData.startDate
                this.searchData1.endDate = this.searchData.endDate
                // console.log(this.searchData1)
                let requestData = Object.assign(this.searchData1, this.page)

                // console.log(requestData)

                var url = `/v2/stock/vendors?`

                for (var i in requestData) {
                    if (requestData[i] != '' && requestData[i] != undefined) {
                        url += i + '=' + requestData[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);

                this.checkData(url)
            },
            checkData(url) {
                this.$http.get(url).then(res => {
                    // console.log(res)
                    this.ContainerMsg = res.data.vendorList;
                    this.page.total = res.data.total;
                    // 在售商品最大库存
                    this.ContainerMsg.map(v => {
                        v.maxCount = 0;
                        v.plantDtos.forEach((s, i) => {
                            if (s.maxCount != null) {
                                v.maxCount += s.maxCount
                            }
                        })
                    })
                    // 在售商品当前库存
                    this.ContainerMsg.map(v => {
                        v.count = 0;
                        v.plantDtos.map((s, i) => {
                            if (s.sku != null) {
                                s.sku.count = Math.floor(Math.abs(s.weight) / s.sku.weight);
                                // console.log(s.sku.count)
                                const offset = Math.abs(s.weight) % s.sku.weight
                                if (offset >= s.sku.weight * (1 - 0.5)) {
                                    s.sku.count = s.sku.count + 1
                                    s.error = 0
                                } else if (offset > s.sku.weight * 0.5) {
                                    s.error = 1
                                } else {
                                    s.error = 0
                                }
                                v.count += s.sku.count;
                            }

                        })
                    })
                    // 数据处理时间
                    this.ContainerMsg.map(v => {
                        function add0(m) { return m < 10 ? '0' + m : m }
                        function format(createTime) {
                            //shijianchuo是整数，否则要parseInt转换
                            var time = new Date(createTime);
                            var y = time.getFullYear();
                            var m = time.getMonth() + 1;
                            var d = time.getDate();
                            var h = time.getHours();
                            var mm = time.getMinutes();
                            var s = time.getSeconds();
                            return v.lastReplenishmengTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                        }
                        format(v.lastReplenishmengTime)
                        return v
                    })
                }, err => {
                    // console.log(err)
                    if (err.code == -1) {
                        window.location.hash = '/login'
                        this.$message.error('网络错误，请重新登录!');
                        return;
                    }
                })
            },
            // 货到详情
            Goodsdetails(idx, row) {
                // console.log(row)

                /* 货到详情 */
                this.$router.push({
                    path: '/container/ArrivalGoodsdetails',
                    query: {
                        data: JSON.stringify(row)
                    }
                })
            },
            // 货到日志
            ContainerLog(idx, row) {
                // 货到日志
                this.$router.push({
                    path: '/container/ContainerLog',
                    query: {
                        data: row.vendorId
                    }
                })
            },
            // 生成补货单
            replenishment_order(idx, row) {
                this.confirmAgainDialog = true;
                this.invoiceOrder = row;
            },
            // 确认生成补货单  -确认按钮
            confirmAgain_sure() {
                var loadingInstance = Loading.service({ loading: true });

                this.confirmAgainDialog = false;
                
                this.$http.post('/v1/business/order/replenishment', {
                    "vendorId": this.invoiceOrder.vendorId,
                    "cover": false
                }).then(res => {
                    console.log(res)
                    if (res.data.error == 113){
                        // 设备正在开门
                        loadingInstance.close()
                        this.repOrder_dialog_opendoor = true;
                        return;
                    }
                    if (res.data.error == 1011){
                        // 已有补货单 - 作废之前 覆盖
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
                        // 成功
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
            existing_sure(){

                var loadingInstance = Loading.service({ loading: true });

                this.$http.post('/v1/business/order/replenishment', {
                    "vendorId": this.invoiceOrder.vendorId,
                    "cover": true
                }).then(res => {
                    console.log(res)
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
            existing_notsure(){
                this.repOrder_dialog_existing = false;
            },
            // dialog 确定
            dialog_sure() {
                this.repOrder_dialog_success = false;
            },
            // dialog 立即查看
            dialog_ImmediatelyCheck() {
                this.repOrder_dialog_success = false;
                this.$router.push('/container/repMentOrdManagement')
            }
        },
        activated() {
            if (this.$store.state.isFirstEnter) {
                this.searchData = {
                    vendorId: '',
                    userId: '',
                    startDate: '',
                    endDate: '',
                    memo: '',
                    sortCondition: 1,
                    sortType: 1
                }
                this.searchData1 = {
                    vendorId: '',
                    userId: '',
                    startDate: '',
                    endDate: '',
                    memo: '',
                    sortCondition: 1,
                    sortType: 1
                }
                this.provinces = areas.filter(area => area.level === 1)
                this.provinces.unshift({ name: '请选择省', code: '请选择省' })
                this.cities = []
                this.districts = []
                this.cities.unshift({ name: '请选择市', code: '请选择市' })
                this.districts.unshift({ name: '请选择区', code: '请选择区' })
                this.search();
            }
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
            this.search();
        }
    }

</script>
<style scoped>
    .InventoryStatus {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }
    /*  dialog  */

    .dialog_tit {
        padding: 50px 0;
        text-align: center;
    }

    .dialog_foot {
        padding-bottom: 20px;
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

    .address-select {
        width: 140px;
    }

    .page {
        padding: 16px 0;
    }
</style>
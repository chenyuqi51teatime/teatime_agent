<template>
    <div class="ContainerGoods">
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
                <el-input class="address-select" v-model="searchData.id"></el-input>
            </el-form-item>
            <!--  查询  -->
            <el-form-item>
                <el-button type="warning" class="checkBtn" @click.native.prevent="search(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <el-button type="warning" class="nAddTemp" @click='setTemp_batch'>批量设置模板</el-button>

        <!--  table表格  -->
        <el-table :data="devices" border style="width: 100%" :show-header="header" inline class="demo-table-expand" @selection-change='containerInfor'>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="货柜编号" align="center" width="100" fixed></el-table-column>
            <el-table-column prop="address" label="摆放地址" align="center" min-width="200"></el-table-column>
            <el-table-column prop="recommendSkuCount" label="备选商品种类" align="center" min-width="150">
                <template slot-scope="scope">
                    <span class='stat' v-if='scope.row.recommendSkuCount == 0' @click="details(scope.$index, scope.row)">未设置</span>
                    <span class='stat' v-if='scope.row.recommendSkuCount != 0' @click="details(scope.$index, scope.row)">{{scope.row.recommendSkuCount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="skuKind" label="当前在售商品种类" align="center" min-width="150"></el-table-column>
            <el-table-column prop="" label="操作" align="center" min-width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="details(scope.$index, scope.row)" class='details'>商品详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--  分页器  -->
        <el-pagination v-show="page.totalPage >= 1" @current-change='search' :current-page.sync="page.pageNo" class="page"
            layout="total, prev, pager, next" :total="page.total">
        </el-pagination>

        <!--  选择模板dialog  -->
        <el-dialog title="选择模板" :visible.sync="SelectTemplate" @close='notSure'>
            <el-form :model="changeTemplate" label-width="80px">
                <el-form-item label="模板名称">
                    <!--  模板名称  -->
                    <el-input class="address-select" v-model="changeTemplate.templateName"></el-input>
                    <!--  查询  -->
                    <el-button type="warning" class="checkTempBtn" @click='checkTempName'>查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="templateName" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
                <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <span class="rad_ck radio_check" @click='checked_Btn(scope.row,scope.$index)'></span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="keepBtnTemp">保 存</el-button>
                <el-button @click="notSure">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 未勾选货柜提示dialog -->
        <el-dialog title="提示" :visible.sync="SelectTempDialog" width="30%">
            <div class="exitMsg">未勾选货柜！</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="SelectTempDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { areas } from '@/area'
    import { serverAddress } from '@/config.json'
    import { mapState, mapActions } from 'vuex'
    import {MessageBox} from 'element-ui'
    export default {
        name: 'ContainerGoods',
        data() {
            return {
                SelectTemplate: false, // 选择模板
                templateName: [], // dialog模板名称
                SelectTempDialog: false, // 未勾选货柜提示
                devices: [],
                provinces: areas.filter(area => area.level === 1),
                cities: [],
                districts: [],
                radio: '1',
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                page2: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 999999,
                    total: 0
                },
                searchData: {
                    id: '',    // 货柜编号
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
                    id: '',
                    memo: '',
                    startDate: '',
                    endDate: '',
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    sortCondition: 1,
                    sortType: 1
                },
                changeTemplate: {  // 模板名称
                    templateName: ''
                },
                containerInforMsg: [], // 批量设置模板
                checked_temp: [], // 选中的模板

            }
        },
        computed: {
            ...mapState(['role', 'pageNo', 'isFirstEnter'])
        },
        methods: {
            // 单选
            checked_Btn(row, idx) {
                var checks = document.getElementsByClassName('rad_ck');

                for (var i = 0; i < checks.length; i++) {
                    checks[i].className = 'rad_ck radio_check'
                }

                checks[idx].className = 'rad_ck radio_checked'

                // 设置选中模板
                this.checked_temp = row;
            },
            // 改变省份
            changeProvince(code) {
                if (this.searchData.provinceId === '请选择省') {
                    this.cities = [];
                    this.searchData = {
                        id: '',    // 货柜编号
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
                        id: '',
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
                // this.multipleSelection = JSON.parse(localStorage.getItem('deviceStr1'))
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
                this.searchData1.id = this.searchData.id
                this.searchData1.memo = this.searchData.memo
                this.searchData1.startDate = this.searchData.startDate
                this.searchData1.endDate = this.searchData.endDate

                let requestData = Object.assign(this.searchData1, this.page)

                this.$xhr('deviceListApiB', requestData).success(res => {
                    if (res.error) {
                        window.location.hash = '/login'
                        this.$message.error('网络错误，请重新登录!');
                        return;
                    }
                    // console.log(res)
                    this.devices = res.data // 设置表格数据
                    this.page.total = res.total // 设置表格页数
                    // 拼接省市区+详细地址
                    // this.devices.map((v, i) => {
                    //     var ssq = '';
                    //     areas.forEach((val) => {
                    //         if (val.code == v.provinceId) ssq += val.name;
                    //     })
                    //     areas.forEach((val) => {
                    //         if (val.code == v.cityId) ssq += val.name;
                    //     })
                    //     areas.forEach((val) => {
                    //         if (val.code == v.districtId) ssq += val.name;
                    //     })
                    //     v.addressDetailMsg = ssq + v.address;
                    // })
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
                }).error(err => {
                    // console.log(err)
                })
            },
            // 取消
            notSure() {
                // 取消单选按钮
                var checks = document.getElementsByClassName('rad_ck');

                for (var i = 0; i < checks.length; i++) {
                    checks[i].className = 'rad_ck radio_check'
                }
                // 设置选中模板
                this.checked_temp = [];
                this.changeTemplate.templateName = '';
                this.getTemplateList();
                this.SelectTemplate = false;
            },
            // 商品详情
            details(idx, row) {
                var DataArr = [];
                this.$http.get(`/v2/goods/vendor/${row.id}`).then(res => {
                    console.log(res)
                    res.data.data.forEach((v, i) => {
                        DataArr.push({
                            id: v.id,
                            name: v.productName,
                            productId: v.productId,
                            property: v.property,
                            skus: [v]
                        })
                    })
                    console.log(DataArr)
                    this.$router.push({
                        path: '/container/GoodsDetails',
                        query: {
                            data: JSON.stringify(DataArr),
                            vendorIds: row.id
                        }
                    })
                })
            },
            // 货柜信息
            containerInfor(data) {
                this.containerInforMsg = data;
            },
            // 批量设置模板
            setTemp_batch() {
                if (this.containerInforMsg.length <= 0) {
                    // 未勾选货柜
                    this.SelectTempDialog = true;

                } else {
                    // 勾选货柜
                    this.SelectTemplate = true;
                }
                // console.log(this.containerInforMsg)
            },
            // dialog选择模板
            getTemplateList() {
                // templateName
                this.$http.get('/v2/goods/templates?totalPage=1&pageNo=1&pageSize=9999&total=0').then(res => {
                    this.templateName = res.data.datas;
                    // 数据处理时间
                    this.templateName.map(v => {
                        // console.log(v.createTime)
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
                            return v.createTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                        }
                        format(v.createTime)
                        return v
                    })
                })
            },
            // 保存模板
            keepBtnTemp() {
                if (this.checked_temp.length < 1) {
                    this.$alert('未勾选模板');
                    return false;
                }
                var objs = {
                    vendorIds: [],
                    templateId: this.checked_temp.id
                }
                this.containerInforMsg.forEach((v, i) => {
                    objs.vendorIds.push(v.id)
                })
                // console.log(objs)
                this.$xhr('selectTem', objs).success(res => {
                    this.$message('更改成功!')
                    this.SelectTemplate = false;
                    this.search();
                    this.notSure();
                }).error(err => {
                    this.$alert('请先删除货柜已有商品!');
                    console.log(err)
                })

            },
            // 查询模板名称
            checkTempName() {
                var _this = this;

                let requestData = Object.assign(this.changeTemplate, this.page2);

                var url = '/v2/goods/templates?'

                for (var i in requestData) {
                    if (requestData[i]) {
                        url += i + '=' + requestData[i] + '&'
                    }
                }

                if (url.slice(-1) == '&') {
                    url = url.substring(0, url.length - 1)
                }

                // console.log(url)

                this.$http.get(url)
                    .then(function (res) {
                        if (res.data.success) {
                            _this.templateName = res.data.datas;
                        }
                    })
            }
        },
        activated() {
            if (this.$store.state.isFirstEnter) {
                this.searchData = {
                    id: '',
                    userId: '',
                    startDate: '',
                    endDate: '',
                    memo: '',
                    sortCondition: 1,
                    sortType: 1
                }
                this.searchData1 = {
                    id: '',
                    userId: '',
                    startDate: '',
                    endDate: '',
                    memo: '',
                    sortCondition: 1,
                    sortType: 1
                }
                this.search()
                this.provinces = areas.filter(area => area.level === 1)
                this.provinces.unshift({ name: '请选择省', code: '请选择省' })
                this.cities = []
                this.districts = []
                this.cities.unshift({ name: '请选择市', code: '请选择市' })
                this.districts.unshift({ name: '请选择区', code: '请选择区' })
                // this.setSearchDate()
            } else { }
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
            if (this.$route.name != 'GoodsDetails') {
                localStorage.removeItem('templateStr')             //  路由离开就要移除
            }
            this.search();
            this.getTemplateList();
        }
    }

</script>
<style scoped>
    .ContainerGoods {
        width: 100%;
        height: 100%;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }
    /*  批量设置模板按钮  */

    .nAddTemp {
        margin: 0 0 10px 0;
    }
    /*  分页器  */

    .page {
        margin-top: 14px;
    }

    .dialog-footer {
        text-align: center;
    }

    .address-select {
        width: 140px;
    }

    .stat {
        cursor: pointer;
        text-decoration: underline;
        color: #f5d978;
    }

    .radio_check {
        display: inline-block;
        width: 14px;
        height: 14px;
        cursor: pointer;
        border-radius: 50%;
        border: 1px solid #f5d978;
    }

    .radio_checked {
        display: inline-block;
        width: 5px;
        height: 5px;
        cursor: pointer;
        border-radius: 50%;
        border: 5px solid #f5d978;
    }

    .details {
        font-size: 14px;
    }

    .address-select {
        width: 140px;
    }

    .checkTempBtn{
        margin-left: 10px;
    }
</style>
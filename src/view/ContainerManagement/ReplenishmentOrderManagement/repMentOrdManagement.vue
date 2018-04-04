<template>
    <div class="repMentOrdManagement" v-loading="loading">
        <div class="tabs_tit">
            <div class="routerBox actives" @click='search(1,1,0,true)'>
                <span>待补货</span>
                <span> ({{forRlen}}) </span>
            </div>
            <div class="routerBox" @click='search(2,1,1,true)'>
                <span>补货中</span>
                <span> ({{forplen}}) </span>
            </div>
            <div class="routerBox" @click='search(4,1,2,true)'>
                <span>待审核</span>
                <span> ({{ToAulen}}) </span>
            </div>
            <div class="routerBox" @click='search(3,1,3,true)'>
                <span>已完成</span>
                <span>  </span>
            </div>
        </div>

        <!-- 查询货柜信息 -->
        <div class="check_container">
            <span class="tit">摆放地址</span>
            <el-select class="address-select spacing" v-model="searchData.provinceId" @change="changeProvince" placeholder="请选择省">
                <el-option v-for="p in provinces" :label="p.name" :value="p.code" :key="p.id"></el-option>
            </el-select>
            <el-select class="address-select spacing" v-model="searchData.cityId" @change="changeCity" placeholder="请选择市">
                <el-option v-for="c in cities" :label="c.name" :value="c.code" :key="c.id"></el-option>
            </el-select>
            <el-select class="address-select spacing" v-model="searchData.districtId" placeholder="请选择区">
                <el-option v-for="d in districts" :label="d.name" :value="d.code" :key="d.id"></el-option>
            </el-select>

            <span class="tit">货柜编号</span>

            <el-input class="address-select spacing" v-model="searchData.vendorId"></el-input>

            <el-button type="warning" @click="search_S" class="search_btn">查询</el-button>
        </div>

        <!--  表格展示数据  -->
        <el-table :data="DataContainers" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
            <el-table-column prop="replenishmentOrderId" label="补货单号" align="center" min-width='70'></el-table-column>

            <el-table-column prop="vendorId" label="货柜编号" align="center" min-width='70'></el-table-column>

            <el-table-column prop="vendorAddress" label="摆放地址" align="center" min-width='160'></el-table-column>

            <el-table-column prop="createUserName" label="创建人" align="center" width='100' v-if='searchData.state == 1'></el-table-column>

            <el-table-column prop="createTime" label="创建时间" align="center" v-if='searchData.state == 1'></el-table-column>

            <el-table-column prop="deliveryUserName" label="补货员" align="center" width='100' v-if='searchData.state != 1'></el-table-column>

            <el-table-column prop="phone" label="手机号" align="center" width='130' v-if='searchData.state != 1'></el-table-column>

            <el-table-column label="打印时间" align="center" v-if='searchData.state != 1'>
                <template slot-scope="scope" v-if="scope.row.printTime.split(' ')[0].split('-')[0] != '1970'">
                    <div>{{scope.row.printTime.split(' ')[0]}}</div>
                    <div>{{scope.row.printTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="领取时间" align="center" v-if='searchData.state != 1'>
                <template slot-scope="scope" v-if="scope.row.accessTime.split(' ')[0].split('-')[0] != '1970'">
                    <div>{{scope.row.accessTime.split(' ')[0]}}</div>
                    <div>{{scope.row.accessTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="首次开门" align="center" v-if='searchData.state != 1'>
                <template slot-scope="scope" v-if="scope.row.firstOpendoorTime.split(' ')[0].split('-')[0] != '1970'">
                    <div>{{scope.row.firstOpendoorTime.split(' ')[0]}}</div>
                    <div>{{scope.row.firstOpendoorTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="上次补货时间" align="center" v-if='searchData.state == 2'>
                <template slot-scope="scope" v-if="scope.row.lastClosedoorTime.split(' ')[0].split('-')[0] != '1970'">
                    <div>{{scope.row.lastClosedoorTime.split(' ')[0]}}</div>
                    <div>{{scope.row.lastClosedoorTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>

            <el-table-column prop="lastClosedoorTime" label="最后关门" align="center" v-if='searchData.state == 4 || searchData.state == 3'>
                <template slot-scope="scope" v-if="scope.row.lastClosedoorTime.split(' ')[0].split('-')[0] != '1970'">
                    <div>{{scope.row.lastClosedoorTime.split(' ')[0]}}</div>
                    <div>{{scope.row.lastClosedoorTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>

            <el-table-column prop="finishTime" label="审核时间" align="center" v-if='searchData.state == 3'>
                <template slot-scope="scope" v-if="scope.row.finishTime.split(' ')[0].split('-')[0] != '1970'">
                    <div>{{scope.row.finishTime.split(' ')[0]}}</div>
                    <div>{{scope.row.finishTime.split(' ')[1]}}</div>
                </template>
            </el-table-column>

            <!-- 功能 -->
            <el-table-column prop="" label="详情" align="center" width='120'>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click='doPrint(scope.$index, scope.row)' v-if='searchData.state == 1'>打印</el-button>
                    <el-button type="text" size="small" @click="checkDetails(scope.$index, scope.row)" v-if='searchData.state == 2'>查看</el-button>
                    <el-button type="text" size="small" @click="audit(scope.$index, scope.row)" v-if='searchData.state == 4'>审核</el-button>
                    <el-button type="text" size="small" @click="checkMsg(scope.$index, scope.row)" v-if='searchData.state == 3'>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  分页器  -->
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="page_change" />

    </div>
</template>
<script>
    import { areas } from '@/area';
    import { mapState, mapActions } from 'vuex';
    import { Loading } from 'element-ui';

    export default {
        data() {
            return {
                loading: false, // 加载dialog
                sty: 0, // 样式
                flag: true, // 是否更新摆放地址
                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区

                searchData: {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    state: 1,
                },

                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },

                DataContainers: [], // 表格数据

                forRlen: 0, // 待补货
                forplen: 0, // 补货中
                ToAulen: 0, // 待审核
                // complen: 0, // 已完成

                
            }
        },
        computed: {
            ...mapState(['role', 'pageNo', 'isFirstEnter'])
        },
        methods: {
            // 补货单状态 1 待领取 2 进行中 3已完成 新增 4 审核中
            // search(请求列表状态1 2 4 3, 分页, 列表样式, 是否更新省市区,)
            // 改变省份
            changeProvince(code) {
                if (this.searchData.provinceId === '请选择省') {
                    this.cities = [];  // 清空市数据
                    this.districts = [];  // 清空区数据
                    this.searchData.provinceId = '';
                    this.searchData.cityId = '';
                    this.searchData.districtId = '';
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
            // 改变城市
            changeCity(code) {
                if (this.searchData.cityId === '请选择市') {
                    this.districts = []
                    this.searchData.districtId = '';
                }
                if (this.searchData.provinceId === '请选择省') {
                    this.cities = []
                    this.searchData.cityId = '';
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
            // 更改样式
            changeClass(idx) {

                var rous = document.getElementsByClassName('routerBox');

                if (rous.length > 0) {

                    for (var i = 0; i < rous.length; i++) {
                        rous[i].className = 'routerBox'
                    }

                    rous[idx].className = 'routerBox actives'

                }
            },
            // 获取所有商品数量
            getlen() {
                this.$http.get('/v2/stock/replenishments?state=1&totalPage=1&pageNo=1&pageSize=99999').then(res => {
                    if (res.data.replenishmentList) this.forRlen = res.data.replenishmentList.length;
                })
                this.$http.get('/v2/stock/replenishments?state=2&totalPage=1&pageNo=1&pageSize=99999').then(res => {
                    if (res.data.replenishmentList) this.forplen = res.data.replenishmentList.length;
                })
                this.$http.get('/v2/stock/replenishments?state=4&totalPage=1&pageNo=1&pageSize=99999').then(res => {
                    if (res.data.replenishmentList) this.ToAulen = res.data.replenishmentList.length;
                })
                this.$http.get('/v2/stock/replenishments?state=3&totalPage=1&pageNo=1&pageSize=99999').then(res => {
                    if (res.data.replenishmentList) this.complen = res.data.replenishmentList.length;
                })
            },
            // 分页
            page_change(pageNo) {
                this.search(this.searchData.state, pageNo, this.sty, false);
            },
            // 查询
            search(state, pageNo = 1, idx, flag) {

                this.flag = flag;

                if (this.flag) {
                    this.searchData.provinceId = '';
                    this.searchData.cityId = '';
                    this.searchData.districtId = '';
                    this.searchData.vendorId = '';
                }

                this.searchData.state = state; // 显示的列表 1 2 4 3
                this.sty = idx, // 列表样式 0 1 2 3 
                this.page.pageNo = pageNo; // 分页

                if (this.searchData.provinceId === '请选择省') {
                    this.searchData.provinceId = '';
                    this.searchData.cityId = '';
                    this.searchData.districtId = '';
                }
                if (this.searchData.cityId === '请选择市') {
                    this.searchData.cityId = '';
                    this.searchData.districtId = '';
                }
                if (this.searchData.districtId === '请选择区') {
                    this.searchData.districtId = '';
                }

                let requestData = Object.assign(this.searchData, this.page)

                var url = '/v2/stock/replenishments?';

                for (var i in requestData) {

                    if (requestData[i] != '' && requestData[i] != null && requestData[i] != undefined) {

                        url += i + '=' + requestData[i] + '&';

                    }
                }

                url = url.slice(0, url.length - 1);

                new Promise((res, rej) => {
                    this.ObtRequestData(url); // 获取数据
                    // this.getlen()// 获取数据长度
                    res()
                }).then(res => {
                    this.changeClass(idx); // 更改样式
                })

            },
            // 查询_S
            search_S() {
                this.search(this.searchData.state, 1, this.sty, false)
            },
            // 请求表格数据
            ObtRequestData(url) {
                // console.log(url)
                var loadingInstance = Loading.service({ loading: true }); // 加载菊花 dialog
                this.DataContainers = []; // 重载数据

                this.$http.get(url).then(res => {
                    // console.log(res.data)
                    this.forRlen = res.data.waitRepNum, // 待补货数据 len
                    this.forplen = res.data.inRepNum, // 补货中数据 len
                    this.ToAulen = res.data.waitCheckNum, // 待审核数据 len
                    // this.complen = res.data, // 已完成数据 len
                    this.DataContainers = res.data.replenishmentList; //设置数据
                    this.page.total = res.data.total || 0; // 分页
                    loadingInstance.close(); // 加载取消

                    if (this.DataContainers) {
                        // 创建时间转换
                        this.DataContainers.map(v => {
                            function add0(m) { return m < 10 ? '0' + m : m }
                            function format(createTime) {
                                //时间戳是整数，否则要parseInt转换
                                var time = new Date(createTime);
                                var y = time.getFullYear();
                                var m = time.getMonth() + 1;
                                var d = time.getDate();
                                var h = time.getHours();
                                var mm = time.getMinutes();
                                var s = time.getSeconds();
                                return v.createTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }
                            format(v.createTime);
                            return v
                        })
                        // 打印时间转换
                        this.DataContainers.map(v => {
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
                                return v.printTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }
                            format(v.printTime)
                            return v
                        })
                        // 领取时间转换
                        this.DataContainers.map(v => {
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
                                return v.accessTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }
                            format(v.accessTime)
                            return v
                        })
                        // 首次开门时间转换
                        this.DataContainers.map(v => {
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
                                return v.firstOpendoorTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }
                            format(v.firstOpendoorTime)
                            return v
                        })
                        // 上次补货时间转换
                        this.DataContainers.map(v => {
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
                                return v.lastClosedoorTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }
                            format(v.lastClosedoorTime)
                            return v
                        })
                        // 审核时间转换
                        this.DataContainers.map(v => {
                            // console.log(v)
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
                                return v.finishTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }
                            format(v.finishTime)
                            return v
                        })
                    }

                }, err => {
                    console.log(err)
                })
            },
            // 打印 state == 1
            doPrint(idx, row) {
                // console.log(`/v2/stock/replenishments/${row.replenishmentOrderId}?type=1`)
                // console.log(row.replenishmentOrderId)
                this.$http.get(`/v2/stock/replenishments/${row.replenishmentOrderId}?type=1`).then(res => {
                    // console.log('打印成功');
                    var nurl = window.location.href.split('#')[0];
                    var toUrl = nurl + `#/prints?orderData=${JSON.stringify(row)}&skuDatas=${JSON.stringify(res.data)}`;
                    window.open(toUrl, 'name');
                }, err => {
                    // this.$router.push('/login')
                    console.log(err)
                })
            },
            // 查看详情 state == 2
            checkDetails(idx, row) {
                
                this.$http.get(`/v2/stock/replenishments/${row.replenishmentOrderId}`).then(res => {
                    // console.log(res.data)
                    this.$router.push({
                        path: '/container/RepairInvoiceCheck',
                        query: {
                            skuDatas: JSON.stringify(res.data),
                            vendormsg: JSON.stringify(row),
                            state: 0,
                            cls: 1
                        }
                    })
                }, err => {
                    console.log(err)
                })
            },
            // 审核 state == 4
            audit(idx, row) {
                this.$http.get(`/v2/stock/replenishments/${row.replenishmentOrderId}`).then(res => {
                    // console.log(res.data)
                    this.$router.push({
                        path: '/container/RepairInvoiceCheck',
                        query: {
                            orderData: JSON.stringify(row),
                            skuDatas: JSON.stringify(res.data),
                            vendormsg: JSON.stringify(row),
                            state: 1,
                            cls: 2
                        }
                    })
                }, err => {
                    console.log(err)
                })
            },
            // 查看 state == 3
            checkMsg(idx, row) {
                this.$http.get(`/v2/stock/replenishments/${row.replenishmentOrderId}`).then(res => {
                    console.log(res)
                    this.$router.push({
                        path: '/container/RepairInvoiceCheck',
                        query: {
                            skuDatas: JSON.stringify(res.data),
                            vendormsg: JSON.stringify(row),
                            state: 0,
                            cls: 3
                        }
                    })
                }, err => {
                    console.log(err)
                })
            }
        },
        activated() {
            if (this.$store.state.isFirstEnter) {
                this.searchData = {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    state: 1,
                }
                
                this.provinces = areas.filter(area => area.level === 1)
                this.provinces.unshift({ name: '请选择省', code: '请选择省' })
                this.cities = []
                this.districts = []
                this.cities.unshift({ name: '请选择市', code: '请选择市' })
                this.districts.unshift({ name: '请选择区', code: '请选择区' })
                
                if (sessionStorage.getItem('RepairInvoiceAudit') == 3){
                    var sta = sessionStorage.getItem('RepairInvoiceAudit');
                    this.search(sta, 1, sta, true);
                    sessionStorage.removeItem('RepairInvoiceAudit'); // 清除
                    return;
                }

                this.search(1, 1, 0, true);
            }
            
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
        },

    }

</script>
<style scoped>
    a {
        display: inline-block;
    }

    .repMentOrdManagement {
        width: 100%;
        height: 100%;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .tabs_tit {
        width: 500px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #E0E1E2;
        display: flex;
        font-size: 14px;
        text-align: center;
    }

    .routerBox {
        cursor: pointer;
        flex: 1;
    }

    .actives {
        /* line-height: 50px; */
        border-bottom: 2px solid #fcd900;
        color: #fcd900;
        background: white;
    }

    /* 选择条件container */

    .check_container {
        /* border: 1px solid blue; */
        padding: 20px 0;
    }

    /*  标题  */

    .tit {
        margin-right: 10px;
        font-size: 14px;
    }

    /*  选择城市间距  */

    .address-select {
        width: 140px;
    }

    .spacing {
        margin-right: 8px;
    }

    /* 分页 */

    .page {
        padding: 20px 0;
    }
</style>
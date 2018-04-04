<template>
    <div class="OrderStatistics">
        <!--  货柜框  -->
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

            <el-input class="address-select venderidBox" v-model="searchData.vendorId" placeholder="请输入货柜编号"></el-input>
        </div>
        <!--  订单框  -->
        <div class="check_container">
            <span class="tit">订单状态</span>
            <el-select class="address-select spacing" v-model="searchData.reviewStatus" placeholder="全部">
                <el-option v-for="p in OrderSta" :label="p.name" :value="p.reviewStatus" :key="p.id"></el-option>
            </el-select>
            <span class="tit">订单编号</span>
            <el-input class="address-select spacing" v-model="searchData.orderId" placeholder="请输入订单编号"></el-input>
            <span class="tit">用户编号</span>
            <el-input class="address-select spacing" v-model="searchData.userId" placeholder="请输入用户编号"></el-input>
            <span class="tit">手机号</span>
            <el-input class="address-select spacing" v-model="searchData.phone" placeholder="请输入手机号"></el-input>

            <el-button type="warning" @click="search(1)" class="search_btn">查询</el-button>
        </div>
        <!--  表格展示数据  -->
        <el-table :data="DataContainers" style="width: 100%" :show-header="header" inline>
            <el-table-column prop="orderId" label="订单编号" align="center" min-width='100'></el-table-column>
            <el-table-column prop="" label="订单金额（元）" align="center" min-width='140'>
                <template slot-scope='scope'>
                    <div>{{ (scope.row.total * 1).toFixed(2) }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="订单创建时间" align="center" min-width='140'>
                <template slot-scope="scope" v-if='scope.row.createTime'>
                    <div>{{scope.row.createTime.split(' ')[0]}}</div>
                    <div>{{scope.row.createTime.split(' ')[1].split('.')[0]}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="vendorId" label="货柜编号" align="center" min-width='120'></el-table-column>
            <el-table-column prop="userId" label="用户编号" align="center" min-width='120'></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center" min-width='120'></el-table-column>
            <el-table-column prop="reviewStatus" label="订单状态" align="center" min-width='120'></el-table-column>
            <el-table-column prop="" label="详情" align="center" min-width='120'>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="AuditOrder(scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  分页器  -->
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="search" />
    </div>
</template>
<script>
    import { areas } from '@/area'

    export default {
        data() {
            return {
                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区
                
                // 订单状态
                OrderSta: [
                    {
                        id: 0,
                        name: '全部',
                        reviewStatus: ''
                    },
                    {
                        id: 1,
                        name: '已审核',
                        reviewStatus: 2
                    },
                    {
                        id: 2,
                        name: '未审核',
                        reviewStatus: '0'
                    }
                ],

                searchData: {
                    provinceId: '',    // 省 
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    status: '', // 订单状态
                    orderId: '', // 订单编号
                    userId: '', // 用户编号
                    phone: '', // 手机号
                },

                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },

                DataContainers: [], // 表格数据

            }
        },
        
        methods: {
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
            // 查询
            search(pageNo = 1) {
                
                this.page.pageNo = pageNo
                
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
                if (this.searchData.startDate == '' || this.searchData.endDate == '') {
                    this.$message.error('请输入时间！');
                    return;
                }

                let requestData = Object.assign(this.searchData, this.page)

                // console.log(requestData)

                var url = '/v2/vieworder/list?';

                for (var i in requestData) {
                    if (requestData[i] != '' && requestData[i] != null && requestData[i] != undefined) {
                        url += i + '=' + requestData[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                
                this.ObtRequestData(url)

            },
            // 请求表格数据
            ObtRequestData(url) {
                console.log(url)
                
                this.$http.get(url).then(res => {
                    console.log(res.data)
                    this.DataContainers = res.data.orderViewDtoList;
                    this.page.total = res.data.total;

                    if (!this.DataContainers) return;
                    
                    // 处理订单状态
                    this.DataContainers.forEach(e => {
                        switch (e.reviewStatus) {
                            case 0: e.reviewStatus = '未审核'
                                break
                            case 2: e.reviewStatus = '审核完成'
                                break
                            case 9: e.reviewStatus = '审核完成'
                                break
                            default: e.reviewStatus = ''
                        }
                    })

                    // 处理时间
                    this.DataContainers.map((v,i) => {
                        v.createTime = v.createTime.slice(0,-2)
                    })

                }, err => {
                    console.log(err)
                })
            },
            // 审核
            AuditOrder(row){
                var orderId = row.orderId;
                var vendorId = row.vendorId;
                // console.log(orderId,vendorId)
                this.$router.push(`/container/AuditOrder/${orderId}/${vendorId}`)
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
        },
    }

</script>
<style scoped>
    .OrderStatistics {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .check_container {
        /* border: 1px solid blue; */
        padding: 10px 0;
    }

    /*  标题  */

    .tit {
        margin-right: 10px;
        font-size: 14px;
    }

    /*  选择时间按钮  */

    .check_time_btn {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid rgb(217, 215, 191);
        color: rgb(61, 59, 31);
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        padding: 10px 15px;
        font-size: 14px;
        border-radius: 4px;
        margin-right: 6px;
    }

    /*  选择时间按钮 - 选中状态 */

    .active {
        border: 1px solid #f7ba2a;
        background: #f7ba2a;
        color: white;
    }

    /*  查询按钮  */

    .search_btn {
        margin-left: 10px;
    }

    /*  选择城市间距  */

    .address-select {
        width: 140px;
    }

    .spacing {
        margin-right: 6px;
    }

    /*  分页器  */

    .page {
        padding: 16px 0;
    }

    /*  dialog 订单详情  */

    .orderMsgA {
        width: 100%;
        height: 100px;
        display: flex;
    }

    .orderMsg_left {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .orderMsg_left>div {
        flex: 1;
    }

    .orderMsg_right {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .orderMsg_right>div {
        flex: 1;
    }

    .orderMsgB {
        width: 100%;
        height: 66px;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #999;
    }

    .orderMsgB>div {
        flex: 1;
    }

    .orderlist {
        padding: 20px 0;
        border-bottom: 1px solid #999;
        text-align: left;
    }

    .orderlist_container {
        margin-left: 100px;
        width: 250px;
        display: flex;
    }

    .orderImg {
        width: 60px;
        height: 60px;
        margin: 0 40px 0 0;
        /* border: 1px solid red; */
    }

    .orderImg>img {
        width: 100%;
        height: 100%;
    }

    .orderslists {
        background: white;
    }

    .orderslists>p {
        line-height: 18px;
        font-size: 12px;
    }

    .footMsgA {
        padding: 20px 0px 0px 0;
        border-bottom: 1px solid #999;
    }

    .footMsgA>div {
        box-sizing: border-box;
        padding: 4px 0px;
        display: flex;
        justify-content: space-between;
    }

    .footMsgB {
        padding: 10px 0px 0px 0;
    }

    .footMsgB>div {
        box-sizing: border-box;
        padding: 4px 0px;
        display: flex;
        justify-content: space-between;
    }

    .PayWay {
        padding: 10px 0px 0px 0;
        border-top: 1px solid #999;
    }

    .PayWay>div {
        box-sizing: border-box;
        padding: 4px 0px;
        display: flex;
        justify-content: space-between;
    }
</style>
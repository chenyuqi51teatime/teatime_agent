<template>
    <div id="EditReplenisher">
        <!-- 补货员信息详情 -->
        <div class="check_container" v-if="state == 'editor' ">

            <span class="tit">姓名</span>

            <el-input class="replenisherMes spacing" v-model="replenisherData.userId" placeholder="请输入姓名"></el-input>

            <span class="tit">手机号</span>

            <el-input class="replenisherMes spacing" v-model="replenisherData.phone" placeholder="请输入手机号"></el-input>
        </div>

        <div class="prompt" v-if="state == 'through' "> 确定通过此补货员申请吗？ </div>

        <div class="prompt"> 设置补货员管理货柜： </div>

        <!-- 货柜信息 -->
        <div class="containerMessage">
            <!-- 查询货柜信息 -->
            <div class="check_container" style="padding:40px 0;">
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

                <el-button type="warning" @click="search(1)" class="search_btn">查询</el-button>

            </div>
            <!--  表格展示数据  -->
            <div class="table_body">
                <!-- 左部表格 -->
                <div class="table_left">
                    <el-table :data="DataContainers" border style="width:100%;" :show-header="header" inline @selection-change='containerInfor'>

                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column prop="id" label="货柜编号" align="center" min-width='120'></el-table-column>

                        <!-- <el-table-column prop="address" label="摆放地址" align="center" min-width='220'></el-table-column> -->

                        <el-table-column label="摆放地址" min-width="300">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top" v-if="scope.row.abbreviatedAddress !== null">
                                    <p>地址 : {{ scope.row.address }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ scope.row.abbreviatedAddress }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
                <!-- 中间按钮 -->
                <div class="table_center">
                    <el-button type="warning" class="add_vendorId" @click="ReplenishmentPart">添加 <span style="font-size:14px;font-weight:600;">-></span>
                    </el-button>
                </div>
                <!-- 右部表格 -->
                <div class="table_right">
                    <!-- 表头 -->
                    <div class="tab">
                        <div class="thead">
                            <div>货柜编号</div>
                            <div><el-button type="text" size="small" @click="clear">清 空</el-button></div>
                        </div>
                        <div class="tbody">
                            <div class="tr" v-for='(v, i) in Has_vendorId'>
                                <div class="td">{{v}}</div>
                                <div class="td"><el-button type="text" size="small" @click="del_vendorId(i)">删除</el-button></div>
                            </div>
                            <div class="tr" v-for=' i in count'>
                                <div class="td"></div>
                                <div class="td"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--  分页器  -->
            <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
                :page-size="page.pageSize" :total="page.total" @current-change="search" />
        </div>

        <div class="footer">
            <el-button type="warning" @click="Sure">保 存</el-button>
            <el-button @click="notSure">返 回</el-button>
        </div>
    </div>
</template>
<script>
    import { areas } from '@/area'

    export default {
        name: 'userDetail',
        data() {
            return {
                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区

                replenisherData: {
                    userId: '', // 姓名
                    phone: '', // 手机号
                },

                DataContainers: [], // 表格数据
                add_vendorId: [], // 要添加的货柜编号
                Has_vendorId: [], // 已选择货柜编号
                
                state: JSON.parse(this.$route.query.state), // 页面状态  // 编辑或者审核补货员
                count: 10, // 计数器

                searchData: {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                },

                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
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
            // 获取补货员信息
            GetReplenisherInfo() {

                var id = this.$route.query.id;

                this.$get('pei', {
                    params: id
                }).success(res => {
                    this.replenisherData.userId = res.data.name;
                    this.replenisherData.phone = res.data.phone;
                })
            },
            // 查询
            search(pageNo = 1) {

                this.page.pageNo = pageNo;
                
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

                var url = '/v2/vendors?';


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
                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res)
                    this.DataContainers = res.data.vendorDtoList;
                    this.page.total = res.data.total;
                }, err => {
                    console.log(err)
                })
            },
            // 保存
            Sure() {
                var id = this.$route.query.id
                this.$xhr('passDist', {
                    audit: true,
                    userIds: [id]
                }).success(res => {
                    console.log(res)
                    this.$message('通过审核!');
                    this.$routr.push('/container/distributionList');
                }).error(res => {
                    console.log(res)
                    this.$message.error(res.message)
                })
            },
            // 返回
            notSure() {
                this.$router.go(-1)
            },
            // 触发多选框
            containerInfor(data) {

                // 清空数组
                this.add_vendorId = [];

                // push 每次选中的货柜编号
                data.forEach((v, i) => {
                    this.add_vendorId.push(v.id);
                })

                this.add_vendorId.sort((a, b) => {
                    return a - b
                })

                // console.log(this.add_vendorId)
            },
            // 添加货柜编号
            ReplenishmentPart() {

                this.add_vendorId.forEach((v,i) => {
                    this.Has_vendorId.push(v)
                })
                
                // 去重
                const set = new Set(this.Has_vendorId);
                
                this.Has_vendorId = [...set]
                
                // 排序
                this.Has_vendorId.sort((a, b) => {
                    return a - b
                })
                
                if (this.Has_vendorId.length <= 10 ){
                    this.count = 10 - this.Has_vendorId.length
                } else {
                    this.count = 0
                }
                
            },
            // 删除货柜编号
            del_vendorId(idx){
                
                this.Has_vendorId.splice(idx,1);

                if (this.Has_vendorId.length <= 10 ){
                    this.count = 10 - this.Has_vendorId.length
                } else {
                    this.count = 0
                }
            },
            // 清空
            clear(){
                this.Has_vendorId = [];
                this.count = 10;
            }
        },
        created() {
            this.GetReplenisherInfo(); // 获取补货员信息
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
    #EditReplenisher {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    /* 选择条件container */

    .check_container {
        /* border: 1px solid blue; */
        padding: 20px 0;
    }

    .replenisherMes {
        width: 240px;
    }

    /*  标题  */

    .tit {
        margin-right: 10px;
        font-size: 14px;
    }

    /*  选择城市间距  */

    .address-select {
        width: 115px;
    }

    .spacing {
        margin-right: 8px;
    }

    /* 提示信息 */

    .prompt {
        padding: 20px 0 20px 0;
        font-size: 14px;
        /* border: 1px solid red; */
    }

    /* 货柜信息 */

    .containerMessage {
        padding-left: 10px;
        width: 100%;
        /* border: 1px solid purple; */
    }


    .table_body {
        width: 100%;
        height: 580px;
        display: flex;
        /* border:1px solid red; */
        box-sizing: border-box;
        /* padding: 0 30px 0 0 ; */
        position: relative;
    }

    .table_left {
        /* position: absolute; */
        top:0;
        left: 0;
        flex: 0.45;
        /* border:1px solid blue; */
    }

    .table_center {
        flex: 0.2;
        /* position: relative; */
        /* position: absolute; */
        top: 50%;
        /* left: 0; */
        right: 544px;
        text-align: center;
        /* border:1px solid green; */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 添加货柜编号按钮 */

    .add_vendorId {
        width: 80px;
        height: 40px;
    }

    .table_right {
        /* position: absolute;; */
        top:0;
        right: 0;
        flex: 0.35;
        /* border:1px solid red; */
    }

    /* 表头 */

    .tab {
        width: 100%;
        height: 100%;
        text-align: center;
        color: rgb(61, 59, 31);
        font-size: 14px;
        border: 1px solid rgb(241, 241, 231);
    }

    .thead {
        border: 1px pink;
        display: flex;
    }

    .thead>div {
        display: inline-block;
        width: 50%;
        height: 54.6px;
        line-height: 54.6px;
        background: rgba(241, 241, 231, 0.7);
    }

    .tbody {
        height: 504px;
        overflow-x: hidden;
        overflow-y: scroll;
        
    }

    .tr {
        display: flex;
        border-top: 1px solid rgb(236, 235, 223);
    }

    .tr:last-child {
        /* border-bottom: none; */
    }

    .td {
        width: 50%;
        height: 49.4px;
        line-height: 49.4px;
        /* border-bottom: 1px solid rgb(236, 235, 223); */
    }

    .td:nth-child(2n-1) {
        border-right: 1px solid rgb(236, 235, 223);
    }

    /* 分页 */

    .page {
        padding: 0 0 20px 0;
    }

    /* 脚部 */

    .footer {
        padding: 10px 0;
        text-align: center;
    }
</style>
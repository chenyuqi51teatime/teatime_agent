<template>
    <div class="CommoditySales">
        <!--  选择时间框  -->
        <div class="check_container">
            <span class="tit">时间</span>
            <span class="check_time_btn" @click='check_time_btn(0)'>今天</span>
            <span class="check_time_btn" @click='check_time_btn(1)'>昨天</span>
            <span class="check_time_btn" @click='check_time_btn(2)'>最近7天</span>
            <span class="check_time_btn" @click='check_time_btn(3)'>最近30天</span>
            <el-date-picker :clearable='false' style="padding: 0px 10px;" @blur='cancel_cls' v-model="pickertime" type="datetimerange"
                :picker-options="pickerOptions" range-separator="至" :start-placeholder="staPlaceholder" :end-placeholder="endPlaceholder">
            </el-date-picker>
        </div>
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

            <el-input class="address-select spacing" v-model="searchData.vendorId" placeholder="请输入货柜编号"></el-input>
        </div>
        <!--  货柜框  -->
        <div class="check_container">
            <span class="tit">所属品牌</span>

            <el-select class="address-select spacing" v-model="searchData.brandId" @change='getProducts' filterable>
                <el-option v-for="p in currentbrand" :label="p.name" :value="p.id" :key="p.id"></el-option>
            </el-select>

            <span class="tit">所属类别</span>

            <el-select class="address-select spacing" v-model="searchData.categoryOne" @change="changeOne" placeholder="一级分类">
                <el-option v-for="p in currentone" :label="p.label" :value="p.id" key="p.id"></el-option>
            </el-select>

            <el-select class="address-select spacing" v-model="searchData.categoryTwo" @change="changeTwo" placeholder="二级分类">
                <el-option v-for="p in currenttwo" :label="p.label" :value="p.id" key="p.id"></el-option>
            </el-select>

            <el-select class="address-select spacing" v-model="searchData.categoryId" @change="changeThree" placeholder="三级分类">
                <el-option v-for="p in currentthree" :label="p.label" :value="p.id" key="p.id"></el-option>
            </el-select>

            <span class="tit">商品名称</span>

            <el-input class="address-select spacing" v-model="searchData.goodName" placeholder="请输入商品名称"></el-input>

            <el-button type="warning" @click="search(1)" class="search_btn">查询</el-button>

            <el-button type="warning" @click="exportData" class="exportData_btn">导出</el-button>
        </div>
        <!--  总数据详情展示  -->
        <div class="detailsShow">
            <div>
                <p> 商品销售总数量 </p>
                <p v-if='DataContainersShow.count'> {{ DataContainersShow.count }} </p>
                <p v-else>0</p>
            </div>
            <div>
                <p> 商品应收总额 (元) </p>
                <p v-if='DataContainersShow.receive'> {{ (DataContainersShow.receive || 0) }} </p>
                <p v-else>0</p>
            </div>
        </div>
        <!--  表格展示数据  -->
        <el-table :data="DataContainers" border style="width: 100%" :show-header="header" inline>
            <el-table-column prop="id" label="货柜编号" align="center" min-width='100' fixed></el-table-column>
            <el-table-column prop="address" label="摆放地址" align="center" min-width='220'></el-table-column>
            <el-table-column prop="brand" label="品牌" align="center" min-width='100'></el-table-column>
            <el-table-column prop="category" label="商品类别" align="center" min-width='115'></el-table-column>
            <el-table-column prop="name" label="商品名称" align="center" min-width='140'></el-table-column>
            <el-table-column prop="saleCount" label="销售数量" align="center" min-width='115'></el-table-column>
            <el-table-column prop="" label="应收总额" align="center" min-width='115'>
                <template slot-scope='scope'>
                    <div>{{ (scope.row.receivable * 1).toFixed(2) }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="" label="付款方式" align="center" min-width='115'></el-table-column>
            <el-table-column prop="" label="付款状态" align="center" min-width='115'></el-table-column> -->
            <!-- <el-table-column prop="" label="支付宝收款" align="center" min-width='115'>
                <template slot-scope='scope'>
                    <div>{{ (scope.row.alipay * 1).toFixed(2) }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="微信收款" align="center" min-width='115'>
                <template slot-scope='scope'>
                    <div>{{ (scope.row.wxpay * 1).toFixed(2) }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="储值收款" align="center" min-width='115'>
                <template slot-scope='scope'>
                    <div>{{ (scope.row.balance * 1).toFixed(2) }}</div>
                </template>
            </el-table-column> -->
        </el-table>
        <!--  分页器  -->
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="search" />

        <!--  导出dialog  -->
        <el-dialog title="提示" :visible.sync="exportDialog" width="30%" :before-close="exportDialog_notsure">
            <div class="exitMsg" style="text-align:center;">确定导出？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="exportDialog_sure">确 定</el-button>
                <el-button @click="exportDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { areas } from '@/area'

    export default {
        data() {
            return {
                exportDialog: false, // 导出Dialog
                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区
                currentbrand: [], // 品牌
                currentone: [], // 所属类别
                currenttwo: [], // 所属类别
                currentthree: [], // 所属类别

                pickertime: [], // 时间选择器
                staPlaceholder: '', // 时间选择器-开始placeholder
                endPlaceholder: '', // 时间选择器-结束placeholder
                // 控制日期选择范围 不能超过当天
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },

                searchData: {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    startDate: '', // 开始时间
                    endDate: '', // 结束时间
                    brandId: '', //  品牌


                    categoryOne: '', // 类别一级分类
                    categoryTwo: '', // 类别二级分类
                    categoryId: '', // 类别三级分类

                    goodName: '', // 商品名称
                },

                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },

                //表格数据
                DataContainers: [],
                DataContainersShow: {}, // 应收
                DataContainersShowPaid: [], // 实收
            }
        },
        watch: {
            // 监听到数据赋值成功后 调用函数
            // currentone(){
            //     this.todayStatus(); // 设置为当天状态
            // }
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
            this.changeBrand(); // 获取品牌
            this.category(); // 获取分类
            this.todayStatus(); // 设置为当天状态
        },
        methods: {
            // 日期时间戳兼容 start
            publicTimeStart(startTime){
                // console.log(startTime)
                var timeStr = startTime + ' ' + '00:00:00'; // 开始日期string

                timeStr = timeStr.replace(/-/g,':').replace(' ',':').split(':'); // 处理日期 返回 safari 兼容日期格式
                
                var _new_timeStrStamp = new Date(timeStr[0],(timeStr[1]-1),timeStr[2],timeStr[3],timeStr[4],timeStr[5]).getTime();
                
                return _new_timeStrStamp;
            },
            // 日期时间戳兼容 end
            publicTimeEnd(endTime){
                var timeStr = endTime + ' ' + '23:59:59'; // 开始日期string

                timeStr = timeStr.replace(/-/g,':').replace(' ',':').split(':'); // 处理日期 返回 safari 兼容日期格式
                
                var _new_timeStrStamp = new Date(timeStr[0],(timeStr[1]-1),timeStr[2],timeStr[3],timeStr[4],timeStr[5]).getTime();
                
                return _new_timeStrStamp;
            },
            // 更改选择时间按钮改变样式
            check_time_btn(idx) {
                var btns = document.getElementsByClassName('check_time_btn');

                // 判断当前按钮如果为选中状态时
                if (btns[idx].className == 'check_time_btn active') {
                    this.staPlaceholder = '开始日期';
                    this.endPlaceholder = '结束日期';
                    this.pickertime = []; // 时间选择器为空
                    this.searchData.startDate = ''; // 时间选择器 开始日期为空
                    this.searchData.endDate = ''; // 时间选择器 结束日期为空

                    btns[idx].className = 'check_time_btn';
                    return;
                }

                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'check_time_btn'
                }

                btns[idx].className = 'check_time_btn active'

                this.pickertime = []; // 时间选择器为空
                this.searchData.startDate = ''; // 时间选择器 开始日期为空
                this.searchData.endDate = ''; // 时间选择器 结束日期为空

                // 绑定时间数据
                if (btns[idx].innerHTML == '今天') {
                    // console.log(btns[idx].innerHTML)

                    // 今天的时间

                    // 开始
                    var todaySta = new Date(); // 获取今天前日期

                    var todayStampSta = todaySta.getTime(); // 获取今天前日期时间戳

                    todaySta.setTime(todayStampSta)

                    var startTime = todaySta.getFullYear() + "-" + (todaySta.getMonth() + 1) + "-" + todaySta.getDate();

                    var todayStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00

                    // 结束
                    var todayEnd = new Date(); // 获取当天日期

                    var todayStampEnd = todayEnd.getTime(); // 获取当日日期时间戳

                    todayEnd.setTime(todayStampEnd)

                    var endTime = todayEnd.getFullYear() + "-" + (todayEnd.getMonth() + 1) + "-" + todayEnd.getDate();

                    var todayEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59

                    // console.log('开始' + startTime)
                    // console.log('结束' + endTime)

                    this.staPlaceholder = startTime;
                    this.endPlaceholder = endTime;
                    this.searchData.startDate = todayStartTime;
                    this.searchData.endDate = todayEndTime;
                    this.search();
                } else if (btns[idx].innerHTML == '昨天') {
                    // console.log(btns[idx].innerHTML)

                    // 昨天的时间

                    // 开始
                    var yesterdaySta = new Date(); // 获取今天前日期

                    var yesterdayStampSta = yesterdaySta.getTime() - 24 * 60 * 60 * 1000; // 获取今天前日期时间戳

                    yesterdaySta.setTime(yesterdayStampSta)

                    var startTime = yesterdaySta.getFullYear() + "-" + (yesterdaySta.getMonth() + 1) + "-" + yesterdaySta.getDate();

                    var yesterdayStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置昨天到00:00:00

                    // 结束
                    var yesterdayEnd = new Date(); // 获取当天日期

                    var yesterdayStampEnd = yesterdayEnd.getTime() - 24 * 60 * 60 * 1000; // 获取当日日期时间戳

                    yesterdayEnd.setTime(yesterdayStampEnd)

                    var endTime = yesterdayEnd.getFullYear() + "-" + (yesterdayEnd.getMonth() + 1) + "-" + yesterdayEnd.getDate();

                    var yesterdayEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置昨天到23:59:59

                    // console.log('开始' + startTime)
                    // console.log('结束' + endTime)
                    // console.log(yesterdayStartTime)
                    // console.log(yesterdayEndTime)

                    this.staPlaceholder = startTime;
                    this.endPlaceholder = endTime;
                    this.searchData.startDate = yesterdayStartTime;
                    this.searchData.endDate = yesterdayEndTime;
                    this.search();
                } else if (btns[idx].innerHTML == '最近7天') {
                    // console.log(btns[idx].innerHTML)

                    // 最近一周的时间

                    // 开始
                    var latestWeekSta = new Date(); // 获取7天前日期

                    var latestWeekStampSta = latestWeekSta.getTime() - (24 * 60 * 60 * 1000 * 7) + (24 * 60 * 60 * 1000); // 获取7天前日期时间戳

                    latestWeekSta.setTime(latestWeekStampSta)

                    var startTime = latestWeekSta.getFullYear() + "-" + (latestWeekSta.getMonth() + 1) + "-" + latestWeekSta.getDate();

                    var latestWeekStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置一周前00:00:00

                    // 结束
                    var latestWeekEnd = new Date(); // 获取当天日期

                    var latestWeekStampEnd = latestWeekEnd.getTime(); // 获取当日日期时间戳

                    latestWeekEnd.setTime(latestWeekStampEnd)

                    var endTime = latestWeekEnd.getFullYear() + "-" + (latestWeekEnd.getMonth() + 1) + "-" + latestWeekEnd.getDate();

                    var latestWeekEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59

                    // console.log('开始' + startTime)
                    // console.log('结束' + endTime)

                    this.staPlaceholder = startTime;
                    this.endPlaceholder = endTime;
                    this.searchData.startDate = latestWeekStartTime;
                    this.searchData.endDate = latestWeekEndTime;
                    this.search();
                } else if (btns[idx].innerHTML == '最近30天') {
                    // console.log(btns[idx].innerHTML)

                    // 最近30天的时间

                    // 开始
                    var latestMonthSta = new Date(); // 获取30天前日期

                    var latestMonthStampSta = latestMonthSta.getTime() - (24 * 60 * 60 * 1000 * 30) + (24 * 60 * 60 * 1000); // 获取30天前日期时间戳

                    latestMonthSta.setTime(latestMonthStampSta)

                    var startTime = latestMonthSta.getFullYear() + "-" + (latestMonthSta.getMonth() + 1) + "-" + latestMonthSta.getDate();

                    var latestMonthStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置一月前00:00:00

                    // 结束
                    var latestMonthEnd = new Date(); // 获取当天日期

                    var latestMonthStampEnd = latestMonthEnd.getTime(); // 获取当日日期时间戳

                    latestMonthEnd.setTime(latestMonthStampEnd)

                    var endTime = latestMonthEnd.getFullYear() + "-" + (latestMonthEnd.getMonth() + 1) + "-" + latestMonthEnd.getDate();

                    var latestMonthEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59

                    // console.log('开始' + startTime)
                    // console.log('结束' + endTime)

                    this.staPlaceholder = startTime;
                    this.endPlaceholder = endTime;
                    this.searchData.startDate = latestMonthStartTime;
                    this.searchData.endDate = latestMonthEndTime;
                    this.search();
                }
            },
            // 当选择日期框触发时
            cancel_cls() {
                if (this.pickertime != '') {
                    // 时间选择器选择了时间
                    if (this.pickertime) {
                        // 取消所有样式
                        var btns = document.getElementsByClassName('check_time_btn');
                        for (var i = 0; i < btns.length; i++) {
                            btns[i].className = 'check_time_btn'
                        }

                        // 限制所选日期长度
                        if (this.pickertime[1].getTime() - this.pickertime[0].getTime() > 2678399000) {
                            this.staPlaceholder = '开始日期';
                            this.endPlaceholder = '结束日期';
                            this.pickertime = []; // 时间选择器为空
                            this.searchData.startDate = ''; // 时间选择器 开始日期为空
                            this.searchData.endDate = ''; // 时间选择器 结束日期为空
                            this.$message.error('所选时间超过31天');
                            return;
                        }

                        // 设置开始时间 和 结束时间
                        this.searchData.startDate = this.pickertime[0].getTime();
                        this.searchData.endDate = this.pickertime[1].getTime();
                    } else {
                        // 如果样式存在说明选择了 最近7天 或 最近30天
                        var btns = document.getElementsByClassName('check_time_btn');

                        for (var i = 0; i < btns.length; i++) {
                            if (btns[i].className == 'check_time_btn active') {
                                // console.log('有存在样式')
                                return;
                            }
                        }
                        // console.log('无存在样式')
                        this.staPlaceholder = '开始日期';
                        this.endPlaceholder = '结束日期';
                        this.searchData.startDate = '';
                        this.searchData.endDate = '';
                    }
                }
            },
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
            // 设置为当天状态
            todayStatus() {
                new Promise((res, rej) => {
                    res()
                }).then(() => {
                    this.check_time_btn(0)
                    this.search();
                })
            },
            // 查询
            search(pageNo = 1) {

                this.page.pageNo = pageNo

                if (this.searchData.categoryOne != '' && this.searchData.categoryId == '') {
                    this.$message.error('三级分类不能为空!')
                    return;
                }
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
                var url = '/v2/kpis/sales/goods/sum?';
                var urlShow = '/v2/kpis/sales/sales/count?';

                for (var i in requestData) {
                    if (requestData[i] != '' && requestData[i] != null && requestData[i] != undefined) {
                        url += i + '=' + requestData[i] + '&';
                        urlShow += i + '=' + requestData[i] + '&';
                    }
                }
                
                url = url.slice(0, url.length - 1);
                urlShow = urlShow.slice(0, urlShow.length - 1);

                this.ObtRequestData(url)
                this.ObtRequestDataShow(urlShow)
            },
            // 请求表格数据
            ObtRequestData(url) {
                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.DataContainers = res.data.data;
                    this.page.total = res.data.total || 0;
                    // 拼接省市区
                    // this.DataContainers.map((v, i) => {
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
                    //     v.address = ssq + v.address;
                    // })
                    // 品牌转换
                    // this.DataContainers.map((v, i) => {
                    //     this.currentbrand.forEach((val) => {
                    //         if (val.id == v.brand) v.brand = val.name;
                    //     })
                    // })
                    // 商品类别转换
                    // this.DataContainers.map((val, idx) => {
                    //     this.currentone.forEach((v, i) => {
                    //         if (v.children) {
                    //             v.children.forEach((b, o) => {
                    //                 if (b.children) {
                    //                     b.children.forEach((n, p) => {
                    //                         if (n.id == val.category) {
                    //                             val.category = n.label;
                    //                         }
                    //                     })
                    //                 }
                    //             })
                    //         }
                    //     })
                    // })
                }, err => {
                    console.log(err)
                })
            },
            // 请求展示总数据 应收
            ObtRequestDataShow(urlShow) {
                var _this = this;
                // console.log(urlShow)

                this.$http.get(urlShow).then(res => {
                    // console.log(res.data.date)
                    if (res.data.date != null) {
                        _this.DataContainersShow = res.data.date;
                        // console.log(_this.DataContainersShow)
                    } else {
                        this.DataContainersShow = {};
                    }
                    
                }, err => {
                    console.log(err)
                })
            },
            // 获取品牌
            changeBrand() {
                /* todo 品牌的获取 此处可能会传分类信息 */
                this.$xhr('brandList', {}).success(res => {
                    // console.log(res.datas)
                    this.currentbrand = res.datas
                    this.currentbrand.unshift({ name: '全部', id: '' })
                })
            },
            // 获取所属类别
            category() {
                this.$get('categoryList', { params: '' }).success(res => {
                    this.currentone = res.datas
                    this.currentone.unshift({ label: '全部', id: '' })
                })
            },
            // 更改一级分类
            changeOne(num) {
                for (var a = 0; a < this.currentone.length; a++) {
                    if (this.currentone[a].id === num) {
                        this.currenttwo = this.currentone[a].children
                    }
                }
                this.searchData.categoryTwo = ''
                this.searchData.categoryId = ''
                this.currentthree = []
            },
            // 更改二级分类
            changeTwo(num) {
                for (var a = 0; a < this.currenttwo.length; a++) {
                    if (this.currenttwo[a].id === num) {
                        this.currentthree = this.currenttwo[a].children
                    }
                }
                this.searchData.categoryId = ''
            },
            // 导出
            exportData() {
                this.exportDialog = true;
            },
            // 导出Dialog - 确认
            exportDialog_sure() {
                console.log('导出')

                let requestData = Object.assign(this.searchData, this.page)

                requestData.pageSize = 10000;
                requestData.type = 4;

                var url = '/v2/kpis/excel/upload?';

                for (var i in requestData) {
                    if (requestData[i] != '' && requestData[i] != null && requestData[i] != undefined) {
                        url += i + '=' + requestData[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);

                // console.log(url)
                this.$http.get(url).then(res => {
                    console.log(res)
                    if (res.data.result.code == 999) {
                        this.$message.error('导出失败！');
                        this.exportDialog = false;
                        return;
                    }
                    window.location.href = res.data.excelUrl;
                    this.exportDialog = false;
                },err => {
                    console.log(err)
                })
            },
            // 导出Dialog - 取消
            exportDialog_notsure() {
                this.exportDialog = false;
            },
        },
    }

</script>

<style scoped>
    .CommoditySales {
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

    /*  总数据详情展示  */

    .detailsShow {
        margin: 14px 0 14px 0;
        padding: 10px 10px;
        border: 1px solid #ccc;
    }

    .detailsShow>div {
        padding: 0 30px;
        display: inline-block;
        text-align: center;
        vertical-align: top;
    }

    /*  展示标题  */

    .detailsShow>div>p:nth-child(1) {
        font-size: 16px;
        padding-bottom: 8px;
    }

    /*  展示数据信息  */

    .detailsShow>div>p:nth-child(2) {
        font-size: 16px;
        color: #f7ba2a;
        padding-bottom: 8px;
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
        /* white-space: nowrap; */
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

    .spacing {
        margin-right: 6px;
    }

    .address-select {
        width: 140px;
    }

    /*  分页器  */

    .page {
        padding: 16px 0;
    }
</style>
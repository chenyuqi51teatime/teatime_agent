<template>
    <div class="OrderStatistics">
        <!--  选择时间框  -->
        <div class="check_container">
            <span class="tit">时间</span>
            <span class="check_time_btn" @click='check_time_btn(0)'>今天</span>
            <span class="check_time_btn" @click='check_time_btn(1)'>昨天</span>
            <span class="check_time_btn" @click='check_time_btn(2)'>最近7天</span>
            <span class="check_time_btn" @click='check_time_btn(3)'>最近30天</span>
            <el-date-picker :clearable='false' style="padding: 0px 10px;margin-right:6px;" @blur='cancel_cls' v-model="pickertime" :picker-options="pickerOptions"
                type="datetimerange" range-separator="至" :start-placeholder="staPlaceholder" :end-placeholder="endPlaceholder">
            </el-date-picker>

            <el-radio v-model="searchData.oper" :label="1">按照订单创建时间查询</el-radio>

            <el-radio v-model="searchData.oper" :label="2">按照支付完成时间查询</el-radio>

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

            <el-input class="address-select venderidBox" v-model="searchData.vendorId" placeholder="请输入货柜编号"></el-input>
        </div>
        <!--  订单框  -->
        <div class="check_container">
            <span class="tit">订单状态</span>
            <el-select class="address-select spacing" v-model="searchData.status" placeholder="全部">
                <el-option v-for="p in OrderSta" :label="p.name" :value="p.state" :key="p.id"></el-option>
            </el-select>
            <span class="tit">订单编号</span>
            <el-input class="address-select spacing" v-model="searchData.orderId" placeholder="请输入订单编号"></el-input>
            <span class="tit">用户编号</span>
            <el-input class="address-select spacing" v-model="searchData.userId" placeholder="请输入用户编号"></el-input>
            <span class="tit">手机号</span>
            <el-input class="address-select spacing" v-model="searchData.phone" placeholder="请输入手机号"></el-input>

            <el-button type="warning" @click="search(1)" class="search_btn">查询</el-button>

            <el-button type="warning" @click="exportData" class="exportData_btn">导出</el-button>
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
            <el-table-column prop="paiedTime" label="支付完成时间" align="center" min-width='140'>
                <template slot-scope="scope" v-if='scope.row.paiedTime'>
                    <div>{{scope.row.paiedTime.split(' ')[0]}}</div>
                    <div>{{scope.row.paiedTime.split(' ')[1].split('.')[0]}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="vendorId" label="货柜编号" align="center" min-width='120'></el-table-column>
            <el-table-column prop="userId" label="用户编号" align="center" min-width='120'></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center" min-width='120'></el-table-column>
            <el-table-column prop="status" label="订单状态" align="center" min-width='120'></el-table-column>
            <el-table-column prop="" label="详情" align="center" min-width='120'>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="orderDetails(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  分页器  -->
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="search" />

        <!--  订单详情Dialog  -->
        <el-dialog title="订单详情" :visible.sync="detailsDialog" class="detailWidth" center>

            <div class="orderMsgA">
                <div class="orderMsg_left">
                    <div>
                        <span>订单编号：</span>
                        <span v-if='row.orderId'>{{row.orderId}}</span>
                    </div>
                    <div>
                        <span>创建时间：</span>
                        <span v-if='row.createTime'>{{row.createTime.split('.')[0]}}</span>
                    </div>
                    <div>
                        <span>用户编号：</span>
                        <span v-if='row.userId'>{{row.userId}}</span>
                    </div>
                </div>
                <div class="orderMsg_right">
                    <div>
                        <span>订单状态：</span>
                        <span v-if='row.status'>{{row.status}}</span>
                    </div>
                    <div>
                        <span>完成时间：</span>
                        <span v-if='row.paiedTime'>{{row.paiedTime.split('.')[0]}}</span>
                    </div>
                    <div>
                        <span>手机号：</span>
                        <span v-if='row.phone'>{{row.phone}}</span>
                    </div>
                </div>
            </div>

            <div class="orderMsgB">
                <div>
                    <span>货柜编号：</span>
                    <span>{{row.vendorId}}</span>
                </div>

                <div>
                    <span>购买地址：</span>
                    <span>{{orderDet.detailedAddress}}</span>
                </div>
            </div>

            <div class="orderlist" v-for='(v,i) in orderDetList'>
                <div class="orderlist_container">
                    <div class="orderImg">

                        <img :src="v.image" alt="">

                    </div>
                    <div class="orderslists">
                        <p>{{v.name}} {{v.property}}</p>
                        <p>
                            <span>价格：</span>
                            <span style="color:red;">￥{{v.sellPrice}} 元</span>
                        </p>
                        <p>
                            <span>数量：</span>
                            <span style="color:red;">{{v.amount}} </span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="footMsgA">
                <div>
                    <span></span>
                    <span style="width:150px;">商品总额：
                        <span style="color:red;" v-if='orderDet.orderTotal'>￥{{orderDet.orderTotal}} 元</span>
                        <span v-else>0</span>
                    </span>
                </div>
                <div v-if='balance != 0'>
                    <span></span>
                    <span style="width:150px;">余额支付：￥{{balance}} 元</span>
                </div>
            </div>

            <!-- 已支付 -->
            
            <div class="footMsgB" v-if="orderState == '已支付' ">
                <div>
                    <span></span>
                    <span style="width:150px;">实付款：
                        <span style="color:red;" v-if='orderDet.actualPay'>￥{{orderDet.actualPay}} 元</span>
                        <span v-else>0.00 元</span>
                    </span>
                </div>
            </div>

            <div class="PayWay" v-if="orderState == '已支付' ">
                <div>
                    <span>支付方式：{{orderDet.payPlat}}支付 {{orderDet.orderTotal}}元</span>
                    <span></span>
                </div>
            </div>

            <!-- 未支付 -->

            <div class="footMsgB" v-if="orderState == '未支付' ">
                <div>
                    <span></span>
                    <span style="width:150px;">需付款：
                        <span style="color:red;">￥{{orderDet.needPay}} 元</span>
                    </span>
                </div>
            </div>

            <!-- 已关闭 -->

            <div class="footMsgB" v-if="orderState == '已关闭' ">
                <div>
                    <span></span>
                    <span style="width:150px;">总计：
                        <span style="color:red;">￥{{orderDet.needPay}} 元</span>
                    </span>
                </div>
            </div>

            <div class="PayWay" v-if="orderState == '已关闭' ">
                <div>
                    <span>备注：{{orderDet.closeMemo}}</span>
                    <span></span>
                </div>
            </div>

            <!-- 关闭 -->
            
            <div slot="footer" class="dialog-footer ">
                <el-button type='warning' @click="detailsDialog = false">关 闭</el-button>
            </div>

        </el-dialog>

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
                detailsDialog: false, // 订单详情dialog
                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区
                
                // 订单状态
                OrderSta: [
                    {
                        id: 0,
                        name: '全部',
                        statçe: ''
                    },
                    {
                        id: 1,
                        name: '已支付',
                        state: 2
                    },
                    {
                        id: 2,
                        name: '未支付',
                        state: 1
                    },
                    {
                        id: 3,
                        name: '已关闭',
                        state: 3
                    }
                ],

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
                    // pickertime: '', // 时间选择器
                    time: '', // 时间
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    startDate: '', // 开始时间
                    endDate: '', // 结束时间
                    OrderCreationTime: '',// 订单创建时间
                    status: '', // 订单状态
                    orderId: '', // 订单编号
                    userId: '', // 用户编号
                    phone: '', // 手机号
                    oper: 1, // 1 查询订单创建时间 2 查询支付时间
                },

                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },

                DataContainers: [], // 表格数据

                row: {}, // 查看订单中商品支付详情
                orderDet: [], // 查看订单详情
                orderDetList: [], // 查看订单中商品详情
                orderState: '' , // 订单状态
                balance: 0, // 余额支付
                radio: ''
            }
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
            this.todayStatus();
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

                // 判断当前按钮如果为非选中状态时
                // 清空所有样式
                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'check_time_btn'
                }

                btns[idx].className = 'check_time_btn active'; // 为当前点击按钮添加样式

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
                var a = new Promise((res, rej) => {
                    res()
                }).then(() => {
                    this.check_time_btn(0)
                    this.search();
                })
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

                var url = '/v2/kpis/sales/orders/sum?';

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
                    // console.log(res.data)
                    this.DataContainers = res.data.data;
                    this.page.total = res.data.total;

                    if (!this.DataContainers) return;

                    // 处理支付方式和支付状态
                    // this.DataContainers.forEach(e => {
                    //     switch (e.status) {
                    //         case 1: e.status = '未支付'
                    //             break
                    //         case 2: e.status = '已支付'
                    //             break
                    //         case 3: e.status = '已关闭'
                    //             break
                    //         default: e.status = ''
                    //     }
                    // })
                }, err => {
                    console.log(err)
                })
            },
            // 查看详情
            orderDetails(row) {
                console.log(row)
                this.row = row; // 查看订单中商品支付详情
                this.orderState = row.status; // 订单状态

                this.$xhr('saleDetail', { orderId: row.orderId }).success(res => {
                    console.log(res)
                    this.orderDet = res;
                    this.orderDetList = res.data;
                    this.balance = res.balancePay; // 余额支付
                    // 处理订单状态
                    // switch (this.orderDet.status) {
                    //     case 1: this.orderDet.status = '未支付'
                    //         break
                    //     case 2: this.orderDet.status = '已支付'
                    //         break
                    //     case 3: this.orderDet.status = '已关闭'
                    //         break
                    //     default: this.orderDet.status = ''
                    // }
                    // 处理订单支付方式
                    switch (this.orderDet.payPlat) {
                        case 1: this.orderDet.payPlat = '微信'
                            break
                        case 2: this.orderDet.payPlat = '支付宝'
                            break
                        case 9: this.orderDet.payPlat = '余额'
                            break
                        default: this.orderDet.payPlat = ''
                    }
                    // 处理图片
                    this.orderDetList.map((v, i) => {
                        v.image = 'http://teatime-pic.oss-cn-beijing.aliyuncs.com/' + v.image; // 图片地址
                    })
                })
                this.detailsDialog = true;
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
                requestData.type = 3;

                var url = '/v2/kpis/excel/upload?';

                for (var i in requestData) {
                    if (requestData[i] != '' && requestData[i] != null && requestData[i] != undefined) {
                        url += i + '=' + requestData[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);

                // console.log(url)
                this.$http.get(url).then(res => {
                    if (res.data.result.code == 999) {
                        this.$message.error('导出失败！');
                        this.exportDialog = false;
                        return;
                    }
                    window.location.href = res.data.excelUrl;
                    this.exportDialog = false;
                }, err => {
                    console.log(err)
                })
            },
            // 导出Dialog - 取消
            exportDialog_notsure() {
                this.exportDialog = false;
            },
        }
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
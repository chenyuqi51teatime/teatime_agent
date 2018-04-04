<template>
    <div class="home">
        <!-- <p class="home_tit">月度指标（数据实时更新）</p> -->


        <!--  信息总览  -->
        <div class="home_shop">
            <!-- 营业额 -->
            <div class="home_shop_list business">
                <div class="shop_tit">
                    <p class="shop_pro"><span>营业额（元）</span></p>
                </div>
                <div class="shop_con">
                    <div class="shop_con_son">
                        <p class="last_sty"><span>昨天：</span><span>{{yesterday_Container.actual}}</span></p>
                        <p><span>今天：</span><span style="color: red;font-weight:600;font-size:16px;">{{today_Container.actual}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上周：</span><span>{{lastweek_Container.actual}}</span></p>
                        <p><span>本周：</span><span style="color: red;font-weight:600;font-size:16px;">{{week_Container.actual}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上月：</span><span>{{lastmonth_Container.actual}}</span></p>
                        <p><span>本月：</span><span style="color: red;font-weight:600;font-size:16px;">{{month_Container.actual}}</span></p>
                    </div>
                </div>
            </div>
            <!-- 订单数量 -->
            <div class="home_shop_list orderNumber">
                <div class="shop_tit">
                    <p class="shop_pro"><span>订单数量（笔）</span></p>
                </div>
                <div class="shop_con">
                    <div class="shop_con_son">
                        <p class="last_sty"><span>昨天：</span><span>{{yesterday_Container.orderCount}}</span></p>
                        <p><span>今天：</span><span style="color: red;font-weight:600;font-size:16px;">{{today_Container.orderCount}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上周：</span><span>{{lastweek_Container.orderCount}}</span></p>
                        <p><span>本周：</span><span style="color: red;font-weight:600;font-size:16px;">{{week_Container.orderCount}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上月：</span><span>{{lastmonth_Container.orderCount}}</span></p>
                        <p><span>本月：</span><span style="color: red;font-weight:600;font-size:16px;">{{month_Container.orderCount}}</span></p>
                    </div>
                </div>
            </div>
            <!-- 客单价 -->
            <div class="home_shop_list UnitPrice">
                <div class="shop_tit">
                    <p class="shop_pro"><span>客单价（元/笔）</span></p>
                </div>
                <div class="shop_con">
                    <div class="shop_con_son">
                        <p class="last_sty"><span>昨天：</span><span>{{yesterday_Container.aveOrder}}</span></p>
                        <p><span>今天：</span><span style="color: red;font-weight:600;font-size:16px;">{{today_Container.aveOrder}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上周：</span><span>{{lastweek_Container.aveOrder}}</span></p>
                        <p><span>本周：</span><span style="color: red;font-weight:600;font-size:16px;">{{week_Container.aveOrder}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上月：</span><span>{{lastmonth_Container.aveOrder}}</span></p>
                        <p><span>本月：</span><span style="color: red;font-weight:600;font-size:16px;">{{month_Container.aveOrder}}</span></p>
                    </div>
                </div>
            </div>
            <!-- 新增顾客 -->
            <div class="home_shop_list NewCustomer">
                <div class="shop_tit">
                    <p class="shop_pro"><span>新增顾客（人）</span></p>
                </div>
                <div class="shop_con">
                    <div class="shop_con_son">
                        <p class="last_sty"><span>昨天：</span><span>{{NewCustomers.yestoday || 0}}</span></p>
                        <p><span>今天：</span><span style="color: red;font-weight:600;font-size:16px;">{{NewCustomers.today}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上周：</span><span>{{NewCustomers.lastweek}}</span></p>
                        <p><span>本周：</span><span style="color: red;font-weight:600;font-size:16px;">{{NewCustomers.week}}</span></p>
                    </div>
                    <div class="shop_con_son">
                        <p class="last_sty"><span>上月：</span><span>{{NewCustomers.lastmonth}}</span></p>
                        <p><span>本月：</span><span style="color: red;font-weight:600;font-size:16px;">{{NewCustomers.month}}</span></p>
                    </div>
                </div>
            </div>
        </div>


        <!--  信息图表  -->
        <div class="home_chart">
            <!-- 营业额 -->
            <div class="home_chart_list">
                <!-- 选择按钮 -->
                <div class="box_title">
                    <span class="fl_tit">营业额（元）</span>
                    <span class='changeChart Turnover changeChart_active' @click='ChangeTurnoverChart(0)'>对比上周</span>
                    <span class='changeChart Turnover' @click='ChangeTurnoverChart(1)'>近30天趋势</span>
                </div>
                <!-- 图表 -->
                <div class="box_container">
                    <div id="can_view_turnover"></div>
                </div>
            </div>
            <!-- 订单数量 -->
            <div class="home_chart_list">
                <!-- 选择按钮 -->
                <div class="box_title">
                    <span class="fl_tit">订单数量（笔）</span>
                    <span class='changeChart Ordernumber changeChart_active' @click='ChangeOrdernumberChart(0)'>对比上周</span>
                    <span class='changeChart Ordernumber' @click='ChangeOrdernumberChart(1)'>近30天趋势</span>
                </div>
                <!-- 图表 -->
                <div class="box_container">
                    <div id="can_view_Ordernumber"></div>
                </div> 
            </div>
        </div>
        
        <!-- <div class="home_chart"> -->
            <!-- 周客流量与营业额 -->
            <!-- <div class="home_chart_list"> -->
                <!-- 选择按钮 -->
                <!-- <div class="box_title">
                    <span class="fl_tit">周客流量与营业额</span>
                    <span class='changeChart week_PassengerTurnover changeChart_active' @click='ChangeWeekPassengerTurnoverChart(0)'>最近1月</span>
                    <span class='changeChart week_PassengerTurnover' @click='ChangeWeekPassengerTurnoverChart(1)'>最近2月</span>
                </div> -->
                <!-- 图表 -->
                <!-- <div class="box_container">
                    <div id="can_view_week_PassengerTurnover"></div>
                </div> -->
            <!-- </div> -->
            <!-- 时段客流量与营业额 -->
            <!-- <div class="home_chart_list"> -->
                <!-- 选择按钮 -->
                <!-- <div class="box_title">
                    <span class="fl_tit">时段客流量与营业额</span>
                    <span class='changeChart Period_PassengerTurnover changeChart_active' @click='ChangePeriodPassengerTurnoverChart(0)'>最近1月</span>
                    <span class='changeChart Period_PassengerTurnover' @click='ChangePeriodPassengerTurnoverChart(1)'>最近2月</span>
                </div> -->
                <!-- 图表 -->
                <!-- <div class="box_container">
                    <div id="can_view_Period_PassengerTurnover"></div>
                </div> -->
            <!-- </div> -->
        <!-- </div> -->

        <!-- <div class="home_chart"> -->
            <!-- 顾客月复购率 -->
            <!-- <div class="home_chart_list"> -->
                <!-- 选择按钮 -->
                <!-- <div class="box_title">
                    <span class="fl_tit">顾客月复购率</span>
                </div> -->
                <!-- 图表 -->
                <!-- <div class="box_container">
                    <div id="can_view_Month_AfterBuying"></div>
                </div> -->
            <!-- </div> -->
            <!-- 顾客周复购率 -->
            <!-- <div class="home_chart_list"> -->
                <!-- 选择按钮 -->
                <!-- <div class="box_title">
                    <span class="fl_tit">顾客月复购率</span>
                </div> -->
                <!-- 图表 -->
                <!-- <div class="box_container">
                    <div id="can_view_Week_AfterBuying"></div>
                </div> -->
            <!-- </div> -->
        <!-- </div> -->
    </div>
</template>

<script>
    
    import echarts from 'echarts'

    export default {
        data() {
            return {
                a:2000,
                today_Container: {}, // 营业额 订单数量 客单价  今天
                yesterday_Container: {}, // 营业额 订单数量 客单价  昨天
                week_Container: {}, // 营业额 订单数量 客单价  本周
                lastweek_Container: {}, // 营业额 订单数量 客单价  上周
                month_Container: {}, // 营业额 订单数量 客单价  本月
                lastmonth_Container: {}, // 营业额 订单数量 客单价  上月
                // 新增顾客人数
                NewCustomers:{
                    today: '', // 今天
                    yesterday: '', // 昨天
                    week: '', // 本周
                    lastweek: '', // 上周
                    month: '', // 本月
                    lastmonth: '', // 上月
                },
                
                turnover_arr: [], // 营业额 - 对比上周
            }
        },
        components: {

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
            // 今天
            todayTeaTime(){
                // 开始 startDate
                var todaySta = new Date(); // 获取今天前日期

                var todayStampSta = todaySta.getTime(); // 获取今天日期时间戳

                todaySta.setTime(todayStampSta); // 根据时间戳设置日期

                var startTime = todaySta.getFullYear() + "-" + (todaySta.getMonth() + 1) + "-" + todaySta.getDate();

                var todayStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳
                
                // 结束 endDate
                var todayEnd = new Date(); // 获取当天日期

                var todayStampEnd = todayEnd.getTime(); // 获取当日日期时间戳

                todayEnd.setTime(todayStampEnd); // 根据时间戳设置日期

                var endTime = todayEnd.getFullYear() + "-" + (todayEnd.getMonth() + 1) + "-" + todayEnd.getDate();

                var todayEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳

                // console.log('今天')
                // console.log('开始' + startTime, todayStartTime)
                // console.log('结束' + endTime, todayEndTime)
                // console.log(time1)
                return {
                    startDate: todayStartTime,
                    endDate: todayEndTime,
                }
            },
            // 昨天
            YesterdayTeaTime(){
                // 昨天
                // 开始 startDate

                var yesterdaySta = new Date(); // 获取今天前日期

                var yesterdayStampSta = yesterdaySta.getTime() - 24 * 60 * 60 * 1000; // 获取昨天日期时间戳

                yesterdaySta.setTime(yesterdayStampSta); // 根据时间戳设置日期

                var startTime = yesterdaySta.getFullYear() + "-" + (yesterdaySta.getMonth() + 1) + "-" + yesterdaySta.getDate();

                var yesterdayStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳

                // 结束 endDate
                var yesterdayEnd = new Date(); // 获取当天日期

                var yesterdayStampEnd = yesterdayEnd.getTime() - 24 * 60 * 60 * 1000; // 获取当日日期时间戳

                yesterdayEnd.setTime(yesterdayStampEnd); // 根据时间戳设置日期

                var endTime = yesterdayEnd.getFullYear() + "-" + (yesterdayEnd.getMonth() + 1) + "-" + yesterdayEnd.getDate();

                var yesterdayEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳

                // console.log('昨天')
                // console.log('开始' + startTime, yesterdayStartTime)
                // console.log('结束' + endTime, yesterdayEndTime)

                return {
                    startDate: yesterdayStartTime,
                    endDate: yesterdayEndTime
                }
            },
            // 本周
            WeekTeaTime(){
                // 本周
                // 开始 startDate
                //   0   1    2    3    4    5    6
                //  日   一   二   三   四   五   六
                var weekSta = new Date(); // 获取今天前日期

                var day = weekSta.getDay() || 7; // 今天是周几 如果是周日 返回 7
                
                var weekStaMonday =  new Date(weekSta.getFullYear(), weekSta.getMonth(), weekSta.getDate() + 1 - day); // 本周一开始日期的GMT格式

                var weekStampSta = weekStaMonday.getTime(); // 获取本周一日期时间戳

                weekSta.setTime(weekStampSta); // 根据时间戳设置日期

                var startTime = weekSta.getFullYear() + "-" + (weekSta.getMonth() + 1) + "-" + weekSta.getDate();

                var weekStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳

                // 结束 endDate
                var weekEnd = new Date(); // 获取当天日期

                var weekStampEnd = weekEnd.getTime(); // 获取当日日期时间戳

                weekEnd.setTime(weekStampEnd); // 根据时间戳设置日期

                var endTime = weekEnd.getFullYear() + "-" + (weekEnd.getMonth() + 1) + "-" + weekEnd.getDate();

                var weekEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳

                // console.log('本周')
                // console.log('开始' + startTime, weekStartTime)
                // console.log('结束' + endTime, weekEndTime)

                return {
                    startDate: weekStartTime,
                    endDate: weekEndTime
                }
            },
            // 上周
            LastWeekTeaTime(){
                // 上周
                // 开始 startDate
                //   0   1    2    3    4    5    6
                //  日   一   二   三   四   五   六
                var LastWeekSta = new Date(); // 获取今天日期

                var day = LastWeekSta.getDay() || 7; // 今天是周几 如果是周日 返回 7
                
                var LastWeekStaMonday =  new Date(LastWeekSta.getFullYear(), LastWeekSta.getMonth(), LastWeekSta.getDate() + 1 - day - 7); // 上周一开始日期的GMT格式

                var LastWeekStampSta = LastWeekStaMonday.getTime(); // 获取上周一日期时间戳

                LastWeekSta.setTime(LastWeekStampSta); // 根据时间戳设置日期

                var startTime = LastWeekSta.getFullYear() + "-" + (LastWeekSta.getMonth() + 1) + "-" + LastWeekSta.getDate();

                var LastWeekStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳

                // 结束 endDate
                var LastWeekEnd = new Date(); // 获取今天日期

                var LastWeekEndMonday = new Date(LastWeekEnd.getFullYear(), LastWeekEnd.getMonth(), LastWeekEnd.getDate() + 1 - day - 1); // 上周一开始日期的GMT格式

                var LastWeekStampEnd = LastWeekEndMonday.getTime(); // 获取当日日期时间戳

                LastWeekEnd.setTime(LastWeekStampEnd); // 根据时间戳设置日期

                var endTime = LastWeekEnd.getFullYear() + "-" + (LastWeekEnd.getMonth() + 1) + "-" + LastWeekEnd.getDate();

                var LastWeekEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳

                // console.log('上周')
                // console.log('开始' + startTime, LastWeekStartTime)
                // console.log('结束' + endTime, LastWeekEndTime)

                return {
                    startDate: LastWeekStartTime,
                    endDate: LastWeekEndTime
                }
            },
            // 上周一到今天
            LastMondayToNowTeaTime(){
                // 上周
                // 开始 startDate
                //   0   1    2    3    4    5    6
                //  日   一   二   三   四   五   六
                var LastWeekSta = new Date(); // 获取今天日期

                var day = LastWeekSta.getDay() || 7; // 今天是周几 如果是周日 返回 7
                
                var LastWeekStaMonday =  new Date(LastWeekSta.getFullYear(), LastWeekSta.getMonth(), LastWeekSta.getDate() + 1 - day - 7); // 上周一开始日期的GMT格式

                var LastWeekStampSta = LastWeekStaMonday.getTime(); // 获取上周一日期时间戳

                LastWeekSta.setTime(LastWeekStampSta); // 根据时间戳设置日期

                var startTime = LastWeekSta.getFullYear() + "-" + (LastWeekSta.getMonth() + 1) + "-" + LastWeekSta.getDate();

                var LastWeekStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳

                // 结束 endDate
                var LastWeekEnd = new Date(); // 获取今天日期

                var LastWeekStampEnd = LastWeekEnd.getTime(); // 获取当日日期时间戳

                LastWeekEnd.setTime(LastWeekStampEnd); // 根据时间戳设置日期

                var endTime = LastWeekEnd.getFullYear() + "-" + (LastWeekEnd.getMonth() + 1) + "-" + LastWeekEnd.getDate();

                var LastWeekEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳

                // console.log('上周一至今')
                // console.log('开始' + startTime, LastWeekStartTime)
                // console.log('结束' + endTime, LastWeekEndTime)

                return {
                    startDate: LastWeekStartTime,
                    endDate: LastWeekEndTime
                }
            },
            // 本月
            MonthTeaTime(){
                // 本月
                // 开始 startDate
                var MonthSta = new Date(); // 获取今天日期
                
                var MonthStartTime = new Date(MonthSta.getFullYear(), MonthSta.getMonth(), 1); // 获取本月1号 GTM 日期格式
                
                var MonthStampSta = MonthStartTime.getTime(); // 获取本月1号日期时间戳

                MonthSta.setTime(MonthStampSta); // 根据时间戳设置日期

                var startTime = MonthSta.getFullYear() + "-" + (MonthSta.getMonth() + 1) + "-" + MonthSta.getDate();

                var MonthStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳

                // 结束 endDate
                var MonthEnd = new Date(); // 获取当天日期

                var MonthStampEnd = MonthEnd.getTime(); // 获取当日日期时间戳

                MonthEnd.setTime(MonthStampEnd); // 根据时间戳设置日期

                var endTime = MonthEnd.getFullYear() + "-" + (MonthEnd.getMonth() + 1) + "-" + MonthEnd.getDate();

                var MonthEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳
                
                // console.log('本月')
                // console.log('开始' + startTime, MonthStartTime)
                // console.log('结束' + endTime, MonthEndTime)

                return {
                    startDate: MonthStartTime,
                    endDate: MonthEndTime
                }
            },
            // 上月
            LastMonthTeaTime(){
                // 上月
                // 开始 startDate
                var LastMonthSta = new Date(); // 获取今天日期
                
                var LastMonthStartTime = new Date(LastMonthSta.getFullYear(), LastMonthSta.getMonth() - 1, 1); // 获取上月1号 GTM 日期格式
                
                var LastMonthStampSta = LastMonthStartTime.getTime(); // 获取上月1号日期时间戳

                LastMonthSta.setTime(LastMonthStampSta); // 根据时间戳设置日期

                var startTime = LastMonthSta.getFullYear() + "-" + (LastMonthSta.getMonth() + 1) + "-" + LastMonthSta.getDate();

                var LastMonthStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置今天到00:00:00  返回时间戳

                // 结束 endDate
                var LastMonthEnd = new Date(); // 获取当天日期

                var LastMonthEndTime = new Date(LastMonthEnd.getFullYear(), LastMonthEnd.getMonth(), 0); // 获取上月最后一天 GTM 日期格式

                var LastMonthStampEnd = LastMonthEndTime.getTime(); // 获取当日日期时间戳

                LastMonthEnd.setTime(LastMonthStampEnd); // 根据时间戳设置日期

                var endTime = LastMonthEnd.getFullYear() + "-" + (LastMonthEnd.getMonth() + 1) + "-" + LastMonthEnd.getDate();

                var LastMonthEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59  返回时间戳
                
                // console.log('上月')
                // console.log('开始' + startTime, LastMonthStartTime)
                // console.log('结束' + endTime, LastMonthEndTime)

                return {
                    startDate: LastMonthStartTime,
                    endDate: LastMonthEndTime
                }
            },
            // 最近60天
            LastTwoMonthsTeaTime(){
                // 最近60天
                // 开始 startDate
                var lastTwoMonthsSta = new Date(); // 获取30天前日期

                var lastTwoMonthsStampSta = lastTwoMonthsSta.getTime() - (24 * 60 * 60 * 1000 * 60) + (24 * 60 * 60 * 1000); // 获取60天前日期时间戳

                lastTwoMonthsSta.setTime(lastTwoMonthsStampSta)

                var startTime = lastTwoMonthsSta.getFullYear() + "-" + (lastTwoMonthsSta.getMonth() + 1) + "-" + lastTwoMonthsSta.getDate();

                var lastTwoMonthsStartTime = new Date(startTime + ' ' + '00:00:00').getTime() || this.publicTimeStart(startTime); // 设置一月前00:00:00

                // 结束
                var lastTwoMonthsEnd = new Date(); // 获取当天日期

                var lastTwoMonthsStampEnd = lastTwoMonthsEnd.getTime(); // 获取当日日期时间戳

                lastTwoMonthsEnd.setTime(lastTwoMonthsStampEnd)

                var endTime = lastTwoMonthsEnd.getFullYear() + "-" + (lastTwoMonthsEnd.getMonth() + 1) + "-" + lastTwoMonthsEnd.getDate();

                var lastTwoMonthsEndTime = new Date(endTime + ' ' + '23:59:59').getTime() || this.publicTimeEnd(endTime); // 设置今天到23:59:59

                // console.log('最近60天')
                // console.log('开始' + startTime, lastTwoMonthsStartTime)
                // console.log('结束' + endTime, lastTwoMonthsEndTime)

                return {
                    startDate: lastTwoMonthsStartTime,
                    endDate: lastTwoMonthsEndTime
                }
            },
            // 占比区间处理
            interval_2(arr) {

                arr[0] = 190

                var mathceil_arr = Math.ceil(Math.max.apply(Math, arr)); // 最大值向上取整

                var a = Math.ceil( mathceil_arr / 5 ) * 5;
                // console.log(a)
                return a;
            },
            interval_(arr) {
                
                // 占比区间  取最大值 最后一位阿拉伯数字 不为0 设置为0 并且 倒数第二位+1

                var interval;

                var mathceil_arr = Math.ceil(Math.max.apply(Math, arr)); // 最大值向上取整

                // 判断最大值是一位数字还是多位
                if (mathceil_arr.toString().length > 1) {
                    // 多位
                    // console.log('多位')

                    if (mathceil_arr.toString().slice(-1) > 0) { // 判断最后一位是否为0
                        // 最大值最后一位不为0
                        // 23
                        var a = Number(mathceil_arr.toString().slice(-1));  // 倒数第1位      3

                        var b = Number(mathceil_arr.toString().slice(-2, -1))  // 倒数第2位      2

                        var c = Number(mathceil_arr.toString().slice(-2, -1)) + 1; // 倒数第2位 +1   2+1 = 3

                        var d = mathceil_arr.toString().replace(b, c);  // 把倒数第二位提取出来+1

                        var array = d.toString().split('');

                        array.splice(-1, 1, 0);

                        var s = [], u = '';
                        array.map((v, i) => {
                            s.push(Number(v));
                            u += v
                        })

                        interval = Number(u);
                        
                        return interval;
                    } else {
                        // 最大值最后一位为0
                        interval = mathceil_arr;
                        return interval;
                    }

                } else {
                    // 一位
                    // console.log('一位');
                    interval = 10;
                    return interval;
                }
            },
            // 数据展示
            ShowData(){
                var url = '/v2/kpis/index/sales?';  // 营业额 订单数量 客单价 
                var url2 = '/v2/kpis/index/customers?' // 新增顾客人数

                this.todayShowData(url, url2);

                this.yestodayShowData(url, url2);

                this.weekShowData(url, url2);
                
                this.lastweekShowData(url, url2);
                
                this.monthShowData(url, url2);

                this.lastmonthShowData(url, url2);
            },
            // 营业额 订单数量 客单价  今天
            todayShowData(url,url2){
                var url = url;

                var url2 = url2;

                var TimeStamp = this.todayTeaTime(); // 获取日期时间戳

                for (var i in TimeStamp) {
                    if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                        url += i + '=' + TimeStamp[i] + '&';
                        url2 += i + '=' + TimeStamp[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                url2 = url2.slice(0, url2.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.today_Container = res.data.data
                }, err => {
                    console.log(err)
                })

                this.$http.get(url2).then(res => {
                    this.NewCustomers.today = res.data.data.newUserCount
                }, err => {
                    console.log(err)
                })
            },
            // 营业额 订单数量 客单价  昨天
            yestodayShowData(url,url2){
                var url = url;

                var url2 = url2;

                var TimeStamp = this.YesterdayTeaTime(); // 获取日期时间戳
                
                for (var i in TimeStamp) {
                    if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                        url += i + '=' + TimeStamp[i] + '&';
                        url2 += i + '=' + TimeStamp[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                url2 = url2.slice(0, url2.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.yesterday_Container = res.data.data
                }, err => {
                    console.log(err)
                })

                this.$http.get(url2).then(res => {
                    this.NewCustomers.yestoday = res.data.data.newUserCount
                }, err => {
                    console.log(err)
                })
            },
            // 营业额 订单数量 客单价  本周
            weekShowData(url, url2){
                var url = url;

                var url2 = url2;

                var TimeStamp = this.WeekTeaTime(); // 获取日期时间戳

                for (var i in TimeStamp) {
                    if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                        url += i + '=' + TimeStamp[i] + '&';
                        url2 += i + '=' + TimeStamp[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                url2 = url2.slice(0, url2.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.week_Container = res.data.data
                }, err => {
                    console.log(err)
                })

                this.$http.get(url2).then(res => {
                    this.NewCustomers.week = res.data.data.newUserCount
                }, err => {
                    console.log(err)
                })
            },
            // 营业额 订单数量 客单价  上周
            lastweekShowData(url, url2){
                var url = url;

                var url2 = url2;

                var TimeStamp = this.LastWeekTeaTime(); // 获取日期时间戳

                for (var i in TimeStamp) {
                    if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                        url += i + '=' + TimeStamp[i] + '&';
                        url2 += i + '=' + TimeStamp[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                url2 = url2.slice(0, url2.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.lastweek_Container = res.data.data
                }, err => {
                    console.log(err)
                })

                this.$http.get(url2).then(res => {
                    this.NewCustomers.lastweek = res.data.data.newUserCount
                }, err => {
                    console.log(err)
                })
            },
            // 营业额 订单数量 客单价  本月
            monthShowData(url, url2){
                var url = url;

                var url2 = url2;

                var TimeStamp = this.MonthTeaTime(); // 获取日期时间戳

                for (var i in TimeStamp) {
                    if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                        url += i + '=' + TimeStamp[i] + '&';
                        url2 += i + '=' + TimeStamp[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                url2 = url2.slice(0, url2.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.month_Container = res.data.data
                }, err => {
                    console.log(err)
                })

                this.$http.get(url2).then(res => {
                    this.NewCustomers.month = res.data.data.newUserCount
                }, err => {
                    console.log(err)
                })
            },
            // 营业额 订单数量 客单价  上月
            lastmonthShowData(url, url2){
                var url = url;

                var url2 = url2;

                var TimeStamp = this.LastMonthTeaTime(); // 获取日期时间戳

                for (var i in TimeStamp) {
                    if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                        url += i + '=' + TimeStamp[i] + '&';
                        url2 += i + '=' + TimeStamp[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);
                url2 = url2.slice(0, url2.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data.data)
                    this.lastmonth_Container = res.data.data
                }, err => {
                    console.log(err)
                })

                this.$http.get(url2).then(res => {
                    this.NewCustomers.lastmonth = res.data.data.newUserCount
                }, err => {
                    console.log(err)
                })
            },

            // 更改营业额图表
            ChangeTurnoverChart(idx) {
                var btns = document.getElementsByClassName('Turnover');

                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'changeChart Turnover'
                }

                btns[idx].className = 'changeChart Turnover changeChart_active';

                switch(idx){
                    case 0:  //``````````````````````````````````````````````````````````````````````````````````````````````````````````````````
                    // 处理url 给函数传递一个拼接好的url去下一个函数发起请求
                    var state = '对比上周';
                    
                    var type = 'bar'

                    var url = '/v2/kpis/index/turnover?';

                    var TimeStamp = this.LastMondayToNowTeaTime(); // 获取日期时间戳

                    for (var i in TimeStamp) {
                        if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                            url += i + '=' + TimeStamp[i] + '&';
                        }
                    }

                    url = url.slice(0, url.length - 1);

                    // console.log(url)

                    var turnover_arr = []

                    // 发起请求 上周一至今
                    this.$http.get(url).then(res => {

                        if (res.data.result.code == 0) {
                            
                            res.data.month.forEach((v,i) => {

                                turnover_arr.push(v.turnover)
                            })

                            this.TurnoverChartsData(state, type, turnover_arr);
                        }

                    }, err => {
                        console.log(err)
                    })

                    break;
                    
                    case 1:  //``````````````````````````````````````````````````````````````````````````````````````````````````````````````````
                    var state = '近30天趋势';
                    var type = 'line'
                    var url = '/v2/kpis/index/turnover?';

                    var TimeStamp = this.LastTwoMonthsTeaTime(); // 获取日期时间戳
                    
                    for (var i in TimeStamp) {
                        if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                            url += i + '=' + TimeStamp[i] + '&';
                        }
                    }

                    url = url.slice(0, url.length - 1);

                    // console.log(url)

                    var turnover_arr = []

                    // 发起请求 近60天
                    this.$http.get(url).then(res => {
                        
                        if (res.data.result.code == 0) {

                            turnover_arr = res.data.month;

                            var weekend_arr = []; // 存储周末
                            
                            // 处理日期 如果是周末就push weekend
                            turnover_arr.forEach((v,i) => {
                                if (new Date(v.date).getDay() == 0) {
                                    weekend_arr.push(v)
                                }
                            })

                            this.TurnoverChartsData(state, type, weekend_arr);
                        }

                    }, err => {
                        console.log(err)
                    })
                    break;

                    default :
                    break;
                }
            },
            // 营业额图表数据
            TurnoverChartsData(state, type, arr) {
                // console.log(url)

                var seriesType = type;

                var turnover_myChart = echarts.init(document.getElementById('can_view_turnover'));

                if (state == '对比上周') {

                    var interval = this.interval_(arr);
                    
                    var turnover_option = {

                        legend: {
                            data: ['本周', '上周']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    interval: 0,
                                    rotate: 0,
                                },  
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                min: 0,
                                max: interval,
                                show: true,
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: interval,
                                show:false, 
                            }
                        ],
                        series: [
                            {
                                name: '上周',
                                type: seriesType,
                                data: arr.slice(0,7),
                                barGap: '70%',
                                barWidth: 20,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#fedb5b',
                                        label: {
                                            show: true,
                                        }
                                    }
                                },
                            },
                            {
                                name: '本周',
                                type: seriesType,
                                data: arr.slice(7),
                                barWidth: 20,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#66e0e3',
                                        label: {
                                            show: true,
                                        }
                                    }
                                },
                            }
                        ],
                    };

                    turnover_myChart.setOption(turnover_option);

                } else if (state == '近30天趋势') {
                    var week_arr = [], // 存放日期 
                        weekdata_arr = []; // 存放日期对应数据

                    arr.forEach((v, i) => {
                        week_arr.push(v.date);
                        weekdata_arr.push(v.turnover);
                    })
                    
                    var interval = this.interval_(weekdata_arr)
                    
                    var turnover_option = {

                        legend: {
                            data: ['周末'],
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: week_arr,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    interval: 0,
                                    rotate: 50,
                                },
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                min: 0,
                                max: interval
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: interval,
                                show: false,
                            }
                        ],
                        series: [
                            {
                                name: '周末',
                                type: seriesType,
                                smooth: true,
                                data: weekdata_arr,
                                barWidth: 20,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#5793f3',
                                        label: {
                                            show: true,
                                        }
                                    }
                                },
                                areaStyle: {}
                            },
                            {
                                data: [],
                            }
                        ],
                    };

                    turnover_myChart.setOption(turnover_option);
                }
            },

            // 更改订单数量图表
            ChangeOrdernumberChart(idx) {
                var btns = document.getElementsByClassName('Ordernumber');

                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'changeChart Ordernumber'
                }

                btns[idx].className = 'changeChart Ordernumber changeChart_active';

                switch(idx){
                    case 0:  //``````````````````````````````````````````````````````````````````````````````````````````````````````````````````

                    var state = '对比上周';

                    var type = 'bar'

                    var url = '/v2/kpis/index/orders?';

                    var TimeStamp = this.LastMondayToNowTeaTime(); // 获取日期时间戳
                    
                    for (var i in TimeStamp) {
                        if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                            url += i + '=' + TimeStamp[i] + '&';
                        }
                    }

                    url = url.slice(0, url.length - 1);

                    // console.log(url)

                    var turnover_arr = []

                    // 发起请求 上周一至今
                    this.$http.get(url).then(res => {
                        
                        if (res.data.result.code == 0) {
                            
                            res.data.orderData.forEach((v,i) => {

                                turnover_arr.push(v.orderCount)

                            })

                            this.OrdernumberChartsData(state, type, turnover_arr);
                        }

                    }, err => {
                        console.log(err)
                    })
                    
                    break;
                    
                    case 1:  //``````````````````````````````````````````````````````````````````````````````````````````````````````````````````

                    var state = '近30天趋势';

                    var type = 'line'

                    var url = '/v2/kpis/index/orders?';

                    var TimeStamp = this.LastTwoMonthsTeaTime(); // 获取日期时间戳
                    
                    for (var i in TimeStamp) {
                        if (TimeStamp[i] != '' && TimeStamp[i] != null && TimeStamp[i] != undefined) {
                            url += i + '=' + TimeStamp[i] + '&';
                        }
                    }

                    url = url.slice(0, url.length - 1);

                    // console.log(url)

                    var turnover_arr = []

                    // 发起请求 近60天
                    this.$http.get(url).then(res => {
                        
                        if (res.data.result.code == 0) {

                            turnover_arr = res.data.orderData;

                            var weekend_arr = []; // 存储周末

                            // 处理日期 如果是周末就push weekend
                            turnover_arr.forEach((v,i) => {
                                if (new Date(v.orderDate).getDay() == 0) {
                                    weekend_arr.push(v)
                                }
                            })

                            this.OrdernumberChartsData(state, type, weekend_arr);
                        }

                    }, err => {
                        console.log(err)
                    })

                    break;

                    default :
                    break;
                }
            },
            // 订单数量图表数据
            OrdernumberChartsData(state, type, arr) {
                // console.log(url)
                
                var seriesType = type;

                var turnover_myChart = echarts.init(document.getElementById('can_view_Ordernumber'));
                

                if (state == '对比上周') {

                    var interval = this.interval_(arr);

                    var turnover_option = {

                        legend: {
                            data: ['本周', '上周']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    interval: 0,
                                    rotate: 0,
                                },  
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                min: 0,
                                max: interval,
                                show: true,
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: interval,
                                show:false, 
                            }
                        ],
                        series: [
                            {
                                name: '上周',
                                type: seriesType,
                                data: arr.slice(0,7),
                                barWidth : 20,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#4d93dd',
                                        label: {
                                            show: true,
                                        }
                                    }
                                },
                            },
                            {
                                name: '本周',
                                type: seriesType,
                                data: arr.slice(7),
                                barGap: '70%',
                                barWidth : 20,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#e48d3e',
                                        label: {
                                            show: true,
                                        }
                                    }
                                },
                            }
                        ],
                    };

                    turnover_myChart.setOption(turnover_option);

                } else if (state == '近30天趋势') {
                    
                    var week_arr = [], // 存放日期 
                        weekdata_arr = []; // 存放日期对应数据

                    arr.forEach((v, i) => {
                        week_arr.push(v.orderDate);
                        weekdata_arr.push(v.orderCount);
                    })
                    
                    var interval = this.interval_(weekdata_arr);

                    var turnover_option = {

                        legend: {
                            data: ['周末']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: week_arr,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    interval: 0,
                                    rotate: 50,
                                },                       
                                position:'bottom',

                            },
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                min: 0,
                                max: interval
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: interval,
                                show:false, 
                            }
                        ],
                        series: [
                            {
                                name: '周末',
                                type: seriesType,
                                smooth: true,
                                data: weekdata_arr,
                                barWidth : 20,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#e95f3a',
                                        label: {
                                            show: true,
                                        }
                                    }
                                },
                                areaStyle: {}
                            },
                            {
                                data: [],
                            }
                        ],
                    };

                    turnover_myChart.setOption(turnover_option);
                }
            },




            // 更改周客流量与营业额图表
            ChangeWeekPassengerTurnoverChart(idx) {
                var btns = document.getElementsByClassName('week_PassengerTurnover');

                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'changeChart week_PassengerTurnover'
                }

                btns[idx].className = 'changeChart week_PassengerTurnover changeChart_active';
                // console.log(idx)
                switch(idx){
                    case 0:
                    var url = 2000;
                    this.WeekPassengerTurnoverChartsData(url);
                    break;
                    
                    case 1:
                    var url = 6000;
                    this.WeekPassengerTurnoverChartsData(url);
                    break;

                    default :
                    break;
                }
            },
            // 周客流量与营业额图表数据
            WeekPassengerTurnoverChartsData(url) {
                // console.log(url)
                var week_PassengerTurnover_myChart = echarts.init(document.getElementById('can_view_week_PassengerTurnover'));

                var num = url / 1000 + 15

                var week_PassengerTurnover_option = {
                    legend: {
                        data:['客流量(笔)', '交易额(元)'],
                        textStyle: {
                            fontSize: 12,
                            color: '#000'
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['周一','周二','周三','周四','周五','周六','周日'],
                            axisPointer: {
                                type: 'shadow'
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '客流量(笔)',
                            min: 0,
                            max: 250,
                            interval: 50,
                        },
                        {
                            type: 'value',
                            name: '交易额(元)',
                            min: 0,
                            max: 25,
                            interval: 5,
                        }
                    ],
                    series: [
                        {
                            name:'客流量(笔)',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
                            barWidth : 20,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#5793f3',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        },
                        
                        {
                            name:'交易额(元)',
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, num, 4.5, 6.3, 10.2, 20.3],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#d14a61',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        }
                    ]
                };
                
                week_PassengerTurnover_myChart.setOption(week_PassengerTurnover_option);
            },



            // 更改时段客流量与营业额图表
            ChangePeriodPassengerTurnoverChart(idx) {
                var btns = document.getElementsByClassName('Period_PassengerTurnover');

                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'changeChart Period_PassengerTurnover'
                }

                btns[idx].className = 'changeChart Period_PassengerTurnover changeChart_active';
                // console.log(idx)
                switch(idx){
                    case 0:
                    var url = 2000;
                    this.PeriodPassengerTurnoverChartsData(url);
                    break;
                    
                    case 1:
                    var url = 6000;
                    this.PeriodPassengerTurnoverChartsData(url);
                    break;

                    default :
                    break;
                }
            },
            // 时段客流量与营业额图表数据
            PeriodPassengerTurnoverChartsData(url) {
                // console.log(url)
                var Period_PassengerTurnover_myChart = echarts.init(document.getElementById('can_view_Period_PassengerTurnover'));

                var num = url / 1000 + 15

                var Period_PassengerTurnover_option = {
                    legend: {
                        data:['客流量(笔)', '交易额(元)'],
                        textStyle: {
                            fontSize: 12,
                            color: '#000'
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 60
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '客流量(笔)',
                            min: 0,
                            max: 250,
                            interval: 50,
                        },
                        {
                            type: 'value',
                            name: '交易额(元)',
                            min: 0,
                            max: 25,
                            interval: 5,
                        }
                    ],
                    series: [
                        {
                            name:'客流量(笔)',
                            type:'line',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 2.0, 4.9, 12.0, 4.9, 12.0, 4.9, 2.9, 4.9, 2.0, 4.9, 32.0, 4.9, 2.0, 4.9, 2.0, 4.9, 2.0],
                            barWidth : 20,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#5793f3',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        },
                        
                        {
                            name:'交易额(元)',
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, num, 4.5, 6.3, 10.2, 20.3, 2.0, 2.2, num, 4.5, 6.3, 2.0, 2.2, num, 4.5, 6.3, 2.0, 2.2, num, 4.5, 6.3, 2.7, 17.9],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#d14a61',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        }
                    ]
                };
                
                Period_PassengerTurnover_myChart.setOption(Period_PassengerTurnover_option);
            },



            // 更改顾客月复购率图表
            ChangeMonthAfterBuyingChart(idx) {
                
                var url = 2000;

                this.Month_AfterBuyingChartsData(url);

            },
            // 顾客月复购率图表数据
            Month_AfterBuyingChartsData(url) {
                // console.log(url)
                var Month_AfterBuying_myChart = echarts.init(document.getElementById('can_view_Month_AfterBuying'));

                var num = url / 1000 + 15

                var Month_AfterBuying_option = {
                    legend: {
                        data:['当月消费人数', '复购率'],
                        textStyle: {
                            fontSize: 12,
                            color: '#000'
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['7月','8月','9月','10月','11月','12月','1月'],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '当月消费人数',
                            min: 0,
                            max: 250,
                            interval: 50,
                        },
                        {
                            type: 'value',
                            name: '复购率',
                            min: 0,
                            max: 25,
                            interval: 5,
                        }
                    ],
                    series: [
                        {
                            name:'当月消费人数',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
                            barWidth : 20,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#5793f3',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        },
                        
                        {
                            name:'复购率',
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, num, 4.5, 6.3, 10.2, 20.3],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#d14a61',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        }
                    ]
                };
                
                Month_AfterBuying_myChart.setOption(Month_AfterBuying_option);
            },



            // 更改顾客周复购率图表
            ChangeWeekAfterBuyingChart(idx) {
                
                var url = 2000;

                this.Week_AfterBuyingChartsData(url);

            },
            // 顾客周复购率图表数据
            Week_AfterBuyingChartsData(url) {
                // console.log(url)
                var Week_AfterBuying_myChart = echarts.init(document.getElementById('can_view_Week_AfterBuying'));

                var num = url / 1000 + 15

                var Week_AfterBuying_option = {
                    legend: {
                        data:['当月消费人数', '复购率'],
                        textStyle: {
                            fontSize: 12,
                            color: '#000'
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['7月','8月','9月','10月','11月','12月','1月'],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '当月消费人数',
                            min: 0,
                            max: 250,
                            interval: 50,
                        },
                        {
                            type: 'value',
                            name: '复购率',
                            min: 0,
                            max: 25,
                            interval: 5,
                        }
                    ],
                    series: [
                        {
                            name:'当月消费人数',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
                            barWidth : 20,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#5793f3',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        },
                        
                        {
                            name:'复购率',
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, num, 4.5, 6.3, 10.2, 20.3],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#d14a61',
                                    label: {
                                        show: true,
                                    }
                                }
                            },
                        }
                    ]
                };
                
                Week_AfterBuying_myChart.setOption(Week_AfterBuying_option);
            },
        },
        created(){
            // this.LastMondayToNowTeaTime()
        },
        mounted() {
            this.ShowData();
            // 营业额
            this.ChangeTurnoverChart(0);
            // 订单数量
            this.ChangeOrdernumberChart(0);
            // 周客流量与营业额
            // this.ChangeWeekPassengerTurnoverChart(0);
            // 时段客流量与营业额
            // this.ChangePeriodPassengerTurnoverChart(0);
            // 顾客月复购率图表
            // this.ChangeMonthAfterBuyingChart(0)
            // 顾客周复购率图表
            // this.ChangeWeekAfterBuyingChart(0)
        }
    }

</script>

<style scoped>
    .home {
        width: 100%;
        /* height: 100%; */
        background: none;
        box-sizing: border-box;
        padding: 40px 30px 30px 30px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        background: white;
    }

    .home_tit {
        width: 100%;
        margin-bottom: 10px;
        color: #000;
        font-size: 14px;
        font-weight: 600;
    }
    /*  数据列表  */

    .home_shop {
        width: 100%;
        height: 210px;
        display: flex;
        background: white;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .home_shop_list {
        box-sizing: border-box;
        /* margin: 0 10px 0 0; */
        padding: 20px 0 0 0px;
        width: 25%;
        height: 100%;
        line-height: 34px;
        border: none;
        font-size: 14px;
        color: #000;
        display: flex;
        flex-direction: column;
        background: white;
        position: relative;
        /* border:1px solid red; */
    }

    .home_shop_list:nth-child(2n-1)::after{
        content: ' ';
        display: inline-block;
        width: 1px;
        height: 170px;
        background: #ccc;
        position: absolute;
        top: 20px;
        right: 0;
    }

    .home_shop_list:nth-child(2)::after{
        content: '';
        width: 1px;
        height: 170px;
        background: #ccc;
        position: absolute;
        top: 20px;
        right: 0;
    }

    .home_shop_list:last-child {
        margin: 0;
    }

    /*  数据列表 上内容  */

    .shop_tit {
        width: 100%;
        text-align: center;
    }

    .shop_pro {
        color: #000;
        font-size: 18px;
        /* font-weight: 600; */
    }
    /*  数据列表 下内容  */

    .shop_con {
        flex: 1;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        /* padding-left:8px; */
    }

    .shop_con_son {
        display: flex;
        /* flex: 1; */
        box-sizing: border-box;
        padding-top: 10px;
        /* border:1px solid red; */
    }

    .shop_con_son>p:nth-child(1){
        box-sizing: border-box;
        flex: 1;
        /* border:1px solid blue; */
    }
    
    .shop_con_son>p:nth-child(2){
        flex: 1;
        /* border:1px solid orange; */
    }

    .shop_con_son>p:nth-child(2)>span:nth-child(1){
        /* border:1px solid red; */
        padding-left: 10px;
    }

    .last_sty {
        font-size: 14px;
    }

    .last_sty span:nth-child(1){
        /* font-size: 12px; */
        padding-left: 25px;
    }

    .last_sty span:nth-child(2){
        font-size: 14px;
    }

    /*  信息图表  */

    .home_chart {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .home_chart_list {
        /* width: 50%; */
        width: 49%;
        flex: 1;
        height: 350px;
        margin: 0px 12px 0 0;
        box-sizing: border-box;
        background: white;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #000;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .home_chart_list:nth-child(2n) {
        margin-right: 0;
    }
    /*  每个容器的图表 - title  */

    .box_title {
        padding: 10px 0;
        box-sizing: border-box;
        text-align: center;
    }

    .fl_tit {
        position: absolute;
        top: 12px;
        left: 10px;
        /* font-weight: 600; */
        font-size: 16px;
    }
    /*  切换图表按钮  */

    .changeChart {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid rgb(217, 215, 191);
        color:#999;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        padding: 10px 15px;
        font-size: 14px;
        border-radius: 4px;
        margin-right: 6px;
    }
    /*  按钮点击样式  */

    .changeChart_active {
        border: 1px solid rgba(0, 0, 0, 0.3);
        color: rgba(0, 0, 0, 0.8);
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.3);
        /* f7ba2a */
    }
    /*  每个容器的图表 - container  */

    .box_container {
        flex: 1;
        /* width:100%; */
    }

    #can_view_turnover, #can_view_Ordernumber, #can_view_week_PassengerTurnover, #can_view_Period_PassengerTurnover, #can_view_Month_AfterBuying, #can_view_Week_AfterBuying {
        width: 99.9%;
        height: 100%;
    }

    .a{
        background: #f7ba2a;
        background: #37a2da;
        background: #66e0e3;
        background: #fedb5b;
        background: #ff9f7f;
        background: #e061ae;
    }
</style>
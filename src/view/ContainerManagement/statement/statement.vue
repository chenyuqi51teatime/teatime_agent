<template>
    <div class="statement">
        <!--  选择时间框  -->
        <div class="check_time">
            <span class="tit">时间</span>
            <span class="check_time_btn" @click='check_time_btn(0)'>今天</span>
            <span class="check_time_btn" @click='check_time_btn(1)'>昨天</span>
            <span class="check_time_btn" @click='check_time_btn(2)'>最近7天</span>
            <span class="check_time_btn" @click='check_time_btn(3)'>最近30天</span>
            <el-date-picker :clearable='false' style="padding: 0px 10px;" @blur='cancel_cls' v-model="pickertime" type="datetimerange"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <!--  查询条件框  -->
        <div class="check_container">
            <span class="tit">姓名</span>

            <el-input class="address-select spacing" v-model="searchData.venderId" placeholder="请输入姓名"></el-input>

            <span class="tit">手机号</span>

            <el-input class="address-select spacing" v-model="searchData.venderId" placeholder="请输入手机号"></el-input>

            <span class="tit">昵称</span>

            <el-input class="address-select spacing" v-model="searchData.venderId" placeholder="请输入昵称"></el-input>

            <span class="tit">操作类型</span>

            <el-select class="address-select spacing" v-model="searchData.OperationType" placeholder="全部">
                <el-option v-for="p in OperationT" :label="p" :value="p" :key="p"></el-option>
            </el-select>

            


            <el-button type="warning" @click="search" class="search_btn">查询</el-button>

            <el-button type="warning" @click="exportData" class="exportData_btn">导出</el-button>
        </div>
    </div>
</template>

<script>
    // import { areas } from '@/area'

    export default {
        data() {
            return {
                pickertime: [], // 时间选择器
                searchData: {
                    time: '', // 时间
                    venderId: '', // 货柜编号
                    startDate: '', // 开始时间
                    endDate: '', // 结束时间
                    OperationType: '', // 操作类型
                },
                OperationT: ['全部', '微信充值', '支付宝充值', '消费'], // 操作类型
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },

            }
        },
        created() {

        },
        methods: {
            // 更改选择时间按钮改变样式
            check_time_btn(idx) {
                var btns = document.getElementsByClassName('check_time_btn');

                // 判断当前按钮如果为选中状态时

                if (btns[idx].className == 'check_time_btn active') {
                    this.searchData.time = '';
                    btns[idx].className = 'check_time_btn';
                    return;
                }

                for (var i = 0; i < btns.length; i++) {
                    btns[i].className = 'check_time_btn'
                }

                btns[idx].className = 'check_time_btn active'

                // 绑定时间数据
                this.searchData.time = btns[idx].innerHTML;
                this.pickertime = [];
                this.searchData.startDate = '';
                this.searchData.endDate = '';
            },
            // 当选择日期框触发时
            cancel_cls() {
                if (this.pickertime != '') {
                    // 时间选择器选择了时间
                    // console.log(111)
                    if (this.pickertime) {
                        // 取消所有样式
                        var btns = document.getElementsByClassName('check_time_btn');
                        for (var i = 0; i < btns.length; i++) {
                            btns[i].className = 'check_time_btn'
                        }
                        // 设置开始时间 和 结束时间
                        this.searchData.startDate = this.pickertime[0].getTime();
                        this.searchData.endDate = this.pickertime[1].getTime();
                        // 天数清空
                        this.searchData.time = '';
                    } else {
                        this.searchData.startDate = '';
                        this.searchData.endDate = '';
                    }
                }
            },
            // 查询
            search(pageNo = 1) {
                
                let requestData = Object.assign(this.searchData, this.page)

                console.log(requestData)
            }
        }
    }

</script>

<style scoped>
    .statement {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba4(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .check_time {
        /* border: 1px solid red; */
        padding: 10px 0;
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
    /*  导出按钮  */

    .exportData_btn {}
    /*  选择城市间距  */

    .spacing {
        margin-right: 6px;
    }
</style>
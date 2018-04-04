<template>
    <div class="ReplenishmentRules">
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

        <div class="check_container">
            <el-button type="warning" @click='setRules_batch'>批量设置规则</el-button>
        </div>

        <!--  表格展示数据  -->
        <el-table :data="DataContainers" style="width: 100%" border :show-header="header" inline @selection-change='containerInfor'
            ref="multipleTable">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="id" label="货柜编号" align="center" width='120' fixed></el-table-column>

            <el-table-column prop="address" label="摆放地址" align="center" min-width='220'></el-table-column>

            <el-table-column prop="" label="状态" align="center" min-width='120'>
                <template slot-scope='scope'>
                    <div v-if='scope.row.rulesStatus == 0'>未启用</div>
                    <div v-if='scope.row.rulesStatus == 1'>启用</div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="操作" align="center" min-width='120'>
                <template slot-scope='scope'>
                    <el-button type="text" size="small" @click="SetRules(scope.row)">设置规则</el-button>
                    <el-button v-if='scope.row.rulesStatus == 1' type="text" size="small" @click="_stop(scope.row)">停用</el-button>
                    <el-button v-if='scope.row.rulesStatus == 0' type="text" size="small" @click="_start(scope.row)">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  分页器  -->
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="search" />

        <!-- 设置规则dialog -->
        <el-dialog title="设置规则" :visible.sync="SetRulesDialog" width="30%" class="RementRules" :before-close="SetRules_notsure">

            <div class="rules_title">统计日期：从上一次补货完成时间到当前时间。 当销售额、销售数量、货道为空数量满足下面设置的数字时，系统会自动生成补货单。</div>

            <el-form :model="checked" ref="taskForm" :rules="taskRules">
                <el-form-item prop="ContainerSales">
                    <div style="height:40px; display:flex;">
                        <div style="width: 140px;">
                            <el-checkbox v-model="check.ContainerSales" @change='_ContainerSales'>货柜销售额</el-checkbox>
                        </div>
                        <div style="width: 200px;">
                            <el-input v-if='check.ContainerSales' v-model="checked.ContainerSales"></el-input>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item prop="SalesAmount">
                    <div style="height:40px; display:flex;">
                        <div style="width: 140px;">
                            <el-checkbox v-model="check.SalesAmount" @change='_SalesAmount'>销售数量</el-checkbox>
                        </div>
                        <div style="width: 200px;">
                            <el-input v-if='check.SalesAmount' v-model="checked.SalesAmount"></el-input>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item prop="EmptyNumber">
                    <div style="height:40px; display:flex;">
                        <div style="width: 140px;">
                                <el-checkbox v-model="check.EmptyNumber" @change='_EmptyNumber'>货道为空数量</el-checkbox>
                        </div>
                        <div style="width: 200px;">
                                <el-input v-if='check.EmptyNumber' v-model="checked.EmptyNumber"></el-input>
                        </div>
                    </div>
                </el-form-item>
                
                <el-form-item>
                    <div class="rules_title" style="color:red;">
                        补货规则：
                        <span v-if=' checked.ContainerSales > 0 '>货柜销售额{{checked.ContainerSales || 0}}元，</span>
                        <span v-if=' checked.SalesAmount > 0 '>销售数量为{{checked.SalesAmount || 0}}个，</span>
                        <span v-if=' checked.EmptyNumber > 0 '>货道为空数量{{checked.EmptyNumber || 0}}个，</span>
                        以上条件成立时，系统自动生成补货单！
                    </div>
                </el-form-item>

                <el-form-item>
                    <div class="dialog-footer">
                        <el-button type="warning" @click="SetRules_sure('taskForm')">保存</el-button>
                        <el-button @click="SetRules_notsure">取消</el-button>
                    </div>
                </el-form-item>

            </el-form>
            

        </el-dialog>
        <!-- 启用补货规则 -->
        <el-dialog title="提示" :visible.sync="start_Dialog" width="30%" :before-close="start_notsure">
            <div class="exitMsg">确定开启自动生成补货单功能？</div>
            <div slot="footer" class="dialog-footer">
              <el-button type="warning" @click="start_sure">确 定</el-button>
              <el-button @click="start_notsure">取 消</el-button>
            </div>
          </el-dialog>
        <!-- 停用补货规则 -->
        <el-dialog title="提示" :visible.sync="stop_Dialog" width="30%" :before-close="stop_notsure">
            <div class="exitMsg">确定停用自动生成补货单规则？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="stop_sure">确 定</el-button>
                <el-button @click="stop_notsure">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 没有设置规则 -->
        <el-dialog title="提示" :visible.sync="noRules_Dialog" width="30%" :before-close="noRules_sure">
            <div class="exitMsg">暂未设置补货规则，设置规则后才能开启此功能。</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="noRules_sure">确 定</el-button>
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
    export default {
        data() {
            return {
                SetRulesDialog: false, // 设置规则dialog
                start_Dialog: false, // 开启规则dialog
                stop_Dialog: false, // 停用规则dialog
                noRules_Dialog: false, // 没有设置规则dialog
                SelectTempDialog: false, // 未勾选货柜提示
                check: {
                    ContainerSales: false,
                    SalesAmount: false,
                    EmptyNumber: false,
                },
                checked: {
                    ContainerSales: '',
                    SalesAmount: '',
                    EmptyNumber: '',
                },
                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区

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

                DataContainers: [], //表格数据
                containerInforMsg: [], // 批量设置规则
                checked_temp: [], // 选中的模板
                start: '', // 启用货柜信息
                stop: '', // 停用货柜信息
                error_info_ContainerSales:'',
                error_info_SalesAmount:'',
                error_info_EmptyNumber:'',
                taskRules: {
                    ContainerSales: [
                        {
                            validator: function (rule, value, callback) {
                                if (value) {
                                    if (isNaN(value)) {
                                        callback(new Error("输入内容有误,请重新输入!"));
                                    } else if (0 >= value || value > 99999) {
                                        callback(new Error("输入金额在1`99999之间"));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    SalesAmount: [
                        {
                            validator: function (rule, value, callback) {
                                if (value) {
                                    if (isNaN(value)) {
                                        callback(new Error("输入内容有误,请重新输入!"));
                                    } else if (0 >= value || value > 99999) {
                                        callback(new Error("输入金额在1`99999之间"));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    EmptyNumber: [
                        {
                            validator: function (rule, value, callback) {
                                if (value) {
                                    if (isNaN(value)) {
                                        callback(new Error("输入内容有误,请重新输入!"));
                                    } else if (0 >= value || value > 99999) {
                                        callback(new Error("输入金额在1`99999之间"));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                }
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

                this.ObtRequestData(url);

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
            // 货柜信息
            containerInfor(data) {
                this.containerInforMsg = data;
            },
            // 批量设置规则
            setRules_batch() {
                if (this.containerInforMsg.length <= 0) {
                    // 未勾选货柜！
                    this.SelectTempDialog = true;
                } else {
                    // 勾选货柜
                    // console.log('勾选货柜')
                    
                    this.SetRulesDialog = true;
                }
            },
            // 设置规则
            SetRules(row) {

                this.containerInforMsg = [row];

                this.SetRulesDialog = true;
            },
            // 设置规则dialog - 确定
            SetRules_sure(formName) {

                var _this = this;

                if (this.checked.ContainerSales == '' && this.checked.SalesAmount == '' && this.checked.EmptyNumber == '') {
                    this.$message.error('请输入规则!');
                    return;
                }
                
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        // console.log(this.checked)

                        let containerInforMsg = this.containerInforMsg;

                        containerInforMsg.map((v, i) => {
                            v.actual = Number(this.checked.ContainerSales); // 货柜销售额
                            v.salesCount = Number(this.checked.SalesAmount); // 销售数量
                            v.nullPlantCount = Number(this.checked.EmptyNumber); // 空托盘数量
                            v.rulesStatus = 1; // 更改状态 0未启用 1启用
                        })
                        
                        // console.log(this.containerInforMsg)

                        new Promise((res, rej) => {

                            containerInforMsg.forEach((v, i) => {
                                this.$http.post('/v1/business/vendor/updataVendor', v).then(res => { }, err => { console.log(err); });
                            })

                            res();

                        }).then(() => {
                            this.$message('设置规则成功!');
                            this.SetRules_notsure();
                        })

                    } else {
                        return false
                    }
                })

            },
            // 设置规则dialog - 取消
            SetRules_notsure() {
                this.check = {
                    ContainerSales: false,
                    SalesAmount: false,
                    EmptyNumber: false,
                };
                this.checked = {
                    ContainerSales: '',
                    SalesAmount: '',
                    EmptyNumber: '',
                };
                this.containerInforMsg = [];
                this.$refs.multipleTable.clearSelection();
                this.SetRulesDialog = false;
            },
            // 启用
            _start(row) {
                this.start_Dialog = true;
                this.start = row;
                // console.log('启用')
            },
            // 启用 - 确认
            start_sure(){

                var _start = this.start;
                
                if (_start.actual == '' && _start.salesCount == '' && _start.nullPlantCount == '') {
                    this.start_Dialog = false;
                    this.noRules_Dialog = true;
                    return;
                }
                if (_start.actual == null && _start.salesCount == null && _start.nullPlantCount == null) {
                    this.start_Dialog = false;
                    this.noRules_Dialog = true;
                    return;
                }
                _start.rulesStatus = 1;
                
                this.$http.post('/v1/business/vendor/updataVendor', _start).then(res => {
                    if (res.data.success) {
                        this.start_notsure();
                    }
                },err => {
                    // console.log(err)
                })
                
            },
            // 启用 - 取消
            start_notsure(){
                this.start = '';
                this.start_Dialog = false;
            },
            // 停用
            _stop(row) {
                this.stop_Dialog = true;
                this.stop = row;
                // console.log('停用')
            },
            // 停用 - 确认
            stop_sure() {

                var _stop = this.stop;

                _stop.rulesStatus = 0;

                this.$http.post('/v1/business/vendor/updataVendor', _stop).then(res => {
                    // console.log(res)
                    if (res.data.success) {
                        this.stop_notsure()
                    }
                }, err => {
                    // console.log(err);
                });

            },
            // 停用 - 取消
            stop_notsure() {
                this.stop = '',
                this.stop_Dialog = false;
            },
            // 没有设置规则提示框
            noRules_sure(){
                this.noRules_Dialog = false;
            },
            // dialog - 多选框选中状态
            _ContainerSales() {
                if (!this.check.ContainerSales) {

                    this.checked.ContainerSales = ''

                } else {

                    this.checked.ContainerSales = 1

                }
            },
            _SalesAmount() {
                if (!this.check.SalesAmount) {

                    this.checked.SalesAmount = ''

                } else {

                    this.checked.SalesAmount = 1

                }
            },
            _EmptyNumber() {
                if (!this.check.EmptyNumber) {

                    this.checked.EmptyNumber = ''

                } else {

                    this.checked.EmptyNumber = 1

                }
            },
        },
        activated() {
            if (this.$store.state.isFirstEnter) {
                this.searchData = {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                },

                    this.provinces = areas.filter(area => area.level === 1)
                this.provinces.unshift({ name: '请选择省', code: '请选择省' })
                this.cities = []
                this.districts = []
                this.cities.unshift({ name: '请选择市', code: '请选择市' })
                this.districts.unshift({ name: '请选择区', code: '请选择区' })
                this.search()
            }
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
            this.search()
        },
    }

</script>
<style scoped>
    .ReplenishmentRules {
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
        padding: 0 0 10px 0;
    }

    /*  标题  */

    .tit {
        margin-right: 10px;
        font-size: 14px;
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

    /* dialog 多选框 */

    .checkBox_cls {
        display: flex;
        flex-direction: column;
        height: 70px;
        /* line-height: 80px; */
        /*  */
        /* padding: 2px 0; */
    }

    /* 错误提示 */
    
    .error_info{
        /* padding-left:10px; */
        /* border:1px solid red; */
        color:red;
    }

    .rules_title {
        /* padding: 20px 0; */
    }
</style>
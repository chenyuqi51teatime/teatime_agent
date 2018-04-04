<template>
    <div id="product">
        <div class="form">
            <el-form :inline="true" :model="searchData">
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

                <el-form-item label="货柜编号">
                    <el-input class="address-select" v-model="searchData.vendorId"></el-input>
                </el-form-item>

                <el-form-item label="商务姓名">
                    <el-input class="address-select" v-model="searchData.bdName"></el-input>
                </el-form-item>

                <el-form-item label="维护人姓名">
                    <el-input class="address-select" v-model="searchData.maintainPersonName"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="warning" @click.native.prevent="search(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-button type="warning" class="bind binddev" @click='bindCon'>
            <!-- <router-link to='/container/BindingEquipment'>绑定设备</router-link> -->
            绑定设备
        </el-button>
        <el-button type="warning" class="bind binddev_batch" @click="batch">
            批量绑定设备
        </el-button>

        <div class="title">手机认证：开启后，新用户第一次扫码开门必须输入手机号。<span style='margin: 0 40px;'></span> 必须免密：开启后，用户扫码开门必须开启微信、支付宝小额免密支付功能。</div>

        <!--  表格数据  -->
        <el-table :data="devices" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
            <el-table-column prop="id" label="货柜编号" width="100"></el-table-column>

            <el-table-column label="摆放地址" min-width="140">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" v-if="scope.row.abbreviatedAddress !== null">
                        <p>地址 : {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.abbreviatedAddress }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column prop="maintainPersonName" label="维护人姓名" min-width="100"></el-table-column>

            <el-table-column prop="maintainPersonPhone" label="维护人手机号" min-width="100"></el-table-column>

            <el-table-column prop="bdName" label="商务姓名" min-width="80"></el-table-column>

            <el-table-column prop="bdPhone" label="商务手机号" min-width="100"></el-table-column>

            <el-table-column prop="createTime" label="绑定时间" min-width="100">
                <template slot-scope="scope" >
                    <div v-if='scope.row.createTime'>{{scope.row.createTime.split(' ')[0]}}</div>
                </template>
            </el-table-column>

            <el-table-column label="手机认证" min-width="80">
                <template slot-scope="scope">
                    <el-button type="text" size="small" v-if='scope.row.mobileAuth == 1' style="color:red;text-decoration:underline;" @click="NowCloseState(scope.row)">已关闭</el-button>
                    <el-button type="text" size="small" v-if='scope.row.mobileAuth == 2' style="color:#44b549;text-decoration:underline;" @click="NowOpenState(scope.row)">已开启</el-button>
                </template>
            </el-table-column>

            <el-table-column label="必须免密" min-width="80">
                <template slot-scope="scope">
                    <el-button type="text" size="small" v-if='scope.row.mustPap == 1' style="color:red;text-decoration:underline;" @click="NowCloseMustNoPwd(scope.row)">已关闭</el-button>
                    <el-button type="text" size="small" v-if='scope.row.mustPap == 2' style="color:#44b549;text-decoration:underline;" @click="NowOpenMustNoPwd(scope.row)">已开启</el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width='100'>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="editor(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="search" />
        </el-pagination>

        <!--  开启手机认证dialog  -->
        <el-dialog title="提示" :visible.sync="OpenPhoneAuthDialog" width="30%" :before-close="OpenPhoneAuthDialog_notsure">
            <div class="exitMsg">
                <div>确定开启手机认证？</div>
                <div>开启后，新用户第一次扫码开门必须输入手机号。</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="OpenPhoneAuthDialog_sure">确 定</el-button>
                <el-button @click="OpenPhoneAuthDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>
        <!--  关闭手机认证dialog  -->
        <el-dialog title="提示" :visible.sync="ClosePhoneAuthDialog" width="30%" :before-close="ClosePhoneAuthDialog_notsure">
            <div class="exitMsg">
                <div>确定关闭手机认证？</div>
                <div>关闭后，新用户第一次扫码开门不需要输入手机号。</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="ClosePhoneAuthDialog_sure">确 定</el-button>
                <el-button @click="ClosePhoneAuthDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>

        <!--  开启必须免密dialog  -->
        <el-dialog title="提示" :visible.sync="OpenMustNoPwdDialog" width="30%" :before-close="OpenMustNoPwdDialog_notsure">
            <div class="exitMsg">
                <div>确定开启免密支付？</div>
                <div>开启后，用户每次扫码开门必须开启微信、支付宝小额免密支付功能。</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="OpenMustNoPwdDialog_sure">确 定</el-button>
                <el-button @click="OpenMustNoPwdDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>

        <!--  关闭必须免密dialog  -->
        <el-dialog title="提示" :visible.sync="CloseMustNoPwdDialog" width="30%" :before-close="CloseMustNoPwdDialog_notsure">
            <div class="exitMsg">
                <div>确定关闭免密支付？</div>
                <div>关闭后，用户每次扫码开门不用开启微信、支付宝小额免密支付功能。</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="CloseMustNoPwdDialog_sure">确 定</el-button>
                <el-button @click="CloseMustNoPwdDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>

        <!--  绑定设备dialog  -->
        <el-dialog title="批量绑定设备" class="BindContainer" :visible.sync="state" center>
            <div class="container_dialog">
                <div class="dialog_file">
                    <div style="margin:0 40px 0 10px;">选择文件</div>
                    <div>
                        <el-upload ref="upload" name="dialog_" :action="fileUrl" :on-success="handleAvatarSuccess" :auto-upload="false" :file-list="fileList"
                            :on-change="handleChange" :headers='this.headers'>
                            <el-button type="warning" class="btn">请选择文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="dialog_temp">
                    <div style="margin:0 40px 0 10px;">下载模板</div>
                    <div>
                        <el-button type="warning" @click="downloadTemplate" class="btn">下载模板</el-button>
                    </div>
                </div>
                <div class="dialog_btn" style="text-align:center;">
                    <el-button style="margin-right:10px;" type="warning" @click="submitUpload">确定</el-button>
                    <el-button style="margin-left:10px;" @click="cancelUpload">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { areas } from '@/area'
    import { serverAddress,xlsxAddress } from '@/config.json'
    import { mapState, mapActions } from 'vuex'

    import md5 from 'js-md5';
    export default {
        name: 'ContainerBinding',
        data() {
            return {
                OpenPhoneAuthDialog: false,// 开启手机认证
                ClosePhoneAuthDialog: false,// 关闭手机认证
                OpenMustNoPwdDialog: false,// 开启必须免密
                CloseMustNoPwdDialog: false,// 关闭必须免密
                ChangeStaVendorId: null, // 要更改状态的货柜ID
                OpenVendorData: [], // 要开启手机认证的货柜信息

                headers: {
                    'Authorization': sessionStorage.getItem('teatimechangetoken')
                },
                
                state: false, // 绑定设备dialog
                fileList: [], // 上传文件
                fileName: '',
                fileUrl: `${serverAddress}/v1/business/vendor/batch/add`,    // 批量上传设备地址

                devices: [], // 表格数据

                page: {
                    totalPage: 1,
                    pageNo: '',
                    pageSize: 10,
                    total: 0
                },

                provinces: [],  // 省
                cities: [], // 市
                districts: [], // 区
                searchData: {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    bdName: '', // 商务姓名
                    maintainPersonName: '', // 维护人姓名
                },
            
            }
        },
        computed: {
            ...mapState(['role', 'pageNo', 'isFirstEnter'])
        },
        activated() {
            // console.log(this.$store.state.isFirstEnter)
            if (this.$store.state.isFirstEnter) {
                this.searchData = {
                    provinceId: '',    // 省
                    cityId: '',    // 市
                    districtId: '',    // 区
                    vendorId: '', // 货柜编号
                    bdName: '', // 商务姓名
                    maintainPersonName: '', // 维护人姓名
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
            console.log(localStorage.getItem('teatimechangetoken'))
        },
        methods: {
            ...mapActions(['getRole', 'changepageNo', 'changeEnter']),
            
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
            // 绑定设备
            bindCon() {
                this.$router.push({
                    path: '/container/BindingEquipment',
                    query: {
                        data: {
                            state: 1
                        }
                    }
                })
            },
            // 批量绑定设备
            batch() {
                this.state = true
            },
            // 下载模板
            downloadTemplate() {
                // https://teatime-excel.oss-cn-beijing.aliyuncs.com/%E7%BB%91%E5%AE%9A%E8%B4%A7%E6%9F%9C%E6%A8%A1%E6%9D%BF.xlsx
                window.location.href = `${xlsxAddress}/%E7%BB%91%E5%AE%9A%E8%B4%A7%E6%9F%9C%E6%A8%A1%E6%9D%BF.xlsx`
            },
            // 批量绑定设备dialog - 取消
            cancelUpload() {
                this.state = false;
                this.fileList = []
            },
            // 查看
            handleClick(row) {
                this.$router.push(`/container/deviceDetailCheck/${row.id}`)
            },
            // 编辑
            editor(row) {
                this.$router.push(`/container/deviceDetail/${row.id}`)
            },
            // 查询
            search(pageNo = 1) {
                this.page.pageNo = pageNo
                
                this.$store.dispatch('changepageNo', pageNo)
                
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

                let requestData = Object.assign(this.searchData, this.page);

                // console.log(requestData)

                var url = '/v2/vendors?'
                
                for (var i in requestData) {
                    if (requestData[i] != '' && requestData[i] != null && requestData[i] != undefined) {
                        url += i + '=' + requestData[i] + '&';
                    }
                }

                url = url.slice(0, url.length - 1);

                // console.log(url)

                this.$http.get(url).then(res => {
                    // console.log(res.data)
                    this.devices = res.data.vendorDtoList;
                    this.page.total = res.data.total;

                    // 日期格式化
                    this.devices.map(v => {
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

                }, err => {
                    console.log(err)
                    if (err) {
                        window.location.hash = '/login'
                        this.$message.error('网络错误，请重新登录!');
                        return;
                    }
                })

            },
            // 存放上传文件
            handleChange(file, fileList) {
                this.fileName = file.name
                let files = this.$refs.upload.uploadFiles
                this.$refs.upload.uploadFiles = [files[files.length - 1]]
            },
            // 提示上传状态
            handleAvatarSuccess(res) {
                console.log(res)
                if (res.success === false) {
                    this.$message.error('上传失败!')
                    //          this.fileList = []
                } else {
                    this.$message('上传成功!')
                    this.state = false
                    //          this.fileList = []
                    this.search()
                }
            },
            // 上传失败提示
            handleAvatarError(res) {
                this.$message.error('上传失败!')
            },
            // 上传文件 - 确定
            submitUpload() {
                // console.log(this.fileName.substring(this.fileName.length - 4, this.fileName.length))
                if (this.fileName.substring(this.fileName.length - 4, this.fileName.length) !== 'xlsx') {
                    this.$message.error('文件后缀名必须是.xlsx')
                    return false
                } else {
                    this.$refs.upload.submit()
                }
            },
            // 手机认证······························

            // 现在手机状态-关闭
            NowCloseState(row) {
                this.OpenPhoneAuthDialog = true;
                this.ChangeStaVendorId = row.id;
            },
            // 开启手机状态dialog - 确认
            OpenPhoneAuthDialog_sure() {
                this.$get('deviceDetailApis', {

                    params: this.ChangeStaVendorId

                }).success(res => {
                    this.OpenVendorData = res.source;
                    this.OpenVendorData.mobileAuth = 2;

                    this.$xhr('updateDeviceDetails', this.OpenVendorData).success(res => {
                        // console.log(res)
                        this.OpenPhoneAuthDialog = false;
                        this.search(this.page.pageNo);
                        this.$message('手机认证开启成功!');
                    }).error(err => {
                        console.log(err)
                    })
                })

            },
            // 开启手机状态dialog - 取消
            OpenPhoneAuthDialog_notsure() {
                this.OpenPhoneAuthDialog = false;
            },
            // 现在手机状态-开启
            NowOpenState(row) {
                this.ClosePhoneAuthDialog = true;
                this.ChangeStaVendorId = row.id;
            },
            // 关闭手机状态dialog - 确认
            ClosePhoneAuthDialog_sure() {
                this.$get('deviceDetailApis', {

                    params: this.ChangeStaVendorId

                }).success(res => {
                    this.OpenVendorData = res.source;
                    this.OpenVendorData.mobileAuth = 1;

                    this.$xhr('updateDeviceDetails', this.OpenVendorData).success(res => {
                        // console.log(res)
                        this.ClosePhoneAuthDialog = false;
                        this.search(this.page.pageNo);
                        this.$message('手机认证关闭成功!');
                    }).error(err => {
                        console.log(err)
                    })
                })
            },
            // 关闭手机状态dialog - 取消
            ClosePhoneAuthDialog_notsure() {
                this.ClosePhoneAuthDialog = false;
            },
            // 必须免密······························

            // 必须免密-关闭
            NowCloseMustNoPwd(row) {
                this.OpenMustNoPwdDialog = true;
                this.ChangeStaVendorId = row.id;
            },
            // 开启必须免密dialog - 确认
            OpenMustNoPwdDialog_sure() {

                this.$get('deviceDetailApis', {

                    params: this.ChangeStaVendorId

                }).success(res => {
                    this.OpenVendorData = res.source;
                    this.OpenVendorData.mustPap = 2;

                    this.$xhr('updateDeviceDetails', this.OpenVendorData).success(res => {
                        // console.log(res)
                        this.OpenMustNoPwdDialog = false;
                        this.search(this.page.pageNo);
                        this.$message('免密支付开启成功!')
                    }).error(err => {
                        console.log(err)
                    })
                })

            },
            // 开启必须免密dialog - 取消
            OpenMustNoPwdDialog_notsure() {
                this.OpenMustNoPwdDialog = false;
            },
            // 必须免密-开启
            NowOpenMustNoPwd(row) {
                this.CloseMustNoPwdDialog = true;
                this.ChangeStaVendorId = row.id;
            },
            // 关闭必须免密dialog - 确认
            CloseMustNoPwdDialog_sure() {

                this.$get('deviceDetailApis', {

                    params: this.ChangeStaVendorId

                }).success(res => {
                    this.OpenVendorData = res.source;
                    this.OpenVendorData.mustPap = 1;

                    this.$xhr('updateDeviceDetails', this.OpenVendorData).success(res => {
                        // console.log(res)
                        this.CloseMustNoPwdDialog = false;
                        this.search(this.page.pageNo);
                        this.$message('免密支付关闭成功!')
                    }).error(err => {
                        console.log(err)
                    })
                })

            },
            // 关闭必须免密dialog - 取消
            CloseMustNoPwdDialog_notsure() {
                this.CloseMustNoPwdDialog = false;
            },
        }
    }

</script>

<style scoped>
    #product {
        box-sizing: border-box;
        padding: 10px 20px;
        width: 100%;
        /* height: 100%; */
        background: white;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .page {
        /* float: left; */
        padding: 10px 0;
    }

    .new {
        margin-top: 5px;
        float: right;
        margin-left: 5px;
    }

    .form {
        width: 100%;
    }

    .address-select {
        width: 140px;
    }

    /* .address-select {
        width: 120px;
    } */

    .btn {
        width: 160px;
    }

    .dialog {
        margin: 0 auto;
        width: 800px;
    }

    .div {
        margin-top: 30px;
    }

    .pagex {
        float: left;
        width: 100px;
        margin-left: 20px;
    }

    .pagew {
        float: left;
        margin-top: 5px;
        margin-left: 10px;
        font-size: 16px;
    }

    .line {
        text-decoration: underline;
    }

    .bind {
        margin-bottom: 10px;
    }

    .container_dialog {
        /* border: 1px solid red; */
        display: flex;
        flex-direction: column;
    }

    .container_dialog>div {
        flex: 1;
    }

    .dialog_file {
        padding: 10px 0 50px 0;
        height: 40px;
        line-height: 40px;
        display: flex;
        /* border: 1px solid blue; */
    }

    .dialog_temp {
        padding-bottom: 20px;
        height: 40px;
        line-height: 40px;
        display: flex;
    }

    .dialog_btn {}

    .title{
        margin-bottom: 8px;
        font-size: 14px;
        color: red;
    }
</style>
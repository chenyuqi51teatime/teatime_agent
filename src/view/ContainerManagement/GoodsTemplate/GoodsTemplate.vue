<template>
    <div class="GoodsTemplate">

        <el-form :inline="true" :model="changeTemplate">
            <!--  货柜编号  -->
            <el-form-item label="模板名称">
                <el-input class="address-select" v-model="changeTemplate.templateName" ></el-input>
            </el-form-item>
            <!--  查询  -->
            <el-form-item>
                    <el-button type="warning" @click="checkTempName">查询</el-button>
            </el-form-item>
        </el-form>

        <el-button type="warning" class="nAddTemp" @click='addTemplate'>新增模板</el-button>

        <!--  表格数据  -->
        <el-table class="con_tab" :data="templateList" border style="width: 100%">

            <el-table-column prop="name" label="模板名称"></el-table-column>

            <el-table-column prop="createTime" label="创建时间"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="distribution(scope.row)">分配货柜</el-button>
                    <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="editor(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="del(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="searchPage" />

        <!--  分配货柜dialog  -->
        <el-dialog title="分配货柜" :visible.sync="dialog" :before-close='notSure' width="55%">

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

            <el-table :data="formList" row-key="id" style="width: 100%" :show-header="header" inline class="demo-table-expand" @selection-change='selectionTemp'>
                <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                <el-table-column prop="id" label="货柜编号" align="center" width='100'></el-table-column>
                <el-table-column prop="addressDetail" label="地址" align="center"></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="AllcontainerkeepBtn">保 存</el-button>
                <el-button @click="notSure">取 消</el-button>
            </div>
        </el-dialog>

        <!--  货柜分配成功提示  -->
        <el-dialog title="提示" :visible.sync="disContainerDialog" width="30%" :before-close="exit_notsure">
            <div class="exitMsg">分配成功！</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="disContainerDialog_sure">确 定</el-button>
                <!-- <el-button @click="adm_notsure">取 消</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { areas } from '@/area'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'GoodsTemplate',
        data() {
            return {
                dialog: false,
                disContainerDialog: false, // 货柜分配成功提示dialog
                templateList: [], // 总数据容器
                page: {
                    totalPage: 1,
                    pageNo: '',
                    pageSize: 10,
                    total: 0
                },
                changeTemplate: {  // 模板名称
                    templateName: ''
                },
                formList: [], // 分配货柜数据
                provinces: areas.filter(area => area.level === 1), // 省
                cities: [], // 市
                districts: [], // 区
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

                templateSku: [], // 要分配货柜的模板中的sku商品信息 
                tempSelectList: [], // 选中要分配的货柜信息
                templateId: '', // 要分配货柜的模板id
            }
        },
        computed: {
            ...mapState(['pageNo']),
        },
        methods: {
            ...mapActions(['changepageNo', 'changeEnter']),
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
                    this.$alert('请输入摆放地址！');
                    return false;
                }
                if (this.searchData.cityId === '请选择市') {
                    this.searchData1.cityId = ''
                    this.searchData1.districtId = ''
                    this.$alert('请输入摆放地址！');
                    return false;
                }
                if (this.searchData.districtId === '请选择区') {
                    this.searchData1.districtId = ''
                    this.$alert('请输入摆放地址！');
                    return false;
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

                let requestData = this.searchData1;

                // console.log(requestData)

                this.$xhr('deviceListApiB', requestData).success(res => {
                    // console.log(res.data)
                    this.formList = res.data// 设置表格数据
                    // 拼接省市区+详细地址
                    this.formList.map((v, i) => {
                        var ssq = '';
                        areas.forEach((val) => {
                            if (val.code == v.provinceId) ssq += val.name;
                        })
                        areas.forEach((val) => {
                            if (val.code == v.cityId) ssq += val.name;
                        })
                        areas.forEach((val) => {
                            if (val.code == v.districtId) ssq += val.name;
                        })
                        v.addressDetail = ssq + v.address;
                    })

                }).error(err => {
                    console.log(err)
                    if (err) {
                        window.location.hash = '/login'
                        this.$message.error('网络错误，请重新登录!');
                        return;
                    }
                })
            },
            // 分配货柜
            distribution(row) {
                this.dialog = true;
                this.search();
                this.templateSku = row.dates;
                this.templateId = row.id;
            },
            // 查看
            handleClick(row) {
                // console.log(row.id)
                var _this = this;
                this.$http.get(`/v2/goods/template/${row.id}`)
                    .then(function (res) {
                        // console.log(res.data.data)
                        _this.$router.push({
                            path: '/container/CheckContainerInfor',
                            query: {
                                data: JSON.stringify(res.data.data)
                            }
                        })
                    })
                // this.$router.push(`/container/deviceDe1/27/deDetails`)
            },
            // 编辑
            editor(d) {
                // console.log(d)
                var dataArr = [];
                d.dates.map((v, i) => {
                    dataArr.push({
                        "id": '',
                        "name": v.productName,
                        "productId": '',
                        "property": '',
                        "skus": [v]
                    })
                })

                var dataArrn = {
                    "id": d.id,
                    "name": d.name,
                    "skus": dataArr
                }

                console.log(dataArrn)

                var _this = this;

                this.$http.get(`/v2/goods/template/${d.id}`)
                    .then(function (res) {

                        // console.log(res.data.data)

                        var arr = [];
                        res.data.data.dates.forEach((v,i) => {
                            arr.push({
                                "id": '',
                                "name": v.productName,
                                "productId": '',
                                "property": '',
                                "skus": [v]
                            })
                        })

                        var in_data = {
                            "id": res.data.data.id,
                            "name": res.data.data.name,
                            "skus": arr
                        }
                        console.log(in_data)
                        _this.$router.push({
                            path: '/container/editor',
                            query: {
                                data: JSON.stringify(in_data)
                            }
                        })
                    })
                // this.$router.push({
                //     path: '/container/editor',
                //     query: {
                //         data: JSON.stringify(dataArrn)
                //     }
                // })
            },
            searchPage(pageNo = 1) {
                // console.log(pageNo)
                var _this = this;
                this.page.pageNo = pageNo
                this.$store.dispatch('changepageNo', pageNo)

                // 新
                this.$http.get(`/v2/goods/templates?totalPage=1&pageNo=${this.page.pageNo}&pageSize=10&total=0`)
                    .then(function (res) {

                        if (res.data.error) {
                            this.$router.push('/login');
                            return;
                        }

                        _this.templateList = res.data.datas;
                        _this.page.total = res.data.total;
                        // console.log(_this.page.total)
                        // 数据处理时间
                        _this.templateList.map(v => {
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

                    }, function (err) {
                        // _this.$router.push('/login')
                        console.log(err)
                    })
            },
            // 删除
            del(num) {
                var arr = [], _this = this;
                arr[0] = this.templateList[num].id
                this.$http.post(`/v1/business/template/delete`, {
                    ids: arr
                })
                    .then(function (res) {
                        _this.$message('删除成功!')
                        _this.searchPage(_this.$store.state.pageNo)
                    })
            },
            addTemplate() {
                localStorage.removeItem('templateStr')             //  路由离开就要移除
                this.$router.push('/container/NewTemplate')
            },
            // 保存分配货柜
            AllcontainerkeepBtn() {
                var _this = this;

                // console.log(this.templateSku)  // 要分配的模板中的所有sku
                // console.log(this.tempSelectList[0].id)  // 绑定单个情况下 勾选货柜的id

                var vendorId = [];
                this.tempSelectList.forEach((v, i) => {
                    vendorId.push(v.id)
                })

                if (this.tempSelectList.length < 1) {

                    this.$alert('未选择货柜')

                } else if (this.tempSelectList.length > 1) {

                    console.log('批量绑定')

                    var objs = {
                        vendorIds: vendorId,
                        templateId: this.templateId
                    }

                    this.$http.post(`/v1/business/vendor/batchBindTemplateToVendor`, objs).then(res => {
                        console.log(res)
                        if (res.data.success) {
                            // 弹出提示框
                            _this.disContainerDialog = true;
                        } else {
                            // 弹出提示框
                            this.$message.error(res.data.message)
                        }
                    }, err => {
                        console.log(err)
                    })

                } else {
                    var objs = {
                        skus: this.templateSku, // 要分配的模板中的所有sku
                        vendorId: this.tempSelectList[0].id // 勾选货柜的id
                    }

                    this.$http.post('/v2/goods/vendor', objs).then(res => {
                        // 弹出提示框
                        _this.disContainerDialog = true;
                    }, err => {
                        console.log(err)
                    })
                }
            },
            // 分配货柜成功弹出框-确定
            disContainerDialog_sure() {
                // 刷新当前页面
                window.location.reload(true);
            },
            // 取消 dialog
            notSure() {
                this.dialog = false;
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
                this.search();
            },
            // 选取分配货柜
            selectionTemp(data) {
                this.tempSelectList = data;
            },
            // 查询模板名称
            checkTempName() {
                var _this = this;

                let requestData = Object.assign(this.changeTemplate, this.page);
                console.log(requestData)
                var url = '/v2/goods/templates?'

                for (var i in requestData) {
                    if (requestData[i]) {
                        url += i + '=' + requestData[i] + '&'
                    }
                }

                if (url.slice(-1) == '&') {
                    url = url.substring(0, url.length - 1)
                }

                console.log(url)

                this.$http.get(url)
                    .then(function (res) {
                        if (res.data.success) {
                            _this.templateList = res.data.datas;
                            _this.page.total = res.data.total;
                            // 数据处理时间
                            _this.templateList.map(v => {
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
                        }
                    })
            }
        },
        activated() {
            if (this.$store.state.isFirstEnter) {
                this.searchPage()
                this.search();
                this.provinces = areas.filter(area => area.level === 1)
                this.provinces.unshift({ name: '请选择省', code: '请选择省' })
                this.cities = []
                this.districts = []
                this.cities.unshift({ name: '请选择市', code: '请选择市' })
                this.districts.unshift({ name: '请选择区', code: '请选择区' })
                this.searchData = {
                    id: '',
                    userId: '',
                    startDate: '',
                    endDate: '',
                    memo: '',
                    sortCondition: 1,
                    sortType: 1
                }
                this.changeTemplate = {  // 模板名称
                    templateName: ''
                }
            }
        },
        created() {
            this.searchPage()
            // 获取所有货柜信息
            this.search();
            this.provinces = areas.filter(area => area.level === 1)
            this.provinces.unshift({ name: '请选择省', code: '请选择省' })
            this.cities = []
            this.districts = []
            this.cities.unshift({ name: '请选择市', code: '请选择市' })
            this.districts.unshift({ name: '请选择区', code: '请选择区' })
        }
    }

</script>

<style scoped>
    .GoodsTemplate {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    /*  选择城市间距  */

    .address-select {
        width: 140px;
    }


    /*  新增模板按钮  */

    .nAddTemp {
        margin: 0 0 10px 0;
    }

    /*  分页器  */

    .con_pageIndex {
        margin-top: 14px;
    }

    .dialog-footer {
        text-align: center;
    }

    /*  分页器  */

    .page {
        padding: 16px 0;
    }
</style>
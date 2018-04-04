<template>
    <div class="GoodsDetails">
        <el-form :model="temData" ref="taskForm" :rules="taskRules" label-width="100px">

            <el-button type="warning" class="nAddTemp" @click.stop.native.prevent="addcommodity">添加商品</el-button>
            <el-button type="warning" class="nAddTemp" @click.stop.native.prevent="selectTemp">选择模板</el-button>
            <!--  表格数据  -->
            <el-table class="con_tab" :data="templateStr" border style="width: 98%">

                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <!--  v-if="temData.skus[scope.$index].skus[0].image"  -->
                        <img class="image" :src="image + templateStr[scope.$index].skus[0].image">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称">
                </el-table-column>

                <el-table-column prop="skus[0].property" label="属性">
                </el-table-column>

                <el-table-column prop="skus[0].weight" label="重量（g）">
                </el-table-column>

                <el-table-column prop="skus[0].commendedPrice" label="推荐价格（元）">
                </el-table-column>

                <el-table-column prop="" label="售卖价格（元）">
                    <template slot-scope="scope">
                        <el-input class="changeIpt" v-model="price[scope.$index]" @blur='sellingChange(price[scope.$index])'></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="成本价（元）">
                    <template slot-scope="scope">
                        <el-input class="changeIpt" v-model="costPrice[scope.$index]" @blur='costChange(costPrice[scope.$index])'></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.stop.native.prevent="deleteTem(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="ipt_footer">
                <el-button type="warning" class="keepBtn" @click="keepBtn('taskForm')">保存</el-button>
                <el-button class="cancelBtn" @click='cancelBtn'>取消</el-button>
            </div>
        </el-form>

        <!--  添加商品dialog  -->
        <el-dialog title="添加商品" :visible.sync="addGoods" class="addgoods">
            <el-form :model="form" label-width="80px">

                <el-form-item label="品牌">

                    <template>
                        <el-select class="diaInput" v-model="form.brandId" filterable placeholder="请选择" @change='getProducts'>
                            <el-option v-for="p in currentbrand" :label="p.name" :value="p.id" key="p.id">
                            </el-option>
                        </el-select>
                    </template>

                </el-form-item>

                <el-form-item label="商品分类">

                    <el-select class="short-select" v-model="form.one" @change="changeOne" placeholder="请选择一级分类">
                        <el-option v-for="p in currentone" :label="p.label" :value="p.id" key="p.id"></el-option>
                    </el-select>

                    <el-select class="short-select" v-model="form.two" @change="changeTwo" placeholder="请选择二级分类">
                        <el-option v-for="p in currenttwo" :label="p.label" :value="p.id" key="p.id"></el-option>
                    </el-select>

                    <el-select class="short-select" v-model="form.categoryId" @change="changeThree" placeholder="请选择三级分类">
                        <el-option v-for="p in currentthree" :label="p.label" :value="p.id" key="p.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品名称">
                    <el-input class="diaInput" v-model="form.name"></el-input>
                    <el-button @click="getProducts" type="warning">查询</el-button>
                </el-form-item>

            </el-form>
            <el-table :data="formList" style="width: 100%" :show-header="header" inline class="demo-table-expand">
                <el-table-column label="图片" align="center">
                    <template slot-scope="scope">
                        <img v-if="formList[scope.$index].skus[0].image" class="image" :src="image + formList[scope.$index].skus[0].image">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="skus[0].price" label="推荐价格（元）" align="center"></el-table-column>
                <el-table-column prop="skus[0].weight" label="重量（g）" align="center" :maxlength="2"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button class='shop' @click.stop.native.prevent="sure(scope.$index, scope.row, scope.row)" type="text" size="small">添加到模板</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--  分页器  -->
            <el-pagination class="page" v-show="page.totalPage >= 1" @current-change="getProducts" background layout="total, prev, pager,
            next" :current-page.sync="page.pageNo" :page-size="page.pageSize" :total="page.total">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="notSure">取 消</el-button>
            </div>
        </el-dialog>

        <!--  选择模板dialog  -->
        <el-dialog title="选择模板" :visible.sync="SelectTemplate" :before-close="notSure">
            <el-form :model="changeTemplate" label-width="80px">
                <el-form-item label="模板名称">
                    <!--  模板名称  -->
                    <el-input class="user-input" v-model="changeTemplate.templateName"></el-input>
                    <!--  查询  -->
                    <el-button type="warning" class="checkTempBtn" @click='checkTempName'>查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="templateName" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
                <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <span class="rad_ck radio_check" @click='checked_Btn(scope.row,scope.$index)'></span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="keepBtnTemp">保 存</el-button>
                <el-button @click="notSure">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { picAddress } from '@/config.json'
    import { mapState, mapActions } from 'vuex'

    export default {
        data() {
            return {
                addGoods: false, // 添加商品
                SelectTemplate: false, // 选择模板
                image: `${picAddress}`,
                templateStr: [],
                temData: {
                    vendorId: '',
                    skus: []
                },
                formList: [],
                form: {
                    one: '',
                    two: '',
                    categoryId: '',
                    brandId: '',
                    name: ''
                },
                changeTemplate: {
                    templateName: ''
                },
                currentone: [],
                currenttwo: [],
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                bar: [],
                price: [], // 售卖价格
                costPrice: [], // 成本价
                templateName: [], // 模板名称
                // templateAll: [], // 所有模板信息
                checked_temp: [], // 选中的模板
            }
        },
        computed: {
            ...mapState(['pageNo', 'categoryList'])
        },
        methods: {
            ...mapActions(['changepageNo', 'getCategoryList']),
            // 单选
            checked_Btn(row, idx) {
                var checks = document.getElementsByClassName('rad_ck');

                for (var i = 0; i < checks.length; i++) {
                    checks[i].className = 'rad_ck radio_check'
                }

                checks[idx].className = 'rad_ck radio_checked'

                // 设置选中模板
                this.checked_temp = row;
            },
            // 添加商品
            addcommodity() {
                this.addGoods = true;
            },
            // 选择模板
            selectTemp() {
                // 重置模板名称
                this.changeTemplate = {
                    templateName: ''
                }
                this.checkTempName();
                this.SelectTemplate = true;
            },
            // 取消 dialog
            notSure() {
                this.addGoods = false;
                this.SelectTemplate = false;
                var checks = document.getElementsByClassName('rad_ck');

                for (var i = 0; i < checks.length; i++) {
                    checks[i].className = 'rad_ck radio_check'
                }

                // 重置模板名称
                this.changeTemplate = {
                    templateName: ''
                }
                this.checkTempName();
            },
            changeOne(num) {
                for (var a = 0; a < this.currentone.length; a++) {
                    if (this.currentone[a].id === num) {
                        this.currenttwo = this.currentone[a].children
                    }
                }
                this.form.two = ''
                this.form.categoryId = ''
                this.currentthree = []
            },
            changeTwo(num) {
                for (var a = 0; a < this.currenttwo.length; a++) {
                    if (this.currenttwo[a].id === num) {
                        this.currentthree = this.currenttwo[a].children
                    }
                }
                this.form.categoryId = ''
            },
            changeThree(num) {
                this.form.type = num
            },
            changeBrand() {
                /* todo 品牌的获取 此处可能会传分类信息 */
                this.$xhr('brandList', {}).success(res => {
                    this.currentbrand = res.datas
                    this.currentbrand.unshift({ name: '全部', id: '' })
                })
            },
            // 查询
            getProducts(pageNo = 1) {
                if (this.form.one !== '' && this.form.two === '') {
                    this.$message.error('三级分类不能为空!')
                    return false
                }
                this.page.pageNo = pageNo
                let requestData = Object.assign(this.form, this.page)
                console.log(requestData)
                // console.log(requestData)

                this.$xhr('SKUapi', requestData).success(res => {
                    this.formList = res.datas
                    this.formList.forEach(e => {
                        e.skus.forEach(x => {
                            x.skuName = `${e.name} ${x.property}`;
                            x.commendedPrice = x.price;
                            x.costPrice = 0;
                        })
                    })
                    // console.log(this.formList)
                    this.page.total = res.total
                }).error(err => {
                    console.log(err)
                })
            },
            // 保存
            keepBtn(formName) {
                this.temData.vendorId = this.$route.query.vendorIds
                this.temData.skus = [];
                JSON.parse(localStorage.templateStr).forEach((v, i) => {
                    this.temData.skus.push(v.skus[0])
                })

                console.log(this.temData)

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/v2/goods/vendor', this.temData)
                            .then((data) => {
                                this.$message('更改成功!')
                                localStorage.removeItem('templateStr')
                                this.$store.dispatch('changeEnter', true); // 需要刷新
                                this.$router.back()
                            }, (err) => {
                                console.log(res)
                                this.$message.error('保存失败!')
                            })
                    } else {
                        return false
                    }
                })
            },
            // 取消
            cancelBtn() {
                localStorage.removeItem('templateStr')             //  路由离开就要移除
                this.$store.dispatch('changeEnter', false); // 不需要刷新
                this.$router.back()
            },
            // 删除
            deleteTem(num, row) {
                console.log(num)

                /* todo 删除本地存储中那条数据并刷新列表 */
                // 去重
                this.bar.map((v, i) => {
                    if (v == row.skus[0].skuId) {
                        this.bar.splice(i, 1)
                    }
                })

                var localStorageData = JSON.parse(localStorage.getItem('templateStr'))
                localStorageData.splice(num, 1)
                localStorage.setItem('templateStr', JSON.stringify(localStorageData))

                this.search()
            },
            search() {
                /* TODO 在本地存储中取数据  并渲染表格 */
                if (localStorage.templateStr !== undefined) {
                    // console.log('刷新刷新刷新刷新刷新刷新')
                    // 如果是刷新页面 localstorage中有值
                    // 存储售卖价格
                    this.price = []
                    JSON.parse(localStorage.templateStr).forEach((v, i) => {
                        this.price.push(v.skus[0].price || 0)
                    })
                    // 存储成本价
                    this.costPrice = []
                    JSON.parse(localStorage.templateStr).forEach((v, i) => {
                        this.costPrice.push(v.skus[0].costPrice || 0)
                    })
                    // 去重
                    this.bar = [];
                    JSON.parse(localStorage.templateStr).forEach(s => {
                        this.bar.push(s.skus[0].skuId)
                    })
                    this.templateStr = JSON.parse(localStorage.templateStr)
                    // console.log(JSON.parse(localStorage.templateStr))
                } else {
                    // console.log('新进新进新进新进新进新进')
                    // 没字符串就添加
                    console.log(JSON.parse(this.$route.query.data))
                    // 存储售卖价格
                    this.price = []
                    JSON.parse(this.$route.query.data).forEach((v, i) => {
                        this.price.push(v.skus[0].price || 0)
                    })
                    // console.log(this.price)
                    // 存储成本价
                    this.costPrice = []
                    JSON.parse(this.$route.query.data).forEach((v, i) => {
                        this.costPrice.push(v.skus[0].costPrice || 0)
                    })
                    // 去重
                    this.bar = [];
                    JSON.parse(this.$route.query.data).forEach(s => {
                        this.bar.push(s.skus[0].skuId)
                    })
                    // 取出路由数据
                    this.templateStr = JSON.parse(this.$route.query.data)
                    // 赋值localStorage
                    localStorage.setItem('templateStr', JSON.stringify(this.templateStr))
                    // console.log(JSON.parse(this.$route.query.data))
                }
            },
            // 添加到模板
            sure(index, row, row0) {
                console.log(row)
                /* todo 如果本地存储有，就不能添加重复skuId的 */
                if (localStorage.templateStr !== '[]') {
                    this.templateStr = JSON.parse(localStorage.getItem('templateStr'))    // 把本地存储的变成数组
                    // 去重
                    this.templateStr.forEach(s => {
                        this.bar.push(s.skus[0].skuId)
                    })
                    if (this.bar.indexOf(row.skus[0].skuId) >= 0) {
                        this.$message.error('X已经添加!')
                        return false
                    } else {
                        // 添加成功 向数据容器push新商品

                        var rowN = {
                            id: row.id,
                            name: row.name,
                            productId: row.productId,
                            property: row.property,
                            skus: [
                                {
                                    commendedPrice: row.skus[0].commendedPrice,
                                    costPrice: row.skus[0].costPrice,
                                    discount: row.skus[0].discount,
                                    image: row.skus[0].image,
                                    price: row.skus[0].price,
                                    productId: row.skus[0].productId,
                                    productName: row.skus[0].productName,
                                    property: row.skus[0].property,
                                    skuId: row.skus[0].skuId,
                                    skuName: row.skus[0].skuName,
                                    weight: row.skus[0].weight
                                }
                            ]
                        }
                        this.templateStr.push(rowN)
                        // 更新售卖价格
                        this.price = [];
                        this.templateStr.forEach((v, i) => {
                            this.price.push(v.skus[0].price || 0)
                        })
                        // 更新成本价
                        this.costPrice = [];
                        this.templateStr.forEach((v, i) => {
                            this.costPrice.push(v.skus[0].costPrice || 0)
                        })
                        row.property = `${row.name}`
                    }
                    localStorage.setItem('templateStr', JSON.stringify(this.templateStr))  //  再把它存到本地存储中
                } else {
                    // 第一次添加
                    row.property = `${row.name}`
                    localStorage.setItem('templateStr', JSON.stringify([row]))
                    // 设置售卖价格
                    this.price = [];
                    JSON.parse(localStorage.templateStr).forEach((v, i) => {
                        this.price.push(v.skus[0].price || 0)
                    })
                    // 设置成本价格
                    this.costPrice = [];
                    JSON.parse(localStorage.templateStr).forEach((v, i) => {
                        this.costPrice.push(v.skus[0].costPrice || 0)
                    })
                }
                this.templateStr = []
                this.search()
            },
            // 售卖价格
            sellingChange(row) {
                this.price.map((v, i) => {
                    return this.price[i] = Number(v)
                })
                console.log(this.price)
                // 每次更改价格后 更新localStorage中值
                var localStorageData = JSON.parse(localStorage.getItem('templateStr'))
                localStorageData.forEach((v, i) => {
                    v.skus[0].price = this.price[i]
                })
                localStorage.setItem('templateStr', JSON.stringify(localStorageData))
                // console.log(JSON.parse(localStorage.templateStr))
            },
            // 成本价格
            costChange(row) {
                this.costPrice.map((v, i) => {
                    return this.costPrice[i] = Number(v)
                })
                console.log(this.costPrice)
                // 每次更改价格后 更新localStorage中值
                var localStorageData = JSON.parse(localStorage.getItem('templateStr'))
                localStorageData.forEach((v, i) => {
                    v.skus[0].costPrice = this.costPrice[i]
                })
                localStorage.setItem('templateStr', JSON.stringify(localStorageData))
                // console.log(JSON.parse(localStorage.templateStr))
            },
            // 保存模板
            keepBtnTemp() {

                if (this.checked_temp.length < 1) {
                    this.$alert('未勾选模板');
                    return false;
                }
                var objs = {
                    vendorIds: [],
                    templateId: this.checked_temp.id
                }
                objs.vendorIds.push(this.$route.query.vendorIds)
                
                console.log(objs)
                // this.$xhr('selectTem', objs).success(res => {
                //     this.$message('添加成功!')
                //     this.$router.back()
                // }).error(err => {
                //     this.$alert('请先删除货柜已有商品!');
                //     // console.log(err)
                // })
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

                // console.log(url)

                this.$http.get(url)
                    .then(function (res) {
                        // console.log(res)
                        if (res.data.success) {
                            _this.templateName = res.data.datas;
                            // 数据处理时间
                            _this.templateName.map(v => {
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
        created() {
            this.search();
            this.getProducts();
            this.checkTempName();
            this.getCategoryList().then(() => {
                this.currentone = this.categoryList
                this.currentone.unshift({ label: '全部', id: '' })
            })
            this.changeBrand();
        }
    }

</script>
<style scoped>
    .GoodsDetails {
        width: 100%;
        height: 100%;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .template_list {
        width: 100%;
        height: 40px;
        line-height: 40px;
    }

    .template_list_name {
        font-size: 14px;
    }

    .user-input {
        width: 40%;
        margin: 0 8px 0 10px;
    }

    .image {
        display: block;
        margin: 0 auto;
        height: 40px;
        min-width: 40px;
    }

    .nAddTemp {
        margin: 10px 0;
    }

    .ipt_footer {
        padding: 20px 0;
        text-align: center;
    }

    .page {
        margin-top: 10px;
    }
    /*  select 下拉框  */

    .short-select {
        width: 160px;
        margin-left: 5px;
        float: left;
        margin-top: 0px;
    }
    /*  商品名称 input  */

    .diaInput {
        width: 160px;
        /* float: left; */
        margin-left: 5px;
        margin-right: 10px;
    }

    .dialog-footer {
        text-align: center;
    }
    /*  单选  */

    .radio_check {
        display: inline-block;
        width: 14px;
        height: 14px;
        cursor: pointer;
        border-radius: 50%;
        border: 1px solid #f5d978;
    }

    .radio_checked {
        display: inline-block;
        width: 5px;
        height: 5px;
        cursor: pointer;
        border-radius: 50%;
        border: 5px solid #f5d978;
    }
</style>
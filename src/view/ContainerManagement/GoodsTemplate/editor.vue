<template>
    <div class="editor">
        <el-form :model="temData" ref="taskForm" :rules="taskRules">
            <el-form-item label="模板名称">
                <el-input class="address-select" v-model="temData.name" ></el-input>
            </el-form-item>

            <!-- <div class="template_list">
                <span class='template_list_name'>模板名称</span>
  
                <el-input class="user-input" v-model="temData.name"></el-input>
            </div> -->

            <el-button type="warning" class="nAddTemp" @click.stop.native.prevent="addcommodity">添加商品</el-button>
            <!--  表格数据  -->
            <el-table class="con_tab" :data="templateStr" border style="width: 98%" highlight-current-row>

                <el-table-column prop="name" label="商品名称">
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
                <el-button type="warning" @click="keepBtn">保存</el-button>
                <el-button @click='cancelBtn'>取消</el-button>
            </div>
        </el-form>
        <!--  添加商品dialog  -->
        <el-dialog title="添加商品" :visible.sync="dialog" class="addgoods">
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
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="notSure">取 消</el-button>
            </div> -->
        </el-dialog>
    </div>
</template>
<script>
    import { picAddress } from '@/config.json'
    import { mapState, mapActions } from 'vuex'

    export default {
        data() {
            return {
                containerlist: [], // 总数据容器
                dialog: false,
                image: `${picAddress}`,
                currentone: [],
                currenttwo: [],
                // currentthree: [],
                currentbrand: [],
                bar: [],
                formList: [],
                templateStr: [],
                temData: {
                    id: '',
                    name: '',
                    skus: []
                },
                // sellingPrice: [], // 售卖价格
                // costPrice: [], // 成本价
                price: [], // 售卖价格
                costPrice: [], // 成本价
                tempArr: {
                    name: '',
                    skus: []
                },
                form: {
                    one: '',
                    two: '',
                    categoryId: '',
                    brandId: '',
                    name: ''
                },
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },

            }
        },
        computed: {
            ...mapState(['pageNo', 'categoryList'])
        },
        methods: {
            ...mapActions(['changepageNo', 'changeacIndex', 'changeEnter', 'changeOenter', 'changeRenter', 'getCategoryList']),
            active() {
                this.$store.dispatch('changeEnter', true)
                this.$store.dispatch('changeOenter', true)
                this.$store.dispatch('changeRenter', true)
                this.$store.dispatch('changeacIndex', '1')
                this.$store.dispatch('changepageNo', 1)
                localStorage.removeItem('skulistStr')
                localStorage.removeItem('skulistStr1')
                localStorage.removeItem('templateStr')
                // console.log(this.$store.state.keepAlive = 1)
            },
            // 删除
            deleteTem(num, row) {
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
            // 添加商品
            addcommodity() {
                this.dialog = true
            },
            // 保存
            keepBtn(formName) {
                this.temData.id = JSON.parse(this.$route.query.data).id
                this.temData.name = this.temData.name
                this.temData.skus = [];
                JSON.parse(localStorage.templateStr).forEach((v, i) => {
                    this.temData.skus.push(v.skus[0])
                })

                // console.log(this.temData)

                this.$http.put('/v2/goods/template', this.temData)
                    .then((data) => {
                        if (data.data.success) {
                            this.$message('更改成功!')
                            localStorage.removeItem('templateStr')
                            this.$store.dispatch('changeEnter', true)
                            this.$router.back()
                            // this.active();
                            // this.$router.push('/container/GoodsTemplate')
                        }
                    }, (err) => {
                        console.log(res)
                        this.$message.error('保存失败!')
                    })
            },
            // 取消
            cancelBtn() {
                this.$store.dispatch('changeEnter', false)
                localStorage.removeItem('templateStr')             //  路由离开就要移除
                this.$router.back()
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

                this.$xhr('SKUapi', requestData).success(res => {
                    this.formList = res.datas
                    this.formList.forEach(e => {
                        e.skus.forEach(x => {
                            x.skuName = `${e.name} ${x.property}`;
                            x.commendedPrice = x.price;
                            x.costPrice = 0;
                        })
                    })

                    this.page.total = res.total

                }).error(err => {
                    console.log(err)
                })
            },
            search() {
                // 刷新页面时
                /* TODO 在本地存储中取数据  并渲染表格 */
                if (localStorage.templateStr !== undefined) {
                    // 设置模板id
                    this.temData.id = JSON.parse(this.$route.query.data).id
                    // 设置模板名称
                    this.temData.name = JSON.parse(this.$route.query.data).name
                    // 渲染列表
                    this.templateStr = JSON.parse(localStorage.templateStr)
                    // 如果是刷新页面 localstorage中有值
                    // 存储售卖价格
                    this.price = []
                    JSON.parse(localStorage.templateStr).forEach((v, i) => {
                        this.price.push(v.skus[0].price || 0)
                    })
                    console.log(this.price)
                    // 存储成本价
                    this.costPrice = []
                    JSON.parse(localStorage.templateStr).forEach((v, i) => {
                        this.costPrice.push(v.skus[0].costPrice || 0)
                    })
                    // console.log('刷新刷新刷新刷新')
                    // 去重
                    this.bar = [];
                    JSON.parse(localStorage.templateStr).forEach(s => {
                        this.bar.push(s.skus[0].skuId)
                    })
                    // console.log(this.bar)
                } else {
                    console.log('新进新进')
                    // 新进页面
                    // 没字符串就添加

                    // 设置模板id
                    this.temData.id = JSON.parse(this.$route.query.data).id
                    // 设置模板名称
                    this.temData.name = JSON.parse(this.$route.query.data).name
                    // 渲染列表
                    this.templateStr = JSON.parse(this.$route.query.data).skus
                    // 第一次进来 存储价格
                    // 存储售卖价格
                    this.price = [];
                    JSON.parse(this.$route.query.data).skus.forEach((v, i) => {
                        this.price.push(v.skus[0].price || 0)
                    })
                    console.log(this.price)
                    // 存储成本价
                    this.costPrice = [];
                    JSON.parse(this.$route.query.data).skus.forEach((v, i) => {
                        this.costPrice.push(v.skus[0].costPrice || 0)
                    })

                    // 去重
                    this.bar = [];
                    JSON.parse(this.$route.query.data).skus.forEach(s => {
                        this.bar.push(s.skus[0].skuId)
                    })

                    localStorage.setItem('templateStr', JSON.stringify(this.templateStr))
                }
            },
            // 添加到模板
            sure(index, row, row0) {
                /* todo 如果本地存储有，就不能添加重复skuId的 */
                if (localStorage.templateStr !== '[]') {
                    // 更新更改后的价格
                    this.templateStr = JSON.parse(localStorage.getItem('templateStr'))    // 把本地存储的变成数组
                    // 去重
                    this.templateStr.forEach(s => {
                        this.bar.push(s.skus[0].skuId)
                    })
                    if (this.bar.indexOf(row.skus[0].skuId) >= 0) {
                        this.$message.error('X已经添加!')
                        return false
                    } else {
                        // 添加成功
                        // 向数据容器push新商品
                        this.templateStr.push(row)
                        // 更新售卖价格
                        this.price = [];
                        this.templateStr.forEach((v, i) => {
                            this.price.push(v.skus[0].price || 0)
                        })
                        // 更新成本价
                        this.costPrice = [];
                        this.templateStr.forEach((v, i) => {
                            this.costPrice.push(v.skus[0].costPrice)
                        })
                        // console.log(this.sellingPrice)
                        row.property = `${row.name}`
                    }

                    localStorage.setItem('templateStr', JSON.stringify(this.templateStr))  //  再把它存到本地存储中
                } else {
                    row.property = `${row.name}`
                    localStorage.setItem('templateStr', JSON.stringify([row]))
                }
                this.templateStr = []
                this.search()
            },
            // 售卖价格
            sellingChange(row) {
                this.price.map((v, i) => {
                    return this.price[i] = Number(v)
                })
                // console.log(this.price)
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
                // console.log(this.costPrice)
                // 每次更改价格后 更新localStorage中值
                var localStorageData = JSON.parse(localStorage.getItem('templateStr'))
                localStorageData.forEach((v, i) => {
                    v.skus[0].costPrice = this.costPrice[i]
                })
                localStorage.setItem('templateStr', JSON.stringify(localStorageData))
                // console.log(JSON.parse(localStorage.templateStr))
            },
        },
        created() {
            // this.$store.dispatch('changeEnter', false)
            // this.newRoute = this.$route.path
            /* 不用判断是从哪里来的  用的是back（） */
            /* todo 这个页面inputColumnm,注意返回null和 '' */
            /* 本地存储 */
            this.search()
            this.getProducts()
            /* todo 取到那棵大树 */
            this.getCategoryList().then(() => {
                this.currentone = this.categoryList
                this.currentone.unshift({ label: '全部', id: '' })
            })
            /* todo 品牌如何获取  目前我想到的：取到所有品牌（ 1.四级联动  2.填写完三级之后去调用接口取品牌） */
            this.changeBrand();
            // this.temData.skus = [{},{}]
        },
        mounted() {
            document.getElementsByClassName('el-dialog__headerbtn')[0].addEventListener('click', () => {
                this.form = {
                    one: '',
                    two: '',
                    categoryId: '',
                    brandId: '',
                    name: ''
                }
                this.dialog = false
                this.getProducts()
            })

        }
    }

</script>
<style scoped>
    img {
        margin: 0 auto;
    }

    .editor {
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

    .nAddTemp {
        margin: 10px 0;
    }

    .ipt_footer {
        padding: 20px 0;
        text-align: center;
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
        padding-top: 20px;
        text-align: center;
    }

     .address-select {
        width: 240px;
    }
    
    .image {
        display: block;
        height: 40px;
        min-width: 40px;
    }

    .el-dialog__body {
        padding: 20px 20px 0 20px;
    }

    .page {
        margin: 20px 10px;
    }

    .inline-input {
        width: 100px;
        height: 50px;
        border: 1px solid red;
    }

    .el-input__suffix {
        display: none;
    }
</style>
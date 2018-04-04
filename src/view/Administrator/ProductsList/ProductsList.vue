<template>
    <div id="product">
        <el-form :inline="true" :model="searchData" class="form">
            <el-form-item label="商品名称">
                <el-input class="user-input" v-model="searchData.name"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select class="short-select" v-model="searchData.brandId" placeholder="请选择品牌">
                    <el-option v-for="p in currentbrand" :label="p.name" :value="p.id" :key="p.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类">
                <el-select class="short-select" v-model="searchData.one" @change="changeOne" placeholder="请选择分类">
                    <el-option v-for="p in currentone" :label="p.label" :value="p.id" :key="p.id"></el-option>
                </el-select>
                <el-select v-if="secondLevel === true" class="short-select" v-model="searchData.two" @change="changeTwo" placeholder="请选择分类">
                    <el-option v-for="p in currenttwo" :label="p.label" :value="p.id" :key="p.id"></el-option>
                </el-select>
                <el-select v-if="threeLevel === true" class="short-select" v-model="searchData.categoryId" @change="changeThree" placeholder="请选择分类">
                    <el-option v-for="p in currentthree" :label="p.label" :value="p.id" :key="p.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click.native.prevent="getProduct(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <el-button type="warning" @click.stop.native.prevent="addProduct()" class="btn">添加商品</el-button>

        <el-table :data="productsList" style="width: 100%" border>
            <el-table-column label="缩略图" align="center" wdith="200">
                <template slot-scope="scope">
                    <img v-if="productsList[scope.$index].image" class="image" :src="image + productsList[scope.$index].image">
                </template>
            </el-table-column>
            <el-table-column label="名称" width="500" align="center">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <table id="table-5">
                            <thead>
                                <th>属性</th>
                                <th>重量(g)</th>
                                <th>价格(元)</th>
                            </thead>
                            <tr v-for="(v, i) in scope.row.skus">
                                <td>{{ v.property }}</td>
                                <td>{{ v.weight }}</td>
                                <td>{{ v.price }}</td>
                            </tr>
                        </table>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.stop.native.prevent="editPro(scope.$index, scope.row)">修改</el-button>
                    <el-button type="text" @click="deletePro(scope.$index, scope.row)">下架</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="getProduct" />

        <!--  下架商品提示框  -->
        <el-dialog title="提示" :visible.sync="deleteProDialog" width="30%" :before-close="exit_notsure">
            <div class="exitMsg">确定下架？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="deleteProDialog_sure">确 定</el-button>
                <el-button @click="deleteProDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import { picAddress } from '@/config.json'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'productsList',
        data() {
            return {
                deleteProDialog: false,
                deleteProId: null,
                skuData: {
                    name: '111'
                },
                tipData: {},
                secondLevel: false,
                threeLevel: false,
                able: false,
                currentone: [],
                currenttwo: [],
                currentthree: [],
                currentbrand: [],
                obj1: [],
                obj2: [],
                obj3: [],
                searchData: {
                    name: '',
                    brandId: '',
                    categoryId: '',
                    one: '',
                    two: ''
                },
                productsList: [],
                image: `${picAddress}`,
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        computed: {
            ...mapState(['role', 'acIndex', 'pageNo', 'categoryList'])
        },
        activated() {
            console.log(this.$store.state.isOrderFirst)
            if (this.$store.state.isOrderFirst) {
                this.searchData = {
                    name: '',
                    brandId: '',
                    categoryId: '',
                    one: '',
                    two: ''
                }
                console.log(22222)
                this.getProduct();
                localStorage.removeItem('skuList')
            }
        },
        created() {
            this.getProduct()
            this.$xhr('brandList', {}).success(res => {
                this.currentbrand = res.datas
                this.currentbrand.splice(0, 0, {
                    id: '',
                    name: '全部'
                })
            })
            this.getCategoryList().then(() => {
                this.currentone = this.categoryList
                this.currentone.splice(0, 0, {
                    one: '',
                    label: '全部'
                })
                this.filters()
            })
            localStorage.removeItem('skuList')
        },
        methods: {
            ...mapActions(['getRole', 'changepageNo', 'changeacIndex', 'getCategoryList']),
            changeOne(num) {
                for (var a = 0; a < this.currentone.length; a++) {
                    if (this.currentone[a].id === num) {
                        this.currenttwo = this.currentone[a].children
                        this.searchData.two = ''
                        this.searchData.categoryId = ''
                        this.currentthree = []
                    }
                }
                this.able = true
                this.secondLevel = true
            },
            changeTwo(num) {
                for (var a = 0; a < this.obj2.length; a++) {
                    if (this.obj2[a].id === num) {
                        this.currentthree = this.obj2[a].children
                        this.searchData.categoryId = ''
                    }
                }
                this.threeLevel = true
            },
            changeThree(num) {
                this.searchData.type = num
                this.able = false
            },
            filters() {
                for (var a = 0; a < this.categoryList.length; a++) {
                    var one = this.categoryList[a]
                    this.obj1.push(one)
                    if (one.children) {
                        for (var b = 0; b < one.children.length; b++) {
                            var two = one.children[b]
                            this.obj2.push(two)
                            if (two.children) {
                                for (var c = 0; c < two.children.length; c++) {
                                    var three = two.children[c]
                                    this.obj3.push(three)
                                }
                            }
                        }
                    }
                }
            },
            editPro(num) {
                this.$router.push(`/container/productEdit/${this.productsList[num].id}`)
            },
            // 下架商品
            deletePro(num) {
                this.deleteProDialog = true;
                this.deleteProId = this.productsList[num].id;
            },
            // 确定下架商品
            deleteProDialog_sure() {
                this.$xhr('removeProduct', {
                    ids: [this.deleteProId]
                }).success(res => {
                    this.$message('下架成功!');
                    this.deleteProDialog = false;
                    this.getProduct(this.$store.state.pageNo)
                }).error(res => {
                    this.$message.error(res.message)
                })
            },
            // 取消下架商品
            deleteProDialog_notsure() {
                this.deleteProDialog = false;
            },
            addProduct() {
                this.$router.push('/container/newProduct')
            },
            getProduct(pageNo = 1) {
                // console.log(pageNo)
                if (this.searchData.one && this.searchData.categoryId === '') {
                    this.$message.error('请选择第三级分类');
                    return;
                }
                this.page.pageNo = pageNo
                this.$store.dispatch('changepageNo', pageNo)
                let requestData = Object.assign(this.searchData, this.page)
                this.$xhr('productsList', requestData).success(res => {
                    // console.log(res)
                    this.productsList = res.datas
                    this.page.total = res.total
                })
            }
        }
    }

</script>
<style scoped>
    #product {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
        -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    }

    .page {
        padding: 10px 0;
    }

    .btn {
        margin-bottom: 10px;
    }

    .short-select,
    .user-input {
        width: 150px;
    }

    .image {
        height: 78px;
    }

    /* Border styles */

    /* Table Head */

    #table-5 thead th {
        background-color: rgb(245, 217, 120);
        color: rgba(2, 2, 2, 0.98);
        border-bottom-width: 0;
    }

    .el-tag {
        background-color: rgb(245, 239, 155) !important;
        color: black;
    }

    /* Column Style */

    #table-5 td {
        color: #000;
    }

    /* Heading and Column Style */

    #table-5 tr,
    #table-5 th {
        border-width: 1px;
        border-style: solid;
        border-color: rgb(245, 217, 120);
    }

    /* Padding and font style */

    #table-5 td,
    #table-5 th {
        padding: 5px 10px;
        font-size: 12px;
        font-family: Verdana;
        font-weight: bold;
    }
</style>
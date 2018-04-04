<template>
    <div id="brandList">
        <el-form :inline="true" :model="searchData" class="form">
            <el-form-item label="品牌名称" prop="name">
                <el-input class="user-input" v-model="searchData.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click.native.prevent="getBrandList(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <el-button type="warning" @click.stop.native.prevent="addBrand()" class="btn">添加品牌</el-button>

        <el-table :data="brandList" style="width: 100%" border>
            <el-table-column prop="name" label="名称" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.stop.native.prevent="editBrand(scope.row)">修改</el-button>

                    <el-button type="text" @click="deleteBrand(scope.$index, scope.row)">删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
            :page-size="page.pageSize" :total="page.total" @current-change="getBrandList" />

        <!--  品牌删除dialog  -->
        <el-dialog title="提示" :visible.sync="deleteBrandDialog" width="30%" :before-close="exit_notsure">
            <div class="exitMsg">确定删除？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="deleteBrandDialog_sure">确 定</el-button>
                <el-button @click="deleteBrandDialog_notsure">取 消</el-button>
            </div>
        </el-dialog>
    </div>

</template>




<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'brandList',
        data() {
            return {
                deleteBrandDialog: false,
                deleteBrandId: null,
                searchData: {
                    name: ''
                },
                brandList: [],
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        activated() {
            console.log(this.$store.state.isOrderFirst)
            if (this.$store.state.isOrderFirst) {
                this.searchData = {
                    name: ''
                }
                this.getBrandList()
            }
        },
        created() {
            this.getBrandList()
        },
        computed: {
            ...mapState(['role', 'acIndex', 'pageNo'])
        },
        methods: {
            ...mapActions(['getRole', 'changepageNo', 'changeacIndex']),
            editBrand(num) {
                this.$router.push(`/container/editBrand/${num.id}`)
            },
            // 删除品牌
            deleteBrand(num) {
                this.deleteBrandDialog = true;
                this.deleteBrandId = this.brandList[num].id;
            },
            // 确定删除品牌
            deleteBrandDialog_sure() {
                this.$xhr('deleteBrand', {
                    ids: [this.deleteBrandId]
                }).success(res => {
                    // console.log(res)
                    this.$message('删除成功!')
                    this.getBrandList(this.$store.state.pageNo)
                    this.deleteBrandDialog = false;
                }).error(err => {
                    this.$message('删除失败!')
                    this.deleteBrandDialog = false;
                })
            },
            // 取消删除品牌
            deleteBrandDialog_notsure() {
                this.deleteBrandDialog = false;
            },
            addBrand() {
                this.$router.push('/container/addBrand')
            },
            getBrandList(pageNo = 1) {
                this.page.pageNo = pageNo
                this.$store.dispatch('changepageNo', pageNo)
                let requestData = Object.assign(this.searchData, this.page)
                let brand = []
                this.$xhr('brandList', requestData).success(res => {
                    this.brandList = res.datas
                    this.brandList.forEach(e => {
                        brand.push(e.name)
                    })
                    localStorage.setItem('brandList', JSON.stringify(brand))
                    this.page.total = res.total
                })
            }
        }
    }

</script>
<style scoped>
    #brandList {
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
        /* float: left; */
    }

    .user-input {
        width: 100%;
        margin: 0 18px 0 10px;
    }

    .btn {
        margin-bottom: 1%;
        /* float: right; */
    }

    .form {
        /* float: left; */
    }
</style>
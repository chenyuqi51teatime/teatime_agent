<template>
    <div id="user">
        <div class="tabs_tit">
            <div class="routerBox actives" @click='Checklist(0,1)'>
                <span>补货员列表</span>
            </div>
            <div class="routerBox" @click='Checklist(1,1)'>
                <span>待审核</span>
            </div>
            <div class="routerBox" @click='Checklist(2,1)'>
                <span>申请二维码</span>
            </div>
        </div>

        <div class="check_container" v-if='state == 0'>
            <span class="tit">姓名</span>

            <el-input class="address-select spacing" v-model="searchData.userName" placeholder="请输入姓名"></el-input>

            <span class="tit">手机号</span>

            <el-input class="address-select" v-model="searchData.vendorId" placeholder="请输入手机号"></el-input>

            <el-button type="warning" class="search_btn" @click="ReplenishmentPart">查询</el-button>
        </div>


        <!-- 表格数据展示 -->
        <el-table :data="DataContainers" border style="width: 100%; margin-top:20px;" @row-click="rowClick" v-if='state != 2'>
            <el-table-column prop="" label="头像" align="center" min-width='120'>
                <template slot-scope="scope">
                    <div class="HeadPortrait">
                        <img :src="scope.row.image" alt="">
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center" min-width='120'></el-table-column>
            <el-table-column prop="name" label="昵称" align="center" min-width='120'></el-table-column>
            <el-table-column prop="gender" label="性别" align="center" min-width='120'></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center" min-width='200'></el-table-column>
            <el-table-column prop="" label="权限" align="center" min-width='120'></el-table-column>
            <el-table-column label="操作" align="center" width='150' v-if='state == 0'>
                <template slot-scope="scope">
                    <el-button @click.stop.native.prevent="editor(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click.stop.native.prevent="deleteMan(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width='150' v-if='state == 1'>
                <template slot-scope="scope">
                    <el-button @click.stop.native.prevent="through(scope.$index, scope.row)" type="text" size="small">通过</el-button>
                    <el-button @click.stop.native.prevent="rejected(scope.$index, scope.row)" type="text" size="small">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 二维码 -->
        <div class="ewm" v-if='state == 2'>

            <div class="ewm_box">
                <p class="ewm_tit">使用支付宝扫一扫此二维码，申请成为补货员。</p>
                <img :src="this.qrcode" class="avatar" />
            </div>

        </div>

        <!--  分页器  -->
        <el-pagination v-if='state != 2' class="page" layout="total, prev, pager, next" :current-page.sync="page.pageNo" :page-size="page.pageSize"
            :total="page.total" @current-change="change_page" />


        <!-- 确认删除 dialog -->
        <el-dialog title="提示" :visible.sync="delUserDialog" width="30%" :before-close="del_notsure">
            <div class="exitMsg">确定删除？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="del_sure">确 定</el-button>
                <el-button @click="del_notsure">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 确认删除 dialog -->
        <el-dialog title="提示" :visible.sync="rejectedDialog" width="30%" :before-close="rejected_notsure">
            <div class="exitMsg">确定驳回此补货员申请吗？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="rejected_sure">确 定</el-button>
                <el-button @click="rejected_notsure">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import { serverAddress, picAddress } from '@/config.json'

    export default {
        name: 'distributionList',
        data() {
            return {
                state: 0,
                DataContainers: [], //表格数据

                searchData: {
                    userName: ''
                },

                page: {
                    total: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                delUserDialog: false, // 删除补货员
                delUserId: null, // 删除补货元 id
                rejectedDialog: false, // 驳回补货员申请
                rejectedId: null, //驳回补货员申请id

                qrcode: `${serverAddress}/qrCode/code?uid=${localStorage.tearoleId}`,
            }
        },
        computed: {
            ...mapState(['role', 'acIndex', 'pageNo'])
        },
        created() {
            this.Checklist(0,1);
        },
        methods: {
            // 更改列表样式
            changeClass(idx) {
                var rous = document.getElementsByClassName('routerBox');

                if (rous.length > 0) {

                    for (var i = 0; i < rous.length; i++) {
                        rous[i].className = 'routerBox'
                    }

                    rous[idx].className = 'routerBox actives'

                }
            },
            // 分页
            change_page(pageNo){
                this.Checklist(this.state, pageNo);
            },
            // 切换列表
            Checklist(sta,pageNo) {
                // 充值容器
                this.DataContainers = [];

                // 设置展示列表 0 补货员列表  1 待审核  2 申请二维码
                this.state = sta;
                // 设置分页
                this.page.pageNo = pageNo;
                
                // 设置列表选中状态
                this.changeClass(sta);

                switch (sta) {
                    case 0:
                        // 补货员列表
                        this.ReplenishmentPart();
                        break;

                    case 1:
                        //待审核
                        this.ToAdit();
                        break;

                    case 2:

                        break;

                    default:
                        break;
                }
            },
            // 编辑补货员
            editor(num, row) {

                var id = row.id;

                this.$router.push({
                    path: '/container/EditReplenisher',
                    query: {
                        id: id,
                        state: JSON.stringify('editor')
                    }
                });
            },
            // 删除补货员
            deleteMan(num) {
                this.delUserId = this.DataContainers[num].id
                this.delUserDialog = true;
            },
            // 删除补货员 - 确定
            del_sure() {
                var id = this.delUserId;

                this.$xhr('deleteDis', {
                    ids: [id]
                }).success(res => {

                    this.delUserId = null; // 清空补货员id
                    this.$message('删除成功!'); // 提示
                    this.ReplenishmentPart(); // 刷新列表
                    this.del_notsure(); // 取消dialog

                }).error(res => {

                    this.$message.error(res.message);

                })
            },
            // 删除补货员 - 取消
            del_notsure() {
                this.delUserDialog = false;
            },
            // 通过
            through(num, row) {
                
                var id = row.id;
                console.log(id)
                this.$router.push({
                    path: '/container/EditReplenisher',
                    query: {
                        id: id,
                        state: JSON.stringify('through')
                    }
                });
            },
            // 驳回
            rejected(num) {
                this.rejectedId = this.DataContainers[num].id
                this.rejectedDialog = true;
            },
            // 驳回 - 确认
            rejected_sure() {
                var id = this.rejectedId;
                
                this.$xhr('rejectDist', {
                    audit: false,
                    userIds: [id]
                }).success(res => {

                    this.rejectedId = null; // 清空待审核人id
                    this.$message('驳回审核!'); // 提示
                    this.ToAdit(); // 刷新列表
                    this.rejected_notsure(); // 取消 dialog

                }).error(res => {
                    this.$message.error(res.message);
                    this.rejected_notsure();
                })
            },
            // 驳回 - 取消
            rejected_notsure() {
                this.rejectedDialog = false;
            },

            // 补货员列表 - 查询
            ReplenishmentPart() {
                let requestData = Object.assign({ audit: true, name: this.searchData.userName }, this.page)
                // console.log(requestData)
                this.$xhr('distList', requestData).success(res => {
                    // console.log(res)
                    this.DataContainers = res.datas;
                    this.page.total = res.total;

                    // 性别处理
                    this.DataContainers.forEach(e => {
                        switch (e.gender) {
                            case 1: e.gender = '男'
                                break
                            case 2: e.gender = '女'
                                break
                        }
                    })
                })
            },
            //待审核
            ToAdit() {
                let requestData = Object.assign({ audit: false }, this.page)

                this.$xhr('distList', requestData).success(res => {
                    // console.log(res)
                    this.DataContainers = res.datas;
                    this.page.total = res.total;

                    // 性别处理
                    this.DataContainers.forEach(e => {
                        switch (e.gender) {
                            case 1: e.gender = '男'
                                break
                            case 2: e.gender = '女'
                                break
                        }
                    })
                })
            },
        }
    }

</script>


<style scoped>
    a {
        display: inline-block;
    }

    #user {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    /* 列表 */

    .tabs_tit {
        /* border:1px solid red; */
        width: 400px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #E0E1E2;
        display: flex;
        font-size: 14px;
        text-align: center;
    }

    .routerBox {
        cursor: pointer;
        flex: 1;
        /* border:1px solid blue; */
    }

    /* 点击样式 */

    .actives {
        /* line-height: 50px; */
        border-bottom: 2px solid #fcd900;
        color: #fcd900;
        background: white;
    }

    /* 头像 */

    .HeadPortrait {
        margin: 0 auto;
        width: 50px;
        height: 50px;
        /* border: 1px solid red; */
    }

    .HeadPortrait>img {
        width: 100%;
    }

    /* 选择条件container */

    .check_container {
        /* border: 1px solid blue; */
        padding: 20px 0 0 0;
    }

    /*  标题  */

    .tit {
        margin-right: 10px;
        font-size: 14px;
        
    }

    /*  选择城市间距  */

    .address-select {
        width: 140px;
    }

    .spacing {
        margin-right: 32px;
    }

    /*  查询按钮  */

    .search_btn {
        margin-left: 10px;
    }

    /* 二维码 */

    .ewm {
        padding: 100px 0;
    }

    /* 二维码标题 */

    .ewm_tit {
        width: 500px;
        position: absolute;
        top: -30px;
        left: 0;
        font-size: 16px;
    }

    /* 二维码container */

    .ewm_box {
        position: relative;
        margin: 0 auto;
        width: 300px;
        height: 300px;
    }

    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }

    /*  分页器  */

    .page {
        padding: 16px 0;
    }
</style>
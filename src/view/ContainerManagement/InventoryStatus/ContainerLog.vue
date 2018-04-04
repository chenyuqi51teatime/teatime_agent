<template>
    <div class="ContainerLog">
        <!--  table表格  -->
        <el-table :data="ContainerMsg" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
            <el-table-column prop="pan" label="货道" align="center"></el-table-column>
            <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="oldWeight" label="之前重量" align="center"></el-table-column>
            <el-table-column prop="newWeight" label="现在重量" align="center"></el-table-column>
            <el-table-column prop="changeWeight" label="变化重量" align="center"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
        </el-table>

        <!--  分页器  -->
        <el-pagination v-show="page.totalPage >= 1" :page-size="page.pageSize" @current-change='logMsg' :current-page.sync="page.pageNo" class="page"
            layout="total, prev, pager, next" :total="page.total">
        </el-pagination>
                
        <div class="ContainerLog_footer">
            <el-button class="cancel_btn" @click='con_cancel'>返回</el-button>
        </div>
        
    </div>
</template>
<script>
    export default {
        data() {
            return {
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                ContainerMsg: []
            }
        },
        methods: {
            // 取消
            con_cancel() {
                this.$router.back();
            },
            // 处理托盘信息
            Deal_aisle() {
                // 处理托盘
                this.ContainerMsg.map((v, i) => {
                    v.pan = (5 - parseInt(v.sensorId.toString().slice(2, 3))) + '—' + (parseInt(v.sensorId.toString().slice(3, 4)) + 1);
                })
                // 排序
                this.ContainerMsg.sort((a, b) => {
                    return b.sensorId - a.sensorId
                })
                // 处理数据
                var a = [], b = [], c = [], d = [], e = [], f = [], g = [];
                this.ContainerMsg.forEach((v, i) => {
                    if (v.pan.slice(0, 1) == 1) {
                        a.push(v)
                    }
                    if (v.pan.slice(0, 1) == 2) {
                        b.push(v)
                    }
                    if (v.pan.slice(0, 1) == 3) {
                        c.push(v)
                    }
                    if (v.pan.slice(0, 1) == 4) {
                        d.push(v)
                    }
                    if (v.pan.slice(0, 1) == 5) {
                        e.push(v)
                    }
                    if (v.pan.slice(0, 1) == 6) {
                        f.push(v)
                    }
                    if (v.pan.slice(0, 1) == 7) {
                        g.push(v)
                    }
                })
                // 倒排序
                a.reverse();
                b.reverse();
                c.reverse();
                d.reverse();
                e.reverse();
                f.reverse();
                g.reverse();
                // 重新赋值
                this.ContainerMsg = a.concat(b, c, d, e, f, g)
            },
            // 获取日志信息
            logMsg(page = 1) {
                // console.log(page)
                this.$http.get(`/v2/stock/vendor/logs/${this.$route.query.data}?pageNo=${this.page.pageNo}&pageSize=${this.page.pageSize}`).then(res => {

                    if (res.data.details) {

                        this.page.total = res.data.total;

                        var list = JSON.parse(JSON.stringify(res.data.details));

                        this.ContainerMsg = list.map((v, i) => {
                            return list[i] = JSON.parse(v)
                        })

                        this.Deal_aisle();

                    } else {
                        this.ContainerMsg = [];
                    }
                })
            },
        },
        created() {
            this.$store.dispatch('changeEnter', false); // 不需要刷新
            this.logMsg();
        }
    }

</script>
<style scoped>
    .ContainerLog {
        width: 100%;
        height: 100%;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .ContainerLog_footer {
        padding-top: 20px;
        text-align: center;
    }

    .sure_btn {
        margin-right: 15px;
    }

    .cancel_btn {
        margin-left: 15px;
    }

    .page {
        margin-top: 14px;
    }
</style>
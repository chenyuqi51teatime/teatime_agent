<template>
    <div class="CheckContainerInfor">
        <div class="template_list">
            <span style="color: red;font-size:18px;">*</span>
            <span class='template_list_name'>模板名称</span>
            <!--  模板名称  -->
            <el-input class="address-select" v-model="tempName" :disabled="true"></el-input>
        </div>
        <el-table :data="formList" border style="width: 100%" :show-header="header" inline class="demo-table-expand">
            <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="commendedPrice" label="推荐价格（元）" align="center"></el-table-column>
            <el-table-column prop="price" label="售卖价格（元）" align="center"></el-table-column>
            <el-table-column prop="costPrice" label="成本价（元）" align="center"></el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
            <el-button class="cancelBtn" @click='cancelBtn'>返回</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                routerData: [],
                tempName: '',
                formList: '',
                // routeId: this.$route.params.did, // 路由参数-货柜ID
            }
        },
        methods: {
            // 取消
            cancelBtn() {
                this.$router.back()
            },
        },
        created() {
            this.$store.dispatch('changeEnter', false)
            // this.search();
            this.routerData = JSON.parse(this.$route.query.data)
            this.tempName = this.routerData.name;
            this.formList = this.routerData.dates;
            console.log(this.formList)
        }
    }

</script>
<style scoped>
    .CheckContainerInfor {
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
        margin: 10px 0 20px 0;
    }

     .address-select {
        width: 240px;
    }

    .template_list_name {
        font-size: 14px;
    }
    /*  取消btn  */

    .dialog-footer {
        padding-top: 20px;
        text-align: center;
    }
</style>
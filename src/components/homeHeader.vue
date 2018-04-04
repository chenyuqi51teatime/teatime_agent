<template>
    <div class="con_header">
        <img class="teatimeLogo" src="../assets/logo1.jpg" alt="">
        <div class="con_login_des">
            <span class="header_p">
                <img src="../assets/teat.jpg" alt="">
            </span>
            <span class="header_fun">
                <p class="userName" @click='Personal'>{{this.$store.state.user}}</p>
                <p class="exit" @click='exit'>安全退出</p>
            </span>
        </div>

        <el-dialog title="提示" :visible.sync="exitDialog" width="30%" :before-close="exit_notsure">
            <div class="exitMsg">是否确定退出系统？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="exit_sure">确 定</el-button>
                <el-button @click="exit_notsure">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import { MessageBox } from 'element-ui';
    export default {
        data() {
            return {
                exitDialog: false,
                account: '',
                userName: '用户名'
            }
        },
        computed: {
            ...mapState(['user', 'role'])
        },
        methods: {
            ...mapActions(['getUser', 'getRole', 'changepageNo', 'changeacIndex']),
            // 退出
            exit() {
                this.exitDialog = true;
            },
            // 确定退出
            exit_sure() {
                this.$store.dispatch('getUser', '')
                this.$store.dispatch('changeacIndex', '1')
                this.$store.dispatch('changepageNo', 1)
                this.$router.push({ name: 'login' })
                localStorage.clear()
                sessionStorage.clear()
            },
            exit_notsure(){
                this.exitDialog = false;
            },
            // 个人详细
            Personal() {
                this.$router.push({
                    path: `/container/Personal`,
                    query: {
                        data: `${localStorage.getItem('tearoleId')}`
                    }
                })
            }
        },
        created() {
            this.$store.dispatch('getUser', localStorage.getItem('teauserName'))
            this.userName = this.$store.state.user
        }
    }

</script>
<style scoped>
    .con_header {
        width: 100%;
        height: 100%;
        background: white;
        position: relative;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .teatimeLogo {
        width: 188px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 4%;
        margin: auto;
    }
    /*  登录描述  */

    .con_login_des {
        height: 50px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 8%;
        margin: auto;
        font-size: 16px;
        font-weight: 600;
        display: flex;
    }

    .header_p {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
    }

    .header_p>img {
        width: 100%;
        height: 100%;
    }

    .header_fun {
        padding: 0 10px 0 12px;
        display: inline-block;
        display: flex;
        flex-direction: column;
    }

    .header_fun>p {
        flex: 1;
        line-height: 25px;
    }

    .userName {
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
    }

    .exit {
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
    }

    .exitMsg {
        text-align: center;
    }

    .icontanhao{
        padding-right: 10px;
        font-size: 36px;
        vertical-align: middle;
        color: #f7ba2a;
    }
</style>
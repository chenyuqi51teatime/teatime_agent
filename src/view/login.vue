<template>
    <div style="width:100%; height: 100%; background:#f5d601;">
        <div class="login">
            <div class="login_msg_box">

                <div class="login_msg">
                    <p><span>登录</span></p>
                </div>
                <div class="login_set_posi">
                    <div class="userName">
                        <span class="user"><i class="iconfont icon-yonghu"></i></span>
                        <input type="text" v-model="loginData.account" class="userName_ipt" placeholder="请输入用户名">
                    </div>

                    <div class="passWord">
                        <span class="psd"><i class="iconfont icon-mima"></i></span>
                        <input type="password" v-model="loginData.password" class="passWord_ipt" placeholder="请输入密码" @keyup="LoginOnKey($event)">
                    </div>
                </div>
                <div class="loginBtn">
                    <el-button class="loginbutton" @click="login('loginRules')">登录</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="loginInDialog" width="30%">
            <div class="exitMsg">用户名或密码输入错误！</div>
            <div slot="footer" class="dialog-footer">
              <el-button type="warning" @click="loginInDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapState, mapActions } from 'vuex'

    export default {
        name: 'hello',
        data() {
            return {
                loginData: {
                    account: '',
                    password: ''
                },
                loginRules: {
                    account: { required: true, message: '请输入用户名' },
                    password: { required: true, message: '请选择密码' }
                },
                loginInDialog: false
            }
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            ...mapActions(['getUser']),

            login(formName) {
                this.loginData.account = this.loginData.account.trim()
                this.loginData.password = this.loginData.password.trim()
                if (this.loginData.account === '') {
                    this.$message.error('请输入用户名')
                    return
                }
                if (this.loginData.password === '') {
                    this.$message.error('请输入正确密码')
                    return
                }
                //  this.$router.push(`/addminList`)        http://192.168.90.181:8181   https://t.bestguy.net
                axios.post('https://testshop.51teatime.com/oauth/token', 'grant_type=password&username=' + this.loginData.account + '&password=' + this.loginData.password + '&client_id=client&client_secret=finance', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                })
                    .then((res) => {
                        // console.log(res)
                        var tok = res.data.token_type + ' ' + res.data.access_token
                        // console.log(tok)
                        sessionStorage.setItem('teatimechangetoken', tok)
                        this.$store.dispatch('getUser', this.loginData.account)
                        localStorage.setItem('teauserPassword', this.loginData.password)
                        localStorage.setItem('teauserName', this.loginData.account)
                        localStorage.setItem('DateToken', new Date().getTime())
                        this.$store.dispatch('getRole').then(() => {

                            if (localStorage.getItem('teauserStatus') === '1') {     //     根据用户角色判断  进那个用户中心
                                // console.log('管理员')
                                this.$router.push(`/container/ProductsList`)                 // 管理员  1
                            } else {
                                // console.log('代理商')
                                this.$router.push(`/container/home`)                // 代理商   3
                            }
                        })
                    })
                    .catch((res) => {

                        this.loginInDialog = true;

                    })
            },
            LoginOnKey(e){
                if (e.keyCode == 13) {
                    // 回车
                    this.login('loginRules')
                }
            }
        }
    }

</script>

<style scoped>
    .login {
        /* position: absolute;
        top: 0;
        left: 0; */
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: white;
        /* background: url(http://teatime-program.oss-cn-beijing.aliyuncs.com/teatime-v2-web-admin-login-backgroud.jpg) no-repeat center center; */
        background: url(http://teatime-program.oss-cn-beijing.aliyuncs.com/teatime-v2-web-admin-login-backgroud-v3.jpg) no-repeat center center;
        /*background-size: cover;*/
        position: relative;

        /* display: flex;
        flex-direction: column; */
    }
    /*  头部  */

    .log_t {
        width: 100%;
        height: 14%;
        overflow: hidden;
        position: relative;
    }

    .login_msg_box {
        position: absolute;
        top: -40px;
        bottom: 0;
        left: 0;
        right: -900px;
        margin: auto;
        width: 440px;
        height: 280px;
        background: white;
        padding: 0 40px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 20px 10px #c6b218;
    }

    .login_msg {
        margin: 30px 0 15px 0;
        font-size: 18px;
        /*color: white;*/
    }

    .login_set_posi {}

    .userName,
    .passWord {
        margin: 0 auto;
        box-sizing: border-box;
        display: flex;
        border: 1px solid #e7e7eb;
    }

    .passWord {
        border-top: none;
    }

    .user,
    .psd {
        padding: 14px 18px;
        font-size: 14px;
        /*color: #ccc;*/
    }

    .userName i,
    .passWord i {
        font-size: 20px;
    }

    .userName_ipt,
    .passWord_ipt {
        border: none;
        background: none;
        padding: 10px 10px;
        width: 100%;
        /*color: white;*/
    }
    /*  登陆按钮  */

    .loginBtn {
        padding-top: 30px;
        text-align: left;
    }

    .loginBtn>button {
        background: #f5d601;
        color: #fff;
        border: none;
    }

    .loginbutton {
        width: 120px;
    }

    .dialog-footer {
        text-align: center;
    }
</style>
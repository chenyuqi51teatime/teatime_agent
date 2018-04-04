<template>
    <div id="product" class="Password">
        <div class="form">
            <el-form :model="passData" ref="productForm" :rules="passRules" label-width="120px">
                <el-form-item label="旧密码" prop="old">
                    <el-input type="password" class="user-input" v-model="passData.oldPassword" :maxlength=max></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" class="user-input" v-model="passData.newPassword" :maxlength=max></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="renew">
                    <el-input type="password" class="user-input" v-model="passData.renew" :maxlength=max></el-input>
                </el-form-item>
                <el-form-item label="">
                    <span class="rule">*密码需要含有字母和数字，并且密码长度大于等于6位</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click.native.prevent="submit('productForm')">保存</el-button>
                    <el-button @click.native.prevent="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'productsList',
        data() {
            var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
            var regNull = new RegExp(' ')
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else if (value === this.passData.oldPassword) {
                    callback(new Error('新密码和旧密码一致!'))
                } else if (reg.test(value) === false) {
                    callback(new Error('密码必须包含数字和字母!'))
                } else if (value.length < 6) {
                    callback(new Error('密码长度必须大于等于6位!'))
                } else if (regNull.test(value)) {
                    callback(new Error('密码不能包含空格!'))
                } else {
                    callback()
                }
            }
            var validatePass1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.passData.newPassword) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                max: 16,
                old: localStorage.getItem('teauserPassword'),
                passData: {
                    userId: this.$route.query.pid,
                    oldPassword: '',
                    newPassword: '',
                    renew: ''
                },
                passRules: {
                    oldPassword: { required: true, message: '请输入旧密码', trigger: 'blur' },
                    newPassword: [{ validator: validatePass, trigger: 'blur' }],
                    renew: [{ validator: validatePass1, trigger: 'blur' }]
                }
            }
        },
        created() {
            this.old = localStorage.getItem('teauserPassword')
        },
        methods: {
            submit(formName) {
                if (this.passData.oldPassword !== this.old) {
                    this.$alert('旧密码输入错误!')
                    return
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$xhr('password', {
                            oldPassword: this.passData.oldPassword,
                            newPassword: this.passData.newPassword
                        }).success(res => {
                            this.$message('修改成功!')
                            localStorage.setItem('teauserPassword', this.passData.newPassword)
                            this.$router.back()
                        }).error(res => {
                            this.$message.error('修改失败!')
                        })
                    } else {
                        return false
                    }
                })
            },
            cancel(num) {
                this.$router.back()
            }
        }
    }

</script>

<style scoped>
    .Password{
        width: 100%;
        height: 100%;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
    }

    .rule {
        color: red;
        font-size: 12px;
        float: left;
    }
</style>
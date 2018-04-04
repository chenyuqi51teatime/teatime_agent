<template>
  <div id="userDetail">
    <el-form :model="user" ref="taskForm" :rules="taskRules" label-width="100px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" :maxlength=11></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="user.gender">
          <el-radio :label="1">
            男
          </el-radio>
          <el-radio :label="2">
            女
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="user.age" :maxlength=3></el-input>
      </el-form-item>
      <el-form-item v-if="this.homie === true" label="身份证号" prop="identityId">
        <el-input v-model="user.identityId" :maxlength=18></el-input>
      </el-form-item>
      <el-form-item v-if="this.homie === true" label="地区" prop="area">
        <el-input v-model="user.area"></el-input>
      </el-form-item>
      <el-form-item class="">
        <el-button v-if="this.homie === false" type="warning" @click="editAdmin('taskForm')">保存</el-button>
        <el-button v-if="this.homie === true" type="warning" @click="editDistribution('taskForm')">保存</el-button>
        <el-button v-if="this.homie === false" type="warning" @click="resetA">重置密码</el-button>
        <el-button v-if="this.homie === true" type="warning" @click="resetB">重置密码</el-button>
        <el-button @click="cancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'userDetail',
    data() {
      return {
        initName: '',
        initId: '',
        homie: false,
        user: {
          id: this.$route.params.did,
          phone: '',
          name: '',
          gender: 1,
          age: '',
          identityId: '',
          area: ''
        },
        taskRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 10, message: '姓名长度不能超过10个字符', trigger: 'blur' }
          ],
          phone: [
            { min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur' },
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          age: { type: 'number', required: true, message: '请输入年龄并且为数字值', trigger: 'blur' },
          identityId: [
            { min: 18, max: 18, message: '身份证号长度为18个字符', trigger: 'blur' },
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
          area: { required: true, message: '请填写地址', trigger: 'blur' }
        }
      }
    },
    created() {
      /* TODO 用户详细 */
      if (this.$route.path.indexOf('addminDetail') > 0) {
        // 管理员
        this.$get('detaiAdmin', {
          params: this.$route.params.did
        }).success(res => {
          this.user = res.data
          this.initName = res.data.phone
          this.initId = res.data.id
        })
        this.homie = false
      } else {
        this.$get('detailBusiness', {
          params: this.$route.params.did
        }).success(res => {
          this.user = res.data
          if (this.user.phone.toString() === localStorage.getItem('teauserName')) {
            this.initName = this.user.phone
          }
        })
        this.homie = true
      }
    },
    methods: {
      editAdmin(formName) {
        /* TODO 保存管理员 */
        var num = localStorage.getItem('teauserName')
        if (num !== '19999999999' && num !== this.initName) {
          this.$message.error('没有权限')
          return false
        }
        if (this.user.phone.trim() === '') {
          this.$message.error('请输入正确的手机号!')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$xhr('updateAdmin', this.user).success(res => {
              /* 怎样判断他改的是自己 */
              if (this.initName !== this.user.phone.toString() && this.initId.toString() === localStorage.getItem('tearoleId')) {
                localStorage.setItem('teauserName', this.user.phone.toString())
                this.$store.dispatch('getUser', localStorage.getItem('teauserName'))
              }
              this.$message('更新管理员成功!')
              this.$router.back()
            }).error(res => {
              this.$message.error('更新管理员失败!')
            })
          } else {
            return false
          }
        })
      },
      editDistribution(formName) {
        /* TODO 保存代理商 */
        if (this.user.phone.trim() === '') {
          this.$message.error('请输入正确的手机号!')
          return false
        }
        if (this.user.identityId.trim() === '') {
          this.$message.error('请输入正确的身份证号!')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$xhr('updateBusiness', this.user).success(res => {
              this.$message('更新代理商成功!')
              this.$router.back()
            }).error(res => {
              this.$message.error('更新代理商失败!')
            })
          } else {
            return false
          }
        })
      },
      resetA() {
        /* 重置密码 */
        this.$xhr('resetAdmin', {
          ids: [this.$route.params.did]
        }).success(res => {
          this.$message('重置密码成功!')
          this.$router.back()
        }).error(res => {
          this.$message.error('重置密码失败!')
        })
      },
      resetB() {
        /* 重置密码 */
        this.$xhr('resetBusiness', {
          ids: [this.$route.params.did]
        }).success(res => {
          this.$message('重置密码成功!')
          this.$router.back()
        }).error(res => {
          this.$message.error('重置密码失败!')
        })
      },
      cancel() {
        this.$router.back()
      }
    }
  }

</script>
<style scoped>
  #userDetail {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .el-radio-group {
    float: left;
    margin-top: 10px;
  }
</style>
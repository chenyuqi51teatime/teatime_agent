<template>
  <div id="admin">
    <el-form :model="adminData" ref="taskForm" :rules="taskRules" label-width="100px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="adminData.phone" :maxlength=11></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="adminData.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="adminData.age" :maxlength=3></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="adminData.gender">
          <el-radio :label="1">
            男
          </el-radio>
          <el-radio :label="2">
            女
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="submit('taskForm')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'addUser',
    components: {},
    data() {
      return {
        adminData: {
          name: '',
          phone: '',
          age: '',
          gender: 1
        },
        taskRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 10, message: '姓名长度不能超过10个字符', trigger: 'blur' }
          ],
          phone: [
            { min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur' },
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          age: { type: 'number', required: true, message: '请输入年龄并且为数字值', trigger: 'blur' }
        }
      }
    },
    created() {
    },
    methods: {
      submit(formName) {
        console.log(this.adminData.phone)
        /* 创建管理员 */
        if (this.adminData.phone.trim() === '') {
          this.$message.error('请输入正确的手机号!')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$xhr('addAdmin', this.adminData).success(res => {
              this.$message('新建管理员成功!')
              this.$router.back()
            }).error(res => {
              this.$message.error(res.message)
            })
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.back()
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #admin {
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
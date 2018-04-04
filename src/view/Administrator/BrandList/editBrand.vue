<template>
  <div class="editBrand">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌介绍" prop="memo">
        <el-input type="textarea" v-model="ruleForm.memo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'editBrand',
    data() {
      return {
        ruleForm: {
          name: '',
          memo: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入品牌', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      // 获取用户详细信息
      this.$get('singleBrand', {
        params: this.$route.params.bid
      }).success(res => {
        this.ruleForm = res.data
      })
    },
    methods: {
      submitForm(formName) {
        if (this.ruleForm.name.trim() === '') {
          this.$message.error('品牌不能为空')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.id = this.$route.params.bid
            this.$xhr('updateBrand', this.ruleForm).success(res => {
              this.$message('修改成功!')
               this.$router.push('/container/BrandList')
              // this.$router.push(`container/BrandList`)
            }).error(res => {
              this.$message.error('修改失败!')
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
<style>
  .editBrand {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }
</style>
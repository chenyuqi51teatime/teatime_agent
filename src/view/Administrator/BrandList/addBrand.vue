<template>
  <div class="addBrand">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌介绍" prop="memo">
        <el-input type="textarea" v-model="ruleForm.memo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
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
    methods: {
      submitForm(formName) {
        let brand = JSON.parse(localStorage.getItem('brandList'))
        if (brand.indexOf(this.ruleForm.name) === 0 || brand.indexOf(this.ruleForm.name) > 0) {
          this.$message.error('该品牌已存在')
          return false
        }
        if (this.ruleForm.name.trim() === '') {
          this.$message.error('品牌不能为空')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$xhr('addBrand', this.ruleForm).success(res => {
              this.$message('创建成功!')
              this.$store.dispatch('changeOenter', true); // 需要刷新
              localStorage.removeItem('brandList')
              this.$router.push(`/container/BrandList`)
            }).error(res => {
              this.$message.error('创建失败!')
            })
          } else {
            return false
          }
        })
      },
      cancel() {
        // localStorage.removeItem('brandList')
        this.$store.dispatch('changeOenter', false); // 不需要刷新
        this.$router.back()
      }
    }
  }

</script>
<style>
  .addBrand {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }
</style>
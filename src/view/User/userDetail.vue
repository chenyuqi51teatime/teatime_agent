<!-- 运营商详情 -->
<template>
  <div id="userDetail">
    <el-form :model="user" label-width="100px">
      <el-form-item label="手机号" prop="telephone">
        {{user.phone}}
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        {{user.name}}
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        {{user.gender}}
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        {{user.age}}
      </el-form-item>
      <el-form-item label="身份证号" prop="identityId">
        {{user.identityId}}
      </el-form-item>
      <el-form-item label="地区" prop="address">
        {{user.area}}
      </el-form-item>
      <el-form-item class="">
        <el-button type="warning" @click="editYun">编辑</el-button>
        <!--   <el-button type="danger" @click="reset">重置密码</el-button>-->
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
        user: {
          phone: '',
          name: '',
          gender: '',
          age: ''
        }
      }
    },
    created() {
      /* TODO 用户详细 */
      this.$get('detailBusiness', {
        params: this.$route.params.did
      }).success(res => {
        this.user = res.data
        var sex = {
          1: '男',
          2: '女'
        }
        this.user.gender = sex[this.user.gender]
        this.user.identityId = this.user.identityId.substr(0, 14) + '****'
      })
    },
    methods: {
      editYun() {
        this.$router.push(`/container/userEdit/${this.$route.params.did}`)
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
</style>
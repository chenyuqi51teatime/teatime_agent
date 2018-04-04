<template>
  <div class="Personal">
    <el-form :model="person" label-width="132px">
      <el-form-item label="用户名">
        {{person.phone}}
      </el-form-item>
      <el-form-item label="性别">
        {{person.gender}}
      </el-form-item>
      <el-form-item label="身份证号" v-if="this.currole === '3'">
        {{person.identityId}}
      </el-form-item>
      <el-form-item label="所属地区" v-if="this.currole === '3'">
        {{person.area}}
      </el-form-item>
      <el-form-item class="img" label="申请补货员二维码" v-if="this.currole === '3'">
        <!-- image +    -->
        <img :src="this.qrcode" class="avatar" />
      </el-form-item>
      <el-form-item class="">
        <el-button type="warning" @click="edit">修改密码</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { serverAddress, picAddress } from '@/config.json'
  export default {
    name: 'homeDetail',
    components: {},
    data() {
      return {
        currole: 1,
        image: `${picAddress}`,
        imageUrl: `${serverAddress}/picture/upload`,
        qrcode: `${serverAddress}/qrCode/code?uid=${localStorage.tearoleId}`,
        person: {},
        userId: this.$route.params.pid
      }
    },
    created() {
      this.currole = localStorage.getItem('teauserStatus')
      this.detail()
      /* todo 个人详细 */
    },
    methods: {
      detail() {
        this.$xhr('login').success(res => {
          this.person = res
          if (this.person.gender === 1) {
            this.person.gender = '男'
          } else {
            this.person.gender = '女'
          }
        })
      },
      edit() {
        /* 更新表单 */
        this.$router.push({
          path: '/container/Password',
          query: {
            pid: `${this.$route.params.pid}`
          }
        })
      },
      cancel() {
        /* 返回上一页 */
        this.$router.back()
      }
    }
  }

</script>
<style>
  .Personal {
    width: 100%;
    height: 100%;
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
  }

  .avatar-uploader {
    width: 178px!important;
  }

  .img {
     text-align: left; 
  }

  .avatar {
    float: left; 
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
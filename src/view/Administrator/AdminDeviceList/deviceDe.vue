<!-- 设备详细页 -->
<template>
  <div id="deviceDetail">
    <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="active"><router-link :to="deDetails" class="nav-link">货柜详情</router-link></el-menu-item>
      <el-menu-item v-if="current === '1'" index="2" @click="active"><router-link :to="deSKUdetails" class="nav-link">货柜SKU信息</router-link></el-menu-item>
      <el-menu-item v-if="current === '3'" index="3" @click="active"><router-link :to="yundeSKUdetails" class="nav-link">货柜SKU信息</router-link></el-menu-item>
      <el-menu-item index="4" @click="active"><router-link :to="deSale" class="nav-link">货柜销售订单</router-link></el-menu-item>
      <el-menu-item index="5" @click="active"><router-link :to="deReplenishment" class="nav-link">货柜补货订单</router-link></el-menu-item>
      <el-menu-item index="6" @click="active"><router-link :to="deState" class="nav-link">货柜状态日志</router-link></el-menu-item>
     <!-- <el-menu-item index="7" @click="active"><router-link :to="deChange" class="nav-link">商品变动日志</router-link></el-menu-item>-->
    </el-menu>
    <div class="router">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'deviceDe',
    components: {},
    data () {
      return {
        current: '',
        deDetails: `deDetails`,
        deSKUdetails: `deSKUdetails`,
        yundeSKUdetails: `yundeSKUdetails`,
        deSale: `deSale`,
        deReplenishment: `deReplenishment`,
        deState: `deState`,
        deChange: `deChange`
      }
    },
    computed: {
      ...mapState(['isFirstEnter'])
    },
    created () {
      this.current = localStorage.getItem('teauserStatus')
//      this.$router.push(`deDetails`)
      this.$store.dispatch('changeEnter', false)
    },
    methods: {
      ...mapActions(['changeEnter']),
      active (num) {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #deviceDetail {
    position: relative;
  }
  .router {
    width:100%;
    margin-top: 6px;
  }
  .el-menu-demo {
    margin-top: 5px;
  }
  .nav-link {
    margin-left: 0!important;
  }
</style>



<template>
  <div id="saleDetail">
    <div class="basicInfo">
      <div class="tip">基本信息</div>
      <el-table :data="basicTable" border style="width:100%" class="basicTable1">
        <el-table-column prop="orderID" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="orderMoney" label="订单金额" align="center"></el-table-column>
        <el-table-column label="用户编号" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="gotoUser(scope.$index, scope.row)" type="text" size="small">{{basicTable[scope.$index].userId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属货柜" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="gotoDevice(scope.$index, scope.row)" type="text" size="small">{{basicTable[scope.$index].device}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderSorce" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="productInfo">
      <div class="tip">商品信息</div>
      <el-table :data="productTable" border style="width:100%" class="basicTable">
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <img v-if="productTable[scope.$index].image" class="image" :src="image + productTable[scope.$index].image + '?x-oss-process=image/resize,h_50'">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="recommendPrice" label="推荐价格" align="center"></el-table-column>
        <el-table-column prop="sellPrice" label="售卖价格" align="center"></el-table-column>
        <el-table-column prop="property" label="属性" align="center"></el-table-column>
        <el-table-column prop="amount" label="数量" align="center"></el-table-column>
        <el-table-column prop="totalPrice" label="小计" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="userInfo">
      <div class="tip">用户信息</div>
      <el-table :data="userTable" border style="width:100%" class="basicTable">
        <el-table-column prop="userID" label="用户编号" align="center"></el-table-column>
        <el-table-column prop="telephone" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
        <el-table-column prop="money" label="预存金额" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="foot_btn">
      <el-button @click.native.prevent="back" class="btn-back">返回</el-button>
    </div>
  </div>

</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import { picAddress } from '@/config.json'
  export default {
    name: 'saleDetail',
    data() {
      return {
        image: `${picAddress}`,
        basicTable: [],
        userTable: [],
        productTable: []
      }
    },
    computed: {
      ...mapState(['isOrderFirst'])
    },
    created(num) {
      
      this.$store.dispatch('changeOenter', false)
      this.$xhr('saleDetail', { orderId: this.$route.params.sid }).success(res => {
        this.productTable = res.data
        this.basicTable.push({})
        this.basicTable[0].orderID = res.orderId
        this.basicTable[0].orderMoney = res.orderTotal
        this.basicTable[0].userId = res.userId
        this.basicTable[0].device = res.vendorId
        this.basicTable[0].orderSorce = res.paiedType
        this.basicTable[0].orderStatus = res.status
        this.basicTable.forEach(e => {
          switch (e.orderSorce) {
            case 1: e.orderSorce = '余额支付'
              break
            case 2: e.orderSorce = '支付宝免密'
              break
            case 3: e.orderSorce = '支付宝非免密'
              break
            default: e.orderSorce = ''
          }
          switch (e.orderStatus) {
            case 1: e.orderStatus = '未支付'
              break
            case 2: e.orderStatus = '已支付'
              break
            case 3: e.orderStatus = '已关闭'
              break
            default: e.orderStatus = ''
          }
        })
        this.userTable.push({})
        this.userTable[0].userID = res.userId
        this.userTable[0].telephone = res.phone
        this.userTable[0].nickName = res.nickname
        this.userTable[0].money = res.balance
      }).error(res => {
        this.$message.error(res.message)
      })
    },
    methods: {
      ...mapActions(['changeEnter']),
      gotoUser() { },
      gotoDevice(num) {
        this.$router.push(`/container/deDetails2/${this.basicTable[num].device}/${this.$route.params.sid}`)
      },
      back() {
        this.$router.back()
      }
    }
  }

</script>
<style scoped>
  #saleDetail {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .tip {
    float: left;
    padding-bottom: 6px;
    font-size: 16px;
    margin-top: 15px;
    font-weight: 600;
    line-height: 17px;
    color: #333333;
  }

  .tip span {
    display: inline-block;
    width: 8px;
    height: 10px;
    border: 1px solid black;
  }

  .basicTable1 {
    margin-top: 10px;
  }

  .basicTable {
    margin-top: 10px;
  }

  .image {
    height: 50px;
  }

  .btn-back {
    margin-top: 10px;
    /* float: right; */
    width: 100px;
  }
  .foot_btn{
    padding: 10px 0;
    text-align: center;
  }
</style>
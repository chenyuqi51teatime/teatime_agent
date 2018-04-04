<!-- 货柜补货订单 -->
<template>
  <div id="examine">
    <el-table :data="reps" border style="width:100%">
      <el-table-column prop="repenishmentOrderId" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="skuKindTotal" label="商品品种总数" align="center"></el-table-column>
      <el-table-column prop="skuSize" label="商品总量" align="center"></el-table-column>
      <el-table-column prop="createTime" label="补货时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.stop.native.prevent="viewOrder(scope.$index, scope.row)" type="text" size="small">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
      :page-size="page.pageSize" :total="page.total" @current-change="getReps" />
    <el-button class="sure" @click="back">返回</el-button>
  </div>
</template>

<script>
  export default {
    name: 'deviceDeSale',
    data() {
      return {
        current: '',
        reps: [],
        page: {
          totalPage: 1,
          pageNo: '',
          pageSize: 10,
          total: 0
        }
      }
    },
    created() {
      this.current = localStorage.getItem('teauserStatus')
      this.getReps()
    },
    methods: {
      back() {
        this.$router.push('/container/AdminDeviceList')
      },
      getReps(pageNo = 1) {
        this.page.pageNo = pageNo
        /* TODO 货柜补货列表接口 */
        let requestData = Object.assign(this.page, { id: this.$route.params.did })
        this.$xhr(localStorage.getItem('teauserStatus') === '1' ? 'deviceRep' : 'deviceRepB', requestData).success(res => {
          this.reps = res.data
          this.page.total = res.total
          this.reps.forEach((e) => {
            e.createTime = this.formatDate(new Date(e.createTime))        // 补货时间
          })
        }).error(res => {
          this.$message.error(res.message)
        })
      },
      viewOrder(num) {
        this.$router.push(`/container/repDetail/${this.reps[num].repenishmentOrderId}`)
      },
      formatDate(now) {
        var year = now.getFullYear()
        var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
        var date = now.getDate() < 10 ? '0' + (now.getDate()) : now.getDate()
        var hour = now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours()
        var minute = now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes()
        var second = now.getSeconds() < 10 ? '0' + (now.getSeconds()) : now.getSeconds()
        return year + '-' + month + '-' + date + '  ' + hour + ':' + minute + ':' + second
      }
    }
  }

</script>

<style scoped>
  #examine {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .page {
    padding:10px 0 30px 0;
  }

  .content {
    margin-top: 20px;
  }

  h3 {
    float: left;
    margin-top: 50px;
  }

  .chart {
    width: 100%;
    height: 500px;
    margin-top: 200px;
  }

  .search {
    float: left;
    overflow: hidden;
    ;
  }

  .radio {
    margin-top: 80px;
    width: 100%;
    height: 50px;
  }

  .sure {
    /* margin-top: 50px; */
  }
</style>
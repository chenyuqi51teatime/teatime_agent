<!-- 货柜销售信息-->
<template>
  <div id="examine">
    <div class="orderTable">
      <el-table :data="sales" border style="width:100%">
        <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="total" label="订单金额" align="center"></el-table-column>
        <el-table-column prop="createTime" label="订单生成时间" align="center"></el-table-column>
        <el-table-column prop="paiedTime" label="支付完成时间" align="center"></el-table-column>
        <el-table-column prop='userId' label="用户ID" align="center">
          <!-- <template slot-scope="scope">
            <el-button @click.stop.native.prevent="gotoUser(scope.$index, scope.row)" type="text" size="small">{{sales[scope.$index].userId}}</el-button>
          </template> -->
        </el-table-column>
        <el-table-column prop="paiedType" label="支付方式" align="center"></el-table-column>
        <el-table-column class="red" prop="status" label="支付状态" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status !== '未支付'" type="text" size="small" class="black">{{sales[scope.$index].status}}</el-button>
            <el-button v-if="scope.row.status === '未支付'" type="text" size="small" class="red">{{sales[scope.$index].status}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="viewOrder(scope.$index, scope.row)" type="text" size="small">查看订单</el-button>
            <el-button v-if="(scope.row.status == '未支付') && (current === '1')" @click.stop.native.prevent="closeO(scope.$index, scope.row)"
              type="text" size="small">确认完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
      :page-size="page.pageSize" :total="page.total" @current-change="getSales" />
    <el-button class="sure" @click="back">返回</el-button>
    <el-dialog title="关闭订单" :visible.sync="closeOrderDialog">
      <el-form :model="remark" :inline="true" ref="remark" :rules="Rules">
        <el-form-item prop="memo" label="备注" style="margin-left: 1%;">
          <el-input type="textarea" v-model="remark.memo" style="clear: left;width: 500px;" :rows=7></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRemark">取 消</el-button>
        <el-button type="primary" @click.stop.native.prevent="closeOrder('remark')">确认关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'deSale',
    data() {
      return {
        index: '',
        closeOrderDialog: false,
        current: '',
        remark: {},
        sales: [{
          userId: 1,
          payStatus: '未支付'
        }],
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        Rules: {
          memo: { required: true, message: '请填写备注信息', trigger: 'blur' }
        }
      }
    },
    computed: {
      ...mapState(['pageNo'])
    },
    beforeRouteLeave(to, from, next) {
      if (to.name !== 'saleDetail') {
        this.$store.dispatch('changepageNo', 1)
      }
      next()
    },
    created() {
      this.current = localStorage.getItem('teauserStatus')
      this.getSales(this.$store.state.pageNo)
    },
    methods: {
      ...mapActions(['changepageNo']),
      getSales(pageNo = 1) {
        this.page.pageNo = pageNo
        this.$store.dispatch('changepageNo', pageNo)
        let requestData = Object.assign(this.page, { id: this.$route.params.did })
        this.$xhr(localStorage.getItem('teauserStatus') === '1' ? 'deviceSale' : 'deviceSaleB', requestData).success(res => {
          this.sales = res.data
          this.page.total = res.total
          this.sales.forEach((e) => {
            if (e.createTime !== '') {
              e.createTime = this.formatDate(new Date(e.createTime))        // 订单生成时间
            }
            if (e.paiedTime !== '') {
              e.paiedTime = this.formatDate(new Date(e.paiedTime))    // 订单完成时间
            }

            switch (e.paiedType) {
              case 1: e.paiedType = '余额支付'
                break
              case 2: e.paiedType = '支付宝免密'
                break
              case 3: e.paiedType = '支付宝非免密'
                break
              default: e.paiedType = ''
            }
            switch (e.status) {
              case 1: e.status = '未支付'
                break
              case 2: e.status = '已支付'
                break
              case 3: e.status = '已关闭'
                break
            }
          })
        }).error(res => {
          this.$message.error(res.message)
        })
      },
      back() {
        this.$router.push('/container/AdminDeviceList')
      },
      closeO(num) {
        this.index = num
        this.closeOrderDialog = true
      },
      cancelRemark() {
        this.closeOrderDialog = false
      },
      viewOrder(num) {
        /* 查看订单 */
        this.$router.push(`/container/saleDetail/${this.sales[num].id}`)
      },
      closeOrder(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let num = this.index
            this.$xhr('closeOrder', { orderId: this.sales[num].id, memo: this.remark.memo }).success(res => {
              this.$message('操作成功')
              this.remark = {}
              this.closeOrderDialog = false
              this.getSales()
            }).error(res => {
              this.$message.error(res.message)
            })
          } else {
            return false
          }
        })
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

  /* .sure {
    margin-top: 50px;
  } */

  .red {
    color: red;
  }

  .black {
    color: #000000;
  }

  .dialog-footer {
    margin-top: 1%;
  }
</style>
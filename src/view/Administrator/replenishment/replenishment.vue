<template>
  <div id="replenishment">
    <div class="search">
      <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" :show-header="header">
        <el-table-column label="筛选查询">
          <template slot-scope="scope">
            <div class="searchForm">
              <el-form :inline="true" :model="searchData">
                <el-form-item label="运营商">
                  <el-input v-model="searchData.businessUserMsg" placeholder="运营商ID/手机号"  size="12"></el-input>
                </el-form-item>
                <el-form-item label="货柜编号">
                  <el-input v-model="searchData.vendorId" placeholder="货柜编号" size="10"></el-input>
                </el-form-item>
                <el-form-item label="补货时间">
                  <el-date-picker :clearable= "false" v-model="dataRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" icon="el-icon-search" @click.native.prevent="search(1)" class="btn-search">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="orderTable">
      <el-table :data="orderTable" border style="width:100%">
        <el-table-column prop="repenishmentOrderId" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="skuKindTotal" label="商品品种总数" align="center"></el-table-column>
        <el-table-column prop="skuSize" label="商品总量" align="center"></el-table-column>
        <el-table-column prop="createTime" label="补货时间" align="center" width='240'></el-table-column>
        <el-table-column label="货柜编号" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="gotoDevice(scope.$index, scope.row)" type="text" size="small">{{orderTable[scope.$index].vendorId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="viewOrder(scope.$index, scope.row)" type="text" size="small">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
      :page-size="page.pageSize" :total="page.total" @current-change="search" />
  </div>

</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'saleOrders',
    data() {
      return {
        searchData: {},
        tableData: [{}],
        header: true,
        dataRange: [],
        orderTable: [],
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    activated() {
      if (this.$store.state.isRepFirst) {
        this.dataRange = []
        this.searchData = {}
        this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
        this.search(this.$store.state.pageNo)
      } else { }
    },
    created() {
      this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
      this.search(this.$store.state.pageNo)
    },
    watch: {
      dataRange(range) {
        this.setSearchDate(range)
      }
    },
    computed: {
      ...mapState(['pageNo', 'isRepFirst'])
    },
    methods: {
      ...mapActions(['changepageNo', 'changeRenter']),
      search(pageNo = 1) {
        if (this.a === '1') {
          this.page.pageNo = pageNo
          this.$store.dispatch('changepageNo', pageNo)
          let requestData = Object.assign(this.searchData, this.page)
          this.$xhr('replenishment', requestData).success(res => {
            this.orderTable = res.data
            this.page.total = res.total
          }).error(res => { this.$message.error(res.message) })
        } else {
          this.page.pageNo = pageNo
          this.$store.dispatch('changepageNo', pageNo)
          let requestData = Object.assign(this.searchData, this.page)
          this.$xhr('dreplenishment', requestData).success(res => {
            this.orderTable = res.data
            this.page.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      viewOrder(num) {
        this.$router.push(`/container/repDetail/${this.orderTable[num].repenishmentOrderId}`)
      },
      setSearchDate(range = this.dataRange || []) {
        console.log(1)
        if (range != null) {
          this.searchData.startDate = range[0] ? range[0].getTime() : ''
          this.searchData.endDate = range[1] ? range[1].getTime() : ''         // + 24 * 60 * 60 * 1000 : ''
        } else{
          this.searchData.startDate = '' ;
          this.searchData.endDate = '' ;
        }
      },
      gotoDevice(num) {
        this.$router.push(`/container/deDetails/${this.orderTable[num].vendorId}`)
      }
    }
  }

</script>
<style scoped>
  #replenishment {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .search {
    margin-top: 10px;
  }

  .searchForm {
    margin-top: 15px;
    float: left;
  }

  .page {
    /* float: right; */
    margin-top: 1%;
  }

  .orderTable {
    margin-top: 10px;
  }
</style>
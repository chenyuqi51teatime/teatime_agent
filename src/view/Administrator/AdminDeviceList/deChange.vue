<!--
<template>
  <div id="deChange">
    <div class="orderStatus">
      <div class="a">
        <el-button type="primary" plain @click="userOpeation(1)" class="btn">用户操作</el-button>
        <el-button type="primary" plain @click="repOpeation(1)" class="btn">补货员操作</el-button>
      </div>
      <div class="b">
        <el-date-picker
          v-model="dataRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="danger" icon="el-icon-search" @click.native.prevent="choose" class="btn-search">搜索</el-button>
      </div>
    </div>
    <div class="productChangeTable">
      <el-table :data="productChangeTable" border style="width:100%">
        <el-table-column prop="rId" label="身份" align="center">
        </el-table-column>
        <el-table-column prop="productChange" label="商品变动" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span style="color: red" v-if="scope.row.type === '退货'">{{productChangeTable[scope.$index].type}}</span>
            <span v-if="scope.row.type === '补货'">{{productChangeTable[scope.$index].type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份ID" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="gotoUser(scope.$index, scope.row)" type="text" size="small">{{productChangeTable[scope.$index].userId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" align="center"></el-table-column>0
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="viewProductChange(scope.$index, scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="page" v-show="showPage === 0"
                   layout="total, prev, pager, next"
                   :current-page.sync="page.pageNo"
                   :page-size="page.pageSize"
                   :total="page.total"
                   @current-change="search"/>
    <el-pagination class="page" v-show="showPage === 1"
                   layout="total, prev, pager, next"
                   :current-page.sync="page1.pageNo"
                   :page-size="page1.pageSize"
                   :total="page1.total"
                   @current-change="userOpeation"/>
    <el-pagination class="page" v-show="showPage === 2"
                   layout="total, prev, pager, next"
                   :current-page.sync="page2.pageNo"
                   :page-size="page2.pageSize"
                   :total="page2.total"
                   @current-change="repOpeation"/>
    <el-button @click="back" type="danger" class="sure">返回</el-button>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'deChange',
    data () {
      return {
        temp: 1,
        showPage: 0,
        name: '11',
        dataRange: [],
        searchData: {},
        productChangeTable: [],
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        page1: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0,
          status: '2'
        },
        page2: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0,
          status: '1'
        }
      }
    },
    computed: {
      ...mapState(['pageNo', 'payStatus', 'deviceFrom'])
    },
    watch: {
      dataRange (range) {
        this.setSearchDate(range)
      }
    },
    created () {
      let data = new Date()
      let today = data.getTime()
      let firstDay = today - 60 * 60 * 24 * 7 * 1000
      this.dataRange = [firstDay, today]
      this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
      this.search(this.$store.state.pageNo)
    },
    methods: {
      ...mapActions(['changepageNo', 'changePayStatus', 'changeDeviceFrom']),
      back () {
        var router = ''
        switch (this.$route.matched[1].name) {
          case 'deviceDe': router = `/deviceList`
            break
          case 'deviceDe1': router = `/adminDeviceList`
            break
          case 'deviceDe2': router = `/saleOrders`
            break
          case 'deviceDe3': router = `/saleDetail/${this.$route.params.sid}`
            break
          case 'deviceDe4': router = `/replenishment`
            break
          case 'deviceDe5': router = `/repDetail/${this.$route.params.rid}`
            break
        }
        this.$router.push(router)
      },
      choose () {
        if (this.temp === 1) {
          this.search(1)
        } else if (this.temp === 2) {
          this.userOpeation(1)
        } else if (this.temp === 3) {
          this.repOpeation(1)
        }
      },
      userOpeation (pageNo = 1) {
        this.temp = 2
        let requestData = Object.assign(this.page1, this.searchData)
        this.page1.vendorId = this.$route.params.did
        if (this.a === '1') {
          this.$xhr('deChangeLog', requestData).success(res => {
            this.page1.pageNo = pageNo
            this.$store.dispatch('changepageNo', pageNo)
            this.showPage = 1
            this.productChangeTable = res.data
            this.productChangeTable.forEach(e => {
              e.productChange = '变动种类：' + e.productTypeSize + '   ' + '变动数量：' + e.productSize
              if (e.productTypeSize === null) {
                e.productChange = ' '
              }
              switch (e.type) {
                case 1: e.type = '补货'
                  break
                case 2: e.type = '退货'
                  break
                default: e.type = ''
              }
              switch (e.rId) {
                case 2: e.rId = '用户'
                  break
                case 4: e.rId = '补货员'
                  break
                default: e.type = ''
              }
              e.createTime = this.formatDate(new Date(e.createTime))
            })
            this.page1.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          this.$xhr('ddeChangeLog', requestData).success(res => {
            this.page1.pageNo = pageNo
            this.$store.dispatch('changepageNo', pageNo)
            this.showPage = 1
            this.productChangeTable = res.data
            this.productChangeTable.forEach(e => {
              e.productChange = '变动种类：' + e.productTypeSize + '   ' + '变动数量：' + e.productSize
              if (e.productTypeSize === null) {
                e.productChange = ' '
              }
              switch (e.type) {
                case 1: e.type = '补货'
                  break
                case 2: e.type = '退货'
                  break
                default: e.type = ''
              }
              switch (e.rId) {
                case 2: e.rId = '用户'
                  break
                case 4: e.rId = '补货员'
                  break
                default: e.type = ''
              }
              e.createTime = this.formatDate(new Date(e.createTime))
            })
            this.page1.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      repOpeation (pageNo = 1) {
        this.temp = 3
        let requestData = Object.assign(this.page2, this.searchData)
        this.page2.vendorId = this.$route.params.did
        if (this.a === '1') {
          this.$xhr('deChangeLog', requestData).success(res => {
            this.page2.pageNo = pageNo
            this.$store.dispatch('changepageNo', pageNo)
            this.showPage = 2
            this.productChangeTable = res.data
            this.productChangeTable.forEach(e => {
              e.productChange = '变动种类：' + e.productTypeSize + '   ' + '变动数量：' + e.productSize
              if (e.productTypeSize === null) {
                e.productChange = ' '
              }
              switch (e.type) {
                case 1: e.type = '补货'
                  break
                case 2: e.type = '退货'
                  break
                default: e.type = ''
              }
              switch (e.rId) {
                case 2: e.rId = '用户'
                  break
                case 4: e.rId = '补货员'
                  break
                default: e.type = ''
              }
              e.createTime = this.formatDate(new Date(e.createTime))
            })
            this.page2.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          this.$xhr('ddeChangeLog', requestData).success(res => {
            this.page2.pageNo = pageNo
            this.$store.dispatch('changepageNo', pageNo)
            this.showPage = 2
            this.productChangeTable = res.data
            this.productChangeTable.forEach(e => {
              e.productChange = '变动种类：' + e.productTypeSize + '   ' + '变动数量：' + e.productSize
              if (e.productTypeSize === null) {
                e.productChange = ' '
              }
              switch (e.type) {
                case 1: e.type = '补货'
                  break
                case 2: e.type = '退货'
                  break
                default: e.type = ''
              }
              switch (e.rId) {
                case 2: e.rId = '用户'
                  break
                case 4: e.rId = '补货员'
                  break
                default: e.type = ''
              }
              e.createTime = this.formatDate(new Date(e.createTime))
            })
            this.page2.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      search (pageNo = 1) {
        let requestData = Object.assign(this.page, this.searchData)
        this.page.vendorId = this.$route.params.did
        if (this.a === '1') {
          this.$xhr('deChangeLog', requestData).success(res => {
            this.page.pageNo = pageNo
            this.$store.dispatch('changepageNo', pageNo)
            this.productChangeTable = res.data
            this.productChangeTable.forEach(e => {
              e.productChange = '变动种类：' + e.productTypeSize + '' + '变动数量：' + e.productSize
              if (e.productTypeSize === null) {
                e.productChange = ' '
              }
              switch (e.type) {
                case 1: e.type = '补货'
                  break
                case 2: e.type = '退货'
                  break
                default: e.type = ''
              }
              switch (e.rId) {
                case 2: e.rId = '用户'
                  break
                case 4: e.rId = '补货员'
                  break
                default: e.type = ''
              }
              e.createTime = this.formatDate(new Date(e.createTime))
            })
            this.page.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          this.$xhr('ddeChangeLog', requestData).success(res => {
            this.page.pageNo = pageNo
            this.$store.dispatch('changepageNo', pageNo)
            this.productChangeTable = res.data
            this.productChangeTable.forEach(e => {
              e.productChange = '变动种类：' + e.productTypeSize + '' + '变动数量：' + e.productSize
              if (e.productTypeSize === null) {
                e.productChange = ' '
              }
              switch (e.type) {
                case 1: e.type = '补货'
                  break
                case 2: e.type = '退货'
                  break
                default: e.type = ''
              }
              switch (e.rId) {
                case 2: e.rId = '用户'
                  break
                case 4: e.rId = '补货员'
                  break
                default: e.type = ''
              }
              e.createTime = this.formatDate(new Date(e.createTime))
            })
            this.page.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      viewProductChange (num) {
        this.$router.push(`/deviceDe/deChangeDetails/${this.productChangeTable[num].id}`)
      },
      formatDate (now) {
        var year = now.getFullYear()
        var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
        var date = now.getDate() < 10 ? '0' + (now.getDate()) : now.getDate()
        var hour = now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours()
        var minute = now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes()
        var second = now.getSeconds() < 10 ? '0' + (now.getSeconds()) : now.getSeconds()
        return year + '-' + month + '-' + date + '  ' + hour + ':' + minute + ':' + second
      },
      setSearchDate (range = this.dataRange || []) {
        if ((typeof this.dataRange[0]) !== 'number') {
          this.searchData.startDate = range[0] ? range[0].getTime() : ''
          this.searchData.endDate = range[1] ? range[1].getTime() : ''         // + 24 * 60 * 60 * 1000 : ''
        }
      }
    }
  }
</script>
<style scoped>
  .orderStatus{
    width: 100%;
    margin-top: 20px;
  }
  .data{
    margin-left: 200px;
  }
  .page{
    float: right;
    margin-top: 1%;
  }
  .productChangeTable{
    margin-top: 10px;
  }
  .btn{
    margin: 0;
  }
  .a{
    float: left;
  }
  .b{
    float: right;
  }
  .sure {
    margin-top: 50px;
  }
</style>
-->

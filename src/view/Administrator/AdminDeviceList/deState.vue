<template>
  <div id="deState">
    <div class="orderStatus">
      <!-- <div class="a"> -->
      <el-button type="primary" plain @click="userOpeation(1)" class="btn">用户操作</el-button>
      <el-button type="primary" plain @click="replenishmentOpeation(1)" class="btn">补货员操作</el-button>
      <el-button type="primary" plain @click="stayError(1)" class="btn">摆放异常</el-button>
      <el-button type="primary" plain @click="restart(1)" class="btn">重启</el-button>
      <!-- </div> -->
      <!-- <div class="b"> -->
      <el-date-picker style="padding:0; margin-right:10px;" :clearable='false' v-model="dataRange" type="datetimerange" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="warning" @click.native.prevent="search(1)">搜索</el-button>
      <!-- </div> -->
    </div>
    <div class="deviceStatusTable">
      <el-table :data="deviceStatusTable" border style="width:100%">
        <el-table-column prop="operateType" label="操作" align="center"></el-table-column>
        <el-table-column prop="userRoleId" label="身份" align="center"></el-table-column>
        <el-table-column label="身份ID" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="gotoUser(scope.$index, scope.row)" type="text" size="small">{{deviceStatusTable[scope.$index].userId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" align="center"></el-table-column>0
      </el-table>
    </div>
    <el-pagination class="page" v-show="showPage === 0" layout="total, prev, pager, next" :current-page.sync="page.pageNo" :page-size="page.pageSize"
      :total="page.total" @current-change="search" />
    <el-pagination class="page" v-show="showPage === 2" layout="total, prev, pager, next" :current-page.sync="page2.pageNo" :page-size="page2.pageSize"
      :total="page2.total" @current-change="replenishmentOpeation" />
    <el-pagination class="page" v-show="showPage === 1" layout="total, prev, pager, next" :current-page.sync="page1.pageNo" :page-size="page1.pageSize"
      :total="page1.total" @current-change="userOpeation" />
    <el-pagination class="page" v-show="showPage === 3" layout="total, prev, pager, next" :current-page.sync="page3.pageNo" :page-size="page3.pageSize"
      :total="page3.total" @current-change="stayError" />
    <el-pagination class="page" v-show="showPage === 4" layout="total, prev, pager, next" :current-page.sync="page4.pageNo" :page-size="page4.pageSize"
      :total="page4.total" @current-change="restart" />
    <el-button @click="back" class="sure">返回</el-button>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'deState',
    data() {
      return {
        showPage: 0,
        name: '11',
        dataRange: [],
        deviceStatusTable: [],
        searchData: {},
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
          status: '1'
        },
        page2: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0,
          status: '2'
        },
        page3: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0,
          status: '3'
        },
        page4: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0,
          status: '4'
        }
      }
    },
    watch: {
      dataRange(range) {
        this.setSearchDate(range)
      }
    },
    created() {
      // let data = new Date()
      // let today = data.getTime()
      // let firstDay = today - 60 * 60 * 24 * 7 * 1000
      // this.dataRange = [firstDay, today]
      this.a = JSON.parse(localStorage.getItem('teauserStatus')) + ''
      this.search()
    },
    computed: {
      ...mapState(['pageNo', 'payStatus'])
    },
    methods: {
      ...mapActions(['changepageNo', 'changePayStatus']),
      back() {
        this.$router.push('/container/AdminDeviceList')
      },
      search(pageNo = 1) {
        let requestData = Object.assign(this.searchData, this.page, { id: this.$route.params.did })
        console.log(requestData)
        if (this.a === '1') {
          this.$xhr('deState', requestData).success(res => {
            this.showPage = 0
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          this.$xhr('ddeState', requestData).success(res => {
            this.showPage = 0
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      setSearchDate(range = this.dataRange || []) {
          if (range != null) {
            this.searchData.startDate = range[0] ? range[0].getTime() : ''
            this.searchData.endDate = range[1] ? range[1].getTime() : ''         // + 24 * 60 * 60 * 1000 : ''
          } else {
            this.searchData.startDate = '';
            this.searchData.endDate = '';
          }
      },
      formatDate(now) {
        var year = now.getFullYear()
        var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
        var date = now.getDate() < 10 ? '0' + (now.getDate()) : now.getDate()
        var hour = now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours()
        var minute = now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes()
        var second = now.getSeconds() < 10 ? '0' + (now.getSeconds()) : now.getSeconds()
        return year + '-' + month + '-' + date + '  ' + hour + ':' + minute + ':' + second
      },
      replenishmentOpeation(paegNo = 1) {
        let requestData = Object.assign(this.searchData, this.page2)
        if (this.a === '1') {
          this.$xhr('deState', requestData).success(res => {
            this.showPage = 2
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page2.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          this.$xhr('ddeState', requestData).success(res => {
            this.showPage = 2
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page2.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      userOpeation(pageNo = 1) {
        if (this.a === '1') {
          let requestData = Object.assign(this.searchData, this.page1)
          this.$xhr('deState', requestData).success(res => {
            this.showPage = 1
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page1.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          let requestData = Object.assign(this.searchData, this.page1)
          this.$xhr('ddeState', requestData).success(res => {
            this.showPage = 1
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page1.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      stayError() {
        if (this.a === '1') {
          let requestData = Object.assign(this.searchData, this.page3)
          this.$xhr('deState', requestData).success(res => {
            this.showPage = 3
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page3.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
        if (this.a === '3') {
          let requestData = Object.assign(this.searchData, this.page3)
          this.$xhr('ddeState', requestData).success(res => {
            this.showPage = 3
            this.deviceStatusTable = res.data
            this.deviceStatusTable.forEach((e) => {
              e.createTime = this.formatDate(new Date(e.createTime))
              switch (e.operateType) {
                case 1: e.operateType = '开门'
                  break
                case 2: e.operateType = '关门'
                  break
                case 3: e.operateType = '错误摆放'
                  break
                case 4: e.operateType = '重启'
                  break
                default: e.operateType = ''
              }
              switch (e.userRoleId) {
                case 1: e.userRoleId = '管理员'
                  break
                case 2: e.userRoleId = '用户'
                  break
                case 3: e.userRoleId = '运营商'
                  break
                case 4: e.userRoleId = '补货员'
                  break
                default: e.userRoleId = ''
              }
            })
            this.page3.total = res.total
          }).error(res => { this.$message.error(res.message) })
        }
      },
      restart() {
        let requestData = Object.assign(this.searchData, this.page4)
        this.$xhr('deState', requestData).success(res => {
          this.showPage = 4
          this.deviceStatusTable = res.data
          this.deviceStatusTable.forEach((e) => {
            e.createTime = this.formatDate(new Date(e.createTime))
            switch (e.operateType) {
              case 1: e.operateType = '开门'
                break
              case 2: e.operateType = '关门'
                break
              case 3: e.operateType = '错误摆放'
                break
              case 4: e.operateType = '重启'
                break
              default: e.operateType = ''
            }
            switch (e.userRoleId) {
              case 1: e.userRoleId = '管理员'
                break
              case 2: e.userRoleId = '用户'
                break
              case 3: e.userRoleId = '运营商'
                break
              case 4: e.userRoleId = '补货员'
                break
              default: e.userRoleId = ''
            }
          })
          this.page4.total = res.total
        }).error(res => { this.$message.error(res.message) })
      }
    }
  }

</script>
<style scoped>
  #deState {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .orderStatus {
    /* background: yellow; */
    margin-top: 20px;
    padding-bottom: 10px;
  }

  .data {
    margin-left: 200px;
  }

  .page {
    padding: 10px 0 30px 0;
  }

  .deviceStatusTable {
    margin-top: 10px;
  }

  .btn {
    margin: 0 10px 0 0;
  }

  .a {
    /* margin-bottom: 20px; */
    /* background: red; */
    /* float: left; */
  }

  .b {
    /* margin-bottom: 20px; */
    /* background: blue;  */
    /* float: right;  */
  }

  .sure {
    /* margin-top: 60px;
    margin-left: 200px; */
  }
</style>
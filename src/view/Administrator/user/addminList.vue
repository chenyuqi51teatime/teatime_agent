<template>
  <div id="user">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="active('1')">管理员列表</el-menu-item>
      <el-menu-item index="2" @click="active('2')">运营商列表</el-menu-item>
    </el-menu>
    <div v-if="activeIndex == 1" width="100%">

      <el-button class="new" @click.stop.native.prevent="createAdmin" type="warning">新建管理员</el-button>

      <el-table :data="manage" border style="width: 100%" @row-click="manageDetail">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.stop.native.prevent="deleteManage(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
        :page-size="page.pageSize" :total="page.total" @current-change="adminList" />
      </el-pagination>
    </div>
    <!--  管理员删除提示  -->
    <el-dialog title="提示" :visible.sync="admDialog" width="30%" :before-close="exit_notsure">
      <div class="exitMsg">确定删除？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="adm_sure">确 定</el-button>
        <el-button @click="adm_notsure">取 消</el-button>
      </div>
    </el-dialog>

    <div v-if="activeIndex == 2" width="100%">
      <div v-if="activeIndex == 2">
        <!-- <el-form :inline="true" :model="searchData1" :label-width="labelWidth">
          <el-form-item label="时间" class="kuang">
            <el-date-picker :clearable="false" v-model="searchData1.value" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=" " class="kuang">
            <el-button type="warning" @click.native.prevent="agentList(1)">查询</el-button>
          </el-form-item>
        </el-form> -->

        <el-button class="new" @click.stop.native.prevent="createAgent" type="warning">新建运营商</el-button>

        <el-table :data="agent" border style="width: 100%" @row-click="agentDetail">
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="gender" label="性别" align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          <el-table-column prop="identityId" label="身份证号" align="center"></el-table-column>
          <el-table-column prop="area" label="地区" align="center"></el-table-column>
          <!--<el-table-column prop="amount" label="营业额（元）"  align="center" ></el-table-column>-->
          <!--<el-table-column prop="number" label="营业数量（订单数）"  align="center" show-overflow-tooltip></el-table-column>-->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click.stop.native.prevent="deleteAgent(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="page" v-show="pageAgent.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="pageAgent.pageNo"
          :page-size="pageAgent.pageSize" :total="pageAgent.total" @current-change="agentList" />
        </el-pagination>
      </div>
    </div>

    <!--  运营商删除提示  -->
    <el-dialog title="提示" :visible.sync="adm2Dialog" width="30%" :before-close="exit_notsure">
      <div class="exitMsg">确定删除？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="adm2_sure">确 定</el-button>
        <el-button @click="adm2_notsure">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'redList',
    data() {
      return {
        admDialog: false,
        adm2Dialog: false,
        num: null,
        num2: null,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个季',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        activeIndex: '1',
        manage: [],
        agent: [],
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        pageAgent: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        searchData: {
          name: '',
          phone: ''
        },
        searchData1: {
          value: ''
        }
      }
    },
    computed: {
      ...mapState(['role', 'acIndex', 'pageNo'])
    },
    created() {
      this.activeIndex = this.$store.state.acIndex
      this.adminList(this.$store.state.pageNo)
      this.agentList(this.$store.state.pageNo)
    },
    methods: {
      ...mapActions(['getRole', 'changepageNo', 'changeacIndex']),
      active(num) {
        this.$store.dispatch('changeacIndex', num)
        this.$store.dispatch('changepageNo', 1)
      },
      handleSelect(type) {
        this.activeIndex = type
      },
      adminList(pageNo = 1) {
        this.page.pageNo = pageNo
        /* TODO 管理员接口 */
        this.$store.dispatch('changepageNo', pageNo)
        this.$xhr('adminList', this.page).success(res => {
          this.manage = res.datas
          this.page.total = res.total
          this.manage.forEach(e => {
            switch (e.gender) {
              case 1: e.gender = '男'
                break
              case 2: e.gender = '女'
                break
            }
          })
        })
      },
      agentList(pageNo = 1) {
        this.pageAgent.pageNo = pageNo
        this.$store.dispatch('changepageNo', pageNo)
        /* TODO 运营商接口 */
        let req = Object.assign(this.pageAgent, this.searchData1)
        console.log(req)
        this.$xhr('agentList', req).success(res => {
          this.agent = res.datas
          this.agent.forEach(e => {
            switch (e.gender) {
              case 1: e.gender = '男'
                break
              case 2: e.gender = '女'
                break
            }
          })
          console.log(res)
          this.pageAgent.total = res.total
        })
      },
      // 管理员
      deleteManage(num) {
        this.admDialog = true;
        this.num = num;
      },
      // 管理员 删除提示框
      adm_sure() {
        var num = this.num;
        this.$xhr('deleteAdmin', {
          ids: [this.manage[num].id]
        }).success(res => {
          this.$message('删除成功!')
          this.adminList()
          this.admDialog = false;
        }).error(res => {
          this.$message.error(res.message)
        })
      },
      adm_notsure() {
        this.admDialog = false;
      },
      // 运营商
      deleteAgent(num) {
        this.adm2Dialog = true;
        this.num2 = num;
      },
      // 运营商 删除提示框
      adm2_sure() {
        var num = this.num2;
        this.$xhr('deleteBusiness', {
          ids: [this.agent[num].id]
        }).success(res => {
          this.$message('删除成功!')
          this.agentList()
          this.adm2Dialog = false;
        }).error(res => {
          this.$message.error(res.message)
        })
      },
      adm2_notsure() {
        this.adm2Dialog = false;
      },
      createAdmin() {
        this.$router.push(`/container/addAddmin`)
      },
      createAgent() {
        this.$router.push(`/container/addUser`)
      },
      manageDetail(row) {
        this.$router.push(`/container/addminDetail/${row.id}`)
      },
      agentDetail(row) {
        this.$router.push(`/container/addminDetail/${row.id}`)
      }
    }
  }

</script>

<style scoped>
  #user {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .page {
    padding: 10px 0;
    /* float: left; */
  }

  .complete {
    margin-top: 20px;
  }

  .new {
    margin: 10px 0;
    /* float: right; */
    /* margin-top: 5px; */
    /* margin-left: 10px; */
  }

  .kuang {
    margin-top: 10px;
    /* float: left; */
  }
</style>
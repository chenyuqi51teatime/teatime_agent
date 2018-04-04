<template>
  <div id="examine">
    <div width="100%">
      <el-table :data="sensorList" border style="width: 100%" @row-click="rowClick">
        <el-table-column prop="sensorNum" label="传感器编号（托盘）" align="center"></el-table-column>
        <el-table-column prop="dvid" label="dvid" align="center"></el-table-column>
        <el-table-column prop="productName" label="当前商品" align="center"></el-table-column>
      </el-table>
      <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
        :page-size="page.pageSize" :total="page.total" @current-change="sensor" />
      </el-pagination>
    </div>
    <div class="foot_btn">
      <el-button class="back" @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        sensorList: [],
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    computed: {
      ...mapState(['pageNo'])
    },
    created() {
      this.sensor(this.$store.state.pageNo)
    },
    methods: {
      ...mapActions(['changepageNo']),
      sensor(pageNo = 1) {
        this.page.pageNo = pageNo
        /* TODO 传感器列表接口 */
        this.$store.dispatch('changepageNo', pageNo)                // 存储分页
        let requestData = Object.assign({ vendorId: this.$route.params.did }, this.page)
        this.$xhr('sensorListApi', requestData).success(res => {
          this.sensorList = res.dates
          this.page.total = res.total
        })
      },
      rowClick(row) {
        this.$router.push(`/container/sensorHistory/${this.$route.params.did}/${row.dvid}`)
      },
      cancel() {
        this.$router.back()
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
    padding: 10px;
    /* float: left; */
  }

  .complete {
    margin-top: 20px;
  }

  .back {
    margin-top: 50px;
  }

  .foot_btn{
    text-align: center;
  }
</style>
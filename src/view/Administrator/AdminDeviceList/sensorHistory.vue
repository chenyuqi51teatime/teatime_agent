<template>
  <div id="examine">
    <div width="100%">
      <el-table :data="sensorH" border style="width: 100%">
        <el-table-column prop="weight" label="重量(g)" align="center"></el-table-column>
        <el-table-column prop="time" label="时间" align="center"></el-table-column>
      </el-table>
      <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
        :page-size="page.pageSize" :total="page.total" @current-change="sensor" />
      </el-pagination>
    </div>
    <div class="foot_brn">
      <el-button class="back" @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sensorH: [],
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    created() {
      this.sensor()
    },
    methods: {
      sensor(pageNo = 1) {
        this.page.pageNo = pageNo
        /* TODO 传感器历史列表接口 */
        let requestData = Object.assign({ vendorId: this.$route.params.did, dvid: this.$route.params.did }, this.page)

        console.log(this.$route.params.did, this.$route.params.sid)

        this.$xhr('sensorHistoryApi', requestData).success(res => {
          this.sensorH = res.dates
          for (var i = 0; i < this.sensorH.length; i++) {
            this.sensorH[i].time = this.formatDate(new Date(this.sensorH[i].time)).slice(0, -8)
          }
          this.page.total = res.total
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
  }

  .complete {
    margin-top: 20px;
  }

  .back {
    margin-top: 50px;
  }

  .foot_brn{
    text-align: center;
  }
</style>
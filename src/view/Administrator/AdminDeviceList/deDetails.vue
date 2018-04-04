<!-- 货柜详情 -->
<template>
  <div id="deviceDetail">
    <div class="common">
      <span>货柜信息</span>
      <!-- <el-button v-if="teauserStatus === '3'" class="edit" type="warning" @click="edit">编辑</el-button> -->
      <el-button class="edit" type="warning" @click="sensor">传感器历史</el-button>
    </div>
    <div class="tableDetail">
      <table class="detail">
        <tr class="detail-one">
          <td class="detail-two">货柜编号：</td>
          <td class="detail-three">{{form.id}}</td>
          <td class="detail-two">维护人：</td>
          <td class="detail-three">{{form.maintainPersonName}}</td>
          <td class="detail-two">货柜状态：</td>
          <td class="detail-three">{{form.status}}<button v-if="this.form.status === '摆放异常'" class="resetBtn" @click="reset">重置</button></td>
        </tr>
        <tr class="detail-one">
          <td class="detail-two">mac地址：</td>
          <td class="detail-three">{{form.mac}}</td>
          <td class="detail-two">维护人电话：</td>
          <td class="detail-three">{{form.maintainPersonPhone}}</td>
          <td class="detail-two">异常货道：</td>
          <td class="detail-three">{{form.pass}}</td>
        </tr>
        <tr class="detail-one">
          <td class="detail-two">货柜地址：</td>
          <td class="detail-three">{{form.pcd}}</td>
          <td class="detail-two">BD联系人：</td>
          <td class="detail-three">{{form.bdName}}</td>
          <td class="detail-two">信号强度：</td>
          <td class="detail-three">{{form.signalIntensity}}</td>
        </tr>
        <tr class="detail-one">
          <td class="detail-two">地址简称：</td>
          <td class="detail-three">{{form.abbreviatedAddress}}</td>
          <td class="detail-two">BD电话：</td>
          <td class="detail-three">{{form.bdPhone}}</td>
          <td class="detail-two">备注信息：</td>
          <td class="detail-three">{{form.memo}}</td>
        </tr>
        <tr class="detail-one">
          <td class="detail-two">绑定时间：</td>
          <td class="detail-three">{{form.createTime}}</td>
          <td class="detail-two">最后补货时间：</td>
          <td class="detail-three">{{form.replenishmentTime}}</td>
          <td class="detail-two"></td>
          <td class="detail-three"></td>
        </tr>
      </table>
    </div>
    <div class="common">
      <span>托盘信息</span>
    </div>
    <div class="lines">
      <div class="sss" v-for="x in tableLines">
        <table :style="classObject" v-for="e in x">
          <tr class="sku-tr detail-two">
            <td v-if="e.yichang !== true" class="sku-td header">{{e.pan}}</td>
            <td v-if="e.yichang == true" class="sku-td red">{{e.pan}}</td>
          </tr>
          <tr class="sku-tr property">
            <td class="sku-td">{{e.productName}} {{e.property}} {{e.skuWeight}}</td>
          </tr>
          <tr class="sku-tr">
            <td class="sku-td">{{e.plantWeight}} {{e.count}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="foot-btn">
      <el-button class="sure" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { areas } from '@/area'
  import { picAddress } from '@/config.json'
  export default {
    name: 'category_new',
    components: {},
    data() {
      return {
        classObject: {
          width: '10%'
        },
        teauserStatus: '',
        provinces: areas.filter(area => area.level === 1),
        cities: [],
        districts: [],
        image: `${picAddress}`,
        tableLines: [],
        list: [],
        form: {
          pass: '',
          id: this.$route.params.did,
          mac: '1',
          createTime: '',
          memo: '',
          provinceId: '',
          cityId: '',
          districtId: ''
        },
        searchId: {
          deviceId: this.$route.params.did
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.meta.module === 'product1') {
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
      }
      next()
    },
    created() {
      /*  取到设备详细和货道  */
      this.$store.dispatch('changepageNo', 1)
      this.teauserStatus = localStorage.getItem('teauserStatus')
      this.detail()
    },
    computed: {
      ...mapState(['deviceFrom'])
    },
    methods: {
      ...mapActions(['changeDeviceFrom']),
      reset() {
        /* TODO 重置状态 */
        this.$xhr('deviceDetailreset', {
          id: this.searchId.deviceId
        }).success(res => {
          this.$message('重置成功!')
          this.detail()
        }).error(err => {
          this.$message.error(err.message)     // '未设置商品与是否已投放不能重置!'
        })
      },
      detail() {
        /* 代理商货柜详情   这里list相当于取回来的货道信息 */
        this.$xhr(localStorage.getItem('teauserStatus') === '1' ? 'deviceDetailApi' : 'deviceDetailApiB', {
          id: this.searchId.deviceId
        }).success(res => {
          console.log(res)
          this.form = res.data[0]
          this.form.signalIntensity = res.signalIntensity
          this.list = res.cargoInformation
          /* 设备状态 */
          switch (this.form.status) {
            case 1:
              this.form.status = '正常'
              break
            case 2:
              this.form.status = '补货中'
              break
            case 3:
              this.form.status = '摆放异常'
              break
            case 4:
              this.form.status = '未投放'
              break
            case 5:
              this.form.status = '未设置商品'
              break
          }
          this.form.createTime = this.formatDate(new Date(this.form.createTime))
          if (this.form.replenishmentTime !== 0 || this.form.replenishmentTime !== null) {
            this.form.replenishmentTime = this.formatDate(new Date(this.form.replenishmentTime))     // 最后补货时间
          } else {
            this.form.replenishmentTime = ''
          }
          if (res.exceptionPass.length > 0) {
            res.exceptionPass.forEach(e => {
              this.form.pass = e.sensorId + ''
              this.form.pass = (5 - parseInt(this.form.pass.slice(2, 3))) + '—' + (parseInt(this.form.pass.slice(3, 4)) + 1)
            })
          }
          if (res.data[0].provinceId === 0) {
            res.data[0].provinceId = ''
          }
          if (res.data[0].cityId === 0) {
            res.data[0].cityId = ''
          }
          if (res.data[0].districtId === 0) {
            res.data[0].districtId = ''
          }
          this.form.provinceId = res.data[0].provinceId + ''
          this.form.cityId = res.data[0].cityId + ''
          this.form.districtId = res.data[0].districtId + ''
          let pName = this.provinces.filter((e) => { return e.code === this.form.provinceId })
          const pCode = this.form.provinceId.slice(0, 2)
          this.cities = areas.filter(area => area.level === 2 && area.sheng === pCode)
          let cName = this.cities.filter((e) => { return e.code === this.form.cityId })
          const cCode = this.form.cityId.slice(2, 4)
          this.districts = areas.filter(area => area.level === 3 && area.sheng === pCode && area.di === cCode)
          let dName = this.districts.filter((e) => { return e.code === this.form.districtId })
          this.form.pcd = pName[0].name + cName[0].name + dName[0].name + res.data[0].address
          this.form.createTime = this.formatDate(new Date(this.form.createTime))
          if (this.form.replenishmentTime !== 0 || this.form.replenishmentTime !== null) {
            this.form.replenishmentTime = this.formatDate(new Date(this.form.replenishmentTime))     // 最后补货时间
          } else {
            this.form.replenishmentTime = ''
          }
          if (res.exceptionPass.length > 0) {
            res.exceptionPass.forEach(e => {
              this.form.pass = e.sensorId + ''
              this.form.pass = (5 - parseInt(this.form.pass.slice(2, 3))) + '—' + (parseInt(this.form.pass.slice(3, 4)) + 1)
            })
          }
          /* 可扩展的 处理货道   其实pan是可以用5减的 */
          var x = 1
          this.tableLines = []
          this.list.sort((a, b) => {
            return b.sensorId - a.sensorId
          })
          this.list.forEach((e) => {
            let index = Math.floor((e.sensorId / 10) % 100)
            res.exceptionPass.forEach(c => {
              if (c.sensorId === e.sensorId) {
                e.yichang = true
              } else {
                e.yichang = false
              }
            })
            if (Array.isArray(this.tableLines[index])) {
              e.skuWeight = e.skuWeight === null ? '' : '重量：' + e.skuWeight + 'g'
              e.plantWeight = e.plantWeight === null ? '' : '总重：' + e.plantWeight + 'g'
              e.count = e.count === null ? '' : '数量：' + e.count
              this.tableLines[index].push(e)
            } else {
              e.skuWeight = e.skuWeight === null ? '' : '重量：' + e.skuWeight + 'g'
              e.plantWeight = e.plantWeight === null ? '' : '总重：' + e.plantWeight + 'g'
              e.count = e.count === null ? '' : '数量：' + e.count
              this.tableLines[index] = [e]
            }
          })
          //          this.tableLines = this.tableLines.filter(e => { return e !== undefined })    //   过滤空行
          this.tableLines.forEach(e => {
            if (e.length > x) {
              x = e.length
            }
          })
          this.classObject.width = (100 / x) + '%'
          this.tableLines.reverse()
          this.tableLines.forEach((e, i) => {
            e.reverse()
            e.forEach((a, c) => {
              a.pan = a.sensorId + ''
              //              a.pan = (i + 1) + '—' + (c + 1)          //  二位数组index排序
              a.pan = (5 - parseInt(a.pan.slice(2, 3))) + '—' + (parseInt(a.pan.slice(3, 4)) + 1)
              if (a.sensorId > 1049) {
                a.pan = '托盘组装错误'
                e.yichang = true
              }
            })
          })
        })
      },
      detail1() {
        /* 管理员货柜详情 接口不同 */
      },
      edit() {
        /* 进入编辑页 */
        this.$router.push(`/deviceDetail/${this.$route.params.did}`)
      },
      back() {
        this.$router.back();
      },
      sensor() {
        this.$router.push(`/container/sensorList/${this.$route.params.did}`)
      },
      newData() { },
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
  #deviceDetail {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .data-header {
    display: flex;
    justify-content: space-between;
  }

  .new-data {
    height: 40px!important;
    margin-top: 10px;
  }

  .new {
    float: right;
    margin-top: 5px;
    margin-left: 10px;
  }

  .image {
    height: 40px;
  }

  .common {
    float: left;
    padding-bottom: 5px;
    overflow: hidden;
  }

  .sku {
    display: inline-block;
    width: 6px;
    height: 8px;
    border-right: 1px #333 solid;
    border-left: 1px #333 solid;
    border-top: 2px #333 solid;
    border-bottom: 2px #333 solid;
  }

  span {
    margin-left: 5px;
    font-size: 16px;
    font-weight: bold;
  }

  .tableDetail {
    width: 100%;
    height: 220px;
    padding-top: 30px;
    padding-bottom: 40px;
  }

  .hang {
    height: 20px;
  }

  .word {
    display: inline-block;
    width: 200px;
    height: 30px;
    line-height: 30px;
    float: left;
  }

  .reset {
    margin-left: 8px;
  }

  .edit {
    margin-left: 10px;
  }

  .sure {
    text-align: center;
    margin-top: 50px;
  }

  .detail {
    border: 1px solid #ccc;
    border-collapse: collapse;
    margin-top: 30px;
  }

  .detail tr {
    border: 1px solid #ccc;
    height: 40px;
  }

  .detail td {
    border: 1px solid #ccc;
    font-size: 14px;
  }

  .detail-one {
    background-color: #fff;
  }

  .detail-two {
    text-align: center;
    background-color: #eee;
    width: 200px;
  }

  .detail-three {
    padding-left: 5px;
    text-align: left;
    background-color: #fff;
    width: 300px;
  }

  .resetBtn {
    float: right;
    margin-right: 10px;
    background-color: red;
    color: #fff;
    border-radius: 5px;
    border: 1px solid red;
    width: 50px;
    height: 40px;
    cursor: pointer;
  }

  .sku-tr {
    height: 60px;
  }

  .sku-td {
    width: 100%;
    font-size: 12px;
  }

  .header {
    background-color: #eee;
  }

  .red {
    background-color: #eee;
    color: red;
  }

  .sss {
    width: 100%;
    display: inline-block;
    margin-top: -6px;
  }

  .sss table {
    border: 1px solid #ccc;
    float: left;
    height: 100%;
    margin-left: -1px;
    border-collapse: collapse;
  }

  .sure {
    margin-top: 50px;
  }

  .lines {
    margin-top: 50px;
    width: 100%;
    height: 100%;
    display: block;
  }

  .foot-btn {
    text-align: left;
  }
</style>
<template>
  <div id="product">
    <div class="form">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="货柜编号">
          <el-input class="user-input" v-model="searchData.id"></el-input>
        </el-form-item>
        <el-form-item label="运营商ID">
          <el-input class="user-input" v-model="searchData.userId"></el-input>
        </el-form-item>
        <el-form-item label="补货时间">
          <el-date-picker :clearable= "false" v-model="dataRange" start-placeholder="开始日期" end-placeholder="结束日期" type="datetimerange" range-separator="至"
          />
        </el-form-item>
        <el-form-item label="地址">
          <el-form-item class="addr-sel" prop="provinceId">
            <el-select class="address-select" v-model="searchData.provinceId" @change="changeProvince" placeholder="请选择省">
              <el-option v-for="p in provinces" :label="p.name" :value="p.code" :key="p.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="addr-sel" prop="cityId">
            <el-select class="address-select" v-model="searchData.cityId" @change="changeCity" placeholder="请选择市">
              <el-option v-for="c in cities" :label="c.name" :value="c.code" :key="c.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="addr-sel" prop="districtId">
            <el-select class="address-select" v-model="searchData.districtId" placeholder="请选择区">
              <el-option v-for="d in districts" :label="d.name" :value="d.code" :key="d.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click.native.prevent="search(1)">检索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="devices" border style="width: 100%" @sort-change="sortChange">
      <el-table-column prop="id" label="货柜编号" align="center" width='90'></el-table-column>
      <el-table-column label="摆放地点" align="center"  width='100'>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.abbreviatedAddress !== null">
            <p>地址 : {{ scope.row.addressDetail }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.abbreviatedAddress }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop='memo'label="备注" align="center" show-overflow-tooltip>
       <!--  <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.abbreviatedAddress !== null">
            <p>{{ scope.row.memo}}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{  scope.row.memo}}</el-tag>
            </div>
          </el-popover>
        </template> -->
      </el-table-column>
      <el-table-column prop="skuKind" label="商品种类" align="center"  width='100'></el-table-column>
      <el-table-column prop="recommendSkuCount" label="推荐商品总数"  width='150'></el-table-column>
      <el-table-column prop="total" label="上次补货后销售额" align="center"  width='100'></el-table-column>
      <el-table-column prop="replenishmentTime" label="补货时间" align="center"  width='100'></el-table-column>
      <el-table-column label="库存情况" align="center"  width='110'>
        <template slot-scope="scope">
          <el-button v-if="devices[scope.$index].color === 0" type="text" style="color: red">{{devices[scope.$index].numerator}}/{{devices[scope.$index].denominator}}</el-button>
          <el-button v-if="devices[scope.$index].color === 1" type="text" style="color: #fb8100">{{devices[scope.$index].numerator}}/{{devices[scope.$index].denominator}}</el-button>
          <el-button v-if="devices[scope.$index].color === 2" type="text" style="color: green">{{devices[scope.$index].numerator}}/{{devices[scope.$index].denominator}}</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="货柜状态" align="center"  width='110'></el-table-column>
      <el-table-column label="运营商ID" align="center" width='100'>
        <template slot-scope="scope">
          <el-button @click.stop.native.prevent="yunDetail(scope.$index, scope.row)" type="text" size="small" class="line">{{devices[scope.$index].userId}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.stop.native.prevent="rowDetail(scope.$index, scope.row)" type="text" size="small">货柜详情</el-button>
          <!-- 管理员没有创建补货单的功能 -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="page" v-show="page.totalPage >= 1" layout="total, prev, pager, next" :current-page.sync="page.pageNo"
      :page-size="page.pageSize" :total="page.total" @current-change="search" />
    </el-pagination>
  </div>
</template>

<script>
  import { areas } from '@/area'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'adminDeviceList',
    data() {
      return {
        provinces: areas.filter(area => area.level === 1),
        cities: [],
        districts: [],
        devicesId: [],
        state: false,
        devices: [{
          id: 1,
          short: '北上广',
          provinceId: '210000',
          cityId: '210200',
          districtId: '210211',
          addressDetail: '1111'
        }],
        page: {
          totalPage: 1,
          pageNo: '',
          pageSize: 10,
          total: 0
        },
        dataRange: [],
        searchData: {
          id: '',
          userId: '',
          startDate: '',
          endDate: '',
          memo: '',
          sortCondition: 1,
          sortType: 1
        },
        searchData1: {
          id: '',
          userId: '',
          startDate: '',
          endDate: '',
          memo: '',
          provinceId: '',
          cityId: '',
          districtId: '',
          sortCondition: 1,
          sortType: 1
        }
      }
    },
    computed: {
      ...mapState(['role', 'pageNo', 'isFirstEnter'])
    },
    watch: {
      dataRange(range) {
        // console.log(range)
        this.setSearchDate(range)
      }
    },
    activated() {
      console.log(1)
      console.log(this.$store.state.isFirstEnter)
      if (this.$store.state.isFirstEnter) {
        this.searchData = {
          id: '',
          userId: '',
          startDate: '',
          endDate: '',
          memo: '',
          sortCondition: 1,
          sortType: 1
        }
        var firstDay = ''
        var today = ''
        this.dataRange = [firstDay, today]
        this.search()
        this.provinces = areas.filter(area => area.level === 1)
        this.provinces.unshift({ name: '请选择省', code: '请选择省' })
        this.cities = []
        this.districts = []
        this.cities.unshift({ name: '请选择市', code: '请选择市' })
        this.districts.unshift({ name: '请选择区', code: '请选择区' })
        this.setSearchDate()
      } else { }
    },
    created() {
      console.log(2)
      var firstDay = ''
      var today = ''
      this.dataRange = [firstDay, today]
      this.search()
      this.provinces = areas.filter(area => area.level === 1)
      this.provinces.unshift({ name: '请选择省', code: '请选择省' })
      this.cities = []
      this.districts = []
      this.cities.unshift({ name: '请选择市', code: '请选择市' })
      this.districts.unshift({ name: '请选择区', code: '请选择区' })
      this.setSearchDate()
    },
    methods: {
      ...mapActions(['getRole', 'changepageNo', 'changeEnter']),
      setSearchDate(range = this.dataRange || []) {
        // console.log(range)
        if (range != null) {
          this.searchData.startDate = range[0] ? range[0].getTime() : ''
          this.searchData.endDate = range[1] ? range[1].getTime() : ''         // + 24 * 60 * 60 * 1000 : ''
        } else{
          this.searchData.startDate = '' ;
          this.searchData.endDate = '' ;
        }
      },
      yunDetail(num) {
        /* 跳转运营商详情 */
        this.$router.push(`/container/userDetail/${this.devices[num].userId}`)
      },
      rowDetail(num) {
        /* 跳转设备详情 */
        this.$router.push(`/container/deviceDe1/${this.devices[num].id}/deDetails`)
        // this.$router.push(`/container/deDetails/${this.devices[num].id}`)
      },
      sortChange() { },
      sortChange1(pageNo = 1) {
        /* todo 排序 */
        this.$store.dispatch('changepageNo', pageNo)
        if (this.searchData.provinceId === '请选择省') {
          this.searchData1.provinceId = ''
          this.searchData1.cityId = ''
          this.searchData1.districtId = ''
        }
        if (this.searchData.cityId === '请选择市') {
          this.searchData1.cityId = ''
          this.searchData1.districtId = ''
        }
        if (this.searchData.districtId === '请选择区') {
          this.searchData1.districtId = ''
        }
        if (this.searchData.provinceId !== '') {
          this.searchData1.provinceId = parseInt(this.searchData.provinceId)
        }
        if (this.searchData.cityId !== '') {
          this.searchData1.cityId = parseInt(this.searchData.cityId)
        }
        if (this.searchData.districtId !== '') {
          this.searchData1.districtId = parseInt(this.searchData.districtId)
        }
        this.searchData1.id = this.searchData.id
        this.searchData1.userId = this.searchData.userId
        this.searchData1.memo = this.searchData.memo
        this.searchData1.startDate = this.searchData.startDate
        this.searchData1.endDate = this.searchData.endDate
        let requestData = Object.assign(this.searchData1, this.page)
        this.$xhr('deviceListApi', requestData).success(res => {
          this.devices = res.data
          for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].provinceId === 0) {
              this.devices[i].provinceId = ''
            }
            if (this.devices[i].cityId === 0) {
              this.devices[i].cityId = ''
            }
            if (this.devices[i].districtId === 0) {
              this.devices[i].districtId = ''
            }
            this.devices[i].provinceId = this.devices[i].provinceId + ''
            this.devices[i].cityId = this.devices[i].cityId + ''
            this.devices[i].districtId = this.devices[i].districtId + ''
            this.provinces.forEach(e => {
              if (e.code === this.devices[i].provinceId) {
                this.devices[i].provinceId = e.name
                const pcode = e.code.slice(0, 2)
                this.cities = areas.filter(area => area.level === 2 && area.sheng === pcode)
                this.cities.forEach(e => {
                  if (e.code === this.devices[i].cityId) {
                    this.devices[i].cityId = e.name
                    const pcode = e.code.substr(0, 2)
                    const ccode = e.code.substr(2, 2)
                    this.districts = areas.filter(area => area.level === 3 && area.sheng === pcode && area.di === ccode)
                    this.districts.forEach(e => {
                      if (e.code === this.devices[i].districtId) {
                        this.devices[i].districtId = e.name
                      }
                    })
                  }
                })
              }
            })
            this.devices[i].addressDetail = this.devices[i].provinceId + this.devices[i].cityId + this.devices[i].districtId + this.devices[i].address
            this.devices[i].createTime = this.formatDate(new Date(this.devices[i].createTime)).slice(0, -8)
            if (this.devices[i].replenishmentTime !== 0) {
              this.devices[i].replenishmentTime = this.formatDate(new Date(this.devices[i].replenishmentTime))
            } else {
              this.devices[i].replenishmentTime = ''
            }
            switch (this.devices[i].status) {
              case 4:
                this.devices[i].status = '未投放'
                break
              case 5:
                this.devices[i].status = '未设置商品'
                break
              case 1:
                this.devices[i].status = '正常'
                break
              case 2:
                this.devices[i].status = '补货中'
                break
              case 3:
                this.devices[i].status = '异常'
                break
            }
          }
          this.page.total = res.total
          this.searchData1.sortType = 2
        })
      },
      search(pageNo = 1) {
        console.log(3)
        if (this.searchData.id !== undefined) {
          if (isNaN(Number(this.searchData.id)) === true) {
            this.$message.error('id必须为数字值')
            return false
          }
        }
        if (Number(this.searchData.id) > 9223372036854775807) {
          this.$message.error('id值必须小于等于9223372036854775807')
          return false
        }
        this.page.pageNo = pageNo
        this.$store.dispatch('changepageNo', pageNo)
        /* TODO 商品列表接口 */
        this.$store.dispatch('changepageNo', pageNo)
        /* TODO 商品列表接口 */
        if (this.searchData.provinceId === '请选择省') {
          this.searchData1.provinceId = ''
          this.searchData1.cityId = ''
          this.searchData1.districtId = ''
        }
        if (this.searchData.cityId === '请选择市') {
          this.searchData1.cityId = ''
          this.searchData1.districtId = ''
        }
        if (this.searchData.districtId === '请选择区') {
          this.searchData1.districtId = ''
        }
        if (this.searchData.provinceId !== '') {
          this.searchData1.provinceId = parseInt(this.searchData.provinceId)
        }
        if (this.searchData.cityId !== '') {
          this.searchData1.cityId = parseInt(this.searchData.cityId)
        }
        if (this.searchData.districtId !== '') {
          this.searchData1.districtId = parseInt(this.searchData.districtId)
        }
        this.searchData1.id = this.searchData.id
        this.searchData1.userId = this.searchData.userId
        this.searchData1.memo = this.searchData.memo
        this.searchData1.startDate = this.searchData.startDate
        this.searchData1.endDate = this.searchData.endDate
        console.log(this.searchData1)
        let requestData = Object.assign(this.searchData1, this.page);
        this.$xhr('deviceListApi', requestData).success(res => {
          this.devices = res.data
          for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].provinceId === 0) {
              this.devices[i].provinceId = ''
            }
            if (this.devices[i].cityId === 0) {
              this.devices[i].cityId = ''
            }
            if (this.devices[i].districtId === 0) {
              this.devices[i].districtId = ''
            }
            this.devices[i].provinceId = this.devices[i].provinceId + ''
            this.devices[i].cityId = this.devices[i].cityId + ''
            this.devices[i].districtId = this.devices[i].districtId + ''
            this.provinces.forEach(e => {
              if (e.code === this.devices[i].provinceId) {
                this.devices[i].provinceId = e.name
                const pcode = e.code.slice(0, 2)
                this.cities = areas.filter(area => area.level === 2 && area.sheng === pcode)
                this.cities.forEach(e => {
                  if (e.code === this.devices[i].cityId) {
                    this.devices[i].cityId = e.name
                    const pcode = e.code.substr(0, 2)
                    const ccode = e.code.substr(2, 2)
                    this.districts = areas.filter(area => area.level === 3 && area.sheng === pcode && area.di === ccode)
                    this.districts.forEach(e => {
                      if (e.code === this.devices[i].districtId) {
                        this.devices[i].districtId = e.name
                      }
                    })
                  }
                })
              }
            })
            this.devices[i].addressDetail = this.devices[i].provinceId + this.devices[i].cityId + this.devices[i].districtId + this.devices[i].address
            this.devices[i].createTime = this.formatDate(new Date(this.devices[i].createTime)).slice(0, -8)
            if (this.devices[i].replenishmentTime !== 0) {
              this.devices[i].replenishmentTime = this.formatDate(new Date(this.devices[i].replenishmentTime))
            } else {
              this.devices[i].replenishmentTime = ''
            }
            // 判断货柜状态
            switch (this.devices[i].status) {
              case 4:
                this.devices[i].status = '未投放'
                break
              case 5:
                this.devices[i].status = '未设置商品'
                break
              case 1:
                this.devices[i].status = '正常'
                break
              case 2:
                this.devices[i].status = '补货中'
                break
              case 3:
                this.devices[i].status = '异常'
                break
            }
          }
          this.page.total = res.total
          document.getElementsByClassName('ascending')[0].addEventListener('click', () => {
            this.searchData1.sortCondition = 3
            this.searchData1.sortType = 1
            this.sortChange1(this.$store.state.pageNo)
          })
          document.getElementsByClassName('descending')[0].addEventListener('click', () => {
            this.searchData1.sortCondition = 3
            this.searchData1.sortType = 2
            this.sortChange1(this.$store.state.pageNo)
          })
        })
      },
      changeProvince(code) {
        if (this.searchData.provinceId === '请选择省') {
          this.cities = []
        }
        const pCode = code.slice(0, 2)
        this.cities = areas.filter(area => area.level === 2 && area.sheng === pCode)
        if (!this.searchData.cityId.startsWith(pCode)) {
          this.searchData.cityId = ''
          this.searchData.districtId = ''
        }
        this.districts = []
        this.cities.unshift({ name: '请选择市', code: '请选择市' })
        this.searchData.cityId = ''
        this.searchData.districtId = ''
      },
      changeCity(code) {
        if (this.searchData.cityId === '请选择市') {
          this.districts = []
        }
        if (this.searchData.provinceId === '请选择省') {
          this.cities = []
          this.cities.unshift({ name: '请选择市', code: '请选择市' })
        }
        const pCode = code.substr(0, 2)
        const cCode = code.substr(2, 2)
        this.districts = areas.filter(area => area.level === 3 && area.sheng === pCode && area.di === cCode)
        if (!this.searchData.districtId.startsWith(code.substr(0, 4))) {
          this.searchData.districtId = ''
        }
        this.districts.unshift({ name: '请选择区', code: '请选择区' })
        this.searchData.districtId = ''
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
  #product {
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

  .new {
    margin-top: 5px;
    /* float: right; */
    margin-left: 5px;
  }

  .form {
    width: 100%;
  }

  .user-input {
    width: 180px;
  }

  .address-select {
    width: 120px;
  }

  .btn {
    width: 160px;
  }

  .dialog {
    margin: 0 auto;
    width: 800px;
  }

  .div {
    margin-top: 30px;
  }

  .line {
    text-decoration: underline;
  }
</style>
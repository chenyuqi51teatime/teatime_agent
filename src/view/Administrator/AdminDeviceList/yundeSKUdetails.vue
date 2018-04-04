<!-- 运营商SKU列表 -->
<template>
  <div id="template">
    <div class="common">
      <span class="span">商品SKU信息</span>
    </div>
    <el-table :data="temData.skus" border style="width: 100%;">
      <el-table-column label="商品图片"  align="center" >
        <template slot-scope="scope">
          <img v-if="temData.skus[scope.$index].image !== image" class="image" :src="image + temData.skus[scope.$index].image + '?x-oss-process=image/resize,h_40'">
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="property" label="属性" align="center"></el-table-column>
      <el-table-column prop="weight" label="重量(g)" align="center"></el-table-column>
      <el-table-column prop="commendedPrice" label="推荐价格(元)" align="center"></el-table-column>
      <el-table-column prop="price" label="销售价格(元)" align="center"></el-table-column>
      <el-table-column prop="discount" label="折扣(%)" align="center"></el-table-column>
      <el-table-column prop="size" label="剩余数量" align="center"></el-table-column>
      <el-table-column prop="maxSize" label="最大库存（建议）" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.stop.native.prevent="rowClick(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click.stop.native.prevent="deleteTem(scope.$index, scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="new" @click="create" type="danger" >添加SKU</el-button>
    <el-button class="new" @click="createTem" type="danger" >更换模板</el-button>
    <div class="btn">
      <el-button @click="save" type="danger" >保存</el-button>
      <el-button @click="getcomfirm" type="danger" >保存并存为模板</el-button>
      <el-button @click="back">返回</el-button>
    </div>

    </el-form>
    <!-- todo 检索规则  样式 -->
    <el-dialog title="添加SKU" :visible.sync="dialog">
      <el-form :model="form"  label-width="80px">
        <el-form-item label="商品分类">
          <el-select class="short-select" v-model="form.one" @change="changeOne" placeholder="请选择一级分类">
            <el-option v-for="q in currentone" :label="q.label" :value="q.id" :key="q.id"></el-option>
          </el-select>
          <el-select class="short-select" v-model="form.two" @change="changeTwo" placeholder="请选择二级分类">
            <el-option v-for="w in currenttwo" :label="w.label" :value="w.id" :key="w.id"></el-option>
          </el-select>
          <el-select  class="short-select" v-model="form.categoryId" @change="changeThree" placeholder="请选择三级分类">
            <el-option v-for="e in currentthree" :label="e.label" :value="e.id" :key="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select class="diaInput" v-model="form.brandId" placeholder="请选择品牌">
            <el-option v-for="r in currentbrand" :label="r.name" :value="r.id" :key="r.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input class="diaInput" v-model="form.name"></el-input>
          <el-button @click="getProducts" type="danger" >检索</el-button>
        </el-form-item>
      </el-form>
      <el-table class="short-select" ref="multipleTable" :data="formList" border tooltip-effect="dark" style="width: 100%" :show-header="header">
        <el-table-column type="expand">
          <template slot-scope="scope0">
            <el-table :data="scope0.row.skus" style="width: 100%" :show-header="header" inline class="demo-table-expand" >
              <el-table-column prop="unit" label="图片"  align="center">
                <template slot-scope="scope">
                  <img v-if="scope0.row.skus[scope.$index].image" class="image" :src="image + scope0.row.skus[scope.$index].image">
                </template>
              </el-table-column>
              <el-table-column prop="skuName" label="SKU名称"  align="center" ></el-table-column>
              <el-table-column prop="weight" label="重量"  align="center"></el-table-column>
              <el-table-column prop="price" label="价格"  align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button class='shop' @click.stop.native.prevent="sure(scope.$index, scope.row, scope0.row)" type="text" size="small">添加到列表</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="name" align="left">
        </el-table-column>
      </el-table>
      <el-pagination class="page" v-show="page.totalPage >= 1"
                     layout="total, prev, pager, next"
                     :current-page.sync="page.pageNo"
                     :page-size="page.pageSize"
                     :total="page.total"
                     @current-change="getProducts"
      />
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="notSure">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="change">
        <el-form-item label="销售价格:" :label-width="formLabelWidth">
          <el-input v-model="change.jia" auto-complete="off"><template slot="append" :maxlength="25">元</template></el-input>
        </el-form-item>
        <el-form-item label="折扣:" :label-width="formLabelWidth">
          <el-input v-model="change.zhe" auto-complete="off" :maxlength="3"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item  :label-width="formLabelWidth">
          <span>*注：原价100元的商品，输入90%，现价就是90元；输入1%，现价就是1元</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="danger" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 模板名弹框 -->
    <el-dialog title="添加模板" :visible.sync="bombBox">
      <el-form :model="temData" ref="taskForm" :rules="taskRules" label-width="100px">
        <el-form-item label="模板名" prop="name">
          <el-input v-model="temData.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="danger" @click="comfirm('taskForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 更换模板 -->
    <el-dialog title="更换模板" :visible.sync="temBox">
      <el-table :data="templateList" border style="width: 100%;">
        <el-table-column prop="name" label="模板名"  align="center" ></el-table-column>
        <el-table-column label="选择模板" align="center">
          <template slot-scope="scope">
            <el-button v-if="templateList[scope.$index].homie === true" type="text"  size="small" @click.stop.native.prevent="select(scope.$index, scope.row)" style="color: red">已选择</el-button>
            <el-button v-if="templateList[scope.$index].homie === false" @click.stop.native.prevent="select(scope.$index, scope.row)" type="text" size="small" style="color: green">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="danger" @click="addTemTo('taskForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {picAddress} from '@/config.json'
  import {mapState, mapActions} from 'vuex'
  export default {
    data () {
      return {
        tid: '',
        templateList: [],      // 模板
        only: true,
        bombBox: false,
        formLabelWidth: '100px',
        temBox: false,
        total: [],
        bar: [],
        rowId: '',             // 本地某一行ID
        header: true,
        image: `${picAddress}`,
        dialogFormVisible: false,
        dialog: false,
        form: {
          one: '',
          two: '',
          categoryId: '',
          brandId: '',
          name: ''
        },
        change: {
          jia: '',
          shu: '',
          zhe: ''
        },
        currentone: [],
        currenttwo: [],
        currentthree: [],
        currentbrand: [],
        formList: [{
          name: '可乐',
          skus: [{
            size: '13',
            price: '12',
            skuId: 1,
            property: ''
          }]
        }],
        templateStr: [],
        listbar: [],
        deleteNumbers: [],
        temData: {
          name: '',
          skus: []
        },
        page: {
          totalPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        taskRules: {
          name: { required: true, message: '请输入模板名称', trigger: 'blur' }
        }
      }
    },
    computed: {
      ...mapState(['pageNo', 'categoryList'])
    },
    created () {
      this.init()
      this.search()
      this.getProducts()
      /*  取到那棵大树 */
      this.getCategoryList().then(() => {
        this.currentone = this.categoryList
        this.currentone.unshift({label: '全部', id: ''})
      })
      this.changeBrand()
    },
    mounted () {
      document.getElementsByClassName('el-dialog__headerbtn')[0].addEventListener('click', () => {
        this.form = {
          one: '',
          two: '',
          categoryId: '',
          brandId: '',
          name: ''
        }
        this.dialog = false
        this.secondLevel = false
        this.threeLevel = false
        this.templateStr = []
        this.bar = []
        this.getProducts()
      })
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'deviceList') {
      } else {
        localStorage.removeItem('skulistStr')
      }
      next()
    },
    methods: {
      ...mapActions(['changepageNo', 'getCategoryList']),
      changeOne (num) {
        for (var a = 0; a < this.currentone.length; a++) {
          if (this.currentone[a].id === num) {
            this.currenttwo = this.currentone[a].children
          }
        }
        this.form.two = ''
        this.form.categoryId = ''
        this.currentthree = []
      },
      changeTwo (num) {
        for (var a = 0; a < this.currenttwo.length; a++) {
          if (this.currenttwo[a].id === num) {
            this.currentthree = this.currenttwo[a].children
          }
        }
        this.form.categoryId = ''
      },
      changeThree (num) {
        this.form.type = num
      },
      changeBrand () {
        /* todo 品牌的获取 此处可能会传分类信息 */
        this.$xhr('brandList', {}).success(res => {
          this.currentbrand = res.datas
          this.currentbrand.unshift({name: '全部', id: ''})
        })
      },
      getProducts () {
        if (this.form.one !== '' && this.form.categoryId === '') {
          this.$message.error('三级分类不能为空!')
          return false
        }
        if (this.form.one === '' && this.form.categoryId === '请选择') {
          this.form.categoryId = ''
        }
        let requestData = Object.assign(this.form, this.page)
        this.$xhr('SKUapi', requestData).success(res => {
          this.formList = res.datas
          this.formList.forEach(e => {
            e.skus.forEach(x => {
              x.skuName = `${e.name} ${x.property}`
            })
          })
          this.page.total = res.total
        })
      },
      init () {
        /* 1.获取页面表格信息，并存入本地 */
        this.$get('deviceDetaiSKUlApi', {
          params: this.$route.params.did
        }).success(res => {
          this.temData.skus = res.data
          localStorage.setItem('skulistStr', JSON.stringify(res.data))
//          this.temData.skus = JSON.parse(localStorage.getItem('skulistStr'))
        })
      },
      create () {
        /* 打开添加SKU弹框 */
        this.dialog = true
      },
      createTem () {
        /* 打开更换模板弹框 */
        if (this.temData.skus.length > 0) {
          this.$alert('请清空SKU列表，再进行更换模板操作!')
        } else {
          this.temBox = true
        }
      },
      save () {
        /* 保存货柜SKU */
        this.$xhr('saveDeviceSKU', {
          skus: this.temData.skus,
          vendorId: this.$route.params.did
        }).success(res => {
          this.$message('更新货柜上SKU成功!')
          this.init()
        }).error(e => {
          this.$message.error('更新货柜上SKU失败!')
          return false
        })
      },
      getcomfirm () {
        /* 打开保存并存为模板弹框 */
        this.bombBox = true
      },
      cancel () {
        /* 关闭  保存并存为模板弹框、编辑弹框、更换模板 */
        this.dialogFormVisible = false
        this.bombBox = false
        this.temBox = false
      },
      notSure () {
        /* 关闭SKU列表弹框 */
        this.form = {
          one: '',
          two: '',
          categoryId: '',
          brandId: '',
          name: ''
        }
        this.dialog = false
        this.secondLevel = false
        this.threeLevel = false
        this.templateStr = []
        this.getProducts()
      },
      sure (index, row, row0) {
        /* 添加一条SKU */
        /*  如果本地存储有，就不能添加重复skuId的 新添加的要存到2个地方，一个是本地有的全部，一个是新添加的 */
        if (localStorage.skulistStr !== '[]') {
          this.templateStr = JSON.parse(localStorage.getItem('skulistStr'))    // 把本地存储的变成数组
          this.templateStr.forEach(s => {
            this.bar.push(s.skuId)
          })
          if (this.bar.indexOf(row.skuId) >= 0) {
            this.$message.error('列表中已有这条SKU!')
            return false
          } else {
            row.productName = `${row0.name}`
            row.id = ''
            this.templateStr.push(row)
          }
          localStorage.setItem('skulistStr', JSON.stringify(this.templateStr))      //  再把它存到本地存储中
        } else {
          row.productName = `${row0.name}`
          row.id = ''
          localStorage.setItem('skulistStr', JSON.stringify([row]))
        }
        this.templateStr = []
        this.temData.skus = JSON.parse(localStorage.getItem('skulistStr'))
      },
      deleteTem (num) {
        /*  删除本地存储中那条数据并刷新列表 */
        this.templateStr = JSON.parse(localStorage.skulistStr)
        this.templateStr.splice(num, 1)
        localStorage.skulistStr = JSON.stringify(this.templateStr)
        this.temData.skus = JSON.parse(localStorage.getItem('skulistStr'))
      },
      comfirm () {
        /* 保存并存为模板 */
        if (this.temData.name === '' || this.temData.name.trim() === '') {
          this.$message.error('请填写模板名!')
          return
        }
        if (this.temData.name.length > 255) {
          this.$message.error('模板名输入过长!')
          return false
        }
        this.$xhr('comTemplate', this.temData).success(res => {
          this.$message('保存模板成功!')
          this.bombBox = false
        }).error(res => {
          this.$message.error('保存模板失败!')
        })
      },
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
      confirm () {
        if (this.change.jia < 0) {
          this.$message.error('价格不能为负数!')
          return false
        }
        if (isNaN(this.change.jia)) {
          this.$message.error('价格必须为数值!')
          return false
        }
        if (this.change.zhe < 0) {
          this.$message.error('折扣不能为负数!')
          return false
        }
        if (this.change.zhe > 100) {
          this.$message.error('折扣不能大于100!')
          return false
        }
        if (this.change.zhe % 1 !== 0) {
          this.$message.error('折扣必须为整数!')
          return false
        }
        this.temData.skus.forEach(e => {
          if (e.skuId === this.rowId) {
            e.price = this.change.jia
            e.discount = this.change.zhe
          }
        })
        localStorage.setItem('skulistStr', JSON.stringify(this.temData.skus))
        this.temData.skus = JSON.parse(localStorage.getItem('skulistStr'))
        this.dialogFormVisible = false
      },
      rowClick (num, row) {
        this.dialogFormVisible = true
        this.rowId = row.skuId
        this.change.jia = row.price
        this.change.zhe = row.discount
      },
      search (pageNum = 1) {
        /* 模板列表 */
        this.page.pageNum = pageNum
        this.$xhr('templateListApi', {}).success(res => {
          this.templateList = res.datas
          this.templateList.forEach(e => {
            e.homie = false
          })
          this.page.total = res.total
        })
      },
      select (num) {
        /* todo 选择    这里参数还要传上一页选中的数组 */
        this.tid = this.templateList[num].id
        this.$xhr('templateListApi', {}).success(res => {
          this.templateList = res.datas
          this.templateList.forEach(e => {
            if (e.id !== this.templateList[num].id) {
              e.homie = false
            } else {
              this.templateList[num].homie = true
            }
          })
          this.page.total = res.total
        })
      },
      addTemTo () {
        if (this.tid === '') {
          this.$message.error('请选择模板!')
        }
        this.$xhr('changeTem', {
          templateId: this.tid
        }).success(res => {
          /* 选择了模板 返回模板中sku  把sku赋值给本地 */
          this.temData.skus = res.data
          localStorage.setItem('skulistStr', JSON.stringify(res.data))
          this.$message('更换成功!')
          this.temBox = false
        }).error(err => {
          this.$message.error(err.message)
        })
      }
    }
  }
</script>

<style scoped>
  #template {
    width: 100%;
    margin-top: 20px;
  }
  .page {
    float: left;
  }
  .new {
    float: right;
    margin-top: 5px;
    margin-left: 10px;
  }
  .btn {
    margin-top: 50px;
  }
  .cell-edit-input .el-input, .el-input__inner {
    width:100px;
  }
  .cell-icon{
    cursor:pointer;
    color:black;
  }
  .diaInput {
    width:260px;
    float: left;
    margin-left: 5px;
  }
  .short-select {
    float: left;
    margin-left: 5px;
    margin-top: 10px;
  }
  .image {
    display: block;
    height: 40px;
    min-width: 40px;
    margin-left: 40px;
  }
  span {
    color:red;
  }
  .common {
    float: left;
    padding-bottom: 5px;
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
  span.span {
    margin-left: 5px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
</style>

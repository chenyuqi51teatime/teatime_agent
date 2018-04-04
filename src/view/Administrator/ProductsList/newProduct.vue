<template>
  <div id="newProduct">
    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="rules" ref="form">
      <el-form-item label="商品名称" prop="name" class="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商品副标题" class="subName">
        <el-input v-model="form.subName"></el-input>
      </el-form-item>
      <el-form-item class="img" label="商品图" prop="image">
        <el-upload class="avatar-uploader" name="photo" :action="imageUrl" :show-file-list="false" :before-upload="beforeAvatarUpload"
          :on-success="productSuccess">
          <img v-if="this.form.image" :src="image + this.form.image" class="avatar">
          <i v-else class="el-icon-plus  avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class="proper" label="">
        <p class="imgsize">*建议上传图片长宽为78px*78px 大小不超过1M 格式为jpg,png </p>
      </el-form-item>
      <el-form-item label="商品分类" class="select" required>
        <el-select class="short-select" v-model="form.one" @change="changeOne" filterable placeholder="请选择分类">
          <el-option v-for="p in currentone" :label="p.label" :value="p.id" :key="p.id"></el-option>
        </el-select>
        <el-select v-if="secondLevel === true" class="short-select" v-model="form.two" @change="changeTwo" filterable placeholder="请选择分类">
          <el-option v-for="p in currenttwo" :label="p.label" :value="p.id" :key="p.id"></el-option>
        </el-select>
        <el-select v-if="threeLevel === true" class="short-select" v-model="form.categoryId" @change="changeThree" filterable placeholder="请选择分类">
          <el-option v-for="p in currentthree" :label="p.label" :value="p.id" :key="p.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品品牌" required>
        <el-select class="short-select" v-model="form.brandId" filterable placeholder="请选择品牌">
          <el-option v-for="p in currentbrand" :label="p.name" :value="p.id" :key="p.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品简介" prop="memo" class="memo">
        <el-input type="textarea" v-model="form.memo" placeholder="请输入内容" autosize></el-input>
      </el-form-item>
      <el-form :label-position="labelPosition" :model="sku" :inline="true" ref="sku" :rules="skuRules">
        <el-button type="warning" @click.prevent="add" id="addsku">添加SKU</el-button>
        <el-table :data="tableData" border style="width: 100%" align="center">
          <el-table-column label="图片" prop="" image class="avatar-s">
            <template slot-scope="scope">
              <img v-if="tableData[scope.$index].image" :src="skuImage + tableData[scope.$index].image" class="avatar-s" />
            </template>
          </el-table-column>
          <el-table-column prop="property" label="属性"></el-table-column>
          <el-table-column prop="price" label="价格(元)"></el-table-column>
          <el-table-column prop="weight" label="重量(g)"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editSkus(scope.$index, scope.row )">修改</el-button>
              <el-button type="text" @click="removeSku(scope.$index, scope.row )">下架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="create">
        <el-button type="warning" @click="submit('form')">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>

    <el-dialog title="添加SKU" :visible.sync="addSku">
      <el-form :model="sku" :inline="true" ref="sku" :rules="skuRules" labelWidth="80px">
        <el-form-item prop="image" class="skuimg">
          <el-upload class="avatar-uploader" name="photo" :action="imageUrl" :show-file-list="false" :on-success="skuSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="this.sku.image" :src="skuImage + this.sku.image" class="avatar-s">
            <i v-else class="el-icon-plus  avatar-uploader-icon"></i>
            <p class="imgsize">*建议上传图片长宽为78px*78px 大小不超过1M 格式为jpg,png. </p>
          </el-upload>
        </el-form-item>
        <el-form-item prop="property" class="property" label="属性">
          <el-input placeholder="请输入属性" v-model="sku.property"></el-input>
        </el-form-item>
        <el-form-item prop="price" class="price" label="价格(元)">
          <el-input placeholder="请输入价格(元)" v-model.number="sku.price"></el-input>
        </el-form-item>
        <el-form-item prop="weight" class="weight" label="重量(g）">
          <el-input placeholder="请输入重量(g)" v-model.number="sku.weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.stop.native.prevent="newSku('sku')">创 建</el-button>
        <el-button @click="cancelSku">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改SKU" :visible.sync="editSku">
      <el-form :model="skuEdit" :inline="true" ref="skuEdit" :rules="skuRules" labelWidth="100px">
        <el-form-item prop="image" class="skuimg">
          <el-upload class="avatar-uploader" name="photo" :action="imageUrl" :show-file-list="false" :on-success="skuEditSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="this.skuEdit.image" :src="skuImage + this.skuEdit.image" class="avatar-s">
            <i v-else class="el-icon-plus  avatar-uploader-icon"></i>
          </el-upload>
          <p class="imgsize">*建议上传图片长宽为78px*78px 大小不超过1M 格式为jpg,png </p>
        </el-form-item>
        <el-form-item prop="property" class="property" label="属性">
          <el-input placeholder="请输入属性" v-model="skuEdit.property"></el-input>
        </el-form-item>
        <el-form-item prop="price" class="price" label="价格(元)">
          <el-input placeholder="请输入价格(元)" v-model.number="skuEdit.price"></el-input>
        </el-form-item>
        <el-form-item prop="weight" class="weight" label="重量（g）">
          <el-input placeholder="请输入重量(g)" v-model.number="skuEdit.weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.stop.native.prevent="saveSku('skuEdit')">保 存</el-button>
        <el-button @click="cancelSkuEdit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { serverAddress, picAddress } from '@/config.json'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'newProduct',
    data() {
      return {
        tableData: [],
        sku: {
          weight: '',
          property: '',
          price: '',
          image: ''
        },
        skuEdit: {
          weight: '',
          property: '',
          price: '',
          image: ''
        },
        editSku: false,
        addSku: false,
        secondLevel: false,
        threeLevel: false,
        currentone: [1, 2, 3],
        currenttwo: [1, 2, 3],
        currentthree: [1, 2, 3],
        currentbrand: [],
        obj1: [],
        obj2: [],
        obj3: [],
        labelPosition: '',
        image: `${picAddress}`,
        skuImage: `${picAddress}`,
        imageUrl: `${serverAddress}/picture/upload`,
        form: {
          name: '',
          subName: '',
          brandId: '',
          image: '',
          memo: '',
          one: '',
          two: '',
          categoryId: '',
          skus: []
        },
        rules: {
          name: { required: true, message: '请输入商品名称', trigger: 'blur' },
          image: { required: true, message: '请上传图片', trigger: 'blur' }
        },
        skuRules: {
          weight: { type: 'number', required: true, message: '输入重量', trigger: 'blur' },
          property: { required: true, message: '输入属性', trigger: 'blur' },
          price: { type: 'number', required: true, message: '输入价格', trigger: 'blur' },
          image: { required: true, message: '请上传图片', trigger: 'blur' }
        }
      }
    },
    computed: {
      ...mapState(['pageNo', 'categoryList'])
    },
    created() {
      console.log(serverAddress)
      this.search()
      this.$xhr('brandList', {}).success(res => {
        this.currentbrand = res.datas
      })
      this.getCategoryList().then(() => {
        this.currentone = this.categoryList
        this.filters()
      })
    },
    methods: {
      ...mapActions(['changepageNo', 'getCategoryList']),
      editSkus(num) {
        let editData = JSON.parse(localStorage.getItem('skuList'))
        this.skuEdit = editData[num]
        this.index = num
        this.editSku = true
      },
      cancelSkuEdit() {
        this.editSku = false
      },
      saveSku(formName) {
        if (this.skuEdit.property.trim() === '') {
          this.$message.error('SKU属性不能为空')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let editData = JSON.parse(localStorage.getItem('skuList'))
            editData[this.index] = this.skuEdit
            localStorage.setItem('skuList', JSON.stringify(editData))
            let editDataT = JSON.parse(localStorage.getItem('skuList'))
            this.tableData = editDataT
            this.editSku = false
          } else {
            return false
          }
        })
      },
      skuEditSuccess(res, file) {
        if (res.success) {
          // 用于本页显示 和 上传
          this.skuEdit.image = res.pictureUrl
        } else { }
      },
      search() {
        if (!localStorage.getItem('skuList')) {
          localStorage.setItem('skuList', [])
        } else {
          this.tableData = JSON.parse(localStorage.getItem('skuList'))
        }
      },
      add(formName) {
        this.addSku = true
      },
      newSku(formName) {
        if (this.sku.property.trim() === '') {
          this.$message.error('SKU属性不能为空')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tableData.push(this.sku)
            localStorage.setItem('skuList', JSON.stringify(this.tableData))
            this.sku = {}
            this.addSku = false
          } else {
            return false
          }
        })
      },
      cancelSku() {
        this.sku = {}
        this.addSku = false
      },
      removeSku(num) {
         this.$confirm('确定下架？','', {
          confirmButtonText: '确定',
          // cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.tableData = JSON.parse(localStorage.getItem('skuList'))
          this.tableData.splice(num, 1)
          localStorage.setItem('skuList', JSON.stringify(this.tableData))
          this.search()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


        // this.$confirm('确定删除？').ok(() => {
        //   this.tableData = JSON.parse(localStorage.getItem('skuList'))
        //   this.tableData.splice(num, 1)
        //   localStorage.setItem('skuList', JSON.stringify(this.tableData))
        //   this.search()
        // })
      },
      skuSuccess(res, file) {
        console.log(res)
        if (res.success) {

          // 用于本页显示 和 上传
          this.sku.image = res.pictureUrl
        } else { }
      },
      changeOne(num) {
        for (var a = 0; a < this.currentone.length; a++) {
          if (this.currentone[a].id === num) {
            this.currenttwo = this.currentone[a].children
            this.form.two = ''
            this.form.categoryId = ''
            this.currentthree = []
          }
        }
        this.able = true
        this.secondLevel = true
      },
      changeTwo(num) {
        for (var a = 0; a < this.obj2.length; a++) {
          if (this.obj2[a].id === num) {
            this.currentthree = this.obj2[a].children
            this.form.categoryId = ''
          }
        }
        this.threeLevel = true
      },
      changeThree(num) {
        this.form.type = num
        this.able = false
      },
      filters() {
        for (var a = 0; a < this.categoryList.length; a++) {
          var one = this.categoryList[a]
          this.obj1.push(one)
          if (one.children) {
            for (var b = 0; b < one.children.length; b++) {
              var two = one.children[b]
              this.obj2.push(two)
              if (two.children) {
                for (var c = 0; c < two.children.length; c++) {
                  var three = two.children[c]
                  this.obj3.push(three)
                }
              }
            }
          }
        }
      },
      submit(formName) {
        if (this.form.brandId === '') {
          this.$message.error('请选择品牌')
          return false
        }
        if (this.form.categoryId === '') {
          this.$message.error('分类必须选择至第三级')
          return false
        }
        if (this.tableData.length === 0) {
          this.$message.error('请添加SKU')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.skus = this.tableData
            this.$xhr('newProduct', this.form).success(res => {
              this.$message('创建成功!')
              localStorage.removeItem('skuList')
              this.$router.back()
            }).error(res => {
              this.$message.error('创建失败!')
            })
          } else {
            return false
          }
        })
      },
      beforeAvatarUpload(file) {
        /* 上传限制 */
        // console.log(file)
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!')
          return false
        }
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
        } else {
          this.$message.error('图片格式必须为jpg/png')
          return false
        }
      },
      cancel() {
        localStorage.removeItem('skuList')
        this.$router.push('/container/ProductsList')
      },
      productSuccess(res, file) {
        if (res.success) {
          // 用于本页显示 和 上传
          this.form.image = res.pictureUrl
          console.log(res.pictureUrl)
        } else { }
      }
    }
  }

</script>
<style scoped>
  #newProduct {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }

  .name,
  .subName {
    /* float: left; */
  }

  .subName {
    margin-left: 1%;
  }

  .img {
    clear: left;
  }

  .imgsize {
    color: red;
    font-size: 10px;
  }

  .short-select {
    /* float: left; */
  }

  .avatar-uploader {
    /* float: left; */
    display: inline-block
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }

  .avatar {
    min-width: 78px;
    max-width: 78px;
    height: 78px;
    display: block;
  }

  .avatar-s {
    min-width: 78px;
    max-width: 78px;
    height: 78px;
    display: block;
  }

  #addsku {
    float: left;
    margin-left: 3%;
    margin-bottom: 1%;
  }

  .weight,
  .property,
  .price {
    display: inline-block;
    float: left;
  }

  .proper {
    display: flex;
  }

  .skuimg {
    padding: 0;
    float: left;
  }

  .dialog-footer {
     text-align: center;
    margin-top: 20%;
  }

  .create{
    padding: 10px 0;
    text-align: center;
  }
</style>
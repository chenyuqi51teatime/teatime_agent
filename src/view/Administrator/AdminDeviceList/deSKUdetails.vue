<!-- 管理员货柜SKU-->
<template>
  <div id="user">
    <div class="common">
      <div class="sku"></div><span>商品SKU信息</span>
    </div>
    <el-table scope="scope" :data="SKUData" border style="width: 100%">
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <img class="image" :src="imagex + SKUData[scope.$index].image + '?x-oss-process=image/resize,h_40'">
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="property" label="属性" align="center"></el-table-column>
      <el-table-column prop="weight" label="重量(g)" align="center"></el-table-column>
      <el-table-column prop="recommendedPrice" label="推荐价格(元)" align="center"></el-table-column>
      <el-table-column prop="price" label="销售价格(元)" align="center"></el-table-column>
      <el-table-column prop="size" label="剩余数量" align="center"></el-table-column>
      <el-table-column prop="maxSize" label="最大库存（建议）" align="center"></el-table-column>
    </el-table>
    <el-button class="sure" @click="back">返回</el-button>
  </div>
</template>

<script>
  import { picAddress } from '@/config.json'
  export default {
    name: 'deSKUdetails',
    data() {
      return {
        imagex: `${picAddress}`,
        SKUData: [{
          image: ''
        }]
      }
    },
    created() {
      this.getProducts()
    },
    methods: {
      back() {
        this.$router.push('/container/AdminDeviceList')
      },
      getProducts() {
        this.$get('deviceDetaiSKUlApi', {
          params: this.$route.params.did
        }).success(res => {
          this.SKUData = res.data
        })
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

  span {
    margin-left: 5px;
    font-size: 16px;
    font-weight: bold;
  }

  .image {
    display: block;
    height: 40px;
    min-width: 40px;
    margin-left: 30%;
  }

  .sure {
    margin-top: 50px;
  }
</style>
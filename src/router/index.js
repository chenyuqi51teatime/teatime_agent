import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 登录页
import login from '@/view/login'
// 首页
import home from '@/view/Home/home'
// container
import container from '@/view/container'

// 管理员
// 用户信息
// import userDetail from '@/view/userDetail'
// 用户信息编辑
// import userEdit from '@/view/userEdit'
//用户中心 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import addminList from '@/view/Administrator/user/addminList'
// 新建管理员
import addAddmin from '@/view/Administrator/user/addAddmin'
// 新建运营商
import addUser from '@/view/Administrator/user/addUser'
// 用户详情
import addminDetail from '@/view/Administrator/user/addminDetail'
// 用户信息编辑
import userEditt from '@/view/Administrator/user/userEdit'
// 商品列表 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import ProductsList from '@/view/Administrator/ProductsList/ProductsList'
// 添加商品
import newProduct from '@/view/Administrator/ProductsList/newProduct'
// 修改
import productEdit from '@/view/Administrator/ProductsList/productEdit'
// 品牌管理 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import BrandList from '@/view/Administrator/BrandList/BrandList'
// 添加品牌
import addBrand from '@/view/Administrator/BrandList/addBrand'
// 修改
import editBrand from '@/view/Administrator/BrandList/editBrand'
// 分类管理 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import ClassificationList from '@/view/Administrator/ClassificationList/ClassificationList'
// 设备列表 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import AdminDeviceList from '@/view/Administrator/AdminDeviceList/AdminDeviceList'
// 货柜详情 tab切换
import deviceDe from '@/view/Administrator/AdminDeviceList/deviceDe'
// 货柜详情
import deDetails from '@/view/Administrator/AdminDeviceList/deDetails'
// 货柜SKU信息
import deSKUdetails from '@/view/Administrator/AdminDeviceList/deSKUdetails'
// 货柜销售订单
import deSale from '@/view/Administrator/AdminDeviceList/deSale'
// 货柜补货订单
import deReplenishment from '@/view/Administrator/AdminDeviceList/deReplenishment'
// 货柜状态日志
import deState from '@/view/Administrator/AdminDeviceList/deState'
import yundeSKUdetails from '@/view/Administrator/AdminDeviceList/yundeSKUdetails'
import deChange from '@/view/Administrator/AdminDeviceList/deChange'
// 传感器历史
import sensorList from '@/view/Administrator/AdminDeviceList/sensorList'
// 传感器托盘
import sensorHistory from '@/view/Administrator/AdminDeviceList/sensorHistory'
// 销售订单 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import saleOrders from '@/view/Administrator/saleOrders/saleOrders'
// 查看订单
import saleDetail from '@/view/Administrator/saleOrders/saleDetail'
// 补货订单 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import replenishment from '@/view/Administrator/replenishment/replenishment'
// 订单详情
import repDetail from '@/view/Administrator/replenishment/repDetail'
// 审核订单 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import DetailsOrder from '@/view/Administrator/DetailsOrder/DetailsOrder'
// 审核订单 - 审核
import AuditOrder from '@/view/Administrator/DetailsOrder/AuditOrder'




// 代理商
// 个人信息
import Personal from '@/view/User/Personal'
// 修改密码
import Password from '@/view/User/Password'
//用户中心 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import distributionList from '@/view/ContainerManagement/distributionList/distributionList'
// 补货员信息编辑
import EditReplenisher from '@/view/ContainerManagement/distributionList/EditReplenisher'
// 货柜绑定 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import ContainerBinding from '@/view/ContainerManagement/ContainerBinding/ContainerBinding'
// 绑定设备
import BindingEquipment from '@/view/ContainerManagement/ContainerBinding/BindingEquipment'
// 编辑
import deviceDetail from '@/view/ContainerManagement/ContainerBinding/deviceDetail'
// 查看
import deviceDetailCheck from '@/view/ContainerManagement/ContainerBinding/deviceDetailCheck'
// 商品模板 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import GoodsTemplate from '@/view/ContainerManagement/GoodsTemplate/GoodsTemplate'
// 新增模板
import NewTemplate from '@/view/ContainerManagement/GoodsTemplate/NewTemplate'
// 编辑页面
import editor from '@/view/ContainerManagement/GoodsTemplate/editor'
// 查看模板
import CheckContainerInfor from '@/view/ContainerManagement/GoodsTemplate/CheckContainerInfor'
// 货柜商品 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import ContainerGoods from '@/view/ContainerManagement/ContainerGoods/ContainerGoods'
// 商品详情
import GoodsDetails from '@/view/ContainerManagement/ContainerGoods/GoodsDetails'
// 库存状况 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import InventoryStatus from '@/view/ContainerManagement/InventoryStatus/InventoryStatus'
// 货道详情
import ArrivalGoodsdetails from '@/view/ContainerManagement/InventoryStatus/ArrivalGoodsdetails'
// 货到日志
import ContainerLog from '@/view/ContainerManagement/InventoryStatus/ContainerLog'
// 补货规则 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import ReplenishmentRules from '@/view/ContainerManagement/ReplenishmentRules/ReplenishmentRules'
// 补货单管理 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import repMentOrdManagement from '@/view/ContainerManagement/ReplenishmentOrderManagement/repMentOrdManagement'
// 打印页
import print from '@/view/ContainerManagement/ReplenishmentOrderManagement/print'
// 补货单_查看
import RepairInvoiceCheck from '@/view/ContainerManagement/ReplenishmentOrderManagement/RepairInvoiceCheck'
// 营业汇总报表 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import BusinessSum from '@/view/ContainerManagement/BusinessSum/BusinessSum'
// 付款类型统计 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import PaymentType from '@/view/ContainerManagement/PaymentType/PaymentType'
// 订单统计报表 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import OrderStatistics from '@/view/ContainerManagement/OrderStatistics/OrderStatistics'
// 商品销售汇总 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import CommoditySales from '@/view/ContainerManagement/CommoditySales/CommoditySales'
// 商品分类统计 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import GoodsClassification from '@/view/ContainerManagement/GoodsClassification/GoodsClassification'
// 商品销售排行 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import MerSalesRanking from '@/view/ContainerManagement/MerSalesRanking/MerSalesRanking'
// 会员统计表 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import MemberStatistics from '@/view/ContainerManagement/MemberStatistics/MemberStatistics'
// 充值消费明细 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
import statement from '@/view/ContainerManagement/statement/statement'

let router = new Router({
  // mode:'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      alias: '/'
    },
    {
      path: '/',
      name: 'container',
      component: container,
      children: [
        // 管理员

        // // 用户信息
        // {
        //   path: '/container/userDetail/:did',
        //   name: 'userDetail',
        //   component: userDetail,
        // },
        // // 用户信息编辑
        // {
        //   path: '/container/userEdit/:did',
        //   name: 'userEdit',
        //   component: userEdit,

        // },
        // 商品管理
        // 商品列表```````````````````````````````````````````````````````````````
        {
          path: '/container/ProductsList',
          name: 'ProductsList',
          component: ProductsList,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 添加商品
        {
          path: '/container/newProduct',
          name: 'newProduct',
          component: newProduct,
        },
        // 修改
        {
          path: '/container/productEdit/:pid',
          name: 'productEdit',
          component: productEdit,
        },
        // 品牌管理```````````````````````````````````````````````````````````````
        {
          path: '/container/BrandList',
          name: 'BrandList',
          component: BrandList,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 添加品牌
        {
          path: '/container/addBrand',
          name: 'addBrand',
          component: addBrand,
        },
        // 修改
        {
          path: '/container/editBrand/:bid',
          name: 'editBrand',
          component: editBrand,
        },
        // 分类管理```````````````````````````````````````````````````````````````
        {
          path: '/container/ClassificationList',
          name: 'ClassificationList',
          component: ClassificationList,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 设备管理
        // 设备列表```````````````````````````````````````````````````````````````
        {
          path: '/container/AdminDeviceList',
          name: 'AdminDeviceList',
          component: AdminDeviceList,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 货柜详情 tab切换
        {
          path: '/container/deviceDe1/:did/',                      //  管理员设备
          name: 'deviceDe1',
          component: deviceDe,
          meta: {
            module: 'product1'
          },
          children: [
            // 货柜详情
            {
              path: 'deDetails',
              name: 'deDetails1',
              component: deDetails,
              meta: {
                module: 'product'
              }
            },
            // 货柜SKU信息
            {
              path: 'deSKUdetails',
              name: 'deSKUdetails1',
              component: deSKUdetails,
              meta: {
                module: 'product'
              }
            },
            // 货柜销售订单
            {
              path: 'deSale',
              name: 'deSale1',
              component: deSale,
              meta: {
                module: 'product'
              }
            },
            // 货柜补货订单
            {
              path: 'deReplenishment',
              name: 'deReplenishment1',
              component: deReplenishment,
              meta: {
                module: 'product'
              }
            },
            // 货柜状态日志
            {
              path: 'deState',
              name: 'deState1',
              component: deState,
              meta: {
                module: 'product'
              }
            },
            {
              path: 'deChange',
              name: 'deChange1',
              component: deChange,
              meta: {
                module: 'product'
              }
            },
            {
              path: 'yundeSKUdetails',
              name: 'yundeSKUdetails1',
              component: yundeSKUdetails,
              meta: {
                module: 'product'
              }
            },
          ]
        },
        // 货柜详情
        {
          path: '/container/deDetails/:did',
          name: 'deDetails',
          component: deDetails,
        },
        // 传感器历史
        {
          path: '/container/sensorList/:did',
          name: 'sensorList',
          component: sensorList,
        },
        // 传感器托盘
        {
          path: '/container/sensorHistory/:did/:sid',
          name: 'sensorHistory',
          component: sensorHistory,
        },
        // 销售订单```````````````````````````````````````````````````````````````
        {
          path: '/container/saleOrders',
          name: 'saleOrders',
          component: saleOrders,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 查看订单
        {
          path: '/container/saleDetail/:sid',
          name: 'saleDetail',
          component: saleDetail,
        },
        // 所属货柜
        {
          path: '/container/deDetails2/:did/:sid',
          name: 'deDetails2',
          component: deDetails,
        },
        // 补货订单```````````````````````````````````````````````````````````````
        {
          path: '/container/replenishment',
          name: 'replenishment',
          component: replenishment,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 订单详情
        {
          path: '/container/repDetail/:rid',
          name: 'repDetail',
          component: repDetail,
        },
        // 订单详情
        {
          path: '/container/deDetails3/:did/:rid',
          name: 'deDetails3',
          component: deDetails,
        },
        // 审核订单`````````````````````````````````````````````````````````````
        {
          path: '/container/DetailsOrder',
          name: 'DetailsOrder',
          component: DetailsOrder,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 审核订单 - 审核
        {
          path: '/container/AuditOrder/:orderId/:vendorId',
          name: 'AuditOrder',
          component: AuditOrder,
        },
        // 用户中心`````````````````````````````````````````````````````````````
        {
          path: '/container/addminList',
          name: 'addminList',
          component: addminList
        },
        // 新建管理员
        {
          path: '/container/addAddmin',
          name: 'addAddmin',
          component: addAddmin
        },
        // 新建运营商
        {
          path: '/container/addUser',
          name: 'addUser',
          component: addUser
        },
        // 用户详情
        {
          path: '/container/addminDetail/:did',
          name: 'addminDetail',
          component: addminDetail
        },
        // 用户信息编辑
        {
          path: '/container/userEditt/:did',
          name: 'userEditt',
          component: userEditt
        },



        // 代理商

        // 首页
        {
          path: '/container/home',
          name: 'home',
          component: home,
        },
        // 个人信息
        {
          path: '/container/Personal',
          name: 'Personal',
          component: Personal
        },
        // 修改密码
        {
          path: '/container/Password',
          name: 'Password',
          component: Password
        },
        // 货柜绑定```````````````````````````````````````````````````````````````
        {
          path: '/container/ContainerBinding',
          name: 'ContainerBinding',
          component: ContainerBinding,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 绑定设备
        {
          path: '/container/BindingEquipment',
          name: 'BindingEquipment',
          component: BindingEquipment
        },
        // 编辑
        {
          path: '/container/deviceDetail/:did',
          name: 'deviceDetail',
          component: deviceDetail
        },
        // 查看
        {
          path: '/container/deviceDetailCheck/:did',
          name: 'deviceDetailCheck',
          component: deviceDetailCheck
        },
        // 商品模板```````````````````````````````````````````````````````````````
        {
          path: '/container/GoodsTemplate',
          name: 'GoodsTemplate',
          component: GoodsTemplate,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 新增模板
        {
          path: '/container/NewTemplate',
          name: 'NewTemplate',
          component: NewTemplate
        },
        // 编辑
        {
          path: '/container/editor',
          name: 'editor',
          component: editor
        },
        // 查看
        {
          path: '/container/CheckContainerInfor',
          name: 'CheckContainerInfor',
          component: CheckContainerInfor
        },
        // 货柜商品```````````````````````````````````````````````````````````````
        {
          path: '/container/ContainerGoods',
          name: 'ContainerGoods',
          component: ContainerGoods,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 商品详情
        {
          path: '/container/GoodsDetails',
          name: 'GoodsDetails',
          component: GoodsDetails
        },
        // 库存状况```````````````````````````````````````````````````````````````
        {
          path: '/container/InventoryStatus',
          name: 'InventoryStatus',
          component: InventoryStatus,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 货道详情
        {
          path: '/container/ArrivalGoodsdetails',
          name: 'ArrivalGoodsdetails',
          component: ArrivalGoodsdetails
        },
        // 货到日志
        {
          path: '/container/ContainerLog',
          name: 'ContainerLog',
          component: ContainerLog
        },
        // 补货规则```````````````````````````````````````````````````````````````
        {
          path: '/container/ReplenishmentRules',
          name: 'ReplenishmentRules',
          component: ReplenishmentRules,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 补货单管理```````````````````````````````````````````````````````````````
        {
          path: '/container/repMentOrdManagement',
          name: 'repMentOrdManagement',
          component: repMentOrdManagement,
          meta: {
            module: 'product',
            keepAlive: true
          }
        },
        // 打印
        {
          path: '/container/print',
          name: 'print',
          component: print
        },

        // 补货单_查看
        {
          path: '/container/RepairInvoiceCheck',
          name: 'RepairInvoiceCheck',
          component: RepairInvoiceCheck
        },
        // 营业汇总报表`````````````````````````````````````````````````````````````
        {
          path: '/container/BusinessSum',
          name: 'BusinessSum',
          component: BusinessSum,
        },
        // 付款类型统计`````````````````````````````````````````````````````````````
        {
          path: '/container/PaymentType',
          name: 'PaymentType',
          component: PaymentType
        },
        // 订单统计报表`````````````````````````````````````````````````````````````
        {
          path: '/container/OrderStatistics',
          name: 'OrderStatistics',
          component: OrderStatistics
        },
        // 商品销售汇总`````````````````````````````````````````````````````````````
        {
          path: '/container/CommoditySales',
          name: 'CommoditySales',
          component: CommoditySales
        },
        // 商品分类统计`````````````````````````````````````````````````````````````
        {
          path: '/container/GoodsClassification',
          name: 'GoodsClassification',
          component: GoodsClassification
        },
        // 商品销售排行`````````````````````````````````````````````````````````````
        {
          path: '/container/MerSalesRanking',
          name: 'MerSalesRanking',
          component: MerSalesRanking
        },
        // 会员统计表`````````````````````````````````````````````````````````````
        {
          path: '/container/MemberStatistics',
          name: 'MemberStatistics',
          component: MemberStatistics
        },
        // 充值消费明细`````````````````````````````````````````````````````````````
        {
          path: '/container/statement',
          name: 'statement',
          component: statement
        },
        // 用户中心`````````````````````````````````````````````````````````````
        {
          path: '/container/distributionList',
          name: 'distributionList',
          component: distributionList
        },
        // 补货员信息编辑
        {
          path: '/container/EditReplenisher',
          name: 'EditReplenisher',
          component: EditReplenisher
        },
      ]
    }
  ]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  // console.log('路由拦截')
  // console.log(localStorage.getItem('DateToken'))
  if (to.name != 'login') {
    // console.log(new Date().getTime() - localStorage.getItem('DateToken'), 5400000, new Date().getTime() - localStorage.getItem('DateToken') > 5400000);
    if (new Date().getTime() - localStorage.getItem('DateToken') > 5400000) {
      
      // 重新登陆
      localStorage.removeItem('DateToken')
      window.location.hash = '/login';

    } else {
      // console.log('路由 - next')
      next();
    }
  } else {
    // console.log('路由 - next')
    next();
  }
})

export default router
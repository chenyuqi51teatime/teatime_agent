// 引入axios
import axios from 'axios'
import { Loading } from 'element-ui'

// 服务器地址
// axios.defaults.baseURL = 'https://shop.51teatime.com';      // production
axios.defaults.baseURL = 'https://testshop.51teatime.com';  // dev

let loadingInstance = {}
// 接口地址
let apis = {
    login: '/v1/common/user/info',    // 登录
    adminList: '/v1/admin/user/list',      // 管理员列表
    agentList: '/v1/admin/business/list',  // 代理商列表
    addAdmin: '/v1/admin/user/add',        // 新建管理员
    addBusiness: '/v1/admin/business/add', // 新建代理商
    detaiAdmin: '/v1/admin/user/get/',     // 管理员详细
    detailBusiness: '/v1/admin/business/get/',    // 代理商详细
    updateAdmin: '/v1/admin/user/modify',         // 修改管理员
    updateBusiness: '/v1/admin/business/modify',  // 修改代理商
    deleteAdmin: '/v1/admin/user/delete',         // 删除管理员
    deleteBusiness: '/v1/admin/business/delete',  // 删除代理商
    distList: '/v1/business/user/deliveryUserlist',  // 送货员列表
    pei: '/v1/business/user/deliveryUserdetail/',          // 送货员详细
    updatePei: '/v1/business/user/deliveryUserModify',   // 修改送货员
    deleteDis: '/v1/business/user/deleteDeliveryUser',  // 删除送货员
    passDist: '/v1/business/user/deliveryAudit',   // 通过审核
    rejectDist: '/v1/business/user/deliveryAudit',  // 驳回审核
    resetAdmin: '/v1/admin/user/resetPassword',  // 重置原始密码
    resetBusiness: '/v1/admin/business/resetPassword',  // 重置原始密码
    SKUapi: '/v1/business/product/list',     // SKU列表
    SKUchange: '/v1/business/product/set',   // SKU更改
    QR: '/v1/business/user/qrcode',           // 二维码
    password: '/v1/common/user/modifyPassword',   // 修改密码
    templateListApi: '/v1/business/template/list',      // 模板列表
    templateListApi2: '/v2/goods/templates',      // 模板列表(重写)
    templateCheck2: '/v2/goods/template/{id}', // 查看模板(重写)
    deleteTemplate: '/v1/business/template/delete',     // 删除模板
    comTemplate: '/v1/business/template/add',            // 保存模板
    comTemplatev2: '/v2/goods/template',            // 保存模板(重写)
    changeTemplate: '/v1/business/template/modify',     //  更改模板
    templateDetail: '/v1/business/template/get/', //  模板详细
    sensorListApi: '/v1/business/sensor/list',   // 传感器列表
    sensorHistoryApi: '/v1/business/sensor/history',   // 传感器历史
    redList: '/v1/business/operation/redPacket/list',       // 红包列表
    deleteRed: '/v1/business/operation/redPacket/delete',  // 删除列表
    newRed: '/v1/business/operation/redPacket/add',         // 新建红包
    changeRed: '/v1/business/operation/redPacket/update',  // 更改红包状态
    setMinus: '/v1/business/operation/discount/update',   // 新建立减
    changeMinus: '/v1/business/operation/discount/update',   // 更改立减
    detailMinus: '/v1/business/operation/discount/detail',     //  立减详细
    deviceListApi: `/v1/admin/vendor/findList`,    // 管理员、运营商设备列表
    deviceListApiB: `/v1/business/vendor/findList`,    // 运营商设备列表
    addDevice: '/v1/business/vendor/add',         // 增加设备
    selectTem: '/v1/business/vendor/batchBindTemplateToVendor',    // 选择模板  数组
    changeTem: '/v1/business/vendor/templateSku',    // 选择模板
    deviceDetailApi: `/v1/admin/vendor/findlistId`,      // 管理员设备详细
    deviceDetailApiB: `/v1/business/vendor/findlistId`, // 运营商设备详细
    deviceDetailApis: `/v1/business/vendor/findVendor/`,     // 运营商   设备详细
    deviceDetaiSKUlApi: '/v1/business/vendor/listVendorSkus/', // todo 设备详细中商品列表
    deviceDetaiSKUlApi2: '/v2/goods/vendor/', // todo 设备详细中商品列表(重写)
    updateDeviceDetail: '/v1/business/vendor/modify',   //  更新设备详细
    updateDeviceDetails: '/v1/business/vendor/updataVendor',   //  更新设备详细
    saveDeviceSKU: '/v1/business/vendor/saveVendorAndSkus',   // 保存设备上SKU
    categoryList: '/v1/admin/category/getAll',  // 分类列表
    addCategory: '/v1/admin/category/add', // 添加分类
    removeCategory: '/v1/admin/category/delete', // 删除分类
    updateCategory: '/v1/admin/category/update', // 编辑分类
    brandList: '/v1/admin/brand/list', // 全部品牌列表
    singleBrand: '/v1/admin/brand/get/', // 获取品牌
    addBrand: '/v1/admin/brand/add', // 添加品牌
    updateBrand: '/v1/admin/brand/update', // 修改品牌
    deleteBrand: '/v1/admin/brand/delete', // 删除品牌
    productsList: '/v1/admin/product/list',  // 商品列表
    newProduct: '/v1/admin/product/add',  // 新建商品
    removeProduct: '/v1/admin/product/delete',  // 删除商品
    updateProduct: '/v1/admin/product/modify', // 修改商品
    productDetail: '/v1/admin/product/get/', //  商品详情
    deviceSale: `/v1/admin/order/findList`,     //  设备详情    管理员货柜销售订单
    deviceSaleB: `/v1/business/order/findList`,  //  设备详情    运营商货柜销售订单
    deviceRep: `/v1/admin/RRIController/findAll`,                       //  管理员设备详情    货柜补货
    deviceRepB: `/v1/business/RRIController/findAll`,                  //  代理商设备详情    货柜补货
    makeRepList: '/v1/business/order/init/replenishment/order',       // 设备列表   生成补货单列表
    makeRep: '/v1/business/order/create/replenishment/order',         // 设备列表   生成补货单  保存
    makeRepChange: '/v1/business/order/add/replenishment/product',         // 设备列表  生成补货单   添加调换商品
    makeRepPan: '/v1/business/order/sensorId/list',         // 设备列表  生成补货单   托盘id列表
    makeRepSKU: '/v1/business/order/vendor/sku/list',                    // 设备列表  生成补货单   SKU列表
    makeRepDelivery: '/v1/business/order/delivery/list',               // 设备列表  生成补货单   送货员列表
    deviceSKUSale: '',  //  设备详情    SKU销售
    deviceDetailreset: '/v1/admin/vendor/updateStatus',  //  设备详情   重置状态
    deviceNum: '',    // 设备新增人数
    SKUSale: '',       // sku销售账单
    saleOrders: '/v1/admin/order/list',
    detailSaleOrders: '/v1/business/order/list',
    closeOrder: '/v1/admin/order/close',
    saleDetail: '/v1/admin/order/detail',
    replenishment: `/v1/admin/order/replenishment/list`,
    dreplenishment: `/v1/business/order/replenishment/list`,
    repDetail: `/v1/admin/order/replenishment/detail`,
    drepDetail: `/v1/business/order/replenishment/detail`,
    deState: '/v1/admin/vendor/findRoleRelationList',
    ddeState: '/v1/business/vendor/findRoleRelationList',
    deleteOrder: '/v1/business/order/replenishment/delete',
    deChangeLog: '/v1/admin/vendor/commodityChangeLog',
    ddeChangeLog: '/v1/business/vendor/commodityChangeLog'
}

export default (Vue) => {
    const xhr = (api, data = {}, config = {
        headers: {
            'Authorization': sessionStorage.getItem('teatimechangetoken')
        }
    }) => {
        // 新建 promise 对象，设定默认的掉用成功成功失败的处理函数
        let promise = {
            successHandler() { },
            errorHandler({ code, message, err }) {
                if (code === 400) {
                } else {
                }
            }
        }
        promise.success = (cb) => {
            // 设定 promise 的 success 处理
            if (typeof cb === 'function') {
                promise.successHandler = cb
            }
            return promise
        }

        promise.error = (cb) => {
            // 设定 promise 的 error 处理
            if (typeof cb === 'function') {
                promise.errorHandler = cb
            }
            return promise
        }

        // 发起网络请求
        if (api !== 'login') {
            const userInfoStr = window.sessionStorage.getItem('teatimechangetoken')
            if (typeof userInfoStr === 'string' && userInfoStr !== '') {
                try {
                    data.token = JSON.parse(userInfoStr).token
                } catch (e) {
                    // console.log(e)
                }
            }
        }

        loadingInstance = Loading.service()

        axios.interceptors.response.use(function (response) {
            return response
        }, function (error) {
            // console.log(error)
            if (error.response.status === 401) {
                window.location.hash = '/login'
                this.$message.error('网络错误，请重新登录!')
                return Promise.reject(error)
            }
        })

        loadingInstance = Loading.service()
        axios.post(apis[api], data, config).then((res) => {
            // console.log(res)
            loadingInstance.close()
            if (res.status === 200) {
                if (res.data.success) {
                    let payload = res.data
                    delete payload.success
                    delete payload.code
                    delete payload.message
                    promise.successHandler(payload)
                } else {
                    if (res.data.error === 'invalid_token') {
                        this.$message.error('网络错误，请重新登录!')
                        window.location.hash = '/login'
                    }
                    promise.errorHandler(res.data)
                }
            } else if (res.status === 401) {
                this.$message.error('网络错误，请重新登录!')
                window.location.hash = '/login'
            } else { }
        }).catch((err) => {
            // console.log(err)
            loadingInstance.close()
            promise.errorHandler({
                code: -1,
                message: '网络请求失败',
                err: err
            })
        })
        return promise
    }
    const get = (api, data = {}, config = {
        headers: {
            'Authorization': sessionStorage.getItem('teatimechangetoken')
        }
    }) => {
        // 新建 promise 对象，设定默认的掉用成功成功失败的处理函数
        let promise = {
            successHandler() { },
            errorHandler({ code, message, err }) {
                if (code === 400) { } else {
                    //  Vue.alert(message)
                }
            }
        }
        promise.success = (cb) => {
            // 设定 promise 的 success 处理
            if (typeof cb === 'function') {
                promise.successHandler = cb
            }
            return promise
        }
        promise.error = (cb) => {
            // 设定 promise 的 error 处理
            if (typeof cb === 'function') {
                promise.errorHandler = cb
            }
            return promise
        }
        // 发起网络请求
        loadingInstance = Loading.service()
        axios.interceptors.response.use(function (response) {
            return response
        }, function (error) {
            if (error.response.status === 401) {
                window.location.hash = '/login'
                this.$message.error('网络错误，请重新登录!')
                return Promise.reject(error)
            }
        })
        axios.get(apis[api] + data.params, config).then((res) => {
            loadingInstance.close()
            if (res.status === 200) {
                if (res.data.success) {
                    let payload = res.data
                    delete payload.success
                    delete payload.code
                    delete payload.message
                    promise.successHandler(payload)
                } else {
                    if (res.data.error === 'invalid_token') {
                        this.$message.error('网络错误，请重新登录!')   // 再想想
                        window.location.hash = '/login'
                    }
                    promise.errorHandler(res.data)
                }
            } else if (res.status === 401) {
                this.$message.error('网络错误，请重新登录!')
                window.location.hash = '/login'
            } else { }
        }).catch((err) => {
            loadingInstance.close()
            // console.log(err)
            promise.errorHandler({
                code: -1,
                message: '网络请求失败',
                err: err
            })
        })
        return promise
    }

    Vue.xhr = xhr
    Vue.prototype.$xhr = xhr
    Vue.get = get
    Vue.prototype.$get = get

}

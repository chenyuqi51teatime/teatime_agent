import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
    categoryList: [],
    token: {},
    role: '',
    roleId: '',
    user: '',
    password: '',
    acIndex: '1',
    pageNo: 1,
    payStatus: '',
    deviceFrom: '',
    isFirstEnter: true,          //  设备列表
    isOrderFirst: true,          //  订单列表
    isRepFirst: true,             //  补货列表
    keepAlive: 1
}
const mutations = {
    activeClass(state, data) {
        setTimeout(function () {
            var rous = document.getElementsByClassName('routerBox');
            if (rous.length > 0) {

                for (var i = 0; i < rous.length; i++) {
                    rous[i].className = 'routerBox'
                }

                rous[data].className = 'routerBox actives'

            }
        }, 100)
    },
    init_store(state, data) {
        state.categoryList = data
    },
    change_token(state, msg) {
        state.token = msg
    },
    change_role(state, msg) {
        state.role = msg
    },
    change_roleId(state, msg) {
        state.roleId = msg
    },
    change_user(state, msg) {
        state.user = msg
    },
    change_pass(state, msg) {
        state.password = msg
    },
    change_acIndex(state, msg) {
        state.acIndex = msg
    },
    change_pageNo(state, msg) {
        state.pageNo = msg
    },
    change_payStatus(state, msg) {
        state.payStatus = msg
    },
    change_deviceFrom(state, msg) {
        state.deviceFrom = msg
    },
    change_enter(state, msg) {
        state.isFirstEnter = msg
    },
    change_oenter(state, msg) {
        state.isOrderFirst = msg
    },
    change_renter(state, msg) {
        state.isRepFirst = msg
    }
}
const actions = {
    /* 用户角色 */
    getRole({ commit }) {
        return new Promise((resolve, reject) => {
            Vue.xhr('login').success(res => {
                commit('change_role', res)
                localStorage.setItem('tearoleId', res.userId)
                localStorage.setItem('teauserStatus', res.roleId)
                resolve()
            }).error(res => {
                this.$alert('用户名或密码输入不正确!')
            })
        })
    },
    getUser({ commit }, msg) {
        commit('change_user', msg)       // 存储用户名
    },
    changePass({ commit }, msg) {
        commit('change_pass', msg)       // 存储密码
    },
    changeacIndex({ commit }, msg) {
        commit('change_acIndex', msg)    //  改变id
    },
    changepageNo({ commit }, msg) {
        commit('change_pageNo', msg)    //  存储page
    },
    changetoken({ commit }, msg) {
        commit('change_token', msg)    //  存储token
    },
    changePayStatus({ commit }, msg) {
        commit('change_payStatus', msg)    //  存储payStatus
    },
    changeDeviceFrom({ commit }, msg) {
        commit('change_deviceFrom', msg)    //  存储payStatus
    },
    getCategoryList({ commit }) {
        return new Promise((resolve, reject) => {
            Vue.get('categoryList', { params: '' }).success(res => {
                commit('init_store', res.datas)
                resolve()
            })
        })
    },
    changeEnter({ commit }, msg) {
        commit('change_enter', msg)
    },
    changeOenter({ commit }, msg) {
        commit('change_oenter', msg)
    },
    changeRenter({ commit }, msg) {
        commit('change_renter', msg)
    }
}

const getters = {
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

import Vue from 'vue'
import axios from 'axios'
import { getCookie } from '../utils/utils.js'

// axios.defaults.baseURL = 'https://shop.51teatime.com';      // production
axios.defaults.baseURL = 'https://testshop.51teatime.com';  // dev
// axios.defaults.baseURL = 'http://10.11.22.160:8181';              // jp

const httpPlugin = {
    install: (Vue) => {
        let axiosCase = axios.create({
            headers: {
                'Authorization': sessionStorage.getItem('teatimechangetoken')
            }
        });
        axiosCase.interceptors.request.use((config) => {
            // console.log(config)
            config.headers.Authorization = sessionStorage.getItem('teatimechangetoken')
            return config;
        }, error => {
            console.log(error)
            if (error) {
                this.$message.error('网络错误，请重新登录!')
                window.location.hash = '/login'
                return Promise.reject(error);
            }
        })
        axios.interceptors.response.use(function (response) {
            if (response.status != 200) {
                this.$message.error('网络错误，请重新登录!')
                window.location.hash = '/login'
                return Promise.reject(error);
            }else {
              return response;  
            }
        }, function (error) {
            console.log(error)
            if (error) {
                this.$message.error('网络错误，请重新登录!')
                window.location.hash = '/login'
                return Promise.reject(error)
            }

        })
        Object.defineProperty(Vue.prototype, '$http', {
            value: axiosCase
        })
    }
}
Vue.use(httpPlugin)
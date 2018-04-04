// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios/axios.js'
import store from './store/store'

import xhr from '@/plugins/xhr'
import Alert from '@/plugins/alert'
import Message from '@/plugins/message'
import Confirm from '@/plugins/confirm'
import Error from '@/plugins/error'
import Bounced from '@/plugins/bounced'
import * as echarts from 'echarts';

import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import './icon/iconfont.css'
import './assets/css/reset.css'
import './assets/css/style.css'
Vue.use(xhr)
Vue.use(Alert)
Vue.use(Message)
Vue.use(Confirm)
Vue.use(Error)
Vue.use(Bounced)
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)

import {
  Autocomplete,
  Form,
  FormItem,
  Input,
  Button,
  Row,
  Col,
  Card,
  Select,
  Option,
  RadioGroup,
  Upload,
  Radio,
  Table,
  TableColumn,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Pagination,
  Dialog,
  Tree,
  Popover,
  Tag,
  DatePicker,
  Tabs,
  Checkbox
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Select)
Vue.use(Option)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tree)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(DatePicker)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(Autocomplete)
Vue.config.silent = true
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render(createElement) {
    return createElement(App)
  }
})

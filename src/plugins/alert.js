/*
* alert方法
*/
import {MessageBox} from 'element-ui'
export default function (Vue) {
  Vue.alert = (text) => {
    return MessageBox.alert(text)
  }
  Vue.prototype.$alert = (text) => {
    return MessageBox.alert(text)
  }
}

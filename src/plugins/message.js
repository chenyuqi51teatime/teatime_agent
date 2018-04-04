import { Message } from 'element-ui'
export default function (Vue) {
  Vue.message = (text) => {
    return Message.success(text)
  }
  Vue.prototype.$message = (text) => {
    return Message.success(text)
  }
}

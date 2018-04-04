import { Message } from 'element-ui'
export default function (Vue) {
  
  Vue.message.error = (text) => {
    return Message.error(text)
  }
  Vue.prototype.$message.error = (text) => {
    return Message.error(text)
  }
}

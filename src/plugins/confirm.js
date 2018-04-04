/*
 * confirm方法
 */
import { MessageBox } from 'element-ui'
export default function (Vue) {
  const yConfirm = (text) => {
    let promise = {
      ok (handler) {
        tip.then(handler)
      },
      cancel (handler) {
        tip.catch()
      }
    }
    var tip = MessageBox.confirm(text, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false
    })
    return promise
  }
  Vue.confirm = yConfirm
  Vue.prototype.$confirm = yConfirm
}

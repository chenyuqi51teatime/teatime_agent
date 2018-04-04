import $ from 'jquery'
import dialogCSS from '../assets/css/dialog.css'

export default function (Vue){
    
    const Bounced = (vue,text) => {
        // mark 遮绕层
        var mark_div = document.createElement('div');
            mark_div.className = 'mark_div_c'
        
        // 最外层div
        var dialog = document.createElement('div');
            dialog.className = 'dialogTitle_c';
            mark_div.appendChild(dialog)
            
        var dialog_header = document.createElement('div');
        var dialog_body = document.createElement('div');














        return vue.$refs.AuditOrder.appendChild(mark_div)
    }


    Vue.prototype.$bounced = Bounced
}
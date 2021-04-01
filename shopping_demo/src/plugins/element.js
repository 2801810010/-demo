import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message
} from 'element-ui'
Vue.prototype.$message = Message; // 挂载到vue原型上
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)


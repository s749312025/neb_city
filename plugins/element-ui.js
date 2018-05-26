import Vue from 'vue'
// 按需引用
import { Message, Notification, Dialog, Button, Input} from 'element-ui'

Vue.use(Dialog)
Vue.use(Button)
Vue.use(Input)

Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
// Vue.component(Button.name, Button)
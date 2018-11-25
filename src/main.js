// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { MdButton, MdContent, MdTabs, MdCard, MdDivider,
  MdDatepicker, MdRadio, MdProgress, MdList, MdSubheader, MdField, MdMenu, MdDialog, MdToolbar, MdEmptyState, MdAvatar } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.use(MdCard)
Vue.use(MdDivider)
Vue.use(MdDatepicker)
Vue.use(MdRadio)
Vue.use(MdProgress)
Vue.use(MdList)
Vue.use(MdSubheader)
Vue.use(MdField)
Vue.use(MdMenu)
Vue.use(MdDialog)
Vue.use(MdToolbar)
Vue.use(MdEmptyState)
Vue.use(MdAvatar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

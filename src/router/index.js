import Vue from 'vue'
import Router from 'vue-router'
import heatmap from 'vue-heatmapjs'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Loginv2'
import ProfileForm from '@/components/ProfileForm'
import MainSection from '@/components/MainSection'
import TestBluetooth from '@/components/TestBluetooth'
import TestBluetoothSitting from '@/components/TestBluetoothSitting'
import TestBluetoothSittingV2 from '@/components/TestBluetoothSittingV2'
// import RegisterData from '@/components/RegisterData'
import RegisterDataWithPauseButton from '@/components/RegisterDataWithPauseButton'
import RegisterDataWithProtocol from '@/components/RegisterDataWithProtocol'

import Pomodoro from '@/components/Pomodoro'
import Information from '@/components/Information'

import Profile from '@/components/Profile'
import ReceivedTips from '@/components/ReceivedTips'

Vue.use(Router)
Vue.use(heatmap)

Vue.component('sitting-monitor', TestBluetoothSittingV2)
Vue.component('pomodoro', Pomodoro)
Vue.component('information', Information)
Vue.component('user-profile', Profile)
Vue.component('received-tips', ReceivedTips)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile_form',
      name: 'ProfileForm',
      component: ProfileForm
    },
    {
      path: '/main',
      name: 'Main',
      component: MainSection
    },
    {
      path: '/testbluetooth',
      name: 'TestBluetooth',
      component: TestBluetooth
    },
    {
      path: '/testbluetoothsitting',
      name: 'TestBluetoothSitting',
      component: TestBluetoothSitting
    },
    {
      path: '/testbluetoothsittingv2',
      name: 'TestBluetoothSittingV2',
      component: TestBluetoothSittingV2
    },
    {
      path: '/register',
      name: 'RegisterDataWithPauseButton',
      component: RegisterDataWithPauseButton
    },
    {
      path: '/registerwithprotocol',
      name: 'RegisterDataWithProtocol',
      component: RegisterDataWithProtocol
    }
  ]
})

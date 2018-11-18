import Vue from 'vue'
import Router from 'vue-router'
import heatmap from 'vue-heatmapjs'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Loginv2'
import ProfileForm from '@/components/ProfileForm'
import MainSection from '@/components/MainSection'
import TestBluetooth from '@/components/TestBluetooth'
import TestBluetoothSitting from '@/components/TestBluetoothSitting'
//import TestBluetoothSittingV2 from '@/components/TestBluetoothSittingV2'
import TestBluetoothSittingV2 from '@/components/TestBluetoothSittingVRegisterData'

import Pomodoro from '@/components/Pomodoro'
import Information from '@/components/Information'

import Profile from '@/components/Profile'

Vue.use(Router)
Vue.use(heatmap)

Vue.component('sitting-monitor', TestBluetoothSittingV2)
Vue.component('pomodoro',Pomodoro)
Vue.component('information', Information)
Vue.component('user-profile', Profile)

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
    }
  ]
})

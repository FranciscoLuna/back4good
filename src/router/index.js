import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import ProfileForm from '@/components/ProfileForm'
import MainSection from '@/components/MainSection'

Vue.use(Router)

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
    }
  ]
})

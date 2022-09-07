import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/MainPage.vue'
import LoginPage from '../components/LoginPage.vue'
// import Register from '../components/Register.vue'
// import Profile from '../components/Profile.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MainPage
    },
    {
      path: '/login',
      component: LoginPage
    }
  ]
})
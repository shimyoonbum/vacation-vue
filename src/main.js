import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.min.css'
import VeeValidate from 'vee-validate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faUmbrellaBeach,
  faPlane,
  faCalendarCheck,
  faBuilding,
  faSitemap,
  faCalendar,
  faPhone,
  faEnvelope,
  faCoffee,
  faPenToSquare,
  faListCheck,
  faEye,
  faCalendarDays,
  faX
} from '@fortawesome/free-solid-svg-icons'
import VCalendar from 'v-calendar';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faUmbrellaBeach, faPlane, faCalendarCheck, faBuilding,
faSitemap, faCalendar, faPhone, faEnvelope, faCoffee, faPenToSquare, faListCheck, faEye, faCalendarDays, faX)
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VeeValidate)
// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc'  // Use <vc-calendar /> instead of <v-calendar />
});
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  el : '#app',
  render: h => h(App),
  router,
  store,
})

import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/main.scss';
import Buefy from 'buefy';
import VueLogger from 'vuejs-logger';

Vue.config.productionTip = false;
Vue.use(Buefy)

// Global components example
//import LoginFailedDialog from './components/LoginFailedDialog.vue';
//Vue.component('LoginFailedDialog', LoginFailedDialog);

const options = {
  isEnabled: true,
  logLevel : process.env.VUE_APP_LOG_LEVEL,
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, options);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

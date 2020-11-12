/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/main.scss';
import Buefy from 'buefy';
import VueLogger from 'vuejs-logger';
import Vuelidate from 'vuelidate';
import VueCookies from 'vue-cookies';

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.use(VueCookies);

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

// Vue constants
const cookieNames = {
  loginRedirectUrl: 'redirect-login',
  firstVisit: 'first-visit',
  accountToken: 'account-token'
}
Vue.prototype.$cookieNames = cookieNames;

window.ATL_JQ_PAGE_PROPS =  {
  "triggerFunction": function(showCollectorDialog: any) {
    Vue.prototype.$showCollectorDialog = showCollectorDialog
  }
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

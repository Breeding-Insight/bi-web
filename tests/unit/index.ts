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

import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Buefy from 'buefy'
import Vue from "vue";
import {Program} from "@/breeding-insight/model/Program";
import Vuelidate from "vuelidate";
import { abilitiesPlugin } from '@casl/vue';
import { defineAbilityFor } from '@/config/ability';
import {User} from "@/breeding-insight/model/User";
import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import {Role} from "@/breeding-insight/model/Role";
import {sorting} from '@/store/sorting/index';

const localVue = createLocalVue();
localVue.use(VueRouter);

// Setup beufy
localVue.use(Buefy);

// Set our Vuex library
localVue.use(Vuex);

Vue.use(Vuelidate);

const fakeProgram = new Program('1', 'Test Program');
export const defaultStore = new Vuex.Store({
  state:{
    apiError: false,
    apiUnavailable: false,
    loginServerError: false,
    loggedIn: false,
    errorNotificationActive: false,
    errorNotificationMsg: '',
    successNotificationActive: false,
    successNotificationMsg: '',
    infoNotificationActive: false,
    infoNotificationMsg: '',
    warningNotificationActive: false,
    warningNotificationMsg: '',
    showSidebarMobile: true
  },
  modules: {
    sorting
  },
  getters: {
    activeProgram: () => fakeProgram
  },
  mutations:{
    deactivateAllNotifications(state) {
      state.successNotificationActive = false;
      state.errorNotificationActive = false;
      state.infoNotificationActive = false;
    },
    showSuccessNotification(state, msg: string) {
      state.successNotificationMsg = msg;
      state.successNotificationActive = true;
    },
  }
});

const fakeUser: User = new User('1', 'Test User','1', 'email@email.com',
  new Role('1', 'admin'),
  [new ProgramUser('1', 'Test User', 'email@email.com', '1', 'breeder', fakeProgram, true)]);
localVue.use(abilitiesPlugin, defineAbilityFor(fakeUser, fakeProgram));

export default localVue;

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
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { mutations } from './mutations';
import {actions} from './actions';
import {sorting} from '@/store/sorting/index';
import {filtering} from '@/store/filtering/';
import {programManagement} from '@/store/program-management/index';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    apiError: false,
    apiUnavailable: false,
    loginServerError: false,
    loggedIn: false,
    requestedPath: undefined,
    user: undefined,
    program: undefined,
    firstVisit: undefined,
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
    sorting,
    filtering,
    programManagement
  },
  mutations,
  actions,
  getters: {
    activeProgram: state => {
      return state.program;
    },
    activeUser: state => {
      return state.user;
    },
    isErrorNotificationActive: state => {
      return state.errorNotificationActive;
    },
    errorNotificationMsg: state => {
      return state.errorNotificationMsg;
    },
    isSuccessNotificationActive: state => {
      return state.successNotificationActive;
    },
    successNotificationMsg: state => {
      return state.successNotificationMsg;
    },
    isInfoNotificationActive: state => {
      return state.infoNotificationActive;
    },
    infoNotificationMsg: state => {
      return state.infoNotificationMsg;
    },
    isWarningNotificationActive: state => {
      return state.warningNotificationActive;
    },
    warningNotificationMsg: state => {
      return state.warningNotificationMsg;
    },
    showSidebarMobile: state => {
      return state.showSidebarMobile;
    }
  }
};

export default new Vuex.Store(store);

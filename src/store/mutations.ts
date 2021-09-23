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

import { MutationTree } from 'vuex';
import { RootState } from '@/store/types';
import {
  DEACTIVATE_ERROR_NOTIFICATION,
  DEACTIVATE_SUCCESS_NOTIFICATION,
  DEACTIVATE_INFO_NOTIFICATION,
  DEACTIVATE_WARNING_NOTIFICATION,
  DEACTIVATE_ALL_NOTIFICATIONS,
  SHOW_ERROR_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
  SHOW_INFO_NOTIFICATION,
  SHOW_WARNING_NOTIFICATION,
  ERROR_STATE,
  FIRST_VISIT,
  LOGIN,
  LOGOUT,
  REQUESTED_PATH,
  RETURN_VISIT,
  SET_ACTIVE_PROGRAM,
  SHOW_SIDEBAR_MOBILE,
} from '@/store/mutation-types';
import {User} from "@/breeding-insight/model/User";
import {Program} from "@/breeding-insight/model/Program";

export const mutations: MutationTree<RootState> = {
  [LOGIN] (state, user: User) {
    state.apiError = false;
    state.apiUnavailable = false;
    state.loggedIn = true;
    state.user = user;
  },
  [LOGOUT] (state) {
    state.apiError = false;
    state.apiUnavailable = false;
    state.loggedIn = false;
    state.user = undefined;
  },
  [ERROR_STATE] (state, payload: any) {
    state.apiError = payload.apiError;
    state.apiUnavailable = payload.apiUnavailable;
    state.loginServerError = payload.loginServerError;
  },
  [REQUESTED_PATH] (state, payload: any) {
    state.requestedPath = payload.path;
  },
  [SET_ACTIVE_PROGRAM] (state, program: Program) {
    state.program = program;
  },
  [FIRST_VISIT] (state) {
    state.firstVisit = true;
  },
  [RETURN_VISIT] (state) {
    state.firstVisit = false;
  },
  // Closes the All Notification boxes.
  [DEACTIVATE_ALL_NOTIFICATIONS] (state) {
    state.errorNotificationActive = false;
    state.successNotificationActive = false;
    state.infoNotificationActive = false;
    state.warningNotificationActive = false;
  },

  // Closes the Error Notification box.
  [DEACTIVATE_ERROR_NOTIFICATION] (state) {
    state.errorNotificationActive = false;
  },
  // Sets the message in the Error Notification box
  // and makes it visible
  [SHOW_ERROR_NOTIFICATION] (state, msg: string) {
    state.errorNotificationMsg = msg;
    state.errorNotificationActive = true;
  },
  // Closes the Success Notification message box.
  [DEACTIVATE_SUCCESS_NOTIFICATION] (state) {
    state.successNotificationActive = false;
  },
  // Sets the message in the Success Notification box
  // and makes it visible
  [SHOW_SUCCESS_NOTIFICATION] (state, msg: string) {
    state.successNotificationMsg = msg;
    state.successNotificationActive = true;
  },
  // Closes the Info Notification box.
  [DEACTIVATE_INFO_NOTIFICATION] (state) {
    state.infoNotificationActive = false;
  },
  // Sets the message in the Info Notification box
  // and makes it visible
  [SHOW_INFO_NOTIFICATION] (state, msg: string) {
    state.infoNotificationMsg = msg;
    state.infoNotificationActive = true;
  },
  // Closes the Warning Notification message box.
  [DEACTIVATE_WARNING_NOTIFICATION] (state) {
    state.warningNotificationActive = false;
  },
  // Sets the message in the Warning Notification box
  // and makes it visible
  [SHOW_WARNING_NOTIFICATION] (state, msg: string) {
    state.warningNotificationMsg = msg;
    state.warningNotificationActive = true;
  },
  [SHOW_SIDEBAR_MOBILE] (state, value: boolean) {
    state.showSidebarMobile = value;
  }
};

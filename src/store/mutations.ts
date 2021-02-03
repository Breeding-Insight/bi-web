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
  ERROR_STATE,
  FIRST_VISIT,
  LOGIN,
  LOGOUT,
  REQUESTED_PATH,
  RETURN_VISIT,
  SET_ACTIVE_PROGRAM,
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
  }
};

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

import {Route} from "vue-router";
import store from "@/store";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {Program} from "@/breeding-insight/model/Program";
import {LOGIN, SET_ACTIVE_PROGRAM} from "@/store/mutation-types";
import Vue from "vue";
import {defineAbilityFor} from "@/config/ability";
import {UserService} from "@/breeding-insight/service/UserService";
import {User} from "@/breeding-insight/model/User";

export async function processProgramNavigation(to: Route, from: Route, next: Function) {

  // Navigating to programs path
  if (isProgramsPath(to)) {
    if (store.state.program === undefined || store.state.program.id !== to.params.programId) {
      try {
        const user: User = await UserService.getUserInfo();
        store.commit(LOGIN, user);
        const program: Program = await ProgramService.getOne(to.params['programId']);
        store.commit(SET_ACTIVE_PROGRAM, program);
        const { rules } = defineAbilityFor(store.state.user, store.state.program);
        Vue.prototype.$ability.update(rules);
        next();
      } catch (error) {
        //TODO: Redirect to internal server page, or not found page
        next({name: 'program-selection'});
      }
    } else { next(); }
  } else { next(); }
}

export function signupRequireAccountToken(to: Route, from: Route, next: Function) {
  if (!to.query[Vue.prototype.$cookieNames.accountToken]) {
    next({name: 'home'});
  } else {
    next();
  }
}

export function isProgramsPath(to: Route): boolean {
  if (to.path.startsWith('/programs/')) {
    return true;
  }
  return false;
}
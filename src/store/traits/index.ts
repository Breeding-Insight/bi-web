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

import {Module} from 'vuex';
import {getters} from '@/store/traits/getters';
import {actions} from '@/store/traits/actions';
import {mutations} from '@/store/traits/mutations';
import {TraitState} from '@/store/traits/types';
import {RootState} from '@/store/types';
import {archive} from '@/store/traits/archive/index';
import {pagination} from "@/store/pagination";

export const state: TraitState = {
    traits: []
};

const namespaced: boolean = true

export const traits: Module<TraitState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
    modules: {
      archive,
      pagination
    }
};


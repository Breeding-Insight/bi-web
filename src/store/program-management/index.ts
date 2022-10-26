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
import {getters} from '@/store/program-management/getters';
import {mutations} from '@/store/program-management/mutations';
import {actions} from '@/store/program-management/actions';
import {RootState} from '@/store/types';
import {ProgramManagementState} from "@/store/program-management/types";

export let state: ProgramManagementState;
state = {
    subscribedOntology: undefined
};

const namespaced: boolean = true

export const programManagement: Module<ProgramManagementState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
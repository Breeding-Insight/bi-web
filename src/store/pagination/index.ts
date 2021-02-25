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
import {getters} from '@/store/pagination/getters';
import {mutations} from '@/store/pagination/mutations';
import {PaginationControllerState} from '@/store/pagination/types';
import {RootState} from '@/store/types';

export const state: PaginationControllerState = {
    currentPage: 1,
    pageSize: 50,
    showAll: false,
    currentCall: undefined
};

const namespaced: boolean = true

export const pagination: Module<PaginationControllerState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
};
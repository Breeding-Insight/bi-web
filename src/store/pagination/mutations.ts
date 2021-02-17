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
import {PaginationControllerState} from "@/store/pagination/types";
import {TOGGLE_SHOW_ALL,
        UPDATE_PAGE_SIZE,
        UPDATE_PAGE,
        SET_CURRENT_CALL} from "@/store/pagination/mutation-types";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";

export const mutations: MutationTree<PaginationControllerState> = {
    [TOGGLE_SHOW_ALL](state: PaginationControllerState) {
        state.showAll = !state.showAll;
    },
    [UPDATE_PAGE_SIZE](state: PaginationControllerState, pageSize: number) {
        state.pageSize = pageSize;
        state.showAll = false;
    },
    [UPDATE_PAGE](state: PaginationControllerState, page: number) {
        state.currentPage = page;
        state.showAll = false;
    },
    [SET_CURRENT_CALL](state: PaginationControllerState, paginationQuery: PaginationQuery) {
        state.currentCall = paginationQuery;
    }
};
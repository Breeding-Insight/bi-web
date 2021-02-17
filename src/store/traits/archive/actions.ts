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

import {ArchiveState} from "@/store/traits/archive/types";
import {RootState} from "@/store/types";
import {ActionTree} from 'vuex';
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {LOAD_PAGINATED_TRAITS, LOAD_PAGINATION, LOAD_TRAITS} from "@/store/traits/archive/mutation-types";
import {SET_CURRENT_CALL} from "@/store/pagination/mutation-types";

export const actions: ActionTree<ArchiveState, RootState> = {
    async getAllArchivedTraits({commit, dispatch, rootGetters}): Promise<void> {

        if (rootGetters['traits/all'].length === 0) {
            await dispatch('traits/getAllTraits', null, {root: true});
        }

        let traits = rootGetters['traits/all'];//.filter(trait => trait.method.methodClass === 'Observation');
        //let traits = rootGetters['traits/all'].filter(trait => trait.method.methodClass === 'Observation');
        commit(LOAD_TRAITS, traits);
    },
    async getArchivedTraits({dispatch, getters, state, commit}): Promise<void> {
        if (state.archivedTraits.length === 0) {
            await dispatch('getAllArchivedTraits');
        }

        let paginationQuery: PaginationQuery = getters['pagination/getPaginationSelections'](
            state.pagination.currentPage,
            state.pagination.pageSize,
            state.pagination.showAll
        );
        commit(`pagination/${SET_CURRENT_CALL}`, paginationQuery);

        const [traits, pagination] = getters['pagination/mockPagination'](
            state.archivedTraits,
            state.pagination.currentPage,
            state.pagination.pageSize,
            state.pagination.showAll
        );

        commit(LOAD_PAGINATED_TRAITS, traits);
        commit(LOAD_PAGINATION, pagination);
    }
};
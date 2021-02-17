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
import {MutationTree} from 'vuex';
import {Trait} from "@/breeding-insight/model/Trait";
import {LOAD_PAGINATED_TRAITS, LOAD_PAGINATION, LOAD_TRAITS} from "@/store/traits/archive/mutation-types";
import {Pagination} from "@/breeding-insight/model/BiResponse";

export const mutations: MutationTree<ArchiveState> = {
    [LOAD_TRAITS](state: ArchiveState, traits: Trait[]) {
        state.archivedTraits = traits;
        //state.archivedTraits = traits.filter(trait => trait.method.methodClass === 'Observation');
        //state.archivedTraits = traits.filter(trait => trait.active === false);
    },
    [LOAD_PAGINATED_TRAITS](state: ArchiveState, traits: Trait[]) {
        state.paginatedTraits = traits;
    },
    [LOAD_PAGINATION](state: ArchiveState, pagination: Pagination) {
        state.archivePagination = pagination;
    }
};
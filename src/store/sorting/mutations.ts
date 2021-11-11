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

import {MutationTree} from 'vuex';
import {NEW_SORT_COLUMN,
    TOGGLE_NAME_SORT_ORDER,
    TOGGLE_METHOD_SORT_ORDER,
    TOGGLE_SCALE_CLASS_SORT_ORDER,
    TOGGLE_UNIT_SORT_ORDER} from "@/store/sorting/mutation-types";
import {SortState} from "@/store/sorting/types";
import {TraitSortField} from "@/breeding-insight/model/Sort";

export const mutations: MutationTree<SortState> = {
    [TOGGLE_NAME_SORT_ORDER](state: SortState) {
        state.nameSortOrder = !state.nameSortOrder;
    },
    [TOGGLE_METHOD_SORT_ORDER](state: SortState) {
        state.methodSortOrder = !state.methodSortOrder;
    },
    [TOGGLE_SCALE_CLASS_SORT_ORDER](state: SortState) {
        state.scaleClassSortOrder = !state.scaleClassSortOrder;
    },
    [TOGGLE_UNIT_SORT_ORDER](state: SortState) {
        state.unitSortOrder = !state.unitSortOrder;
    },
    [NEW_SORT_COLUMN](state: SortState, field: TraitSortField) {
        state.traitSortField = field;
    }
};
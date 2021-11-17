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
import {
    ARCHIVED_ONT_NEW_SORT_COLUMN,
    ARCHIVED_ONT_TOGGLE_NAME_SORT_ORDER,
    ARCHIVED_ONT_TOGGLE_METHOD_SORT_ORDER,
    ARCHIVED_ONT_TOGGLE_SCALE_CLASS_SORT_ORDER,
    ARCHIVED_ONT_TOGGLE_UNIT_SORT_ORDER,
    ACTIVE_ONT_NEW_SORT_COLUMN,
    UPDATE_PROGRAM_USER_SORT,
    UPDATE_LOCATION_SORT,
    UPDATE_SYSTEM_USER_SORT,
    UPDATE_PROGRAM_SORT,
    UPDATE_ARCHIVED_ONT_SORT, ACTIVE_ONT_TOGGLE_SORT_ORDER
} from "@/store/sorting/mutation-types";
import {SortState} from "@/store/sorting/types";
import {
    LocationSort, OntologySort, OntologySortField,
    ProgramSort,
    TraitSortField,
    UserSort
} from "@/breeding-insight/model/Sort";

export const mutations: MutationTree<SortState> = {
    // active ontology table
    [ACTIVE_ONT_TOGGLE_SORT_ORDER](state: SortState) {
        state.activeOntologySort.flag = !state.activeOntologySort.flag;
    },
    [ACTIVE_ONT_NEW_SORT_COLUMN](state: SortState, field: OntologySortField) {
        state.activeOntologySort.field = field;
    },

    // archived ontology table
    [UPDATE_ARCHIVED_ONT_SORT](state: SortState, sort: OntologySort) {
        state.archivedOntologySort.field = sort.field;
        state.archivedOntologySort.order = sort.order;
    },
    [ARCHIVED_ONT_TOGGLE_NAME_SORT_ORDER](state: SortState) {
        state.archivedOntNameSortOrder = !state.archivedOntNameSortOrder;
    },
    [ARCHIVED_ONT_TOGGLE_METHOD_SORT_ORDER](state: SortState) {
        state.archivedOntMethodSortOrder = !state.archivedOntMethodSortOrder;
    },
    [ARCHIVED_ONT_TOGGLE_SCALE_CLASS_SORT_ORDER](state: SortState) {
        state.archivedOntScaleClassSortOrder = !state.archivedOntScaleClassSortOrder;
    },
    [ARCHIVED_ONT_TOGGLE_UNIT_SORT_ORDER](state: SortState) {
        state.archivedOntUnitSortOrder = !state.archivedOntUnitSortOrder;
    },
    [ARCHIVED_ONT_NEW_SORT_COLUMN](state: SortState, field: TraitSortField) {
        state.archivedTraitSortField = field;
    },

    //program user table
    [UPDATE_PROGRAM_USER_SORT](state: SortState, sort: UserSort) {
        state.programUserSort.field = sort.field;
        state.programUserSort.order = sort.order;
    },

    //location table
    [UPDATE_LOCATION_SORT](state: SortState, sort: LocationSort) {
        state.locationSort.field = sort.field;
        state.locationSort.order = sort.order;
    },

    //system user table
    [UPDATE_SYSTEM_USER_SORT](state: SortState, sort: UserSort) {
        state.systemUserSort.field = sort.field;
        state.systemUserSort.order = sort.order;
    },

    //program table
    [UPDATE_PROGRAM_SORT](state: SortState, sort: ProgramSort) {
        state.programSort.field = sort.field;
        state.programSort.order = sort.order;
    }
};
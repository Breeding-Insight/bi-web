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
    ACTIVE_ONT_NEW_SORT_COLUMN,
    UPDATE_PROGRAM_USER_SORT,
    UPDATE_LOCATION_SORT,
    UPDATE_SYSTEM_USER_SORT,
    UPDATE_PROGRAM_SORT,
    ACTIVE_ONT_TOGGLE_SORT_ORDER,
    ARCHIVED_ONT_TOGGLE_SORT_ORDER,
    IMPORT_PREVIEW_ONT_TOGGLE_SORT_ORDER,
    IMPORT_PREVIEW_ONT_NEW_SORT_COLUMN,
    UPDATE_GERMPLASM_SORT,
    UPDATE_GERMPLASM_LIST_SORT,
    UPDATE_EXPERIMENT_SORT
} from "@/store/sorting/mutation-types";
import {SortState} from "@/store/sorting/types";
import {
    ExperimentSort,
    GermplasmSort,
    GermplasmListSort,
    LocationSort, OntologySort, OntologySortField,
    ProgramSort, SortOrder, SystemUserSort,
    TraitSortField,
    UserSort
} from "@/breeding-insight/model/Sort";

export const mutations: MutationTree<SortState> = {
    // active ontology table
    [ACTIVE_ONT_TOGGLE_SORT_ORDER](state: SortState) {
        state.activeOntologySort.order = state.activeOntologySort.order === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    },
    [ACTIVE_ONT_NEW_SORT_COLUMN](state: SortState, field: OntologySortField) {
        state.activeOntologySort.field = field;
    },

    // archived ontology table
    [ARCHIVED_ONT_TOGGLE_SORT_ORDER](state: SortState) {
        state.archivedOntologySort.order = state.archivedOntologySort.order === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    },
    [ARCHIVED_ONT_NEW_SORT_COLUMN](state: SortState, field: OntologySortField) {
        state.archivedOntologySort.field = field;
    },

    // importPreview ontology table
    [IMPORT_PREVIEW_ONT_TOGGLE_SORT_ORDER](state: SortState) {
        state.importPreviewOntologySort.order = state.importPreviewOntologySort.order === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    },
    [IMPORT_PREVIEW_ONT_NEW_SORT_COLUMN](state: SortState, field: OntologySortField) {
        state.importPreviewOntologySort.field = field;
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
    [UPDATE_SYSTEM_USER_SORT](state: SortState, sort: SystemUserSort) {
        state.systemUserSort.field = sort.field;
        state.systemUserSort.order = sort.order;
    },

    //program table
    [UPDATE_PROGRAM_SORT](state: SortState, sort: ProgramSort) {
        state.programSort.field = sort.field;
        state.programSort.order = sort.order;
    },

    //germplasm table
    [UPDATE_GERMPLASM_SORT](state: SortState, sort: GermplasmSort) {
        state.germplasmSort.field = sort.field;
        state.germplasmSort.order = sort.order;
    },

    //germplasm list table
    [UPDATE_GERMPLASM_LIST_SORT](state: SortState, sort: GermplasmListSort) {
        state.germplasmListSort.field = sort.field;
        state.germplasmListSort.order = sort.order;
    },

    //experiments and observations table
    [UPDATE_EXPERIMENT_SORT](state: SortState, sort: ExperimentSort) {
        state.experimentSort.field = sort.field;
        state.experimentSort.order = sort.order;
    }
};
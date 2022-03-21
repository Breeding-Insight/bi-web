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

import {GetterTree} from 'vuex';
import {RootState} from "@/store/types";
import {SortState} from "@/store/sorting/types";
import {
    LocationSort, OntologySort,
    ProgramSort,
    ProgramSortField,
    SortOrder, SystemUserSort, SystemUserSortField,
    TraitSortField,
    UserSort,
    UserSortField
} from "@/breeding-insight/model/Sort";

const orderMap: any = {[SortOrder.Ascending]: 'asc', [SortOrder.Descending]: 'desc'};

export const getters: GetterTree<SortState, RootState> = {

    // active ontology table
    activeOntologySort(state: SortState): OntologySort {
        return state.activeOntologySort;
    },
    activeOntologySortOrder(state: SortState): SortOrder {
      return state.activeOntologySort.order;
    },

    // archived ontology table
    archivedOntologySort(state: SortState): OntologySort {
        return state.archivedOntologySort;
    },
    archivedOntologySortOrder(state: SortState): SortOrder {
        return state.archivedOntologySort.order;
    },

    // archived ontology table
    importPreviewOntologySort(state: SortState): OntologySort {
        return state.importPreviewOntologySort;
    },
    importPreviewOntologySortOrder(state: SortState): SortOrder {
        return state.importPreviewOntologySort.order;
    },

    // program user table
    programUserSort(state: SortState): UserSort {
        return state.programUserSort;
    },
    programUserSortFieldAsBuefy(state: SortState): string {
        const fieldMap: any = {
            [UserSortField.Email]: 'data.email',
            [UserSortField.Name]: 'data.name',
            [UserSortField.Roles]: 'data.roleName'
        };
        return fieldMap[state.programUserSort.field];
    },
    programUserSortOrderAsBuefy(state: SortState): string {
        return orderMap[state.programUserSort.order];
    },

    // location table
    locationSort(state: SortState): LocationSort {
        return state.locationSort;
    },
    locationSortOrderAsBuefy(state: SortState): string {
        return orderMap[state.locationSort.order];
    },

    // system user table
    systemUserSort(state: SortState): SystemUserSort {
        return state.systemUserSort;
    },
    systemUserSortFieldAsBuefy(state: SortState): string {
        const fieldMap: any = {
            [SystemUserSortField.Email]: 'data.email',
            [SystemUserSortField.Name]: 'data.name',
            [SystemUserSortField.Roles]: 'data.roleName',
            [SystemUserSortField.Programs]: 'data.programList'
        };
        return fieldMap[state.systemUserSort.field];
    },
    systemUserSortOrderAsBuefy(state: SortState): string {
        return orderMap[state.systemUserSort.order];
    },

    // program table
    programSort(state: SortState): ProgramSort {
        return state.programSort;
    },
    programSortFieldAsBuefy(state: SortState): string {
        const fieldMap: any = {
            [ProgramSortField.Name]: 'data.name',
            [ProgramSortField.Key]: 'data.key',
            [ProgramSortField.SpeciesName]: 'data.species',
            [ProgramSortField.NumUsers]: 'data.numUsers',
            [ProgramSortField.BrapiUrl]: 'data.brapiUrl'
        };
        return fieldMap[state.programSort.field];
    },
    programSortOrderAsBuefy(state: SortState): string {
        return orderMap[state.programSort.order];
    }
};
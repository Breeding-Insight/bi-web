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
    LocationSort,
    LocationSortField, ProgramSort, ProgramSortField,
    SortOrder,
    TraitSortField,
    UserSort,
    UserSortField
} from "@/breeding-insight/model/Sort";

const orderMap: any = {[SortOrder.Ascending]: 'asc', [SortOrder.Descending]: 'desc'};

export const getters: GetterTree<SortState, RootState> = {
    // active ontology table
    activeTraitSortField(state: SortState): TraitSortField {
        return state.activeTraitSortField;
    },
    activeOntNameSortOrder(state: SortState): boolean {
        return state.activeOntNameSortOrder;
    },
    activeOntMethodSortOrder(state: SortState): boolean {
        return state.activeOntMethodSortOrder;
    },
    activeOntScaleClassSortOrder(state: SortState): boolean {
        return state.activeOntScaleClassSortOrder;
    },
    activeOntUnitSortOrder(state: SortState): boolean {
        return state.activeOntUnitSortOrder;
    },

    // archived ontology table
    archivedTraitSortField(state: SortState): TraitSortField {
        return state.archivedTraitSortField;
    },
    archivedOntNameSortOrder(state: SortState): boolean {
        return state.archivedOntNameSortOrder;
    },
    archivedOntMethodSortOrder(state: SortState): boolean {
        return state.archivedOntMethodSortOrder;
    },
    archivedOntScaleClassSortOrder(state: SortState): boolean {
        return state.archivedOntScaleClassSortOrder;
    },
    archivedOntUnitSortOrder(state: SortState): boolean {
        return state.archivedOntUnitSortOrder;
    },

    // program user table
    programUserSort(state: SortState): UserSort {
        return state.programUserSort;
    },
    programUserSortFieldAsBuefy(state: SortState): string {
        const fieldMap: any = {[UserSortField.Email]: 'data.email', [UserSortField.Name]: 'data.name'};
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
    systemUserSort(state: SortState): UserSort {
        return state.systemUserSort;
    },
    systemUserSortFieldAsBuefy(state: SortState): string {
        const fieldMap: any = {
            [UserSortField.Email]: 'data.email',
            [UserSortField.Name]: 'data.name'
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
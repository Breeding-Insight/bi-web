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
import {getters} from '@/store/sorting/getters';
import {mutations} from '@/store/sorting/mutations';
import {RootState} from '@/store/types';
import {
    GermplasmSort,
    GermplasmSortField,
    LocationSort,
    LocationSortField,
    OntologySort,
    OntologySortField,
    ProgramSort,
    ProgramSortField,
    SortOrder, SystemUserSort, SystemUserSortField,
    UserSort,
    UserSortField
} from "@/breeding-insight/model/Sort";
import {SortState} from "@/store/sorting/types";

export let state: SortState;
state = {
    // active ontology table
    activeOntologySort: new OntologySort(OntologySortField.Name, SortOrder.Ascending),

    // archived ontology table
    archivedOntologySort: new OntologySort(OntologySortField.Name, SortOrder.Ascending),

    // import preview ontology table
    importPreviewOntologySort: new OntologySort(OntologySortField.Name, SortOrder.Ascending),

    // program user table
    programUserSort: new UserSort(UserSortField.Name, SortOrder.Ascending),

    // location table
    locationSort: new LocationSort(LocationSortField.Name, SortOrder.Ascending),

    // system user table
    systemUserSort: new SystemUserSort(SystemUserSortField.Name, SortOrder.Ascending),

    // program table
    programSort: new ProgramSort(ProgramSortField.Name, SortOrder.Ascending),

    // program table
    germplasmSort: new GermplasmSort(GermplasmSortField.AccessionNumber, SortOrder.Ascending)
};

const namespaced: boolean = true

export const sorting: Module<SortState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
};
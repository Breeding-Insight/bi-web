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
import {TraitSortField} from "@/breeding-insight/model/Sort";
import {SortState} from "@/store/sorting/types";

export const state: SortState = {
    // ontology table
    traitSortField: TraitSortField.Name,
    nameSortOrder: true,
    methodSortOrder: true,
    scaleClassSortOrder: true,
    unitSortOrder: true
};

const namespaced: boolean = true

export const sorting: Module<SortState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
};
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
import {TraitSortField} from "@/breeding-insight/model/Sort";

export const getters: GetterTree<SortState, RootState> = {
    traitSortField(state: SortState): TraitSortField {
        return state.traitSortField;
    },
    nameSortOrder(state: SortState): boolean {
        return state.nameSortOrder;
    },
    methodSortOrder(state: SortState): boolean {
        return state.methodSortOrder;
    },
    scaleClassSortOrder(state: SortState): boolean {
        return state.scaleClassSortOrder;
    },
    unitSortOrder(state: SortState): boolean {
        return state.unitSortOrder;
    }
};
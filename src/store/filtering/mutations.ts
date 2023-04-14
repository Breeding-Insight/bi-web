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
import {FilterState} from "@/store/filtering/types";
import {GermplasmFilter} from "@/breeding-insight/model/GermplasmFilter";
import {UPDATE_GERMPLASM_FILTER} from "@/store/filtering/mutation-types";

export const mutations: MutationTree<FilterState> = {
    //germplasm table
    [UPDATE_GERMPLASM_FILTER](state: FilterState, filter: GermplasmFilter) {
        state.germplasmFilter = filter;
    }
};
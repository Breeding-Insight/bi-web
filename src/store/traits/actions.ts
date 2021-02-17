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

import {TraitState} from "@/store/traits/types";
import {RootState} from "@/store/types";
import {ActionTree} from 'vuex';
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {TraitService} from "@/breeding-insight/service/TraitService";
import {Trait} from "@/breeding-insight/model/Trait";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {LOAD_TRAITS} from "@/store/traits/mutation-types";

export const actions: ActionTree<TraitState, RootState> = {
    async getAllTraits({commit, getters, rootGetters}): Promise<void> {
        try {
            let traits: Trait[] = getters.all;
            let metadata: Metadata;

            if (traits.length === 0) {
                let paginationQuery: PaginationQuery = rootGetters['traits/pagination/getPaginationSelections'](
                    0, 0, true
                );

                [traits, metadata] = await TraitService.getAll(
                    rootGetters.activeProgram!.id!,
                    paginationQuery,
                    true
                );
            }

            commit(LOAD_TRAITS, traits);
        } catch(error) {
            throw error;
        }
    }
};
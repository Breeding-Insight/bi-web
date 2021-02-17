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
import {getters} from '@/store/traits/archive/getters';
import {actions} from '@/store/traits/archive/actions';
import {mutations} from '@/store/traits/archive/mutations';
import {ArchiveState} from '@/store/traits/archive/types';
import {RootState} from '@/store/types';
import {pagination} from '@/store/pagination/index';
import {Pagination} from "@/breeding-insight/model/BiResponse";

export const state: ArchiveState = {
    archivedTraits: [],
    paginatedTraits: [],
    archivePagination: new Pagination()
};

const namespaced: boolean = true

export const archive: Module<ArchiveState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
    modules: {
        pagination
    }
};


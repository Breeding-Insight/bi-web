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
import {PaginationControllerState} from "@/store/pagination/types";
import {Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Trait} from "@/breeding-insight/model/Trait";

export const getters: GetterTree<PaginationControllerState, RootState> = {
    getMatchesCurrentRequest(state: PaginationControllerState): (pagination: Pagination) => boolean {
      return (pagination: Pagination): boolean => {
        if (state.currentCall) {
            if (state.showAll){
                return pagination.currentPage == 1 && pagination.totalPages == 1;
            } else {
                return state.currentCall.page === pagination.currentPage &&
                    state.currentCall.pageSize === pagination.pageSize;
            }
        }
        return false;
      };
    },
    getPaginationSelections(state: PaginationControllerState): (currentPage: number, pageSize: number, showAll: boolean) => PaginationQuery {
        return (currentPage: number, pageSize: number, showAll: boolean): PaginationQuery => {
            if (showAll) {
                return new PaginationQuery(0, 0, true);
            } else {
                return new PaginationQuery(
                    currentPage, pageSize, false);
            }
        }
    },
    mockPagination(state: PaginationControllerState, getters: GetterTree<PaginationControllerState, RootState>, rootGetters: any): (records: Trait[], page: number, pageSize: number, showAll: boolean) => [any[], Pagination] {
        return (records: Trait[], page: number, pageSize: number, showAll: boolean): [any[], Pagination] => {
            if (showAll){
                const newPagination: Pagination = new Pagination({
                    totalCount: records.length,
                    pageSize: records.length,
                    totalPages: 1,
                    currentPage: 1
                });
                return [records, newPagination];
            } else if (records.length === 0){
                const newPagination: Pagination = new Pagination({
                    totalCount: 0,
                    pageSize: pageSize,
                    totalPages: 1,
                    currentPage: page
                });
                return [[], newPagination];
            } else {
                const newPagination: Pagination = new Pagination({
                    totalCount: records.length,
                    pageSize: pageSize,
                    totalPages: records.length / pageSize,
                    currentPage: page
                });
                return [records.slice((page * pageSize - pageSize), (page * pageSize > records.length ? records.length : page * pageSize)), newPagination];
            }
        }
    }
};
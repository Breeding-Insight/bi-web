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

import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationUtilities} from "@/breeding-insight/model/view_models/PaginationUtilities";
import {GermplasmDAO} from "@/breeding-insight/dao/GermplasmDAO";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {GermplasmListSortField, SortOrder} from "@/breeding-insight/model/Sort";
import * as api from "@/util/api";
import {ListType} from "@/util/ListType";
import {ListFilter} from "@/breeding-insight/model/ListFilter";

export class ListService {
    static async deleteList(programId: string | undefined, listDbId: string) {
        if (programId == undefined) {
            throw new Error("Not valid program");
        }
        try {
            const response = await api.call({
                url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/deltalists/${listDbId}`,
                method: 'delete',
                params: { hardDelete: true }
            }) as Response;

            // If we get here, it means the call was successful (likely 200 OK)
            return new BiResponse({ success: true });

        } catch (error) {
            // Check if the error is actually a 204 No Content response
            if (error.response && error.response.status === 204) {
                // This is actually a successful deletion
                return new BiResponse({ success: true });
            }

            // For other errors, log and rethrow
            console.error('Error in deleteList:', error);
            throw error;
        }
    }

    static async getLists<T>(listType: ListType,
                             programId: string,
                             sort: { field: T, order: SortOrder },
                             pagination: {pageSize: number, page: number},
                             filters?: any): Promise<BiResponse> {
        if (!programId) throw 'Program ID required';

        // Set list type, sort, and pagination
        let params: any = { listType };
        if(filters) {
            params = filters;
        }

        if (sort.field) {
            params['sortField'] = sort.field;
        }
        if (sort.order) {
            params['sortOrder'] = sort.order;
        }
        if (pagination.page || pagination.page == 0) { //have to account for 0-index pagination since 0 falsy
            params['page'] = pagination.page;
        }
        if (pagination.pageSize) {
            params['pageSize'] = pagination.pageSize;
        }

        // Make the GET call
        try {
            const { data }: any = await api.call({
                url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/deltalists`,
                method: 'get',
                params: params
            });

            return new BiResponse(data);

        } catch (error) {
            throw error;
        }
    }

    static async getAllInList<T, U extends ListFilter>(
        listType: ListType,
        programId: string,
        sort: { field: T, order: SortOrder },
        pagination: { pageSize: number, page: number },
        { listDbId, listName, ...brapiFilters  }: U): Promise<BiResponse> {
        // Form the query params including list type, sorting, pagination, and filtering
        let params: any = { listType, ...brapiFilters };

        if (sort.field) {
            params['sortField'] = sort.field;
        }
        if (sort.order) {
            params['sortOrder'] = sort.order;
        }
        if (pagination.page || pagination.page == 0) { //have to account for 0-index pagination since 0 falsy
            params['page'] = pagination.page;
        }
        if (pagination.pageSize) {
            params['pageSize'] = pagination.pageSize;
        }

        try {
            let listId: String = '';

            if(listName && !listDbId) {
                //Get the list db id
                const paginationQuery = new PaginationQuery(0, 20, true);
                //const {result: {data: lists}} = await GermplasmDAO.getAllLists(programId, paginationQuery);
                const {result: {data: lists}} = await ListService.getLists<GermplasmListSortField>(
                    ListType.GERMPLASM,
                    programId,
                    { field: GermplasmListSortField.Name, order: SortOrder.Descending },
                    new PaginationQuery(0, 200, true));
                const matchingLists = lists.filter((list: any) => list.listName === listName);
                if (matchingLists.length === 0) throw Error("List name is not valid for this program");
                if (matchingLists.length > 1) throw Error("List name must be unique");
                listId = matchingLists[0].listDbId;
            } else if(listDbId) {
                listId = listDbId;
            } else {
                throw Error("Missing list id and name");
            }

            //Get the list germplasm
            const { data }: any = await api.call({
                url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/deltalists/${listId}`,
                method: 'get',
                params: params
            }) as Response;

            return new BiResponse(data);

        } catch(error) {
            throw error;
        }
    }

}

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

import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {SortOrder} from "@/breeding-insight/model/Sort";
import * as api from "@/util/api";
import {ListType} from "@/util/ListType";

export class ListService {
    static async deleteList(programId: string | undefined, listDbId: string) {
        if (programId == undefined) {
            throw new Error("Not valid program");
        }
        try {
            const response = await api.call({
                url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/lists/${listDbId}`,
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
            params = { listType, ...filters };
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
                url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/lists`,
                method: 'get',
                params: params
            });

            return new BiResponse(data);

        } catch (error) {
            throw error;
        }
    }
}

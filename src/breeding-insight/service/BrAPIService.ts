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

import * as api from "@/util/api";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import {SortOrder} from "@/breeding-insight/model/Sort";

export enum BrAPIType {
  GERMPLASM = "germplasm",
  EXPERIMENT = "trials",
  LIST = "lists"
}

export class BrAPIService {

  public static async get<T>(type: BrAPIType, programId: string, sort: { field: T, order: SortOrder },
                          pagination: {pageSize: number, page: number}, filters?: any): Promise<BiResponse> {
    if (!programId) throw 'Program ID required';
console.log(pagination.page);
    // Set sort and pagination
    let params: any = {};
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
      params ['page'] = pagination.page;
    }
    if (pagination.pageSize) {
      params['pageSize'] = pagination.pageSize;
    }

    // Make the GET call
    try {
      const { data } = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/${type}`,
        method: 'get',
        params: params
      }) as Response;

      return new BiResponse(data);

    } catch (error) {
      throw error;
    }
  }
}
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

import {ProgramLocation} from "@/breeding-insight/model/ProgramLocation";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {LocationSort} from "@/breeding-insight/model/Sort";

export class ProgramLocationDAO {

  static create(programLocation: ProgramLocation): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': programLocation.name };
  
      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programLocation.programId}/locations`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(programLocation: ProgramLocation): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': programLocation.name };

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programLocation.programId}/locations/${programLocation.id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static archive(programId: string, locationId: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/locations/${locationId}`, method: 'delete'});
  }

  static getAll(programId: string, {page, pageSize}: PaginationQuery, {field, order}: LocationSort): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {
      const config: any = {
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/locations`,
        method: 'get',
        params: {
          sortField: field,
          sortOrder: order,
          page,
          pageSize
        }
      };
      api.call(config)
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

}

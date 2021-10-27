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

import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {SortField} from "@/breeding-insight/model/SortField";

export class ProgramUserDAO {

  static create(programUser: ProgramUser): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'user': {'id': programUser.id, 'name': programUser.name, 'email': programUser.email}, 
                    'roles': [{'id': programUser.roleId}] };

      if (programUser.program){

        // Make api request
        api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programUser.program.id}/users`, method: 'post', data: body})
          .then((response: any) => {
            const biResponse = new BiResponse(response.data);
            resolve(biResponse);
          }).catch((error) => {reject(error)});

      } else {
        reject();
      }

    });
  }

  static update(programUser: ProgramUser): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'user': {'id': programUser.id}, 'roles': [{'id': programUser.roleId}] };

      if (programUser.program){
        api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programUser.program.id}/users/${programUser.id}`, method: 'put', data: body})
          .then((response: any) => {
            const biResponse = new BiResponse(response.data);
            resolve(biResponse);
          }).catch((error) => reject(error));
      } else {
        reject();
      }


    });
  }

  static delete(programId: string, userId: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/users/${userId}`, method: 'delete'});
  }

  static getAll(programId: string, paginationQuery: PaginationQuery, sortField: SortField | undefined): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      let params = {
        sortField: sortField ? sortField.sortField : undefined,
        sortOrder: sortField ? sortField.sortOrder : undefined,
        page: paginationQuery.page,
        pageSize: paginationQuery.pageSize
      };

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/users`, method: 'get', params: params })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

}

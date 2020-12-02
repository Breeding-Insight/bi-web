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

import {Program} from "@/breeding-insight/model/Program";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";


export class ProgramDAO {

  static create(program: Program): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': program.name, 'species': { 'id': program.speciesId } };

      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(id: string, program: Program): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': program.name, 'species': { 'id': program.speciesId } };

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static archive(id: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/archive/${id}`, method: 'delete'});
  }

  static getAll(paginationQuery: PaginationQuery): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs`, method: 'get'})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

  static getOne(programId: string): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}`, method: 'get' })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
        reject(error);
      })

    }))
  }

  static async getObservationLevels(programId: string): Promise<BiResponse> {

    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/observation-level`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

}

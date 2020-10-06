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

import {User} from "@/breeding-insight/model/User";
import * as api from "@/util/api";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {Role} from "@/breeding-insight/model/Role";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";

export class UserDAO {

  static getUserInfo(): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      api.call({url: `${process.env.VUE_APP_BI_API_V1_PATH}/userinfo`})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});
    });
  }

  static create(user: User, systemRoles: Role[]): Promise<BiResponse> {


    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': user.name, 'email': user.email, 'systemRoles': systemRoles};

      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(id: string, user: User): Promise<BiResponse> {


    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': user.name, 'email': user.email};

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static archive(id: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}`, method: 'delete'});
  }

  static getAll(paginationQuery: PaginationQuery): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users`, method: 'get'})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))

  }

  static updateSystemRoles(id: string, systemRoles: Array<Role>) {

    return new Promise<BiResponse>((resolve, reject) => {
      const body = {'systemRoles': systemRoles.map((role: Role) => {
        return {'id': role.id, 'domain': role.name}
      })};

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}/roles`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  //TODO: Remove when registration flow is complete
  static updateOrcid(id: string, orcid: string){

    return new Promise<BiResponse>((resolve, reject) => {
      const body = {'orcid': orcid}

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}/orcid`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });

  }

}
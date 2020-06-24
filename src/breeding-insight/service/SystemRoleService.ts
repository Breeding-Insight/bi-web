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

import {Role} from "@/breeding-insight/model/Role";
import {SystemRoleDao} from "@/breeding-insight/dao/SystemRoleDao";
import {Metadata} from "@/breeding-insight/model/BiResponse";

export class SystemRoleService {

  static errorGetRoles = "Unable to load system roles";

  static getAll(): Promise<[Role[], Metadata]> {
    return new Promise<[Role[], Metadata]>(((resolve, reject) => {

      SystemRoleDao.getAll().then((biResponse) => {

        const roles = biResponse.result.data.map((roles: any) => {
          return new Role(roles.id, roles.domain);
        });

        resolve([roles, biResponse.metadata]);

      }).catch((error) => {
        error['errorMessage'] = this.errorGetRoles;
        reject(error);
      });

    }));
  }

}
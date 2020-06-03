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

import {ProgramUserDAO} from "@/breeding-insight/dao/ProgramUserDAO";
import {ProgramUser} from "@/breeding-insight/model/ProgramUser";

export class ProgramUserService {

  static errorEmailInUse: String = "Error creating user, a user with this email already exists";
  static errorCreatingUser: String = "Error while creating user";

  static create(programUser: ProgramUser): Promise<ProgramUser> {

    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.id === undefined) {
        ProgramUserDAO.create(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram  = new ProgramUser(result.user.id, result.user.name, result.user.email, programUser.programId, result.roles[0].id);
          resolve(newProgram);

        }).catch((error) => {
          if (error.response && error.response.status === 409) {
            error['errorMessage'] = this.errorEmailInUse;
          } else {
            error['errorMessage'] = this.errorCreatingUser;
          }
          reject(error)
        });
      }
      else {
        reject();
      }

    });
  }

  static update(programUser: ProgramUser): Promise<ProgramUser> {

    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.id && programUser.programId) {
        ProgramUserDAO.update(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new ProgramUser(result.user.id, result.user.name, result.user.email, programUser.programId, result.roles[0].id);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static delete(programId: string, userId: string): Promise<ProgramUser> {

    return new Promise<any>(((resolve, reject) => {

      if (programId && userId){
        return ProgramUserDAO.delete(programId, userId)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  static getAll(programId: string): Promise<ProgramUser[]> {
    return new Promise<ProgramUser[]>(((resolve, reject) => {

      if (programId) {
        ProgramUserDAO.getAll(programId).then((biResponse) => {

          let programUsers: ProgramUser[] = [];
      
          // TODO: workaround for no program users for now
          if (biResponse.result.data) {
            programUsers = biResponse.result.data.map((programUser: any) => {
              return new ProgramUser(programUser.user.id, programUser.user.name, programUser.user.email, programId, programUser.roles[0].id);
            });
          }
      
          resolve(programUsers);
      
        }).catch((error) => reject(error));
      
      } else {
        reject();
      }
    }));
  }
}

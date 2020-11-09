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
import {Program} from "@/breeding-insight/model/Program";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {User} from "@/breeding-insight/model/User";
import {UserService} from "@/breeding-insight/service/UserService";

export class ProgramUserService {

  static errorEmailInUse: String = "Error creating user, a user with this email already exists";
  static errorCreatingUser: String = "Error while creating user";
  static errorAssignedUserToProgramErrorOrcid = "Successfully assigned user to program, error assigning ORCID iD to user.";
  static errorOrcidRequired = "ORCID iD required when creating a new user to add to the program";

  static create(programUser: ProgramUser): Promise<ProgramUser> {

    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.program) {

        ProgramUserDAO.create(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new Program(result.program.id, result.program.name);
          const newProgramUser  = new ProgramUser(result.user.id, result.user.name, result.user.email, result.roles[0].id, newProgram, result.active);
          resolve(newProgramUser);
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

      if (programUser.program && programUser.id) {

        ProgramUserDAO.update(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new Program(result.program.id, result.program.name);
          const newProgramUser = new ProgramUser(result.user.id, result.user.name, result.user.email, result.roles[0].id, newProgram, result.active);
          resolve(newProgramUser);

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

  static getAll(programId: string, paginationQuery?: PaginationQuery): Promise<[ProgramUser[], Metadata]> {
    return new Promise<[ProgramUser[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined){
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      if (programId) {
        ProgramUserDAO.getAll(programId, paginationQuery).then((biResponse) => {

          //TODO: Remove when backend sorts the data by default
          biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
          let programUsers: ProgramUser[] = [];

          programUsers = biResponse.result.data.map((programUser: any) => {
            const newProgram = new Program(programUser.program.id, programUser.program.name);
            return new ProgramUser(programUser.user.id, programUser.user.name, programUser.user.email, programUser.roles[0].id, newProgram, programUser.active);
          });

          //TODO: Remove when backend pagination is implemented
          let newPagination;
          [programUsers, newPagination] = PaginationController.mockPagination(programUsers, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
          biResponse.metadata.pagination = newPagination;

          resolve([programUsers, biResponse.metadata]);
      
        }).catch((error) => reject(error));
      
      } else {
        reject();
      }
    }));
  }
}

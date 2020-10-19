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
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import {Role} from "@/breeding-insight/model/Role";
import {Vue} from "vue-property-decorator";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {Program} from "@/breeding-insight/model/Program";
import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

export class UserService {

  static duplicateEmailMessage : string = 'Email is already in use.';
  static errorCreateUser: string = 'Unable to create user';
  static errorDeleteUser: string = 'Unable to archive user';
  static errorGetUsers: string = 'Error while trying to load roles';
  static errorDeleteUserNotFound: string = 'Unable to find user to deactivate';
  static errorDeleteUserNotAllowed: string = 'You are not allowed to deactivate this user.';
  static errorPermissionsEditUser: string = "You don't have permissions to edit the roles of this user.";
  static errorUpdatingOrcid: string = "Error assigning ORCID iD to user.";
  static errorUpdatingOrcidDuplicate: string = "ORCID iD already in use by another user.";
  static errorUpdatingOrcidOnPutDuplicate: string = "User updated, but could not update ORCID iD. ORCID iD already in use.";
  static errorUpdatingOrcidOnPut: string = "User updated, but could not update ORCID iD";

  static getUserInfo(): Promise<User> {

    return new Promise<User>((resolve, reject) => {
      UserDAO.getUserInfo().then((biResponse: BiResponse) => {
        const result: any = biResponse.result;
        const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
        const user = new User(result.id, result.name, result.orcid, result.email, role);
        resolve(user);
      }).catch((error: any) => reject(error));
    });
  }

  static create(user: User): Promise<User> {
    //TODO: Check everything is good
    return new Promise<User>((resolve, reject) => {

      //TODO: Remove orcid check when registration flow is complete
      if (user.id === undefined && user.orcid) {
        const systemRoles = [];
        if (user.roleId) { systemRoles.push(new Role(user.roleId)) }

        UserDAO.create(user, systemRoles).then((biResponse) => {
          const result: any = biResponse.result;
          const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
          let newUser = new User(result.id, result.name, result.orcid, result.email, role);
          resolve(newUser);
        }).catch((error) => {
          if (error.response && error.response.status === 409) {
            Vue.$log.info('Email already exists');
            error['errorMessage'] = this.duplicateEmailMessage;
          } else {
            Vue.$log.fatal(error);
            error['errorMessage'] = this.errorCreateUser;
          }
          reject(error);
        });
      }
      else {
        reject();
      }

    });
  }

  static update(user: User): Promise<User> {
    //TODO: Check everything is good
    return new Promise<User>((resolve, reject) => {

      if (user.id) {
        UserDAO.update(user.id, user).then((biResponse) => {
          const result: any = biResponse.result;
          const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
          let newUser = new User(result.id, result.name, result.orcid, result.email, role);

          //TODO: Remove this when registration flow is complete
          this.updateOrcid(user).then((updatedUser) => {
            newUser.orcid = updatedUser.orcid;
            resolve(newUser);
          }).catch((error) => {
            if (error.response && error.response.status === 409) {
              error['errorMessage'] = this.errorUpdatingOrcidOnPutDuplicate;
            } else {
              error['errorMessage'] = this.errorUpdatingOrcidOnPut;
            }
            reject(error);
          });

        }).catch((error) => {
          if (error.response && error.response.status === 409) {
            Vue.$log.info('Email already exists');
            error['errorMessage'] = this.duplicateEmailMessage;
          } else {
            Vue.$log.fatal(error);
            error['errorMessage'] = this.errorCreateUser;
          }
          reject(error);
        });
      }
      else {
        reject();
      }
    });
  }

  static archive(user: User): Promise<any> {

    return new Promise<any>(((resolve, reject) => {

      if (user.id){
        return UserDAO.archive(user.id)
          .then(() => resolve())
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              error['errorMessage'] = this.errorDeleteUserNotFound;
            } else if (error.response && error.response.status === 403) {
              error['errorMessage'] = this.errorDeleteUserNotAllowed;
            } else {
              error['errorMessage'] = this.errorDeleteUser;
            }
            reject(error)
          });
      } else {
        reject();
      }

    }))
  }

  static getAll(paginationQuery?: PaginationQuery): Promise<[User[], Metadata]> {
    return new Promise<[User[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined){
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      UserDAO.getAll(paginationQuery).then((biResponse) => {

        biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
        // Parse our users into the vue users param
        let users = biResponse.result.data.map((user: any) => {
          const role: Role | undefined = this.parseSystemRoles(user.systemRoles);
          const programRoles: ProgramUser[] | undefined = this.parseProgramRoles(user.programRoles);
          return new User(user.id, user.name, user.orcid, user.email, role, programRoles);
        });
        //TODO: Remove when backend pagination is implemented
        let newPagination;
        [users, newPagination] = PaginationController.mockPagination(users, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
        biResponse.metadata.pagination = newPagination;

        resolve([users, biResponse.metadata]);

      }).catch((error) => {
        error['errorMessage'] = this.errorGetUsers;
        reject(error)
      });

    }));
  }

  static updateSystemRoles(user: User): Promise<User> {

    return new Promise<User>((resolve, reject) => {

      if (user.id) {
        const systemRoles = [];
        if (user.roleId) { systemRoles.push(new Role(user.roleId)) }

        UserDAO.updateSystemRoles(user.id, systemRoles).then((biResponse) => {
          const result: any = biResponse.result;
          const role: Role | undefined = this.parseSystemRoles(result.systemRoles);
          const newUser = new User(result.id, result.name, result.orcid, result.email, role);
          resolve(newUser);

        }).catch((error) => {
          if (error.response && error.response.status === 403) {
            Vue.$log.info('Unable to edit own roles');
            error['errorMessage'] = this.errorPermissionsEditUser;
          } else {
            Vue.$log.fatal(error);
            error['errorMessage'] = this.errorCreateUser;
          }
          reject(error)
        });

        return;
      }
      reject();
    });
  }

  //TODO: Remove when registration flow is complete
  static updateOrcid(user: User) {

    return new Promise<User>((resolve, reject) => {
      if (user.id && user.orcid){
        UserDAO.updateOrcid(user.id, user.orcid!).then((biResponse) => {
          const result: any = biResponse.result;
          user.orcid = result.orcid;
          resolve(user);
        }).catch((error) => {
          if (error.response && error.response.status === 409) {
            error['errorMessage'] = this.errorUpdatingOrcidDuplicate;
          } else {
            error['errorMessage'] = this.errorUpdatingOrcid;
          }
          Vue.$log.fatal(error);
          reject(error);
        })
      } else {
        reject();
      }
    });

  }

  private static parseSystemRoles(systemRoles: any[]): Role | undefined {
    if (systemRoles && systemRoles.length > 0){
      return new Role(systemRoles[0].id, systemRoles[0].domain);
    }
    return undefined;
  }

  private static parseProgramRoles(programRoleResponse: any[]): ProgramUser[] | undefined {

    if (programRoleResponse && programRoleResponse.length > 0) {

      let programRoles: ProgramUser[] = [];
      for (const programRole of programRoleResponse){

        // Get the program
        const programResponse: any = programRole.program;
        let program: Program | undefined;
        if (programResponse){
          if (programResponse.id && programResponse.name){
            program = new Program(programResponse.id, programResponse.name);
          }
        }

        // Get the roles for that program
        const roleArrayResponse: any[] = programRole.roles;
        let role: Role | undefined;
        if (roleArrayResponse) {
          // We only have one role per program user right now
          if (roleArrayResponse.length > 0){
            const roleResponse: any = roleArrayResponse[0];
            if (roleResponse){
              if (roleResponse.id && roleResponse.domain){
                role = new Role(roleResponse.id, roleResponse.domain);
              }
            }
          }
        }

        // Both need to exist for us to assign the data to the user
        if (role && program){
          const newProgramUser: ProgramUser = new ProgramUser(programRole.id, undefined, undefined,
            role.id, program, programRole.active);
          programRoles.push(newProgramUser);
        }
      }
      return programRoles;
    }
  }

  static openIdLogout(): Promise<any> {
    if (process.env.VUE_APP_OPENID_LOGOUT_URL) {
      return UserDAO.openIdLogout(process.env.VUE_APP_OPENID_LOGOUT_URL);
    } else {
      Vue.$log.info("Open ID logout url not specified. Skipping forced login.");
      return new Promise((resolve) => {resolve()});
    }

  }

}
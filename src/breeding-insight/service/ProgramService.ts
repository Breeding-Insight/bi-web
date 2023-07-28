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

import {ProgramDAO} from "@/breeding-insight/dao/ProgramDAO";
import {Program} from "@/breeding-insight/model/Program";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {ProgramObservationLevel} from "@/breeding-insight/model/ProgramObservationLevel";
import {ProgramSort, ProgramSortField, SortOrder} from "@/breeding-insight/model/Sort";

export class ProgramService {

  static unsupportedBrapiUrl : string = 'BrAPI URL specified is not supported';
  static errorCreatingProgram : string = 'Error creating program';
  static duplicateProgramName: string = 'A program with the same name already exists';
  static duplicateProgramKey: string = 'A program with the same key already exists';
  static PROGRAM_NAME_IN_USE: string = "PROGRAM_NAME_IN_USE";
  static PROGRAM_KEY_IN_USE: string = "PROGRAM_KEY_IN_USE";

  static create(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<Program>((resolve, reject) => {

      if (program.id === undefined) {
        ProgramDAO.create(program).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new Program(result.id, result.name, result.species.id, result.numUsers, result.brapiUrl, result.key);
          resolve(newProgram);

        }).catch((error) => {
          if (error.response && error.response.status === 409 && error.response.statusText === ProgramService.PROGRAM_NAME_IN_USE) {
            error['errorMessage'] = this.duplicateProgramName;
          } else if (error.response && error.response.status === 409 && error.response.statusText === ProgramService.PROGRAM_KEY_IN_USE) {
            error['errorMessage'] = this.duplicateProgramKey;
          } else if (error.response && error.response.status === 422) {
            error['errorMessage'] = this.unsupportedBrapiUrl;
          } else {
            error['errorMessage'] = this.errorCreatingProgram;
          }
          reject(error);
        });
      }
      else {
        reject();
      }

    });
  }

  static update(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<Program>((resolve, reject) => {

      if (program.id) {
        ProgramDAO.update(program.id, program).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new Program(result.id, result.name, result.species.id, result.numUsers, result.brapiUrl, result.key);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static archive(id: string): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<any>(((resolve, reject) => {

      if (id){
        return ProgramDAO.archive(id)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  // the PaginationQuery 'showAll' is not being honored by the ProgramDAO.getAll() method.  So, for now, the pageSize default is set to 1000 (instead of 50)
  static getAll(paginationQuery: PaginationQuery = new PaginationQuery(1, 1000, true),
                sort: ProgramSort = new ProgramSort(ProgramSortField.Name, SortOrder.Ascending)): Promise<[Program[], Metadata]> {
    return new Promise<[Program[], Metadata]>(((resolve, reject) => {

      ProgramDAO.getAll(paginationQuery, sort).then((biResponse) => {

        let programs: Program[] = [];

        // Parse our programs into the vue programs param
        programs = biResponse.result.data.map((program: any) => {
          return new Program(program.id, program.name, program.species.id, program.numUsers, program.brapiUrl, program.key);
        });

        resolve([programs, biResponse.metadata]);
    
      }).catch((error) => reject(error));
    
    }));
  }

  static getOne(programId: string): Promise<Program> {
    return new Promise<Program>(((resolve, reject) => {

      if (programId === null) {
        reject();
      }

      ProgramDAO.getOne(programId).then((biResponse) => {
        const result = biResponse.result;
        const program = new Program(result.id, result.name, result.species.id, result.numUsers, result.brapiUrl, result.key);
        resolve(program);
      }).catch((error) => reject(error));

    }));
  }

  static async getObservationLevels(programId: string): Promise<[ProgramObservationLevel[], Metadata] | void> {
    if (programId) {
      const { result: { data }, metadata } = await ProgramDAO.getObservationLevels(programId);
      return [data, metadata];
    }
    else return;
  }

}


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

import {ProgramLocationDAO} from "@/breeding-insight/dao/ProgramLocationDAO";
import {ProgramLocation} from "@/breeding-insight/model/ProgramLocation";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

export class ProgramLocationService {

  static create(programLocation: ProgramLocation): Promise<ProgramLocation> {

    return new Promise<ProgramLocation>((resolve, reject) => {

      if (programLocation.id === undefined) {
        ProgramLocationDAO.create(programLocation).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgramLocation  = new ProgramLocation(result.id, result.programId, result.name);
          resolve(newProgramLocation);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(programLocation: ProgramLocation): Promise<ProgramLocation> {

    return new Promise<ProgramLocation>((resolve, reject) => {

      if (programLocation.id && programLocation.programId) {
        ProgramLocationDAO.update(programLocation).then((biResponse) => {
          const result: any = biResponse.result;
          const updatedProgramLocation = new ProgramLocation(result.id, result.programId, result.name);
          resolve(updatedProgramLocation);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static delete(programId: string, locationId: string): Promise<ProgramLocation> {

    return new Promise<any>(((resolve, reject) => {

      if (programId && locationId){
        return ProgramLocationDAO.archive(programId, locationId)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  static getAll(programId: string, paginationQuery?: PaginationQuery): Promise<[ProgramLocation[], Metadata]> {
    return new Promise<[ProgramLocation[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined){
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      if (programId) {
        ProgramLocationDAO.getAll(programId, paginationQuery).then((biResponse) => {

          let programLocations: ProgramLocation[] = [];
      
          // TODO: workaround for no program locations for now
          if (biResponse.result.data) {
            programLocations = biResponse.result.data.map((programLocation: any) => {
              return new ProgramLocation(programLocation.id, programLocation.programId, programLocation.name);
            });
            //TODO: Remove when backend pagination is implemented
            let newPagination;
            [programLocations, newPagination] = PaginationController.mockPagination(programLocations, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
            biResponse.metadata.pagination = newPagination;
          }
      
          resolve([programLocations, biResponse.metadata]);
      
        }).catch((error) => reject(error));
      
      } else {
        reject();
      }
    }));
  }
}

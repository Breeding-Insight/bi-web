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
import {LocationSort, LocationSortField, SortOrder} from "@/breeding-insight/model/Sort";

export class ProgramLocationService {

  static forbiddenCreateLocation = "You do not have permissions to add a location to this program";
  static forbiddenUpdateLocation = "You do not have permissions to edit this location";
  static forbiddenDeleteLocation: String = "You do not have permissions to delete this location";
  static errorCreatingLocation: String = "Error while creating location";
  static errorUpdatingLocation: String = "Error while updating location";
  static errorDeletingLocation: String = "Error while deleting location";

  static create(programLocation: ProgramLocation): Promise<ProgramLocation> {

    return new Promise<ProgramLocation>((resolve, reject) => {

      if (programLocation.id === undefined) {
        ProgramLocationDAO.create(programLocation).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgramLocation  = new ProgramLocation(result.id, result.programId, result.name);
          resolve(newProgramLocation);

        }).catch((error) => {
          if (error.response && error.response.status === 403) {
            error['errorMessage'] = this.forbiddenCreateLocation;
          } else {
            error['errorMessage'] = this.errorCreatingLocation;
          }
          reject(error);
        });
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

        }).catch((error) => {
          if (error.response && error.response.status === 403) {
            error['errorMessage'] = this.forbiddenUpdateLocation;
          } else {
            error['errorMessage'] = this.errorUpdatingLocation;
          }
          reject(error);
        });
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
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              error['errorMessage'] = this.forbiddenDeleteLocation;
            } else {
              error['errorMessage'] = this.errorDeletingLocation;
            }
            reject(error);
          });
      } else {
        reject();
      }

    }));
  }

  static getAll(programId: string,
                paginationQuery: PaginationQuery = new PaginationQuery(1, 50, true),
                sort: LocationSort = new LocationSort(LocationSortField.Name, SortOrder.Ascending)): Promise<[ProgramLocation[], Metadata]> {
    return new Promise<[ProgramLocation[], Metadata]>(((resolve, reject) => {

      if (programId) {
        ProgramLocationDAO.getAll(programId, paginationQuery, sort).then((biResponse) => {

          let programLocations: ProgramLocation[] = [];

          programLocations = biResponse.result.data.map((programLocation: any) => {
            return new ProgramLocation(programLocation.id, programLocation.programId, programLocation.name);
          });

          resolve([programLocations, biResponse.metadata]);
      
        }).catch((error) => reject(error));
      
      } else {
        reject();
      }
    }));
  }
}

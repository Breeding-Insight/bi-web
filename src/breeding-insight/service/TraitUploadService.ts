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

import {ProgramUpload} from "@/breeding-insight/model/ProgramUpload";
import {TraitUploadDAO} from '@/breeding-insight/dao/TraitUploadDAO';
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {Trait} from "@/breeding-insight/model/Trait";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {OntologySort, OntologySortField, SortOrder} from "@/breeding-insight/model/Sort";

export class TraitUploadService {

  static errorContactingServer: string = "Unknown error when contacting server. Please try again.";
  static errorUnknown: string = "Unable to determine reason for failure upload. Please check file and try again.";
  static forbiddenUploadingFile: string = "You do not have permission to upload ontology terms";

  static async deleteTraits(programId: string): Promise<void|Error> {
    try {
      await TraitUploadDAO.deleteTraits(programId);
    } catch(err) {
      return new Error(err.message);
    }
  }

  static uploadFile(programId: string, file: File): Promise<ProgramUpload> {

    return new Promise<ProgramUpload>((resolve, reject) => {

      if (file !== null && programId) {
        TraitUploadDAO.update(programId, file).then((biResponse) => {
          const result: any = biResponse.result;

          let traits: Trait[] = [];

          traits = biResponse.result.data.map((trait: any) => {
            return trait as Trait;
          });

          const upload = new ProgramUpload(result.id, traits);
          resolve(upload);

        }).catch((error) => {
          if (error.response && error.response.status === 403) {
            reject(this.forbiddenUploadingFile);
          }
          if (error.response){
            reject(this.parseError(error));
          } else {
            reject(this.errorContactingServer);
          }

        });
      }
      else {
        reject();
      }

    });
  }

  static getTraits(programId: string,
                   paginationQuery: PaginationQuery = new PaginationQuery(1,50,true),
                   sort: OntologySort = new OntologySort(OntologySortField.Name, SortOrder.Ascending)): Promise<[ProgramUpload, Metadata]> {
    return new Promise<[ProgramUpload, Metadata]>(((resolve, reject) => {

      if (programId) {
        TraitUploadDAO.getTraitUpload(programId, paginationQuery, sort).then((biResponse) => {

          let traits: Trait[] = [];

          traits = biResponse.result.data.map((trait: any) => {
            return trait as Trait;
          });

          let upload: ProgramUpload = new ProgramUpload(biResponse.result.id, traits);

          resolve([upload, biResponse.metadata]);

        }).catch((error) => reject(error));

      } else {
        reject();
      }
    }));
  }

  static async confirmUpload(programId: string, traitUploadId: string): Promise<void|Error> {
    try {
      await TraitUploadDAO.confirmUpload(programId, traitUploadId);
      return;
    } catch (error) {
      throw 'Error saving ontology terms';
    }
  }

  static parseError(error: any): ValidationError | string {

    const jsonError = error.response;
    if (jsonError.data){
      const rowErrors = jsonError.data.rowErrors;
      if (rowErrors) {
        let validationError: ValidationError = new ValidationError(rowErrors);
        return validationError;
      } else {
        return jsonError;
      }
    } else {
      if (jsonError.statusText){
        return jsonError.statusText;
      } else {
        return this.errorUnknown;
      }
    }
  }

}

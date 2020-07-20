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
import { TraitUploadDAO } from '@/breeding-insight/dao/TraitUploadDAO';
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {Trait} from "@/breeding-insight/model/Trait";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

export class TraitUploadService {

  static uploadFile(programId: string, file: File): Promise<ProgramUpload> {

    return new Promise<ProgramUpload>((resolve, reject) => {

      if (file !== null) {
        TraitUploadDAO.update(programId, file).then((biResponse) => {
          const result: any = biResponse.result;

          let traits: Trait[] = [];

          traits = biResponse.result.data.map((trait: any) => {
            return trait as Trait;
          });

          const upload = new ProgramUpload(result.id, traits);
          resolve(upload);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static getTraits(programId: string, paginationQuery?: PaginationQuery): Promise<[Trait[], Metadata]> {
    return new Promise<[Trait[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined){
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      if (programId) {
        TraitUploadDAO.getTraitUpload(programId, paginationQuery).then((biResponse) => {

          //TODO: Remove when backend sorts the data by default
          biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
          let traits: Trait[] = [];
      
          traits = biResponse.result.data.map((trait: any) => {
            return trait as Trait;
          });

          //TODO: Remove when backend pagination is implemented
          let newPagination;
          [traits, newPagination] = PaginationController.mockPagination(traits, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
          biResponse.metadata.pagination = newPagination;

          resolve([traits, biResponse.metadata]);
      
        }).catch((error) => reject(error));
      
      } else {
        reject();
      }
    }));
  }

}
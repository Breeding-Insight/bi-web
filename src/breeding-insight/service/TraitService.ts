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

import {TraitDAO} from "@/breeding-insight/dao/TraitDAO";
import {Trait} from "@/breeding-insight/model/Trait";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {TraitUploadService} from "@/breeding-insight/service/TraitUploadService";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";

export class TraitService {

  static notAllowed : string = 'Trait has associated observations and cannot be updated';

  static async createTraits(programId: string, newTraits: Trait[]): Promise<[Trait[], Metadata]> {
    if (programId) {
      try {
        const { result: { data }, metadata } = await TraitDAO.createTraits(programId, newTraits);
        return [data, metadata];
      } catch (error) {
        throw TraitUploadService.parseError(error);
      }
    }
    else throw 'Unable to create trait';
  }

    static async updateTraits(programId: string, traits: Trait[]): Promise<[Trait[], Metadata]> {
      if (programId && traits) {
        // Check that they all have a trait id
        if (traits.filter(trait => trait.id).length !== traits.length) {
          throw 'Unable to update trait';
        }

        try {
          const { result: { data }, metadata } = await TraitDAO.updateTraits(programId, traits);
          return [data, metadata];
        } catch (error) {
          if (error.response && error.response.status === 405) {
            throw this.notAllowed;
          }
          throw TraitUploadService.parseError(error);
        }
      }
      else throw 'Unable to update trait';
    }

    static async archiveTrait(programId: string, trait: Trait): Promise<Trait> {

      if (programId && trait) {
        // Check that they all have a trait id
        if (!trait.id){
          throw 'Unable to update trait';
        }

        try {
          const { result, metadata } = await TraitDAO.archiveTrait(programId, trait);
          return Trait.assign(result);
        } catch (error) {
          throw TraitUploadService.parseError(error);
        }
      }
      else throw 'Unable to update trait';
    }

    static getAll(programId: string, paginationQuery?: PaginationQuery, full?: boolean): Promise<[Trait[], Metadata]> {
        return new Promise<[Trait[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined){
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      if (full === undefined) {
        full = false;
      }

      if (programId) {
          TraitDAO.getAll(programId, paginationQuery, full).then((biResponse) => {

          let traits: Trait[] = [];

          if (biResponse.result.data) {
            //TODO: Remove when backend default sorting is implemented
            biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
            traits = biResponse.result.data.map((trait: any) => {
                return trait as Trait;
            });
          }

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

  static async getTraitEditable(programId: string, traitId: string): Promise<[boolean, Metadata]> {
    if (programId && traitId) {
      try {
        const response = await TraitDAO.getTraitEditable(programId, traitId);
        return [response.result.editable, response.metadata];
      } catch (error) {
        throw error;
      }
    }
    else throw 'Unable to get trait editable info';
  }
}

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
import {BiResponse, Metadata, Response} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {ValidationErrorService} from "@/breeding-insight/service/ValidationErrorService";
import {TraitField, TraitFilter, TraitSelector} from "@/breeding-insight/model/TraitSelector";
import {OntologySort, OntologySortField, SortOrder} from "@/breeding-insight/model/Sort";
import * as api from "@/util/api";

export class TraitService {

  static notAllowed : string = 'Trait has associated observations and cannot be updated';
  static errorUpdating: string = 'Error updating trait';

  static async createTraits(programId: string, newTraits: Trait[]): Promise<[Trait[], Metadata]> {
    if (programId) {
      try {
        const { result: { data }, metadata } = await TraitDAO.createTraits(programId, newTraits);
        return [data, metadata];
      } catch (error) {
        throw ValidationErrorService.parseError(error);
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
          } else if (error.response && error.response.status !== 422) {
            throw this.errorUpdating;
          }
          throw ValidationErrorService.parseError(error);
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
          throw ValidationErrorService.parseError(error);
        }
      }
      else throw 'Unable to update trait';
    }

  static getAll(programId: string,
                paginationQuery: PaginationQuery = new PaginationQuery(1, 50, true),
                full?: boolean): Promise<[Trait[], Metadata]> {
    return new Promise<[Trait[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined) {
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      if (full === undefined) {
        full = false;
      }

      if (programId) {
        TraitDAO.getAll(programId, paginationQuery, full).then(biResponse => {

          let traits: Trait[] = [];

          if (biResponse.result.data) {
            traits = biResponse.result.data.map((trait: any) => {
              return trait as Trait;
            });
          }

          resolve([traits, biResponse.metadata]);

        }).catch((error) => reject(error));

      } else {
        reject();
      }
    }));
  }

  private static makeTraitReqConfig(programId: string, selector: TraitSelector) {
    let config: any = {
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits`,
      method: 'get'
    };

    if (0 !== selector.filters.length) {
      config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits/search`;
      config.method = 'post';
      config.data = selector.filters;
    }

    return config;
  }

  private static mapBrAPIFilters(filters?: any): TraitSelector {
    let selector = new TraitSelector();
    if (filters && Object.keys(filters).length !== 0) {
      Object.entries(filters).forEach(entry => {
        selector.addFilter(new TraitFilter(entry[0], entry[1]));
      });
    }
    return selector;
  }

  private static makeSortAndPageParams(sort: OntologySort, pagination: {pageSize: number, page: number}) {
    let params: any = { full: true };

    if (sort.field) {
      params['sortField'] = sort.field;
    }
    if (sort.order) {
      params['sortOrder'] = sort.order;
    }
    if (pagination.page || pagination.page == 0) { //have to account for 0-index pagination since 0 falsy
      params ['page'] = pagination.page;
    }
    if (pagination.pageSize) {
      params['pageSize'] = pagination.pageSize;
    }

    return params;
  }

  static async getTraits(programId: string,
                   sort: OntologySort,
                   pagination: {pageSize: number, page: number},
                   filters?: any): Promise<BiResponse>{
    if (!programId) throw 'Program ID required';

    const brapiSearchFilters: TraitSelector = this.mapBrAPIFilters(filters);

    const config: any = this.makeTraitReqConfig(programId, brapiSearchFilters);

    config.params = this.makeSortAndPageParams(sort, pagination);

    try {
      const { data } = await api.call(config) as Response;
      return new BiResponse(data);

    } catch (error) {
      throw error;
    }
  }

  static getFilteredTraits(programId: string,
                           paginationQuery: PaginationQuery = new PaginationQuery(1, 50, true),
                           full: boolean = false,
                           filters?: TraitFilter[],
                           sort: OntologySort = new OntologySort(OntologySortField.Name, SortOrder.Ascending)): Promise<[Trait[], Metadata]> {
    return new Promise<[Trait[], Metadata]>(((resolve, reject) => {

      if (programId) {
        TraitDAO.getFilteredTraits(programId, paginationQuery, full, sort, filters).then((biResponse) => {

          let traits: Trait[] = [];

          if (biResponse.result.data) {
            traits = biResponse.result.data.map((trait: any) => {
              return trait as Trait;
            });
          }

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

  static async getTraitTags(programId: string): Promise<[string[], Metadata]> {
    if (programId) {
      try {
        const response = await TraitDAO.getTraitTags(programId);
        return [response.result.data, response.metadata];
      } catch (error) {
        throw error;
      }
    }
    else throw 'Unable to get trait editable info';
  }

  static async getAttributesEntitiesDescriptions(programId: string, totalSize: number): Promise<[string[], string[], string[]]> {
    if (programId) {
      try {
        const [ traits, metadata ] = await TraitService.getAll(programId, new PaginationQuery(1,totalSize,true), true);
        let attributes: Set<string> = new Set();
        let entities: Set<string> = new Set();
        let descriptions: Set<string> = new Set();
        for (const trait of traits) {
          if(trait.attribute) attributes.add(trait.attribute);
          if(trait.entity) entities.add(trait.entity);
          if(trait.method && trait.method.description) descriptions.add(trait.method.description);
        }
        return [[...attributes], [...entities], [...descriptions]];
      } catch (error) {
        throw error;
      }
    }
    else throw 'Unable to get trait editable info';
  }
}

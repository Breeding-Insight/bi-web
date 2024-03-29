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

import {Trait} from "@/breeding-insight/model/Trait";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {TraitFilter, TraitSelector} from "@/breeding-insight/model/TraitSelector";
import {OntologySort, SortOrder} from "@/breeding-insight/model/Sort";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";

export class TraitDAO {
    private activeOntologySortOrder!: SortOrder;

    static getAll(programId: string, {page, pageSize}: PaginationQuery, full: boolean): Promise<BiResponse> {
        const config: any = {
            params: {
                full,
                page,
                pageSize
            },
            url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits`,
            method: 'get'
        };

        return new Promise<BiResponse>(((resolve, reject) => {
            api.call(config)
                .then((response: any) => {
                    const biResponse = new BiResponse(response.data);
                    resolve(biResponse);
                }).catch((error) => {
                reject(error);
            })
        }))
    }

    static async getFilteredTraits(programId: string, params: object): Promise<Result<Error,BiResponse>> {
       try {
           const { data } = await api.call({
               url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits`,
               method: 'get',
               params
       }) as Response;
           return ResultGenerator.success(new BiResponse(data));
       } catch (error) {
           return ResultGenerator.err(error);
       }
    }

  static async createTraits(programId: string, newTraits: Trait[]): Promise<BiResponse> {
      const { data } =  await api.call({
          url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits`,
          method: 'post',
          data: newTraits
      }) as Response;
      return new BiResponse(data);

  }

  static async updateTraits(programId: string, newTraits: Trait[]): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits`,
      method: 'put',
      data: newTraits
    }) as Response;
    return new BiResponse(data);
  }

  static async getTraitEditable(programId: string, traitId: string) : Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits/${traitId}/editable`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

  static async archiveTrait(programId: string, trait: Trait): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits/${trait.id}/archive`,
      params: {'active': trait.active},
      method: 'put'
    }) as Response;
    return new BiResponse(data);
  }

  static async getTraitTags(programId: string): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits/tags`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }
}

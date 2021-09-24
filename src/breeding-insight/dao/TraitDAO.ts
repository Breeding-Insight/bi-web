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
import {Filter, TraitSelector} from "@/breeding-insight/model/TraitSelector";

export class TraitDAO {

    static getAll(programId: string, paginationQuery: PaginationQuery, full : boolean, filters?: Filter[]): Promise<BiResponse> {
        const config: any = {};
        config.params = {full};

        if (filters) {
            // get filtered list of traits
            config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits/search`;
            config.method = 'post';
            config.data = new TraitSelector(filters);
        } else {
            // get all traits
            config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/traits`;
            config.method = 'get';
        }

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

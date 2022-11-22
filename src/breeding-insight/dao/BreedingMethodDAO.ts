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

import * as api from '@/util/api';
import { BiResponse, Response } from '@/breeding-insight/model/BiResponse';
import { BreedingMethod } from '@/breeding-insight/model/BreedingMethod';

export class BreedingMethodDAO {

  static async getProgramBreedingMethods(programId: string, inUse?: boolean) {
    const params = inUse !== undefined ? {'inUse': inUse} : undefined;
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/breeding-methods`,
      method: 'get',
      params: params
    }) as Response;

    return new BiResponse(data);
  }

  static async getSystemBreedingMethods() {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/breeding-methods`,
      method: 'get'
    }) as Response;

    return new BiResponse(data);
  }

  static async enableSystemBreedingMethods(programId: string, ids: string[]) {
    await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/breeding-methods/enable`,
      method: 'put',
      data: ids
    });
  }

  static async createProgramBreedingMethod(programId: string, method: BreedingMethod) {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/breeding-methods`,
      method: 'post',
      data: method
    }) as Response;

    return new BiResponse(data);
  }

  static async updateProgramBreedingMethod(programId: string, method: BreedingMethod) {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/breeding-methods/${method.id}`,
      method: 'put',
      data: method
    }) as Response;

    return new BiResponse(data);
  }
}

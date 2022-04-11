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

import {BiResponse, Metadata, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {SharedOntologyRequest} from "@/breeding-insight/model/SharedOntologyRequest";

export class SharedOntologyDAO {

  static async get(programId: string): Promise<BiResponse> {
    const { data } = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/ontology/shared/programs`,
      method: 'get'
    }) as Response;

    return new BiResponse(data);
  }

  static async share(programId: string, sharedProgramsRequest: SharedOntologyRequest[]): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/ontology/shared/programs`,
      method: 'post',
      data: sharedProgramsRequest
    }) as Response;
    return new BiResponse(data);
  }

  static async revoke(programId: string, sharedProgramId: string) {
    const { data } = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/ontology/shared/programs/${sharedProgramId}`,
      method: 'delete'
    }) as Response;

    return new BiResponse(data);
  }

  static async getSubscriptionOptions(programId: string) {
    const { data } = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/ontology/subscribe`,
      method: 'get'
    }) as Response;

    return new BiResponse(data);
  }

  static async subscribeOntology(programId: string, subscribedProgramId: string) {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/ontology/subscribe/${subscribedProgramId}`,
      method: 'put'
    }) as Response;
    return new BiResponse(data);
  }

  static async unsubscribeOntology(programId: string, subscribedProgramId: string) {
    const { data } = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/ontology/subscribe/${subscribedProgramId}`,
      method: 'delete'
    }) as Response;

    return new BiResponse(data);
  }
}
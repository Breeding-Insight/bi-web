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

import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {Response} from "@/breeding-insight/model/Response";
import * as api from "@/util/api";

export class ApiTokenDAO {

  static async getApiToken(): Promise<BiResponse> {
      const response = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/api-token`,
        method: 'get'
      }) as Response;
      return new BiResponse(response.data);

  }
}
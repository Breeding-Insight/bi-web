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

import {Program} from "@/breeding-insight/model/Program";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class TraitUploadDAO {

  static update(programId: string, file: File): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      var formData = new FormData();
      formData.append("file", file);

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/trait-upload`, method: 'put', data: formData})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }


}

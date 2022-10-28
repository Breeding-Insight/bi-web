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

export class GenoDAO {

  static async uploadData(programId: string, experimentId: string, file: File): Promise<any> {

    var formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);

    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/geno/import`,
      method: 'post', data: formData}
    ) as Response;

    return new BiResponse(data);
  }

  static async fetchGenotypeData(programId: string, germplasmId: string): Promise<BiResponse> {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/germplasm/${germplasmId}/genotype`,
      method: 'get'
    }) as Response;

    return new BiResponse(data);
  }
}
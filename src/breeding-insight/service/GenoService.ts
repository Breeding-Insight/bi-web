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

import { GenoDAO } from '@/breeding-insight/dao/GenoDAO';
import { BiResponse } from '@/breeding-insight/model/BiResponse';
import { ImportResponse } from '@/breeding-insight/model/import/ImportResponse';
import { GermplasmGenotype } from '@/breeding-insight/model/GermplasmGenotype';

export class GenoService {

  static async uploadData(programId: string, experimentId: string, file: File): Promise<ImportResponse> {
    if (!programId) {
      throw 'Program ID not provided';
    }
    if (!experimentId) {
      throw 'Experiment ID not provided';
    }

    const response: BiResponse = await GenoDAO.uploadData(programId, experimentId, file);
    const data: any = response.result;
    return new ImportResponse(data);
  }

  static async fetchGenotypeData(programId: string, germplasmId: string): Promise<GermplasmGenotype> {
    if (!programId) {
      throw 'Program ID not provided';
    }
    if (!germplasmId) {
      throw 'germplasm ID not provided';
    }

    const resp = await GenoDAO.fetchGenotypeData(programId, germplasmId);

    return resp.result as GermplasmGenotype;
  }
}
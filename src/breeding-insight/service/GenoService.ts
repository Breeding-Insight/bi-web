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
import { BiResponse, Metadata } from '@/breeding-insight/model/BiResponse';
import { ImportResponse } from '@/breeding-insight/model/import/ImportResponse';
import { GermplasmGenotype } from '@/breeding-insight/model/GermplasmGenotype';
import { GenotypeImport } from '@/breeding-insight/model/GenotypeImport';
import { PaginationQuery } from '@/breeding-insight/model/PaginationQuery';
import { GenotypeImportSort } from '@/breeding-insight/model/Sort';

export class GenoService {

  static async uploadData(programId: string, submissionId: string, file: File): Promise<ImportResponse> {
    if (!programId) {
      throw 'Program ID not provided';
    }
    if (!submissionId) {
      throw 'Submission ID not provided';
    }

    const response: BiResponse = await GenoDAO.uploadData(programId, submissionId, file);
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

  static async fetchGenotypeImports(
      programId: string,
      paginationQuery: PaginationQuery,
      sort: GenotypeImportSort
  ): Promise<[GenotypeImport[], Metadata]> {
    if (!programId) {
      throw 'Program ID not provided';
    }

    const response = await GenoDAO.fetchGenotypeImports(programId, paginationQuery, sort);
    const responseData = response.result && response.result.data ? response.result.data : response.result;

    if (!Array.isArray(responseData)) {
      return [[], response.metadata];
    }

    const genotypeImports = responseData.map((record: GenotypeImport) => new GenotypeImport(record));

    return [genotypeImports, response.metadata];
  }
}

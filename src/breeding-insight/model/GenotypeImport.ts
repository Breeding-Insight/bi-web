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

interface DisplayUser {
  name?: string;
  email?: string;
}

type DisplayUserValue = string | DisplayUser;

export interface GenotypeImportResponse {
  id?: string;
  genotypeImportId?: string;
  importerImportId?: string;
  sampleSubmissionId?: string;
  sampleSubmissionDbId?: string;
  submissionId?: string;
  projectName?: string;
  sampleSubmissionName?: string;
  sampleSubmissionCreatedBy?: DisplayUserValue;
  sampleSubmissionCreatedByUser?: DisplayUserValue;
  sampleSubmissionCreatedByName?: string;
  genotypingFileName?: string;
  fileName?: string;
  uploadFileName?: string;
  genotypingImportDate?: string;
  genotypingImportedDate?: string;
  importDate?: string;
  importedAt?: string;
  createdAt?: string;
  genotypingImportedBy?: DisplayUserValue;
  genotypingImportedByUser?: DisplayUserValue;
  genotypingImportedByName?: string;
  importedBy?: DisplayUserValue;
  importedByUser?: DisplayUserValue;
}

export class GenotypeImport {
  id?: string;
  sampleSubmissionId?: string;
  projectName?: string;
  sampleSubmissionCreatedBy?: string;
  genotypingFileName?: string;
  genotypingImportDate?: string;
  genotypingImportedBy?: string;

  constructor(record: GenotypeImportResponse = {}) {
    this.id = record.id || record.genotypeImportId || record.importerImportId;
    this.sampleSubmissionId = record.sampleSubmissionId || record.sampleSubmissionDbId || record.submissionId;
    this.projectName = record.projectName || record.sampleSubmissionName;
    this.sampleSubmissionCreatedBy = GenotypeImport.displayUser(
        record.sampleSubmissionCreatedBy || record.sampleSubmissionCreatedByUser || record.sampleSubmissionCreatedByName
    );
    this.genotypingFileName = record.genotypingFileName || record.fileName || record.uploadFileName;
    this.genotypingImportDate = record.genotypingImportDate || record.genotypingImportedDate || record.importDate ||
        record.importedAt || record.createdAt;
    this.genotypingImportedBy = GenotypeImport.displayUser(
        record.genotypingImportedBy || record.genotypingImportedByUser || record.genotypingImportedByName ||
        record.importedBy || record.importedByUser
    );
  }

  private static displayUser(value?: DisplayUserValue): string | undefined {
    if (typeof value === 'string') {
      return value;
    }
    if (value && value.name) {
      return value.name;
    }
    if (value && value.email) {
      return value.email;
    }
    return undefined;
  }
}

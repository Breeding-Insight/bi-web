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

import {ImportData} from "@/breeding-insight/model/import/ImportData";
import {ImportDAO} from "@/breeding-insight/dao/ImportDAO";
import {ImportTypeConfig} from "@/breeding-insight/model/import/ImportTypeConfig";
import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {ImportResponse} from "@/breeding-insight/model/import/ImportResponse";

export class ImportService {
  static mappingNameExists : string = 'A mapping with that name already exists';
  static getUploadUnknown: string = 'An unknown error occurred while retrieving your upload status';

  static async getAllImportTypeConfigs(): Promise<ImportTypeConfig[]> {
    const response: BiResponse = await ImportDAO.getAllImportTypeConfigs();
    const configs: ImportTypeConfig[] = response.result.data.map((config: ImportTypeConfig) => new ImportTypeConfig(config));
    return configs;
  }

  static async getAllMappings(programId: string): Promise<ImportMappingConfig[]> {
    if (!programId || programId === null){
      throw 'Program ID not provided';
    }
    const response: BiResponse = await ImportDAO.getAllMappings(programId);
    const mappings: ImportMappingConfig[] = response.result.data.map((mapping: ImportMappingConfig) => new ImportMappingConfig(mapping));
    return mappings;
  }

  static async getSystemMappings(importName: string | undefined): Promise<ImportMappingConfig[]> {
    const response: BiResponse = await ImportDAO.getSystemMappings(importName);
    const mappings: ImportMappingConfig[] = response.result.data.map((mapping: ImportMappingConfig) => new ImportMappingConfig(mapping));
    return mappings;
  }

  static async updateMapping(programId: string, mapping: ImportMappingConfig, options: {[key:string]:boolean}): Promise<any> {
    if (!programId || programId === null) throw 'Program ID not provided';
    if (!mapping || !mapping.id) throw 'Mapping must have an id.';
    try {
      const response: BiResponse = await ImportDAO.updateMapping(programId, mapping, options);
      const importMapping: ImportMappingConfig = new ImportMappingConfig(response.result);
      return importMapping;
    } catch (e) {
      if (e.response && e.response.status === 409) {
        e.errorMessage = e.response.statusText;
      } else {
        e.errorMessage = e.response.statusText;
      }
      throw e;
    }
  }

  static async saveMappingFile(programId: string, file: File): Promise<ImportMappingConfig> {
    if (!programId || programId === null) {
      throw 'Program ID not provided';
    }

    const response: BiResponse = await ImportDAO.saveMappingFile(programId, file);
    const importMapping: ImportMappingConfig = new ImportMappingConfig(response.result);
    return importMapping;
  }

  static async uploadData(programId: string, mappingId: string, file: File, commit: boolean): Promise<ImportResponse> {
    if (!programId || programId === null) {
      throw 'Program ID not provided';
    }

    const response: BiResponse = await ImportDAO.uploadData(programId, mappingId, file);
    const data: any = response.result;
    const importResponse = new ImportResponse(data);
    return importResponse;
  }

  static async getDataUpload(programId: string, mappingId: string, uploadId: string, includeMapping: boolean): Promise<ImportResponse> {
    if (!programId || programId === null) {
      throw 'Program ID not provided';
    }

    try {
      const response: BiResponse = await ImportDAO.getDataUpload(programId, mappingId, uploadId, includeMapping);
      const data: any = response.result;
      const importResponse = new ImportResponse(data);
      return importResponse;
    } catch (e) {
      if (e.response && e.response.statusText) {
        e.errorMessage = e.response.statusText;
      } else {
        e.errorMessage = this.getUploadUnknown;
      }
      throw e;
    }

  }

  static async updateDataUpload(programId: string, mappingId: string, uploadId: string, commit: boolean) {
    if (!programId || programId === null) {
      throw 'Program ID not provided';
    }
    if (!uploadId || uploadId === null) {
      throw 'Upload ID not provided';
    }

    const response: BiResponse = await ImportDAO.updateUploadData(programId, mappingId, uploadId, commit);
    const data: any = response.result;
    const importResponse = new ImportResponse(data);
    return importResponse;

  }
}
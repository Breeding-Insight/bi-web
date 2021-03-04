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

export class ImportService {

  static async getImport(importId: string): Promise<ImportData> {
    if (importId == null) {
      throw 'Import ID not provided';
    }
    return ImportDAO.getImport(importId);
  }

  static async getAllImportTypeConfigs(): Promise<ImportTypeConfig[]> {
    const response: BiResponse = await ImportDAO.getAllImportTypeConfigs();
    const configs: ImportTypeConfig[] = response.result.data.map((config: ImportTypeConfig) => new ImportTypeConfig(config));
    return configs;
  }

  static async getAllMappings(programId: string): Promise<ImportMappingConfig[]> {
    if (!programId || programId === null){
      throw 'Program ID not provided';
    }
    return ImportDAO.getAllMappings(programId);
  }

  static async updateMapping(programId: string, mapping: ImportMappingConfig, validate: boolean): Promise<any> {
    if (!programId || programId === null) throw 'Program ID not provided';
    if (!mapping || !mapping.id) throw 'Mapping must have an id.' +
    ''
    const response: BiResponse = await ImportDAO.updateMapping(programId, mapping, validate);
    const importMapping: ImportMappingConfig = new ImportMappingConfig(response.result);
    return importMapping;
  }

  static async saveMappingFile(programId: string, file: File): Promise<ImportMappingConfig> {
    if (!programId || programId === null) {
      throw 'Program ID not provided';
    }

    const response: BiResponse = await ImportDAO.saveMappingFile(programId, file);
    const importMapping: ImportMappingConfig = new ImportMappingConfig(response.result);
    return importMapping;
  }

}
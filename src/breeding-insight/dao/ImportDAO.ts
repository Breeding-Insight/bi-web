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
import {tblCross} from "@/breeding-insight/dao/mock_data/importMock";
import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
import {Vue} from "vue-property-decorator";
import { v4 as uuidv4 } from 'uuid';
import * as api from "@/util/api";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";

export class ImportDAO {

  static async getImport(importId: string): Promise<ImportData> {
    //TODO: Implement once back end is up and running
    const fileImports = [tblCross];
    const fileImport = fileImports.filter(fileImport => fileImport.id === importId);
    return fileImport[0];
  }

  static async getAllImportTypeConfigs(): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/import/types`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

  static async getAllMappings(programId: string): Promise<ImportMappingConfig[]> {
    return [new ImportMappingConfig({name: 'Water Quality', id: uuidv4()} as ImportMappingConfig)];
  }

  static async updateMapping(programId: string, mapping: ImportMappingConfig, validate: boolean): Promise<any> {
    const mappingWithoutFile: ImportMappingConfig = new ImportMappingConfig({
      id: mapping.id,
      name: mapping.name,
      importTypeId: mapping.importTypeId,
      objects: mapping.objects
    } as ImportMappingConfig);
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mapping/${mapping.id}?validate=${validate}`,
      method: 'put',
      data: mappingWithoutFile,
    }) as Response;
    return new BiResponse(data);
  }

  static async saveMappingFile(programId: string, file: File): Promise<BiResponse> {

      var formData = new FormData();
      formData.append("file", file);

      const {data} = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mapping/file`,
        method: 'post', data: formData}
        ) as Response;

      return new BiResponse(data);
  }

}
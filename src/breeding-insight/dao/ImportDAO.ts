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

import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
import * as api from "@/util/api";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";

export class ImportDAO {

  static async getAllImportTypeConfigs(): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/import/types`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

  static async getAllMappings(programId: string): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

  static async getSystemMappings(importName: string | undefined) : Promise<BiResponse> {
    const params = importName ? {'importName': importName} : undefined;
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/import/mappings`,
      params: params,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

  static async getWorkflowsForMapping(mappingId: string | undefined) : Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/import/mappings/${mappingId}/workflows`,
      method: 'get'
    }) as Response;
    return new BiResponse(data);
  }

  static async updateMapping(programId: string, mapping: ImportMappingConfig, options: {[key:string]:boolean}): Promise<any> {
    const mappingWithoutFile: ImportMappingConfig = new ImportMappingConfig({
      id: mapping.id,
      name: mapping.name,
      importTypeId: mapping.importTypeId,
      mapping: mapping.mapping,
      draft: options.draft
    } as ImportMappingConfig);
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mapping.id}?validate=${options.validate}`,
      method: 'put',
      data: mappingWithoutFile,
    }) as Response;

    return new BiResponse(data);
  }

  static async saveMappingFile(programId: string, file: File): Promise<BiResponse> {

      var formData = new FormData();
      formData.append("file", file);

      const {data} = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/file`,
        method: 'post', data: formData}
        ) as Response;

      return new BiResponse(data);
  }

  static async uploadData(programId: string, mappingId: string, file: File): Promise<any> {

    var formData = new FormData();
    formData.append("file", file);

    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mappingId}/data`,
      method: 'post', data: formData}
    ) as Response;

    return new BiResponse(data);
  }

  static async getDataUpload(programId: string, mappingId: string, uploadId: string, includeMapping: boolean) {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mappingId}/data/${uploadId}?mapping=${includeMapping}`,
      method: 'get'
    }) as Response;

    return new BiResponse(data);
  }

  static async updateUploadData(programId: string, mappingId: string, uploadId: string, workflowId: string | undefined, userInput: any, commit: boolean) {
    let url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mappingId}/data/${uploadId}`;

    if (workflowId !== undefined) {
      url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mappingId}/workflows/${workflowId}/data/${uploadId}`;
    }

    url += commit ? '/commit' : '/preview';
    const {data} = await api.call({
      url: url,
      method: 'put', data: commit ? userInput : {}}
    ) as Response;

    return new BiResponse(data);
  }



}
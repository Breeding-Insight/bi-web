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

import {ImportMapping} from "@/breeding-insight/model/import/ImportMapping";
import * as api from "@/util/api";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";

export class ImportDAO {

  static async getAllTemplates(): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/import/templates`,
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

  static async getMapping(programId: string, mappingId: string): Promise<BiResponse> {
    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mappingId}`,
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

  static async saveMapping(programId: string, mapping: ImportMapping, options: {[key:string]:boolean}): Promise<any> {
    const mappingWithoutFile: ImportMapping = new ImportMapping({
      id: mapping.id,
      name: mapping.name,
      importerTemplateId: mapping.importerTemplateId,
      mapping: mapping.mapping,
      saved: options.saved
    } as ImportMapping);

    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings`,
      method: 'post',
      data: mappingWithoutFile,
    }) as Response;

    return new BiResponse(data);
  }

  static async updateMapping(programId: string, mapping: ImportMapping): Promise<any> {

    const { data } =  await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mapping.id}`,
      method: 'put',
      data: mapping,
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

  static async uploadData(programId: string, templateId: number, file: File, userInput: any, commit: boolean, mappingId: string): Promise<any> {

    var formData = new FormData();
    formData.append("file", file);
    if (userInput) {
      const json = JSON.stringify(userInput);
      const jsonBlob = new Blob([json], {
        type: 'application/json'
      });
      formData.append("userInput", jsonBlob);
    }

    let url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/${templateId}?commit=${commit}`;
    url = mappingId ? url + `&mappingId=${mappingId}` : url;
    const {data} = await api.call({
      url: url,
      method: 'post',
      data: formData
    }) as Response;

    return new BiResponse(data);
  }

  static async getFileColumns(file: File) {
    var formData = new FormData();
    formData.append("file", file);
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/import/fileColumns`,
      method: 'post',
      data: formData
    }) as Response;

    return new BiResponse(data);
  }

  static async getDataUpload(programId: string, uploadId: string) {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/${uploadId}`,
      method: 'get'
    }) as Response;

    return new BiResponse(data);
  }

  static async updateUploadData(programId: string, mappingId: string, uploadId: string, userInput: any, commit: boolean) {
    let url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/import/mappings/${mappingId}/data/${uploadId}`;
    url += commit ? '/commit' : '/preview';
    const {data} = await api.call({
      url: url,
      method: 'put', data: commit ? userInput : {}}
    ) as Response;

    return new BiResponse(data);
  }
}
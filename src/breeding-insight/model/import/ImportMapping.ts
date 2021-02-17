/*
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

import {Mapping} from "@/breeding-insight/model/import/Mapping";

export class ImportMappingConfig {
  id?: string;
  name?: string;
  importTypeId?: string;
  mapping: {[key:string]:Mapping};

  constructor(config: ImportMappingConfig | undefined) {
    if (config) this.id = config.id;
    if (config) this.name = config.name;
    if (config) this.importTypeId = config.importTypeId;
    if (config) {
      this.mapping = config.mapping;
    } else {
      this.mapping = {};
    }
  }

  public setMappingField(importField: string, fileField: string) {
    this.mapping[importField] = new Mapping({fileFieldName: fileField});
  }

  public createListMappingEntry(importField: string) {
    if (!this.mapping[importField]) {
      this.mapping[importField] = new Mapping(undefined);
    }
    this.mapping[importField].listMappings!.push({});
  }

  public setListEntryMappingField(importField: string, entryIndex: number, subImportField: string, fileField: string) {
    const mappingObject = this.mapping[importField].listMappings![entryIndex]
    mappingObject[subImportField] = new Mapping({fileFieldName: fileField, constantValue: undefined});
  }

  public setListEntryManualField(importField: string, entryIndex: number, subImportField: string, manualValue: string) {
    const mappingObject = this.mapping[importField].listMappings![entryIndex]
    mappingObject[subImportField] = new Mapping({fileFieldName: undefined, constantValue: manualValue});
  }

  getListMappingEntries(importField: string) {
    console.log(importField);
    if (this.mapping[importField]){
      return this.mapping[importField].listMappings;
    }
    return [];
  }

}
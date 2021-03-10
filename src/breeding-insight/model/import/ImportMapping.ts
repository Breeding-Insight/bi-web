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
import {ImportField} from "@/breeding-insight/model/import/ImportField";
import { v4 as uuidv4 } from 'uuid';
import {MappingValue} from "@/breeding-insight/model/import/MappingValue";
import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
import {ImportRelationMap} from "@/breeding-insight/model/import/ImportRelationMap";

export class ImportMappingConfig {
  id?: string;
  name?: string;
  importTypeId?: string;
  file?: {[key:string]:string}[];
  mapping?: Mapping[];
  draft?: boolean;

  constructor(config: ImportMappingConfig | undefined) {
    if (config) this.id = config.id;
    if (config) this.name = config.name;
    if (config) this.importTypeId = config.importTypeId;
    if (config) this.file = config.file;
    if (config) this.draft = config.draft;
    if (config && config.mapping) {
      this.mapping = config.mapping;
    } else {
      this.mapping = [];
    }
  }

  // Get object by id
  getMapping(id: string): {searchMapping?: Mapping, searchPath?: Mapping[]} {
    // Search downward recursively for the object
    for (const mappedField of this.mapping!) {
      const {searchMapping, searchPath} = mappedField.getObjectById(id, []);
      if (searchMapping) return {searchMapping, searchPath};
    }
    return {};
  }

  addMapping(importField: ImportField, mappingId?: string) {
    const newMapping = new Mapping({objectId: importField.id, id: uuidv4()} as Mapping);
    if (mappingId) {
      const {searchMapping} = this.getMapping(mappingId);
      if (searchMapping) searchMapping.mapping!.push(newMapping);
    } else {
      this.mapping!.push(newMapping);
    }
  }

  getFileHeaders(): string[] {
    let headers: string[] = [];
    if (this.file && this.file.length > 0) {
      headers = Object.keys(this.file[0]).map(key => key);
    }
    return headers;
  }

  setMappingConstantField(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);

    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }
      searchMapping.value!.constantValue = value;
    }
  }

  setMappingFileField(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);
    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }
      searchMapping.value!.fileFieldName = value;
    }
  }

  setMappingFieldAlias(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);
    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }
      searchMapping.value!.fieldAlias = value;
    }
  }

  setMappingRelationType(id: string, value: ImportRelationType) {
    const {searchMapping} = this.getMapping(id);
    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }

      searchMapping.value!.relationValue = value;
    }
  }

  setMappingRelationReference(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);
    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }

      if (!searchMapping.value.relationMap) {
        searchMapping.value.relationMap = new ImportRelationMap({});
      }
      searchMapping.value!.relationMap.reference = value;
    }
  }

  setMappingRelationTarget(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);
    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }

      if (!searchMapping.value.relationMap) {
        searchMapping.value.relationMap = new ImportRelationMap({});
      }
      searchMapping.value!.relationMap.target = value;
    }
  }
}
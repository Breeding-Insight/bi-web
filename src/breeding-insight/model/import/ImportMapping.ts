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

export class ImportMapping {
  id?: string;
  name?: string;
  importerTemplateId?: number;
  file?: {[key:string]:string}[];
  mapping: Mapping[] = [];
  saved?: boolean;

  constructor(config?: ImportMapping) {
    if (config) this.id = config.id;
    if (config) this.name = config.name;
    if (config) this.importerTemplateId = config.importerTemplateId;
    if (config) this.file = config.file;
    if (config) this.saved = config.saved;
    if (config && config.mapping) {
      this.mapping = config.mapping;
    } else {
      this.mapping = [];
    }
  }

  /**
   * Takes the path to set the mapping for and the value to set.
   * @param path  -- Json notation path, ex. germplasm.germplasmName
   * @param value -- File column for this mapping
   */
  static createOrUpdateMapping(mapping: Mapping[], path: string, value: string) {

    // TODO: Clean up
    const splitPath = path.split('.');
    const currPath = splitPath.shift();

    // See if there is an existing mapping to update
    let foundMapping: Mapping | undefined;
    for (const mappingField of mapping) {
      // If object exists, get
      if (mappingField.objectId == currPath) {
        console.log('found a mapping');
        foundMapping = mappingField;
      }
    }
    if (!foundMapping) {
      foundMapping = new Mapping({objectId: currPath} as Mapping);
      mapping.push(foundMapping);
    }

    if (splitPath.length == 0) {
      // If no path remaining, set value we're done
      const mappingValue = new MappingValue({fileFieldName: value} as MappingValue);
      foundMapping.value = mappingValue;
    } else {
      // If path has length > 0, recurse down
      ImportMapping.createOrUpdateMapping(foundMapping.mapping!, splitPath.join('.'), value);
    }
  }

  getFieldValue(path: string): string | undefined {
    const foundMapping = this.getMappingByPath(this.mapping!, path);
    if (foundMapping) return foundMapping.value!.fileFieldName;
  }

  getMappingByPath(mappings: Mapping[], path: string): Mapping | undefined {

    const splitPath = path.split('.');
    const currPath = splitPath.shift();

    for (const mapping of mappings) {
      if (mapping.objectId == currPath) {

        if (splitPath.length == 0) {
          // If end of path, return
          return mapping;
        } else {
          // If more to see, recurse deeper
          return this.getMappingByPath(mapping.mapping!, splitPath.join('.'));
        }

      }
    }
    return;
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
    let headers: any = {};
    //TODO: Have the backend do this
    if (this.file && this.file.length > 0) {
      for (const row of this.file) {
        for (const header of Object.keys(row)) {
          if (!(header in headers)) {
            headers[header] = 1;
          }
        }
      }
    }
    return Object.keys(headers);
  }

  resetMappingState(mapping: Mapping) {
    mapping.value!.fileFieldName = undefined;
    mapping.value!.constantValue = undefined;
  }

  setMappingConstantField(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);

    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }
      this.resetMappingState(searchMapping);
      searchMapping.value!.constantValue = value;
    }
  }

  setMappingFileField(id: string, value: string) {
    const {searchMapping} = this.getMapping(id);
    if (searchMapping) {
      if (!searchMapping.value) {
        searchMapping.value = new MappingValue({});
      }
      this.resetMappingState(searchMapping);
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
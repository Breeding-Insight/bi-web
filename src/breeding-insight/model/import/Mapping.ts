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

import {MappingValue} from "@/breeding-insight/model/import/MappingValue";

export class Mapping {

  id?: string;
  objectId?: string;
  value?: MappingValue;
  mapping?: Mapping[];

  constructor(mapping: Mapping) {
    if (mapping) this.id = mapping.id;
    if (mapping) this.objectId = mapping.objectId;
    if (mapping && mapping.value) this.value = new MappingValue(mapping.value);
    if (mapping && mapping.mapping) {
      this.mapping = mapping.mapping.map(mappedField => new Mapping(mappedField));
    } else {
      this.mapping = [];
    }
  }

  getObjectById(id: string, currentPath: Mapping[]): {searchMapping?: Mapping, searchPath?: Mapping[]} {
    const path: Mapping[] = [...currentPath, this];
    if (this.id === id) { return {searchMapping: this, searchPath: path}; }
    for (const mappedField of this.mapping!) {
      const {searchMapping, searchPath} = mappedField.getObjectById(id, currentPath);
      if (searchMapping && searchMapping.objectId === this.objectId) path.pop();
      if (searchPath) path.push(...searchPath);
      if (searchMapping && searchPath) return {searchMapping, searchPath: path};
    }
    return {};
  }
}
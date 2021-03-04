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
import {ObjectMapping} from "@/breeding-insight/model/import/ObjectMapping";
import {ImportGroup} from "@/breeding-insight/model/import/ImportGroup";

export class ImportMappingConfig {
  id?: string;
  name?: string;
  importTypeId?: string;
  file?: {[key:string]:string}[];
  objects?: ObjectMapping[];

  constructor(config: ImportMappingConfig | undefined) {
    if (config) this.id = config.id;
    if (config) this.name = config.name;
    if (config) this.importTypeId = config.importTypeId;
    if (config) this.file = config.file;
    if (config && config.objects) {
      this.objects = config.objects;
    } else {
      this.objects = [];
    }
  }

  // Get object by id
  getObjectMapping(id: string): {searchObject?: ObjectMapping, searchPath?: ObjectMapping[]} {
    // Search downward recursively for the object
    for (const object of this.objects!) {
      let path = [];
      const {searchObject, searchPath} = object.getObjectById(id);
      if (searchPath) path.push(...searchPath);
      if (searchObject) return {searchObject, searchPath: path};
    }
    return {};
  }

  // Add object
  createObjectMapping(importGroup: ImportGroup): {config: ImportGroup, object: ObjectMapping} {
    const newObject = new ObjectMapping({objectId: importGroup.id} as ObjectMapping);
    this.objects!.push(newObject);
    return { config: importGroup, object: newObject};
  }

  createObjectMappings(importGroups: ImportGroup[]): {config: ImportGroup, object: ObjectMapping}[] {
    return importGroups.map(importGroup => { return this.createObjectMapping(importGroup) });
  }

  getFileHeaders(): string[] {
    let headers: string[] = [];
    console.log(this.file);
    if (this.file && this.file.length > 0) {
      console.log('here');
      headers = Object.keys(this.file[0]).map(key => key);
    }
    console.log(headers);
    return headers;
  }
}
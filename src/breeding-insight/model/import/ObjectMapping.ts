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
import { v4 as uuidv4 } from "uuid";

export class ObjectMapping {
  id?: string;
  object_id: string;
  fields?: {[key:string]:Mapping}

  constructor(objectMapping: ObjectMapping) {
    this.object_id = objectMapping.object_id;
    this.id = objectMapping.id ? objectMapping.id : uuidv4();
    if (objectMapping.fields) {
      this.fields = {}
      Object.keys(objectMapping.fields).forEach(key => this.fields![key] = new Mapping(objectMapping.fields![key]));
    } else {
      this.fields = {};
    }
  }

  // Get field mapping

  getObjectById(id: string): {searchObject?: ObjectMapping, searchPath?: ObjectMapping[]} {
    if (this.id === id) { return {searchObject: this, searchPath: [this]}; }
    for (const mapping of Object.values(this.fields!)) {
      for (const object of mapping.objects!){
        let path: ObjectMapping[] = [this];
        const {searchObject, searchPath} = object.getObjectById(id);
        if (searchPath) path.push(...searchPath);
        if (searchObject && searchPath) return {searchObject, searchPath: path};
      }
    }
    return {};
  }

  getField(field: string){
    return this.fields![field];
  }

  replaceMapping(field: string, newMapping: Mapping) {
    this.fields![field] = newMapping;
  }
}
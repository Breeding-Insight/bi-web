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
import { v4 as uuidv4 } from 'uuid';
import {ImportGroup} from "@/breeding-insight/model/import/ImportGroup";
import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";

export class ObjectMapping {
  id?: string;
  object_id: string;
  fields?: {[key:string]:Mapping}

  constructor(objectMapping: ObjectMapping) {
    this.object_id = objectMapping.object_id;
    this.id = objectMapping.id ? objectMapping.id : uuidv4();
    if (objectMapping.fields) {
      this.fields = {}
      Object.keys(objectMapping.fields).forEach(key => this.fields![key] = new Mapping(this.fields![key]));
    } else {
      this.fields = {};
    }
  }

  // Get field mapping

  getObjectById(id: string): ObjectMapping | undefined {
    if (this.id === id) {return this;}
    for (const mapping of Object.values(this.fields!)) {
      for (const object of mapping.objects!){
        const searchObject = object.getObjectById(id);
        if (searchObject) return searchObject;
      }
    }
    return undefined;
  }

  getField(field: string){
    return this.fields![field];
  }

  replaceMapping(field: string, newMapping: Mapping) {
    this.fields![field] = newMapping;
  }

  // Set field mapping
  setFieldMapping(importField: string, fileFieldName: string) {
    this.fields![importField] = new Mapping({fileFieldName});
  }

  // Set manual mapping
  setManualMapping(importField: string, constantValue: string) {
    this.fields![importField] = new Mapping({constantValue});
  }

  setRelationType(importField: string, relationValue: ImportRelationType) {
    this.fields![importField] = new Mapping({relationValue});
  }

  // Add object to list field
  addObjectToListField(targetField: string, importGroup: ImportGroup) {
    if (!this.fields![targetField]){
      this.fields![targetField] = new Mapping({});
    }
    // Create new object
    const newObject = new ObjectMapping({object_id: importGroup.id} as ObjectMapping);
    this.fields![targetField].objects!.push(newObject);
    return { config: importGroup, object: newObject}
  }

  getObjectsFromListField(field: string): ObjectMapping[] {
    if (this.fields![field]) {
      return this.fields![field].objects!;
    } else {
      return [];
    }
  }


}
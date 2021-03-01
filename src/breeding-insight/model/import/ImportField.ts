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

import {ImportGroup} from "@/breeding-insight/model/import/ImportGroup";
import {ImportRelation, ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";

export enum ImportDataType {
  TEXT = "TEXT",
  NUMERICAL = "NUMERICAL",
  INTEGER = "INTEGER",
  DATE = "DATE",
  LIST = "LIST",
  RELATIONSHIP = "RELATIONSHIP"
}

export class ImportField {
  name: string;
  id: string;
  description: string;
  type: ImportDataType;
  required: boolean;
  listObject?: ImportGroup;
  relationOptions?: ImportRelation[];

  constructor({name, id, description, type, required, listObject, relationOptions}: ImportField) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.type = type;
    this.required = required;
    this.listObject = listObject ? new ImportGroup(listObject) : listObject;
    this.relationOptions = relationOptions ? relationOptions.map(relationOption => new ImportRelation(relationOption)) : relationOptions;
  }

  getRelationObject(relationType: ImportRelationType): ImportRelation | undefined {
    if (this.relationOptions){
      return this.relationOptions.find(relationOption => relationOption.id === relationType);
    }
    return undefined;
  }
}

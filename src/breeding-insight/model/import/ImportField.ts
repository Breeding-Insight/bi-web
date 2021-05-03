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

import {ImportRelation, ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";

export enum ImportDataType {
  TEXT = "TEXT",
  NUMERICAL = "NUMERICAL",
  INTEGER = "INTEGER",
  DATE = "DATE",
  LIST = "LIST",
  OBJECT = "OBJECT",
  RELATIONSHIP = "RELATIONSHIP"
}

export class ImportField {
  name: string;
  id: string;
  description: string;
  type: ImportDataType;
  required: boolean;
  fields?: ImportField[];
  relationOptions?: ImportRelation[];

  constructor({name, id, description, type, required, fields, relationOptions}: ImportField) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.type = type;
    this.required = required;
    this.fields = fields ? fields.map(field => new ImportField(field)) : fields;
    this.relationOptions = relationOptions ? relationOptions.map(relationOption => new ImportRelation(relationOption)) : relationOptions;
  }

  getRelationObject(relationType: ImportRelationType): ImportRelation | undefined {
    if (this.relationOptions){
      return this.relationOptions.find(relationOption => relationOption.id === relationType);
    }
    return undefined;
  }

  getImportFieldById(id: string): ImportField | undefined {
    if (this.id === id) {
      return this;
    }

    if (this.fields) {
      for (const field of this.fields) {
        const searchField: ImportField | undefined = field.getImportFieldById(id);
        if (searchField) return searchField;
      }
    }

    return undefined;
  }
}

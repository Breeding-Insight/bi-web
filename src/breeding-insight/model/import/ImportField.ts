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
  Text = "Text",
  Numerical = "Numerical",
  Integer = "Integer",
  Date = "Date",
  List = "List",
  Relationship = "Relationship"
}

export class ImportField {
  name: string;
  id: string;
  description: string;
  type: ImportDataType;
  required: boolean;
  list_object?: ImportGroup;
  relation_options?: ImportRelation[];

  constructor({name, id, description, type, required, list_object, relation_options}: ImportField) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.type = type;
    this.required = required;
    this.list_object = list_object ? new ImportGroup(list_object) : list_object;
    this.relation_options = relation_options ? relation_options.map(relation_option => new ImportRelation(relation_option)) : relation_options;
  }

  getRelationObject(relationType: ImportRelationType): ImportRelation | undefined {
    if (this.relation_options){
      return this.relation_options.find(relation_option => relation_option.id === relationType);
    }
    return undefined;
  }
}

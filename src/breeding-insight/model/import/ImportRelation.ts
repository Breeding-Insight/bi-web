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
export enum ImportRelationType {
  DB_LOOKUP = "DB_LOOKUP",
  FILE_LOOKUP = "FILE_LOOKUP"
}

export class ImportRelation {
  name: string;
  id: ImportRelationType;
  description: string;
  // Fields available to select from for db lookup
  importFields?: string[];

  constructor(importRelation: ImportRelation) {
    this.name = importRelation.name;
    this.id = importRelation.id;
    this.description = importRelation.description;
    this.importFields = importRelation.importFields;
  }

  getDbLookupFields() {
    return this.importFields;
  }
}
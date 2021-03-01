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

export class ImportTypeConfig {
  id: string;
  name: string;
  description: string;
  objects: ImportGroup[];

  constructor({id, name, description, objects}: ImportTypeConfig) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.objects = objects ? objects.map(object => new ImportGroup(object)) : objects;
  }

  getImportGroup(id: string): ImportGroup | undefined {
    for (const group of this.objects){
      const searchGroup = group.getImportGroupById(id);
      if (searchGroup) return searchGroup;
    }
    return undefined;
  }
}

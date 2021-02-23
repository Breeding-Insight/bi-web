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

import {ImportField} from "@/breeding-insight/model/import/ImportField";

export class ImportGroup {
  id: string;
  name: string;
  description: string;
  quantity: string;
  fields: ImportField[];

  constructor({id, name, description, quantity, fields}: ImportGroup) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.fields = fields ? fields.map(field => new ImportField(field)) : fields;
  }

  getImportGroupById(id: string): ImportGroup | undefined {
    if (this.id === id) {
      return this;
    }
    for (const field of this.fields) {
      if (field.list_object) {
        const searchGroup: ImportGroup | undefined = field.list_object.getImportGroupById(id);
        if (searchGroup) return searchGroup;
      }
    }
    return undefined;
  }
}

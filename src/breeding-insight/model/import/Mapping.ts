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

import {ObjectMapping} from "@/breeding-insight/model/import/ObjectMapping";
import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
import {ImportRelationMap} from "@/breeding-insight/model/import/ImportRelationMap";

export class Mapping {

  fileFieldName?: string;
  constantValue?: string;
  fieldAlias?: string;
  relationValue?: ImportRelationType;
  relationMap?: ImportRelationMap;
  objects?: ObjectMapping[];

  constructor(mapping: Mapping) {
    if (mapping) this.fileFieldName = mapping.fileFieldName;
    if (mapping) this.constantValue = mapping.constantValue;
    if (mapping) this.fieldAlias = mapping.fieldAlias;
    if (mapping) this.relationValue = mapping.relationValue;
    if (mapping && mapping.relationMap) this.relationMap = {...mapping.relationMap};
    if (mapping && mapping.objects) {
      this.objects = mapping.objects.map(object => new ObjectMapping(object));
    } else {
      this.objects = [];
    }
  }

  setRelationTarget(target: string) {
    if (!this.relationMap) {
      this.relationMap = new ImportRelationMap({});
    }
    this.relationMap.target = target;
  }

  setRelationReference(reference: string) {
    if (!this.relationMap) {
      this.relationMap = new ImportRelationMap({});
    }
    this.relationMap.reference = reference;
  }

  setConstantValue(value: string) {
    this.fileFieldName = undefined;
    this.constantValue = value;
  }

  setFileFieldValue(value: string) {
    this.constantValue = undefined;
    this.fileFieldName = value;
  }

  setFieldAlias(value: string) {
    this.fieldAlias = value;
  }

  addObject(newObject: ObjectMapping) {
    this.objects!.push(newObject);
  }

}
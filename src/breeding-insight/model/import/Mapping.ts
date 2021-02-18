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
  relationValue?: ImportRelationType;
  relationMap?: ImportRelationMap;
  objects?: ObjectMapping[];

  constructor(mapping: Mapping) {
    this.fileFieldName = mapping.fileFieldName;
    this.constantValue = mapping.constantValue;
    this.relationValue = mapping.relationValue;
    if (mapping && mapping.objects) {
      this.objects = mapping.objects;
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

}
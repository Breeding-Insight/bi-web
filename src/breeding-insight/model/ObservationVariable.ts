/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
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

import {Trait} from "@/breeding-insight/model/Trait";
import {Method} from "@/breeding-insight/model/Method";
import {Scale} from "@/breeding-insight/model/Scale";

// TODO: eventually refactor Trait into Observation Variable to be consistent with the BrAPI model
export class ObservationVariable {
  observationVariableDbId?: string;
  observationVariableName?: string;
  additionalInfo?: OVAdditionalInfo;
  trait?: Trait;
  method?: Method;
  scale?: Scale;
  
  constructor(observationVariableDbId?:string,
              observationVariableName?:string,
              additionalInfo?:OVAdditionalInfo,
              trait?:Trait,
              method?:Method,
              scale?:Scale) {
    this.observationVariableDbId = observationVariableDbId;
    this.observationVariableName = observationVariableName;
    if (additionalInfo){
      this.additionalInfo = OVAdditionalInfo.assign({...additionalInfo} as OVAdditionalInfo);
    } else {
      this.additionalInfo = new OVAdditionalInfo();
    }
    if (trait){
      this.trait = Trait.assign({...trait} as Trait);
    } else {
      this.trait = new Trait();
    }
    if (method){
      this.method = Method.assign({...method} as Method);
    } else {
      this.method = new Method();
    }
    if (scale) {
      this.scale = Scale.assign({...scale} as Scale);
    } else {
      this.scale = new Scale();
    }
  }
}

export class OVAdditionalInfo {
  fullName?: string;

  constructor(fullName?:string) {
    this.fullName = fullName;
  }

  static assign(info: OVAdditionalInfo): OVAdditionalInfo {
    return new OVAdditionalInfo(info.fullName);
  }
}
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

export class ObservationVariable {
  id?: string;
  observationVariableName?: string;
  additionalInfo?: OVAdditionalInfo;
  trait?: Trait;
  method?: Method;
  scale?: Scale;
  
  constructor(id?:string,
              observationVariableName?:string,
              additionalInfo?:OVAdditionalInfo,
              trait?:Trait,
              method?:Method,
              scale?:Scale) {
    this.id = id;
    this.observationVariableName = observationVariableName;
    this.additionalInfo = additionalInfo;
    this.trait = trait;
    this.method = method;
    this.scale = scale;
  }
}

export class OVAdditionalInfo {
  fullName?: string;

  constructor(fullName?:string) {
    this.fullName = fullName;
  }
}
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

import {ProgramObservationLevel} from "@/breeding-insight/model/ProgramObservationLevel";
import {Method} from "@/breeding-insight/model/Method";
import {Scale} from "@/breeding-insight/model/Scale";

export class Trait {
  traitName?: string;
  programObservationLevel?: ProgramObservationLevel;
  method?: Method;
  scale?: Scale;

  constructor(traitName?:string, 
              programObservationLevel?: ProgramObservationLevel,
              method?: Method,
              scale?: Scale
              ) {
    this.traitName = traitName;
    this.programObservationLevel = programObservationLevel;
    this.method = method;
    this.scale = scale;
  }
}
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

import {ExternalReferences} from "@/breeding-insight/brapi/model/externalReferences";

export class ObservationUnit {
  id?: string;
  name?: string;
  position?: ObservationUnitPosition;
  externalReferences?: ExternalReferences;
  
  constructor(id?:string, name?:string, position?:ObservationUnitPosition, externalReferences?: ExternalReferences) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.externalReferences = externalReferences;
  }
}

export class ObservationUnitPosition {
  level?: string;

  constructor(level?:string) {
    this.level = level;
  }
}
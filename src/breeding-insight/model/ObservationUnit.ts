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
  observationUnitDbId: string;
  germplasmDbId?: string;
  germplasmName?: string;
  locationDbI?: string;
  locationName?: string;
  observationUnitName?: string;
  observationUnitPUI?: string;
  programDbId?: string;
  programName?: string;
  studyDbId?: string;
  studyName?: string;
  trialDbId?: string;
  trialName?: string;
  observationUnitPosition?: ObservationUnitPosition;
  externalReferences?: ExternalReferences;
  additionalInfo?: any;
  treatments?: any;


  constructor(observationUnitDbId:string, observationUnitName?:string, observationUnitPosition?:ObservationUnitPosition, externalReferences?: ExternalReferences) {
    this.observationUnitDbId = observationUnitDbId;
    this.observationUnitName = observationUnitName;
    this.observationUnitPosition = observationUnitPosition;
    this.externalReferences = externalReferences;
  }
}

export class ObservationUnitPosition {
  level?: string;
  observationLevelRelationships?: ObservationLevelRelationship[];
  positionCoordinateXType?: string;
  positionCoordinateX?: string;
  positionCoordinateYType?: string;
  positionCoordinateY?: string;
  entryType?: string;

  constructor(level?:string,
              observationLevelRelationships?: ObservationLevelRelationship[],
              positionCoordinateXType?: string,
              positionCoordinateX?: string,
              positionCoordinateYType?: string,
              positionCoordinateY?: string,
              entryType?: string,
              ) {
    this.level = level;
    this.observationLevelRelationships = observationLevelRelationships;
    this.positionCoordinateXType = positionCoordinateXType;
    this.positionCoordinateX = positionCoordinateX;
    this.positionCoordinateYType = positionCoordinateYType;
    this.positionCoordinateY = positionCoordinateY;
    this.entryType = entryType
  }
}


export class ObservationLevelRelationship {
  levelName?: string;
  levelOrder?: string;
  levelCode?: number;

  constructor(levelName?: string, levelOrder?: string, levelCode?: number) {
    this.levelName = levelName;
    this.levelOrder = levelOrder;
    this.levelCode = levelCode;
  }
}
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

import {ObservationLevel} from '@/breedinginsight/model/ObservationLevel';

export class Observation {
  id?: string;
  studyId?: string;
  germplasmId?: string;
  observationUnitId?: string;
  traitId?: string;
  germplasmName?: string;
  observationUnitName?: string;
  traitName?: string;
  collector?: string;
  uploadedBy?: string;
  timeStamp?: Date | null;
  season?: Season;
  level?: ObservationLevel | null;
  value?: any;

  constructor(id?: string,
              studyId?: string,
              germplasmId?: string,
              observationUnitId?: string,
              traitId?: string,
              germplasmName?: string,
              observationUnitName?: string,
              traitName?: string,
              collector?: string,
              uploadedBy?: string,
              timeStamp?: string,
              season?: Season,
              level?: ObservationLevel,
              value?: any
              ) {
    this.id = id;
    this.studyId = studyId;
    this.germplasmId = germplasmId;
    this.observationUnitId = observationUnitId;
    this.traitId = traitId;
    this.germplasmName = germplasmName;
    this.observationUnitName = observationUnitName;
    this.traitName = traitName;
    this.collector = collector;
    this.uploadedBy = uploadedBy;
    if (!timeStamp) {
      this.timeStamp = null;
    } else {
      const stamp: Date = new Date(timeStamp);
      this.timeStamp = stamp.getFullYear() ? stamp : null;
    }
    this.season = season;
    this.level = level ? level : null;
    this.value = value;
  }

  static assign(observation: Observation): Observation {
    const stamp: string | undefined = observation.timeStamp ? observation.timeStamp.toISOString() : undefined;

    return new Observation(observation.id,
                           observation.studyId,
                           observation.germplasmId,
                           observation.observationUnitId,
                           observation.traitId,
                           observation.germplasmName,
                           observation.observationUnitName,
                           observation.traitName,
                           observation.collector,
                           observation.uploadedBy,
                           stamp,
                           observation.season,
                           observation.level,
                           observation.value);
  }

  equals(observation?: Observation): boolean {
    if (!observation) {return false;}
    return (this.id === observation.id) &&
      (this.studyId === observation.studyId) &&
      (this.germplasmId === observation.germplasmId) &&
      (this.observationUnitId === observation.observationUnitId) &&
      (this.traitId === observation.traitId) &&
      (this.germplasmName === observation.germplasmName) &&
      (this.observationUnitName === observation.observationUnitName) &&
      (this.traitName === observation.traitName) &&
      (this.collector === observation.collector) &&
      (this.uploadedBy === observation.uploadedBy) &&
      (this.timeStamp === observation.timeStamp) &&
      (this.season === observation.season) &&
      (this.level === observation.level) &&
      (this.value === observation.value)
  }
}

export class Season {
  id?: string;
  name?: string;
  year?: number;

  constructor(seasonId?: string, seasonName?: string, year?: number) {
    this.id = seasonId;
    this.name = seasonName;
    this.year = year;
  }
}
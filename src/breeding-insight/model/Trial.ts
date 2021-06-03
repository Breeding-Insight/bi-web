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

// import {ProgramObservationLevel} from "@/breeding-insight/model/ProgramObservationLevel";
// import {Method} from "@/breeding-insight/model/Method";
// import {Scale} from "@/breeding-insight/model/Scale";

export class Trial {
  id?: string;
  trialName?: string;
  active?: boolean;

  constructor(id?: string,
              trialName?: string,
              active?: boolean
              ) {
    this.id = id;
    this.trialName = trialName;
    if (active !== undefined) {
      this.active = active;
    } else {
      this.active = true;
    }
  }

  static assign(trial: Trial): Trial {
    return new Trial(trial.id, trial.trialName, trial.active);
  }

  equals(trial?: Trial): boolean {
    if (!trial) {return false;}
    return (this.id === trial.id) &&
      (this.trialName === trial.trialName)
  }
}

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

export class Study {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  location?: string;
  active?: boolean;

  constructor(id?: string,
              name?: string,
              description?: string,
              type?: string,
              startDate?: string,
              endDate?: string,
              location?: string,
              active?: boolean
              ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    if (!startDate) startDate = '';
    if (!endDate) endDate = '';    
    const start: Date = new Date(startDate);
    const end: Date = new Date(endDate);
    this.startDate = start.getFullYear() ? start : null;
    this.endDate = end.getFullYear() ? end : null;
    this.location = location;
    if (active !== undefined) {
      this.active = active;
    } else {
      this.active = true;
    }
  }

  static assign(study: Study): Study {
    const start: string | undefined = study.startDate ? study.startDate.toISOString() : undefined;
    const end: string | undefined = study.endDate ? study.endDate.toISOString() : undefined;    

    return new Study(study.id, study.name, study.description, study.type, start, end, study.location, study.active);
  }

  equals(study?: Study): boolean {
    if (!study) {return false;}
    return (this.id === study.id) &&
      (this.name === study.name) &&
      (this.description === study.description) &&
      (this.type === study.type) &&
      (this.startDate === study.startDate) &&
      (this.endDate === study.endDate) &&
      (this.location === study.location)
  }
}

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
import {TermType} from "@/breeding-insight/model/TraitSelector";

export class Trait {
  id?: string;
  traitName?: string;
  observationVariableName?: string;
  programObservationLevel?: ProgramObservationLevel;
  entity?: string;
  attribute?: string;
  traitDescription?: string;
  method?: Method;
  scale?: Scale;
  synonyms: string[] = [];
  mainAbbreviation?: string;
  active?: boolean;
  tags?: string[] = [];
  fullName?: string;
  isDup?: boolean;
  termType?: TermType;

  constructor(id?: string,
              traitName?: string,
              observationVariableName?: string,
              programObservationLevel?: ProgramObservationLevel,
              entity?: string,
              attribute?: string,
              traitDescription?: string,
              method?: Method,
              scale?: Scale,
              synonyms?: Array<string>,
              active?: boolean,
              tags?: string[],
              fullName?: string,
              isDup?: boolean,
              termType?: TermType
              ) {
    this.id = id;
    this.traitName = traitName;
    this.observationVariableName = observationVariableName;
    if (programObservationLevel) {
      this.programObservationLevel = ProgramObservationLevel.assign({...programObservationLevel} as ProgramObservationLevel);
    } else {
      this.programObservationLevel = new ProgramObservationLevel();
    }
    this.entity = entity;
    this.attribute = attribute;
    this.traitDescription = traitDescription;
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
    if (synonyms){
      this.synonyms = Array.from(synonyms);
    }
    if (active !== undefined) {
      this.active = active;
    } else {
      this.active = true;
    }
    if (tags) {
      this.tags = Array.from(tags);
    }
    this.fullName = fullName;
    this.isDup = isDup;
    this.termType = termType;
  }

  static assign(trait: Trait): Trait {
    return new Trait(trait.id, trait.traitName, trait.observationVariableName, trait.programObservationLevel, trait.entity, trait.attribute,
        trait.traitDescription, trait.method, trait.scale, trait.synonyms, trait.active, trait.tags, trait.fullName, trait.isDup, trait.termType);
  }

  checkStringListEquals(list: string[] | undefined, otherList: string[] | undefined): boolean {
    if (!list && !otherList) { return true; }

    if (list && otherList && list.length === otherList.length) {
      return list.filter((value,index) => {
        return value !== otherList[index];
      }).length === 0;
    }
    return false;
  }

  equals(trait?: Trait): boolean {
    if (!trait) {return false;}
    // @ts-ignore

    return (this.id === trait.id) &&
      (this.traitName === trait.traitName) &&
      (this.observationVariableName === trait.observationVariableName) &&
      (this.fullName === trait.fullName) &&
      (this.termType === trait.termType) &&
      (this.checkStringListEquals(this.synonyms, trait.synonyms)) &&
      (this.mainAbbreviation === trait.mainAbbreviation) &&
        (this.entity === trait.entity) &&
        (this.attribute === trait.attribute) &&
        (this.traitDescription === trait.traitDescription) &&
      (
        (this.programObservationLevel && this.programObservationLevel.equals(trait.programObservationLevel)) ||
        (!this.programObservationLevel && !trait.programObservationLevel)
      ) &&
      (
        (this.scale && this.scale.equals(trait.scale)) ||
        (!this.scale && !trait.scale)
      ) &&
      (
        (this.method && this.method.equals(trait.method)) ||
        (!this.method && !trait.method)
      ) &&
      (this.isDup === trait.isDup) &&
      ( this.checkStringListEquals(this.tags, trait.tags) ) &&
      ( this.checkStringListEquals(this.synonyms, trait.synonyms) );
  }

  addTag(tag: string) {
    if (this.tags) {
      const index = this.tags.indexOf(tag);
      if (index === -1) {
        this.tags.push(tag);
      }
    }
    else {
      this.tags = [tag];
    }
  }

  removeTag(tag: string) {
    if (this.tags) {
      const index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  }

  hasTag(tag: string): boolean {
    if (this.tags) {
      for (const existingTag of this.tags) {
        if (tag.toLowerCase().replace(' ', '') === existingTag.toLowerCase().replace(' ', '')) {
          return true;
        }
      }
    }
    return false;
  }

}

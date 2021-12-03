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
  id?: string;
  traitName?: string;
  programObservationLevel?: ProgramObservationLevel;
  method?: Method;
  scale?: Scale;
  abbreviations?: Array<string>;
  synonyms?: Array<string>;
  mainAbbreviation?: string;
  active?: boolean;
  tags?: string[];

  constructor(id?: string,
              traitName?: string,
              programObservationLevel?: ProgramObservationLevel,
              method?: Method,
              scale?: Scale,
              abbreviations?: Array<string>,
              synonyms?: Array<string>,
              active?: boolean,
              tags?: string[]
              ) {
    this.id = id;
    this.traitName = traitName;
    if (programObservationLevel) {
      this.programObservationLevel = ProgramObservationLevel.assign({...programObservationLevel} as ProgramObservationLevel);
    } else {
      this.programObservationLevel = new ProgramObservationLevel();
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
    this.abbreviations = abbreviations;
    this.synonyms = synonyms;
    if (active !== undefined) {
      this.active = active;
    } else {
      this.active = true;
    }
    this.tags = tags;
  }

  static assign(trait: Trait): Trait {
    // if arrays exist in trait, then COPY them
    let tags;
    if (trait.tags){
       tags = Array.from(trait.tags);
    }
    let synonyms;
    if (trait.synonyms){
      synonyms = Array.from(trait.synonyms);
    }
    return new Trait(trait.id, trait.traitName, trait.programObservationLevel, trait.method,
        trait.scale, trait.abbreviations, synonyms, trait.active, tags);
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
      (this.checkStringListEquals(this.abbreviations, trait.abbreviations)) &&
      (this.checkStringListEquals(this.synonyms, trait.synonyms)) &&
      (this.mainAbbreviation === trait.mainAbbreviation) &&
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
        ( JSON.stringify(this.tags) === JSON.stringify(trait.tags) ) &&
        ( JSON.stringify(this.synonyms) === JSON.stringify(trait.synonyms) );
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

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

import {Category} from "@/breeding-insight/model/Category";

export enum DataType {
  Date = "Date",
  Nominal = "Nominal",
  Numerical = "Numerical",
  Ordinal = "Ordinal",
  Text = "Text"
}

export class Scale {
  scaleName?: string;
  units?: string;
  dataType?: string;
  categories?: Array<Category>;
  decimalPlaces?: number;
  validValueMin?: number;
  validValueMax?: number;

  constructor(scaleName?:string, units?:string, dataType?:string, categories?:Array<Category>, decimalPlaces?:number, validValueMin?:number, validValueMax?: number) {
    this.scaleName = scaleName;
    this.units = units;
    this.dataType = dataType;
    if (categories) {
      this.categories = categories.map(category => new Category(category.label, category.value));
    }
    this.decimalPlaces = decimalPlaces;
    this.validValueMin = validValueMin;
    this.validValueMax = validValueMax;
  }

  static assign(scale: Scale) {
    return new Scale(scale.scaleName, scale.units, scale.dataType, scale.categories, scale.decimalPlaces,
      scale.validValueMin, scale.validValueMax);
  }

  static dataTypeEquals(typeString: string, type: DataType): boolean {
    if (typeString) {
      return typeString.toUpperCase() === type.toUpperCase();
    } else {
      return false;
    }
  }

  private categoriesEqual(categories: Category[] | undefined) {
    if (!this.categories && !categories) { return true; }

    if (this.categories && categories && this.categories.length === categories.length) {
      return this.categories.filter((value,index) => {
        return value.value !== categories[index].value || value.label !== categories[index].label;
      }).length === 0;
    }
    return false;
  }

  equals(scale?: Scale): boolean {
    if (!scale) {return false;}
    return (this.scaleName === scale.scaleName) &&
      (this.units === scale.units) &&
      (this.dataType === scale.dataType) &&
      (this.decimalPlaces === scale.decimalPlaces) &&
      (this.validValueMin === scale.validValueMin) &&
      (this.validValueMax === scale.validValueMax) &&
      (this.categoriesEqual(scale.categories));
  }
}

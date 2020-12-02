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
  Date = "DATE",
  Duration = "DURATION",
  Nominal = "NOMINAL",
  Numerical = "NUMERICAL",
  Ordinal = "ORDINAL",
  Text = "TEXT"
}

export class Scale {
  scaleName?: string;
  dataType?: string;
  categories?: Array<Category>;
  decimalPlaces?: number;
  validValueMin?: number;
  validValueMax?: number;

  constructor(scaleName?:string, dataType?:string, categories?:Array<Category>, decimalPlaces?:number, validValueMin?:number, validValueMax?: number) {
    this.scaleName = scaleName;
    this.dataType = dataType;
    this.categories = categories;
    this.decimalPlaces = decimalPlaces;
    this.validValueMin = validValueMin;
    this.validValueMax = validValueMax;
  }

  static dataTypeEquals(typeString: string, type: DataType): boolean {
    return typeString.toUpperCase() === type;
  }
}

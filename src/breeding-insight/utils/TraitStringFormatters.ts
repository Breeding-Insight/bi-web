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

import {Scale, DataType} from "@/breeding-insight/model/Scale";
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import {TermType} from "@/breeding-insight/model/TraitSelector";
import {EnumUtils} from "@/breeding-insight/utils/EnumUtils";

export class TraitStringFormatters {
  
  static getScaleTypeString(scale: Scale): string | undefined {
    if (scale.dataType) {
      if (scale.categories && (Scale.dataTypeEquals(scale.dataType, DataType.Nominal) || Scale.dataTypeEquals(scale.dataType, DataType.Ordinal))) {
        return StringFormatters.toStartCase(scale.dataType) + " (" + scale.categories.length + ")";
      }
      else {
        return StringFormatters.toStartCase(scale.dataType);
      }
    }
    return undefined;
  }

  static getTermTypeString(termType: TermType): string | undefined {
    return EnumUtils.enumKeyToValue(termType,TermType);
    }

}
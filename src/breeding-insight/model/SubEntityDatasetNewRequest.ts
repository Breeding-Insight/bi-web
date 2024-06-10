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

import {Observation} from "@/breeding-insight/model/Observation";
import {ObservationUnit} from "@/breeding-insight/model/ObservationUnit";
import {ObservationVariable} from "@/breeding-insight/model/ObservationVariable";

export class SubEntityDatasetNewRequest {
    name: string;
    repeatedMeasures: number;


    constructor(name: string, repeatedMeasures: string) {
        this.name = name;
        this.repeatedMeasures = repeatedMeasures;
    }
}
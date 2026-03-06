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

import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {ObservationUnitDAO} from "@/breeding-insight/dao/ObservationUnitDAO";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {ProgramObservationLevel} from "@/breeding-insight/model/ProgramObservationLevel";

export class ObservationUnitService {

    static async getObservationLevels(programId: string): Promise<Result<Error, [ProgramObservationLevel[], Metadata]>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }

        let response: Result<Error, BiResponse>;
        response = await ObservationUnitDAO.getObservationLevels(programId) as Result<Error, BiResponse>;

        const frontendModel = (res: BiResponse): [ProgramObservationLevel[], Metadata] => {
            let levels: ProgramObservationLevel[] = [];
            let {result: {data}, metadata} = res;

            levels = data.map((level: any) => {
                return new ProgramObservationLevel(level.levelName!);
            });

            return [levels, metadata];
        }

        return response.applyResult(frontendModel);
    }

}
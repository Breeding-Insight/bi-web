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

export class DatasetTableRow {
  germplasmName?: string;
  gid?: string;
  tOrC?: string;
  env?: string;
  envLocation?: string;
  envYear?: string;
  expUnitId?: string;
  expReplicate?: string;
  expBlock?: string;
  row?: string;
  column?: string;
  obsUnitId?: string;
  traits?: string[] = [];


  constructor(germplasmName?: string,
              gid?: string,
              tOrC?: string,
              env?: string,
              envLocation?: string,
              envYear?: string,
              expUnitId?: string,
              expReplicate?: string,
              expBlock?: string,
              row?: string,
              column?: string,
              obsUnitId?: string,
              traits?: string[]) {
    this.germplasmName = germplasmName;
    this.gid = gid;
    this.tOrC = tOrC;
    this.env = env;
    this.envLocation = envLocation;
    this.envYear = envYear;
    this.expUnitId = expUnitId;
    this.expReplicate = expReplicate;
    this.expBlock = expBlock;
    this.row = row;
    this.column = column;
    this.obsUnitId = obsUnitId;
    this.traits = traits;

  }

  static assign(dataset: DatasetTableRow): DatasetTableRow {

    return new DatasetTableRow(
        dataset.germplasmName,
        dataset.gid,
        dataset.tOrC,
        dataset.env,
        dataset.envLocation,
        dataset.envYear,
        dataset.expUnitId,
        dataset.expReplicate,
        dataset.expBlock,
        dataset.row,
        dataset.column,
        dataset.obsUnitId,
        dataset.traits
        );
  }


}
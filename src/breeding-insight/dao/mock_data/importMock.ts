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

import {ImportData} from "@/breeding-insight/model/ImportData";

const tblCross: ImportData = new ImportData({
  id: '1',
  fileName: 'tblCross.xlxs',
  headers: ["CrossID","Comments","CrossDate","HatchDate","LotType","FemaleUniqueID","MaleUniqueID","HouseCreek","Shasta","Troutlodge","UW","Arlee","Kamloop","Hayspur","ClearSprings","HatStatus","Project"],
  date_uploaded: Date.now().toString(),
  date_confirmed: undefined,
  program_id: '1',
  upload_user_id: '2',
  data: []
} as ImportData);

export { tblCross }
/*
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

export class ImportData {
  id: string;
  fileName: string;
  headers: string[];
  data: any[];
  date_uploaded: string;
  date_confirmed?: string;
  program_id: string;
  upload_user_id: string;

  constructor({id, fileName, headers, data, date_uploaded, date_confirmed, program_id, upload_user_id}: ImportData) {
    this.id = id;
    this.fileName = fileName;
    this.headers = headers;
    this.data = data;
    this.date_uploaded = date_uploaded;
    this.date_confirmed = date_confirmed;
    this.program_id = program_id;
    this.upload_user_id = upload_user_id;
  }
}

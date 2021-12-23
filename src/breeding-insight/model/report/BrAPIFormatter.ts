/*
 * See the NOTICE file distributed with this work for additional information regarding copyright ownership.
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

import {ReportFormatter} from "@/breeding-insight/model/report/ReportFormatter";
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";

export class BrAPIFormatter extends ReportFormatter {

  static format(jsonData: any[], configs: any): ReportStruct {

    // Loop through the config and construct the column order
    const columns: any[] = super.getColumns(configs);
    // Format the data
    const [data, details] = super.getData(jsonData);
    // Get sort column
    const sortColumn = super.getSortColumn(configs);

    const report: ReportStruct = new ReportStruct(data, columns, details, sortColumn, configs.defaultSortOrder);
    return report;
  }



}
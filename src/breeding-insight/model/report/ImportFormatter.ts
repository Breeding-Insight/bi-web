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

/*
  Documentation
  --------------

  This class takes in an importer JSON preview result and a formatting configuration and
  converts it into a ReportStruct that can be consumed by the ReportTable.

  Formatter Configuration
  ---------------
  This configuration shows the formatter how to convert the json into tabular format.
  The order of the fields in the config is the order they will display.

  [
    {
      field: Path to json field in dot notation (ex. germplasmName),
      displayName: Display name for the column. Will use the json field dot notation if display
        name not provided. (ex. Germplasm Name)
      visible: true/false indicating whether the field is visible in the table.
    },
    {
      field: * (indicates show all fields. Display name is not allowed when this option is used),
      visible: true/false
    }
  ]

 */

import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";

export class ImportFormatter {

  static format(json: any, config: any): ReportStruct {

    // Loop through the config and construct the column order
    const columns: string[] = [];

    // Loop through the json and construct the data
    const data: string[] = [];


    const report: ReportStruct = new ReportStruct(data, columns);
    return report;
  }
}
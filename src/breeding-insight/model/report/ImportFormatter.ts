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
      field: Path to json field in dot notation, excluding brapiObject, the formatter inserts this. (ex. germplasmName),
      displayName: Display name for the column. Will use the json field dot notation if display
        name not provided. (ex. Germplasm Name)
      visible: true/false indicating whether the field is visible in the table.
    }
  ]

  {
    names: { 'yadayada_yada': 'display_name' }, (short names ok)
    display: [ 'this_field', 'that_field' ], (full path required)
    visible: [ 'this_field' ], (full path needed) (everything is visible if not indicated)
    detailDisplay: ['this_field', 'that_field']
  }

  Display name priority (high to low)
  1. Longer paths in component
  2. Shorter paths in component
  3. Longer paths in global
  4. Shorter paths in global
 */

import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";
import {FormatConfig} from "@/breeding-insight/model/report/FormatConfig";
import { v4 as uuidv4 } from 'uuid';
import {DisplayNameManager} from "@/breeding-insight/model/report/DisplayNameManager";
import {ReportSort} from "@/breeding-insight/model/report/ReportSort";
var flatten = require('flat');


export class ImportFormatter {

  // TODO: Make 'n members' into a pill?
  // TODO: Auto expand for multiple sibling objects
  // TODO: Return all columns in data if "*" is passed
  // TODO: Pagination
  // TODO: Filtering
  // TODO: Column toggle

  static format(jsonData: any[], configs: FormatConfig[]): ReportStruct {

    // Loop through the config and construct the column order
    const columns: any[] = this.getColumns(configs);
    // Format the data
    const [data, details] = this.getData(jsonData);

    const report: ReportStruct = new ReportStruct(data, columns, details);
    console.log(report);
    return report;
  }

  static getColumns(configs: any): any[] {
    const tableColumns: any[] = [];
    const displayColumns = configs.display;
    for (const displayColumn of displayColumns) {
      // Check for the renames
      const field = displayColumn.split('.').join('_');
      tableColumns.push({
        field: field,
        label: DisplayNameManager.getDisplayName(displayColumn, configs),
        searchable: configs.searchable === '*' || configs.searchable.includes(displayColumn),
        sortable: true,
        customSort: (a: any, b: any, isAsc: boolean) => this.sort(field, a, b, isAsc)
      });
    }
    return tableColumns;
  }

  static getData(jsonData: any[]): [any[], any] {

    const data: any[] = [];
    const details: any = {};
    for (const datum of jsonData) {
      const row: any = {};
      //TODO: Remove test data
      datum.germplasm.brAPIObject.externalReferences = [
        {'externalReferenceSource': 'breedinginsight.net', 'externalReferenceID': '1'},
        {'externalReferenceSource': 'breedinginsight.net', 'externalReferenceID': '2'}
      ];
      datum.germplasm.brAPIObject.seasons = ['fall 2020', 'spring 2020', 'summer 2020'];

      // Lift the brapi object out
      for (const brapiTypeKey of Object.keys(datum)) {
        row[brapiTypeKey] = datum[brapiTypeKey].brAPIObject;
      }
      const newRowId = uuidv4();
      // Flatten for buefy. Not ideal, but it doesn't like the '.'
      const result: any = flatten(row, {safe: true, delimiter: '_'});
      // Add row id to data
      result.rowId = newRowId;
      // Flatten again with no frills
      details[newRowId] = flatten(row, {safe: true});

      // Filter out the list types and replace with descriptors
      for (const key of Object.keys(result)) {
        if (Array.isArray(result[key])) {
          result[key] = `${result[key].length} members`;
        }
      }

      data.push(result);
    }
    return [data, details];
  }

  static sort(column: string, a: any, b: any, isAsc: boolean) {
    const aString = a[column];
    const bString = b[column];
    const order = aString.localeCompare(bString, undefined, {numeric: true, sensitivity: 'base'});
    return isAsc ? order: order * -1;
  }

}
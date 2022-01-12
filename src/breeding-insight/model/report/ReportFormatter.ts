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

import {DisplayNameManager} from "@/breeding-insight/model/report/DisplayNameManager";
import {v4 as uuidv4} from "uuid";
import flatten from "flat";

export class ReportFormatter {

  static getColumns(configs: any): any[] {
    const tableColumns: any[] = [];
    const displayColumns = configs.display;
    for (const displayColumn of displayColumns) {
      // Buefy doesn't work with . notation
      const field = displayColumn.split('.').join('_');
      tableColumns.push({
        field: field,
        label: DisplayNameManager.getDisplayName(displayColumn, configs),
        searchable: configs.searchable !== undefined && (configs.searchable === '*' || configs.searchable.includes(displayColumn)),
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
      const newRowId = uuidv4();
      // Flatten for buefy. Not ideal, but it doesn't like the '.'
      const result: any = flatten(datum, {safe: true, delimiter: '_'});
      result.rowId = newRowId;
      details[newRowId] = datum;
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
    // Expected to be primitives, but JSON.stringify is safe for number, object, string, etc.
    const aString: string = JSON.stringify(a[column]);
    const bString: string = JSON.stringify(b[column]);
    const order = aString.localeCompare(bString, undefined, {numeric: true, sensitivity: 'base'});
    return isAsc ? order: order * -1;
  }

  static getSortColumn(config: any) {
    const sortColumn = config.defaultSort;
    if (sortColumn) {
      return sortColumn.split('.').join('_');
    }
  }
}
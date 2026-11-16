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

import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

/**
 * The rows a paginated table is showing: rows start to end of total (1-based), or all of them.
 */
export class TableResultRange {
  constructor(
    public readonly start: number,
    public readonly end: number,
    public readonly total: number,
    public readonly showAll: boolean
  ) {}

  /**
   * Works out the range for a table whose records are either one page from the server, or every
   * record with the table paging (and possibly filtering) them in the browser.
   *
   * @param pagination the table's pagination state
   * @param recordCount the number of records passed to the table
   * @param filteredCount the number of records left after the table's own (client-side) filters
   */
  static of(pagination: PaginationController, recordCount: number, filteredCount: number): TableResultRange {
    const pageSize = Math.max(pagination.pageSize, 1);
    // The server holds more rows than it sent, so the records are a single page of server results.
    const serverPaged = pagination.totalCount > recordCount;
    const total = serverPaged ? pagination.totalCount : filteredCount;

    if (total === 0) {
      return new TableResultRange(0, 0, 0, pagination.showAll);
    }

    let start: number;
    let end: number;
    if (serverPaged) {
      start = (pagination.currentPage - 1) * pageSize + 1;
      end = Math.min(start + recordCount - 1, total);
    } else if (total <= pageSize) {
      // Matches Buefy, which shows every row when they all fit on one page, whatever the current page.
      start = 1;
      end = total;
    } else {
      start = (pagination.currentPage - 1) * pageSize + 1;
      end = Math.min(start + pageSize - 1, total);
    }
    return new TableResultRange(start, end, total, pagination.showAll);
  }
}

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

/**
 * The pagination fields the range needs. Both PaginationController and the server's Pagination have
 * them; only PaginationController has showAll.
 */
export interface TablePageState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  showAll?: boolean;
}

/**
 * The rows a paginated table is showing: rows start to end of total (1-based), or all of them.
 *
 * When the table's own column filters narrow a single page of server results, the filter only sees
 * that page: matchedOnPage of the page's pageCount rows match, and total is the server's total.
 */
export class TableResultRange {
  constructor(
    public readonly start: number,
    public readonly end: number,
    public readonly total: number,
    public readonly showAll: boolean,
    public readonly matchedOnPage: number | null = null,
    public readonly pageCount: number | null = null
  ) {}

  static readonly EMPTY = new TableResultRange(0, 0, 0, false);

  /** True when a column filter is narrowing one page of server results. */
  get filteredOnPage(): boolean {
    return this.matchedOnPage !== null;
  }

  /**
   * Works out the range for a table whose records are either one page from the server, or every
   * record with the table paging (and possibly filtering) them in the browser.
   *
   * @param pagination the table's pagination state
   * @param recordCount the number of records passed to the table
   * @param filteredCount the number of records left after the table's own (client-side) filters
   */
  static of(pagination: TablePageState, recordCount: number, filteredCount: number): TableResultRange {
    const pageSize = Math.max(pagination.pageSize, 1);
    const showAll = !!pagination.showAll;
    // The server holds more rows than it sent, so the records are a single page of server results.
    const serverPaged = pagination.totalCount > recordCount;

    if (serverPaged) {
      // No rows yet, e.g. while the next page loads: say nothing rather than a range that isn't there.
      if (recordCount === 0) {
        return TableResultRange.EMPTY;
      }
      const total = pagination.totalCount;
      if (filteredCount < recordCount) {
        return new TableResultRange(0, 0, total, showAll, filteredCount, recordCount);
      }
      const start = Math.min((Math.max(pagination.currentPage, 1) - 1) * pageSize + 1, total);
      const end = Math.max(Math.min(start + recordCount - 1, total), start);
      return new TableResultRange(start, end, total, showAll);
    }

    const total = filteredCount;
    if (total === 0) {
      return new TableResultRange(0, 0, 0, showAll);
    }
    if (showAll || total <= pageSize) {
      // Matches Buefy, which shows every row when they all fit on one page, whatever the current page.
      return new TableResultRange(1, total, total, showAll);
    }
    const lastPage = Math.ceil(total / pageSize);
    const page = Math.min(Math.max(pagination.currentPage, 1), lastPage);
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, total);
    return new TableResultRange(start, end, total, showAll);
  }
}

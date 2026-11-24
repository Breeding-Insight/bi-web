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

import {TableResultRange} from "@/breeding-insight/model/view_models/TableResultRange";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

function pagination(currentPage: number, pageSize: number, totalCount: number, showAll = false): PaginationController {
  const controller = new PaginationController(currentPage, pageSize, undefined, totalCount);
  controller.showAll = showAll;
  return controller;
}

describe('TableResultRange works out the rows a table is showing.', () => {

  it('Returns the first page when every record is in the browser', () => {
    const range = TableResultRange.of(pagination(1, 200, 2000), 2000, 2000);
    expect([range.start, range.end, range.total, range.showAll]).toEqual([1, 200, 2000, false]);
  });

  it('Returns a partial last page when every record is in the browser', () => {
    const range = TableResultRange.of(pagination(3, 50, 120), 120, 120);
    expect([range.start, range.end, range.total]).toEqual([101, 120, 120]);
  });

  it('Returns every row when they fit on one page, whatever the current page', () => {
    const range = TableResultRange.of(pagination(4, 50, 120), 120, 30);
    expect([range.start, range.end, range.total]).toEqual([1, 30, 30]);
  });

  it('Keeps a page past the end of the filtered rows within range', () => {
    const range = TableResultRange.of(pagination(5, 50, 300), 300, 120);
    expect([range.start, range.end, range.total]).toEqual([101, 120, 120]);
  });

  it('Returns every row with Show All', () => {
    const range = TableResultRange.of(pagination(1, 2000, 2000, true), 2000, 2000);
    expect([range.start, range.end, range.total, range.showAll]).toEqual([1, 2000, 2000, true]);
  });

  it('Returns the server page when the records are one page of server results', () => {
    const range = TableResultRange.of(pagination(2, 200, 2000), 200, 200);
    expect([range.start, range.end, range.total, range.filteredOnPage]).toEqual([201, 400, 2000, false]);
  });

  it('Returns a short last server page', () => {
    const range = TableResultRange.of(pagination(10, 200, 1850), 50, 50);
    expect([range.start, range.end, range.total]).toEqual([1801, 1850, 1850]);
  });

  it('Returns an empty range while a server page has no records yet', () => {
    const range = TableResultRange.of(pagination(2, 200, 2000), 0, 0);
    expect(range.total).toEqual(0);
  });

  it('Reports matches on the page when a column filter narrows a server page', () => {
    const range = TableResultRange.of(pagination(2, 200, 2000), 200, 3);
    expect(range.filteredOnPage).toBe(true);
    expect([range.matchedOnPage, range.pageCount, range.total]).toEqual([3, 200, 2000]);
  });

  it('Returns an empty range when there are no records', () => {
    const range = TableResultRange.of(pagination(1, 50, 0), 0, 0);
    expect([range.start, range.end, range.total]).toEqual([0, 0, 0]);
  });

});

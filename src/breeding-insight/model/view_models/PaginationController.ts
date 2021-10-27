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

import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Pagination} from "@/breeding-insight/model/BiResponse";

export class PaginationController {
  public currentPage: number = 1;
  public pageSize: number = 50;
  public showAll: boolean = false;
  public currentCall?: PaginationQuery;

  constructor(currentPage?: number, pageSize?: number, currentCall?: PaginationQuery) {
    if (currentPage) this.currentPage = currentPage;
    if (pageSize) this.pageSize = pageSize;
    if (currentCall) this.currentCall = currentCall;
  }

  toggleShowAll(){
    this.showAll = !this.showAll;
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.showAll = false;
  }
  
  updatePage(page: number) {
    this.currentPage = page;
    this.showAll = false;
  }

  setCurrentCall(paginationQuery: PaginationQuery){
    this.currentCall = paginationQuery;
  }

  matchesCurrentRequest(pagination: Pagination): boolean {

    if (this.currentCall) {
      if (this.showAll){
        return pagination.currentPage == 1 && pagination.totalPages == 1;
      } else {
        return this.currentCall.page === pagination.currentPage &&
          this.currentCall.pageSize === pagination.pageSize;
      }
    }
    return false;
  }

  static getPaginationSelections(currentPage: number, pageSize: number, showAll: boolean): PaginationQuery {
    if (showAll) {
      return new PaginationQuery(0, pageSize, true);
    } else {
      return new PaginationQuery(
        currentPage, pageSize, false);
    }
  }

  //TODO: Remove when backend pagination is implemented
  static mockPagination(records: any[], page: number, pageSize: number, showAll: boolean): [any[], Pagination] {

    if (showAll){
      const newPagination: Pagination = new Pagination({
        totalCount: records.length,
        pageSize: records.length,
        totalPages: 1,
        currentPage: 1
      });
      return [records, newPagination];
    } else if (records.length === 0){
      const newPagination: Pagination = new Pagination({
        totalCount: 0,
        pageSize: pageSize,
        totalPages: 1,
        currentPage: page
      });
      return [[], newPagination];
    } else {
      const newPagination: Pagination = new Pagination({
        totalCount: records.length,
        pageSize: pageSize,
        totalPages: Math.ceil(records.length / pageSize),
        currentPage: page
      });
      return [records.slice((page * pageSize - pageSize), (page * pageSize > records.length ? records.length : page * pageSize)), newPagination];
    }
  }

  //TODO: Remove when backend pagination is implemented
  static mockSortRecords(records: any[]){
    // Imitates sql sorting by created date
    if (records && records.length > 0){
      if (records[0].createdAt){
        records = records.sort((record1, record2) => record1.createdAt > record2.createdAt ? -1: 1);
      }
    }
    return records;
  }

}
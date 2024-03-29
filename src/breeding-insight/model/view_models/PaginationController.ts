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
  public totalPages: number = 1;
  public totalCount: number = 0;
  public lastPageSize : number = 50;
  public showAll: boolean = false;
  public currentCall?: PaginationQuery;

  constructor(currentPage?: number, pageSize?: number, totalPages?: number, totalCount?: number, currentCall?: PaginationQuery) {
    if (currentPage) this.currentPage = currentPage;
    if (pageSize) this.pageSize = pageSize;
    if (totalPages) this.totalPages = totalPages;
    if (totalCount) this.totalCount = totalCount;
    if (currentCall) this.currentCall = currentCall;
  }

  //Changed to wrapper for updatePageSizeVals
  //So showAll set to false when user changes page size
  //And not when called on showAll toggle
  updatePageSize(pageSize: number) {
    this.showAll = false;
    this.updatePageSizeVals(pageSize);
  }

  //This route taken to minimize disruption of all the pages that utilize BackendPaginationController
  updatePageSizeVals(pageSize: number) {
    this.lastPageSize = this.pageSize;
    this.pageSize = pageSize;
  }

  updatePage(page: number) {
    this.currentPage = page;
  }

  setCurrentCall(paginationQuery: PaginationQuery){
    this.currentCall = paginationQuery;
  }

  setPaginationInfo(pagination: Pagination) {
    this.currentPage = pagination.currentPage;
    this.pageSize = pagination.pageSize;
    this.totalCount = pagination.totalCount;
    this.totalPages = pagination.totalPages;
  }

  matchesCurrentRequest(pagination: Pagination): boolean {

    if (this.currentCall) {
      return this.currentCall.page === pagination.currentPage &&
        this.currentCall.pageSize === pagination.pageSize;
    }

    return false;
  }

  toggleShowAll() {
    if (this.showAll) {
      this.updatePageSize(this.lastPageSize);
    } else {
      this.updatePageSizeVals(this.totalCount);
      this.updatePage(1);
      this.showAll = true;
    }
  }

  getPaginationSelections(): PaginationQuery {
    if(this.showAll) {
      return new PaginationQuery(1, this.totalCount, this.showAll);
    } else {
      return new PaginationQuery(this.currentPage, this.pageSize, this.showAll);
    }
  }

  //When show all active, increments page size by one on successful addition in order to keep entries on same page
  //Don't want to update lastPageSize in this case
  updateOnAdd(){
    if (this.showAll){
      this.pageSize += 1;
    }
  }

}
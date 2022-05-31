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

export class BackendPaginationController {
  public currentPage: number = 1;
  public pageSize: number = 50;
  public lastPageSize : number = 50;
  public showAll: boolean = false;
  public currentCall?: PaginationQuery;

  constructor(currentPage?: number, pageSize?: number, currentCall?: PaginationQuery) {
    if (currentPage) this.currentPage = currentPage;
    if (pageSize) this.pageSize = pageSize;
    if (currentCall) this.currentCall = currentCall;
  }

  //todo Keep eye on currentCall, that might be issue here
  //Wrapper to set showAll to false when user changes page size
  //due to update page size being called on showAll toggle as well
  changePageSize(pageSize: number) {
    this.showAll = false;
    this.updatePageSize(pageSize);
  }

  updatePageSize(pageSize: number) {
    this.lastPageSize = this.pageSize;
    this.pageSize = pageSize;
  }

  updatePage(page: number) {
    this.currentPage = page;
  }

  setCurrentCall(paginationQuery: PaginationQuery){
    this.currentCall = paginationQuery;
  }

  matchesCurrentRequest(pagination: Pagination): boolean {

    if (this.currentCall) {
      return this.currentCall.page === pagination.currentPage &&
        this.currentCall.pageSize === pagination.pageSize;
    }

    return false;
  }

  toggleShowAll(totalCount: number) {
    if (this.showAll) {
      this.updatePageSize(this.lastPageSize);
    } else {
      this.updatePageSize(totalCount);
    }
    this.showAll = !this.showAll;
  }

  //todo maybe need wrapper so when user manually changes page size showAll is set to false?
  static getPaginationSelections(currentPage: number, pageSize: number, showAll: boolean): PaginationQuery {
    if (showAll) {
      return new PaginationQuery(
          1, pageSize, showAll);
    } else {
      return new PaginationQuery(
          currentPage, pageSize, showAll);
    }
  }

}
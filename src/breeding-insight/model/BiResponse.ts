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

export class BiResponse {
  result: any;
  metadata: Metadata;

  constructor(jsonBody: any) {
    this.result = jsonBody.result;
    this.metadata = jsonBody.metadata;
  }
}

export class Metadata {
  pagination: Pagination;
  statusArray: Array<Status>;

  constructor(metadataBody: any) {
    this.pagination = new Pagination(metadataBody.pagination);
    this.statusArray = metadataBody.status.map((status: any) => { new Status(status) });
  }
}

export class Pagination {
  totalPages: Number;
  currentPage: Number;
  totalCount: Number;
  pageSize: Number;

  constructor(paginationResult?: any) {
    if (paginationResult){
      this.totalPages = paginationResult.totalPages;
      this.currentPage = paginationResult.currentPage;
      this.totalCount = paginationResult.totalCount;
      this.pageSize = paginationResult.pageSize;
    } else {
      this.totalPages = 1;
      this.currentPage = 1;
      this.totalCount = 0;
      this.pageSize = 0;
    }

  }
}

class Status {
  messageType: String;
  message: String;

  constructor(statusMap: any) {
    this.messageType = statusMap.messageType;
    this.message = statusMap.message;
  }
}

export interface Response {
  data: any
}
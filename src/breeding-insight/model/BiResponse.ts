export class BiResponse {
  result: any;
  metadata: Metadata;

  constructor(jsonBody: any) {
    this.result = jsonBody.result;
    this.metadata = jsonBody.metadata;
  }
}

class Metadata {
  pagination: Pagination;
  statusArray: Array<Status>;

  constructor(metadataBody: any) {
    this.pagination = new Pagination(metadataBody.pagination);
    this.statusArray = metadataBody.status.map((status: any) => { new Status(status) });
  }
}

class Pagination {
  totalPages: Number;
  currentPage: Number;
  totalCount: Number;
  pageSize: Number;

  constructor(paginationResult: any) {
    this.totalPages = paginationResult.totalPages;
    this.currentPage = paginationResult.currentPage;
    this.totalCount = paginationResult.totalCount;
    this.pageSize = paginationResult.pageSize;
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
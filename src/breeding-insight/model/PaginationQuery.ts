export class PaginationQuery {
  page: number;
  pageSize: number;
  showAll: boolean;

  constructor(page: number, pageSize: number, showAll: boolean) {
    this.page = page;
    this.pageSize = pageSize;
    this.showAll = showAll;
  }
}
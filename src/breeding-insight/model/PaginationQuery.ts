export class PaginationQuery {
  page: Number;
  pageSize: Number;
  showAll: boolean;

  constructor(page: Number, pageSize: Number, showAll: boolean) {
    this.page = page;
    this.pageSize = pageSize;
    this.showAll = showAll;
  }
}
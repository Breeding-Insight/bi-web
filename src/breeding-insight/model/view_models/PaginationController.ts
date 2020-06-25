import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Pagination} from "@/breeding-insight/model/BiResponse";

export class PaginationController {
  public currentPage: Number = 1;
  public pageSize: Number = 50;
  public showAll: boolean = false;
  public currentCall?: PaginationQuery;

  constructor(currentPage?: Number, pageSize?: Number, currentCall?: PaginationQuery) {
    if (currentPage) this.currentPage = currentPage;
    if (pageSize) this.pageSize = pageSize;
    if (currentCall) this.currentCall = currentCall;
  }

  toggleShowAll(){
    this.showAll = !this.showAll;
  }

  updatePageSize(pageSize: Number) {
    this.pageSize = pageSize;
    this.showAll = false;
  }

  updatePage(page: Number) {
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
      return new PaginationQuery(0, 0, true);
    } else {
      return new PaginationQuery(
        currentPage, pageSize, false);
    }
  }

  static mockPagination(records: any[], page: number, pageSize: number, showAll: boolean): [any[], Pagination] {
    if (showAll){
      const newPagination: Pagination = new Pagination({
        totalCount: records.length,
        pageSize: records.length,
        totalPages: 1,
        currentPage: 1
      });
      return [records, newPagination];
    } else {
      const newPagination: Pagination = new Pagination({
        totalCount: records.length,
        pageSize: pageSize,
        totalPages: records.length / pageSize,
        currentPage: page
      });
      return [records.slice((page * pageSize - pageSize), (page * pageSize > records.length ? records.length : page * pageSize)), newPagination];
    }
  }

}
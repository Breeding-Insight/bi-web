import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";

export class PaginationController {
  public currentPage: Number = 1;
  public pageSize: Number = 50;
  public showAll: boolean = false;
  public currentCall?: PaginationQuery;

  constructor(currentPage?: Number, pageSize?: Number, lockPaginate?: boolean, currentCall?: PaginationQuery) {
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

}
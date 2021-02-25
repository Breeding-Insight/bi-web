import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";

export interface PaginationControllerState {
    currentPage: number,
    pageSize: number,
    showAll: boolean,
    currentCall?: PaginationQuery
}
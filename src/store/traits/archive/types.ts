import {Trait} from "@/breeding-insight/model/Trait";
import {PaginationControllerState} from "@/store/pagination/types";
import {Pagination} from "@/breeding-insight/model/BiResponse";

export interface ArchiveState {
    archivedTraits?: Trait[];
    paginatedTraits?: Trait[];
    archivePagination?: Pagination;
    pagination: PaginationControllerState;
}
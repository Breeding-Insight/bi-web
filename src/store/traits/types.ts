import {Trait} from "@/breeding-insight/model/Trait";
import {ArchiveState} from "@/store/traits/archive/types";
import {PaginationControllerState} from "@/store/pagination/types";

export interface TraitState {
    traits?: Trait[];
    archive: ArchiveState;
    pagination: PaginationControllerState;
}
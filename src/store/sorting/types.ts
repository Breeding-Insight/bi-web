import {TraitSortField} from "@/breeding-insight/model/Sort";

export interface SortState {
    // ontology table
    traitSortField: TraitSortField,
    nameSortOrder: boolean,
    methodSortOrder: boolean,
    scaleClassSortOrder: boolean,
    unitSortOrder: boolean
}